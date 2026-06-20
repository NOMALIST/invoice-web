// 블로그 포스트 단일 API
// GET: 슬러그로 특정 포스트 반환

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // TODO: Notion API 연동 후 아래 코드 활성화
    // const post = await getPostBySlug(slug);
    // if (!post) return NextResponse.json({ error: "포스트를 찾을 수 없습니다." }, { status: 404 });
    // return NextResponse.json(post);

    void slug; // 임시
    return NextResponse.json({ message: "Notion API 연동이 필요합니다." }, { status: 501 });
  } catch (error) {
    console.error("포스트 조회 실패:", error);
    return NextResponse.json(
      { error: "포스트를 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
