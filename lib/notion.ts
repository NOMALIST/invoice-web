// Notion API 클라이언트 초기화 및 견적서 헬퍼 함수

import { Client } from "@notionhq/client";
import type { Invoice, InvoiceItem } from "@/types/invoice";

// Notion 클라이언트 싱글톤 인스턴스
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// -------------------------------------------
// 견적서 관련 함수
// -------------------------------------------

/**
 * 노션 페이지 ID로 견적서 단일 조회
 * Invoices DB 페이지와 연결된 Items DB 항목을 함께 가져옵니다
 */
export async function getInvoice(pageId: string): Promise<Invoice | null> {
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
  } catch {
    // 존재하지 않는 페이지 또는 접근 불가
    return null;
  }
}

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
