// Notion API 클라이언트 초기화 및 헬퍼 함수
// @notionhq/client를 사용하여 블로그, 갤러리, 견적서 데이터를 가져옵니다

import { Client } from "@notionhq/client";
import type { PostMeta } from "@/types/post";
import type { Album, Photo } from "@/types/gallery";
import type { Invoice, InvoiceItem } from "@/types/invoice";

// Notion 클라이언트 싱글톤 인스턴스
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// @notionhq/client v5에서 databases.query가 제거됨
// 기존 블로그/갤러리 코드 호환을 위해 any 캐스팅 사용
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const notionAny = notion as any;

// -------------------------------------------
// 블로그 포스트 관련 함수
// -------------------------------------------

/**
 * 발행된 블로그 포스트 목록 조회
 * Notion Blog DB에서 Status가 Published인 항목을 가져옵니다
 */
export async function getPublishedPosts(): Promise<PostMeta[]> {
  const dbId = process.env.NOTION_BLOG_DB_ID;
  if (!dbId) throw new Error("NOTION_BLOG_DB_ID 환경변수가 설정되지 않았습니다.");

  const response = await notionAny.databases.query({
    database_id: dbId,
    filter: {
      property: "Status",
      status: {
        equals: "Published",
      },
    },
    sorts: [
      {
        property: "Published At",
        direction: "descending",
      },
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.results.map((page: any) => notionPageToPostMeta(page));
}

/**
 * 슬러그로 블로그 포스트 단일 조회
 */
export async function getPostBySlug(slug: string): Promise<PostMeta | null> {
  const dbId = process.env.NOTION_BLOG_DB_ID;
  if (!dbId) throw new Error("NOTION_BLOG_DB_ID 환경변수가 설정되지 않았습니다.");

  const response = await notionAny.databases.query({
    database_id: dbId,
    filter: {
      property: "Slug",
      rich_text: {
        equals: slug,
      },
    },
  });

  if (response.results.length === 0) return null;
  return notionPageToPostMeta(response.results[0]);
}

/**
 * 포스트의 블록(본문 콘텐츠) 조회
 */
export async function getPageBlocks(pageId: string) {
  const response = await notion.blocks.children.list({
    block_id: pageId,
  });
  return response.results;
}

// -------------------------------------------
// 갤러리 앨범 관련 함수
// -------------------------------------------

/**
 * 발행된 갤러리 앨범 목록 조회
 */
export async function getPublishedAlbums(): Promise<Album[]> {
  const dbId = process.env.NOTION_ALBUMS_DB_ID;
  if (!dbId) throw new Error("NOTION_ALBUMS_DB_ID 환경변수가 설정되지 않았습니다.");

  const response = await notionAny.databases.query({
    database_id: dbId,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.results.map((page: any) => notionPageToAlbum(page));
}

/**
 * 슬러그로 앨범 단일 조회
 */
export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  const dbId = process.env.NOTION_ALBUMS_DB_ID;
  if (!dbId) throw new Error("NOTION_ALBUMS_DB_ID 환경변수가 설정되지 않았습니다.");

  const response = await notionAny.databases.query({
    database_id: dbId,
    filter: {
      property: "Slug",
      rich_text: {
        equals: slug,
      },
    },
  });

  if (response.results.length === 0) return null;
  return notionPageToAlbum(response.results[0]);
}

/**
 * 앨범 ID로 사진 목록 조회
 */
export async function getPhotosByAlbumId(albumId: string): Promise<Photo[]> {
  const dbId = process.env.NOTION_PHOTOS_DB_ID;
  if (!dbId) throw new Error("NOTION_PHOTOS_DB_ID 환경변수가 설정되지 않았습니다.");

  const response = await notionAny.databases.query({
    database_id: dbId,
    filter: {
      property: "Album",
      relation: {
        contains: albumId,
      },
    },
    sorts: [
      {
        property: "Order",
        direction: "ascending",
      },
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.results.map((page: any) => notionPageToPhoto(page));
}

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

/**
 * Notion 페이지 객체를 PostMeta 타입으로 변환
 * @todo Notion 데이터베이스 스키마에 맞게 속성명을 수정하세요
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notionPageToPostMeta(page: any): PostMeta {
  const props = page.properties;

  return {
    id: page.id,
    title: props.Title?.title?.[0]?.plain_text ?? "",
    slug: props.Slug?.rich_text?.[0]?.plain_text ?? "",
    status: props.Status?.status?.name ?? "Draft",
    category: props.Category?.select?.name ?? "",
    tags: props.Tags?.multi_select?.map((t: { name: string }) => t.name) ?? [],
    author: props.Author?.rich_text?.[0]?.plain_text ?? "",
    publishedAt: props["Published At"]?.date?.start ?? null,
    coverImage: props["Cover Image"]?.url ?? null,
    excerpt: props.Excerpt?.rich_text?.[0]?.plain_text ?? "",
  };
}

/**
 * Notion 페이지 객체를 Album 타입으로 변환
 * @todo Notion 데이터베이스 스키마에 맞게 속성명을 수정하세요
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notionPageToAlbum(page: any): Album {
  const props = page.properties;

  return {
    id: page.id,
    name: props.Name?.title?.[0]?.plain_text ?? "",
    slug: props.Slug?.rich_text?.[0]?.plain_text ?? "",
    description: props.Description?.rich_text?.[0]?.plain_text ?? "",
    coverImage: props["Cover Image"]?.url ?? null,
    date: props.Date?.date?.start ?? null,
    published: props.Published?.checkbox ?? false,
  };
}

/**
 * Notion 페이지 객체를 Photo 타입으로 변환
 * @todo Notion 데이터베이스 스키마에 맞게 속성명을 수정하세요
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notionPageToPhoto(page: any): Photo {
  const props = page.properties;

  return {
    id: page.id,
    title: props.Title?.title?.[0]?.plain_text ?? "",
    albumId: props.Album?.relation?.[0]?.id ?? "",
    imageUrl: props["Image URL"]?.url ?? "",
    takenAt: props["Taken At"]?.date?.start ?? null,
    order: props.Order?.number ?? 0,
  };
}
