// NextAuth.js v5 핸들러
// GET, POST 요청을 모두 NextAuth 핸들러로 위임합니다

// TODO: NextAuth 설정 완료 후 아래 주석을 해제하세요
// import { handlers } from "@/lib/auth";
// export const { GET, POST } = handlers;

// 임시: 환경변수 미설정 상태에서 빌드 오류 방지
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "NextAuth 설정이 필요합니다." }, { status: 501 });
}

export function POST() {
  return NextResponse.json({ message: "NextAuth 설정이 필요합니다." }, { status: 501 });
}
