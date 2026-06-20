// 사진 업로드 API (서버 사이드)
// POST: 이미지를 Cloudinary에 업로드하고 URL 반환

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "파일이 필요합니다." },
        { status: 400 }
      );
    }

    // TODO: 인증 확인 (로그인한 가족 구성원만 업로드 가능)
    // const session = await auth();
    // if (!session) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

    // TODO: Cloudinary 업로드 연동 후 아래 코드 활성화
    // const { uploadToCloudinary } = await import("@/lib/cloudinary");
    // const imageUrl = await uploadToCloudinary(file, "family-blog/gallery");
    // return NextResponse.json({ url: imageUrl });

    void file; // 임시
    return NextResponse.json({ message: "Cloudinary 연동이 필요합니다." }, { status: 501 });
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    return NextResponse.json(
      { error: "파일 업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}
