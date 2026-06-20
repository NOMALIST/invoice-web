// 글쓰기 페이지 (관리자 전용)
// 로그인한 가족 구성원이 새 블로그 포스트를 작성합니다

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "글 작성 | 우리 가족 이야기",
};

export default function WritePage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">새 글 작성</h1>
        <p className="text-sm text-muted-foreground">
          작성된 글은 Notion 데이터베이스에 저장됩니다.
        </p>
      </div>

      {/* TODO: PostForm 컴포넌트 추가 */}
      <div className="flex items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-lg">
        글쓰기 폼이 여기에 표시됩니다 (PostForm 컴포넌트 구현 예정)
      </div>
    </div>
  );
}
