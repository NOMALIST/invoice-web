// 블로그 포스트 관련 타입 정의

/** 포스트 상태 */
export type PostStatus = "Published" | "Draft";

/** 블로그 포스트 메타 정보 (목록 조회 시 사용) */
export interface PostMeta {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string | null;
  coverImage: string | null;
  excerpt: string;
}

/** 블로그 포스트 전체 (상세 조회 시 사용) */
export interface Post extends PostMeta {
  /** Notion 블록 콘텐츠 (렌더링용) */
  blocks: NotionBlock[];
}

/** 최소한의 Notion 블록 타입 (자세한 정의는 types/notion.ts 참조) */
export interface NotionBlock {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
