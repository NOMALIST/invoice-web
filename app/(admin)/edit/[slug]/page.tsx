// 글 수정 페이지 (관리자 전용)
// 기존 블로그 포스트를 수정합니다

import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `글 수정: ${slug} | 우리 가족 이야기`,
  };
}

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params;
  void slug; // 임시: 사용되지 않는 변수 경고 억제

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">글 수정</h1>
        <p className="text-sm text-muted-foreground">
          수정된 내용은 Notion 데이터베이스에 반영됩니다.
        </p>
      </div>

      {/* TODO: PostForm 컴포넌트에 기존 데이터 props로 전달 */}
      <div className="flex items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-lg">
        글 수정 폼이 여기에 표시됩니다 (PostForm 컴포넌트 구현 예정)
      </div>
    </div>
  );
}
