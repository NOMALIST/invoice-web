// 갤러리 앨범 상세 페이지
// 특정 앨범의 사진들을 그리드로 표시합니다

import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ albumSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumSlug } = await params;
  // TODO: Notion에서 앨범 메타 조회 후 동적 메타데이터 반환
  return {
    title: `${albumSlug} | 갤러리 | 우리 가족 이야기`,
  };
}

export default async function AlbumDetailPage({ params }: Props) {
  const { albumSlug } = await params;

  // TODO: Notion API 연동 후 실제 데이터 조회
  // const album = await getAlbumBySlug(albumSlug);
  // if (!album) notFound();
  void albumSlug; // 임시: 사용되지 않는 변수 경고 억제
  void notFound; // 임시: 사용되지 않는 함수 경고 억제

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">앨범 준비 중</h1>
        <p className="text-muted-foreground">
          Notion API를 연동하면 사진들이 표시됩니다.
        </p>
      </div>

      {/* TODO: 사진 그리드 컴포넌트 (PhotoGrid) 추가 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* 사진 목록 */}
      </div>
    </div>
  );
}
