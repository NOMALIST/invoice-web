// 블로그 포스트 목록 API
// GET: 발행된 포스트 목록 반환

import { NextResponse } from "next/server";
// TODO: import { getPublishedPosts } from "@/lib/notion";

export async function GET() {
  try {
    // TODO: Notion API 연동 후 아래 코드 활성화
    // const posts = await getPublishedPosts();
    // return NextResponse.json(posts);

    return NextResponse.json({ message: "Notion API 연동이 필요합니다." }, { status: 501 });
  } catch (error) {
    console.error("포스트 목록 조회 실패:", error);
    return NextResponse.json(
      { error: "포스트 목록을 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
