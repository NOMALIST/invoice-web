// 블로그 목록 페이지
// Notion DB에서 발행된 포스트를 가져와 목록으로 표시합니다

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "블로그 | 우리 가족 이야기",
  description: "가족의 이야기와 일상을 기록한 블로그입니다.",
};

export default function BlogListPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tight">블로그</h1>
        <p className="text-muted-foreground">가족의 이야기를 기록합니다.</p>
      </div>

      {/* TODO: Notion API 연동 후 실제 포스트 목록으로 교체 */}
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Notion 데이터베이스를 연동하면 포스트가 표시됩니다.
      </div>
    </div>
  );
}
