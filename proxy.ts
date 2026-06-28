// 인증 프록시 (MVP 하드코딩 방식)
// Next.js 16에서 middleware → proxy로 규칙이 변경되었습니다.
// (admin) 라우트 그룹의 경로(/dashboard, /invoices)를 admin-session 쿠키로 보호합니다.
// 미인증 상태에서 접근 시 /login으로 리다이렉트합니다.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 세션 쿠키 이름 (app/actions/auth.ts와 동일하게 유지)
const SESSION_COOKIE_NAME = "admin-session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // admin-session 쿠키 존재 여부로 인증 상태 판단
  const isAuthenticated =
    request.cookies.get(SESSION_COOKIE_NAME)?.value === "authenticated";

  // 미인증 상태면 로그인 페이지로 리다이렉트 (원래 목적지를 callbackUrl로 전달)
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // (admin) 라우트 그룹 경로만 보호 (/login은 매처에 포함되지 않아 자동 제외)
  matcher: ["/dashboard/:path*", "/invoices/:path*"],
};
