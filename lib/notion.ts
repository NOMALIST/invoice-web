// Notion API 클라이언트 초기화 및 견적서 헬퍼 함수

import { cache } from "react";
import { Client } from "@notionhq/client";
import { APIResponseError, APIErrorCode, RequestTimeoutError } from "@notionhq/client";
import type { Invoice, InvoiceItem, InvoiceListItem } from "@/types/invoice";

// 서버 시작 시 필수 환경변수 존재 여부 확인 (클라이언트 번들에 포함되지 않음)
if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY 환경변수가 설정되지 않았습니다. .env.local을 확인하세요.");
}

// Notion 클라이언트 싱글톤 인스턴스 (15초 타임아웃 설정)
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  timeoutMs: 15_000,
});

// -------------------------------------------
// 견적서 관련 함수
// -------------------------------------------

/**
 * Invoices DB 전체 목록 조회 (랜딩 페이지용)
 * 항목(items) 없이 기본 메타 정보만 반환합니다
 * @notionhq/client v5에서는 databases.query가 없으므로 fetch로 직접 호출
 */
export async function getInvoiceList(): Promise<InvoiceListItem[]> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID!;
    const apiKey = process.env.NOTION_API_KEY!;

    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sorts: [{ timestamp: "created_time", direction: "descending" }],
      }),
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.results ?? []).map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        invoiceNumber: props.invoice_number?.title?.[0]?.plain_text ?? "",
        clientName: props.client_name?.rich_text?.[0]?.plain_text ?? "",
        issueDate: props.issue_date?.date?.start ?? "",
        status: props.status?.select?.name ?? "대기",
        totalAmount: props.total_amount?.number ?? 0,
      } satisfies InvoiceListItem;
    });
  } catch {
    return [];
  }
}

/**
 * 노션 페이지 ID로 견적서 단일 조회
 * Invoices DB 페이지와 연결된 Items DB 항목을 함께 가져옵니다
 * React cache()로 래핑하여 동일 렌더 패스에서 중복 Notion API 호출 방지
 */
export const getInvoice = cache(async (pageId: string): Promise<Invoice | null> => {
  try {
    // 견적서 페이지 조회
    const page = await notion.pages.retrieve({ page_id: pageId });

    // 페이지 타입 확인
    if (page.object !== "page") return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = (page as any).properties;

    // 연결된 Items 관계 ID 목록 추출
    const itemRelations: { id: string }[] = props.items?.relation ?? [];

    // 각 Item 페이지 병렬 조회
    const itemPages = await Promise.all(
      itemRelations.map((rel) =>
        notion.pages.retrieve({ page_id: rel.id })
      )
    );

    const items: InvoiceItem[] = itemPages.map((itemPage) =>
      notionPageToInvoiceItem(itemPage)
    );

    return notionPageToInvoice(page, items);
  } catch (error) {
    if (APIResponseError.isAPIResponseError(error)) {
      // 404: 페이지 없음 / 권한 오류
      if (
        error.code === APIErrorCode.ObjectNotFound ||
        error.code === APIErrorCode.Unauthorized ||
        error.code === APIErrorCode.RestrictedResource
      ) {
        return null;
      }
      // 그 외 API 오류 (rate limit, server error 등) — 상위로 전파
      throw error;
    }
    if (RequestTimeoutError.isRequestTimeoutError(error)) {
      // 네트워크 타임아웃 — 상위 error.tsx에서 처리
      throw error;
    }
    // 알 수 없는 네트워크/런타임 오류
    throw error;
  }
});

// -------------------------------------------
// 내부 변환 헬퍼 함수
// -------------------------------------------

/**
 * Notion 페이지 객체를 Invoice 타입으로 변환
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notionPageToInvoice(page: any, items: InvoiceItem[]): Invoice {
  const props = page.properties;

  return {
    id: page.id,
    invoiceNumber: props.invoice_number?.title?.[0]?.plain_text ?? "",
    clientName: props.client_name?.rich_text?.[0]?.plain_text ?? "",
    issueDate: props.issue_date?.date?.start ?? "",
    validUntil: props.valid_until?.date?.start ?? "",
    status: props.status?.select?.name ?? "대기",
    totalAmount: props.total_amount?.number ?? 0,
    items,
  };
}

/**
 * Notion 페이지 객체를 InvoiceItem 타입으로 변환
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notionPageToInvoiceItem(page: any): InvoiceItem {
  const props = page.properties;
  const quantity = props.quantity?.number ?? 0;
  const unitPrice = props.unit_price?.number ?? 0;

  return {
    id: page.id,
    description: props.description?.title?.[0]?.plain_text ?? "",
    quantity,
    unitPrice,
    // formula 필드가 없을 경우 직접 계산
    amount: props.amount?.formula?.number ?? quantity * unitPrice,
  };
}
