// Notion API 응답 관련 타입 정의
// @notionhq/client 패키지의 타입을 보조하는 커스텀 타입

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/** Notion 페이지 객체 (타입 별칭) */
export type NotionPage = PageObjectResponse;

/** Notion 텍스트 리치 텍스트 요소 */
export interface NotionRichText {
  type: "text" | "mention" | "equation";
  text?: {
    content: string;
    link: { url: string } | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
}

/** Notion 블록 공통 구조 */
export interface NotionBlockBase {
  id: string;
  type: string;
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
}

/** 지원하는 Notion 블록 타입 목록 */
export type NotionBlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list_item"
  | "numbered_list_item"
  | "to_do"
  | "toggle"
  | "child_page"
  | "image"
  | "video"
  | "embed"
  | "code"
  | "quote"
  | "divider"
  | "callout"
  | "bookmark";

/** Notion 데이터베이스 쿼리 필터 (간소화) */
export interface NotionFilter {
  property?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
