// 갤러리 앨범 목록 페이지
// Notion DB에서 발행된 앨범을 가져와 그리드로 표시합니다

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "갤러리 | 우리 가족 이야기",
  description: "가족의 소중한 사진들을 모은 갤러리입니다.",
};

export default function GalleryListPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tight">갤러리</h1>
        <p className="text-muted-foreground">소중한 순간들을 담은 사진첩입니다.</p>
      </div>

      {/* TODO: Notion API 연동 후 실제 앨범 목록으로 교체 */}
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Notion 데이터베이스를 연동하면 앨범이 표시됩니다.
      </div>
    </div>
  );
}
