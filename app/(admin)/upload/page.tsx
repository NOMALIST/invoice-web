// 사진 업로드 페이지 (관리자 전용)
// Cloudinary에 사진을 업로드하고 Notion 갤러리 DB에 등록합니다

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사진 업로드 | 우리 가족 이야기",
};

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">사진 업로드</h1>
        <p className="text-sm text-muted-foreground">
          사진을 업로드하면 Cloudinary에 저장되고 갤러리 DB에 등록됩니다.
        </p>
      </div>

      {/* TODO: 드래그앤드롭 업로드 컴포넌트 추가 */}
      <div className="flex items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-lg">
        사진 업로드 영역 (업로드 컴포넌트 구현 예정)
      </div>
    </div>
  );
}
