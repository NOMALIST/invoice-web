// 인증 미들웨어
// (admin) 라우트 그룹의 모든 경로를 보호합니다
// 로그인하지 않은 사용자는 /login으로 리다이렉트됩니다

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요한 경로 패턴
const PROTECTED_PATHS = ["/write", "/edit", "/upload"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 보호된 경로인지 확인
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // TODO: NextAuth 연동 후 세션 기반 인증으로 교체
  // 현재는 임시로 모든 접근 허용 (개발 편의를 위해)
  // const session = await auth();
  // if (!session) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  // API 라우트, Next.js 내부 경로, 정적 파일은 미들웨어 제외
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
