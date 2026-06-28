"use server";

// 관리자 인증 Server Action (MVP 하드코딩 방식)
// NextAuth.js 없이 단순 자격증명 검증 + 쿠키 기반 세션을 사용합니다.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// MVP용 하드코딩 자격증명
const ADMIN_ID = "admin";
const ADMIN_PW = "admin";

// 세션 쿠키 설정
const SESSION_COOKIE_NAME = "admin-session";
const SESSION_COOKIE_VALUE = "authenticated";
// 쿠키 유효 기간 (7일)
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * 로그인 Server Action
 * admin/admin 자격증명을 검증하고 성공 시 세션 쿠키를 설정한 뒤 대시보드로 이동합니다.
 * 실패 시 에러 메시지를 반환하여 폼에서 표시합니다.
 *
 * @param _prevState useActionState용 이전 상태 (사용하지 않음)
 * @param formData    로그인 폼 데이터 (username, password)
 */
export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // 자격증명 검증
  if (username !== ADMIN_ID || password !== ADMIN_PW) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  // 인증 성공 → 세션 쿠키 설정
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // 대시보드로 리다이렉트 (redirect는 내부적으로 throw하므로 이후 코드 미실행)
  redirect("/dashboard");
}

/**
 * 로그아웃 Server Action
 * 세션 쿠키를 삭제하고 로그인 페이지로 이동합니다.
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
