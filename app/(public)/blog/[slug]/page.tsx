// 블로그 포스트 상세 페이지
// 슬러그를 기반으로 Notion에서 포스트 내용을 가져옵니다

import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // TODO: Notion에서 포스트 메타 조회 후 동적 메타데이터 반환
  return {
    title: `${slug} | 우리 가족 이야기`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // TODO: Notion API 연동 후 실제 데이터 조회
  // const post = await getPostBySlug(slug);
  // if (!post) notFound();
  void slug; // 임시: 사용되지 않는 변수 경고 억제
  void notFound; // 임시: 사용되지 않는 함수 경고 억제

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <article className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
        <h1>포스트 준비 중</h1>
        <p className="text-muted-foreground">
          Notion API를 연동하면 포스트 내용이 표시됩니다.
        </p>
      </article>
    </div>
  );
}
