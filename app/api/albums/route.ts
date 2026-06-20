// 갤러리 앨범 목록 API
// GET: 발행된 앨범 목록 반환

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // TODO: Notion API 연동 후 아래 코드 활성화
    // const albums = await getPublishedAlbums();
    // return NextResponse.json(albums);

    return NextResponse.json({ message: "Notion API 연동이 필요합니다." }, { status: 501 });
  } catch (error) {
    console.error("앨범 목록 조회 실패:", error);
    return NextResponse.json(
      { error: "앨범 목록을 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
