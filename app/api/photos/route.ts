// 갤러리 사진 목록 API
// GET: 앨범 ID를 쿼리 파라미터로 받아 사진 목록 반환

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get("albumId");

    if (!albumId) {
      return NextResponse.json(
        { error: "albumId 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    // TODO: Notion API 연동 후 아래 코드 활성화
    // const photos = await getPhotosByAlbumId(albumId);
    // return NextResponse.json(photos);

    void albumId; // 임시
    return NextResponse.json({ message: "Notion API 연동이 필요합니다." }, { status: 501 });
  } catch (error) {
    console.error("사진 목록 조회 실패:", error);
    return NextResponse.json(
      { error: "사진 목록을 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
