// NextAuth.js v5 (beta) 인증 설정
// Google OAuth를 사용하여 허용된 가족 이메일만 로그인 가능하도록 설정

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * 허용된 이메일 목록을 환경변수에서 파싱
 * ALLOWED_EMAILS=a@gmail.com,b@gmail.com 형식으로 설정
 */
function getAllowedEmails(): string[] {
  const raw = process.env.ALLOWED_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    /**
     * 로그인 허용 여부 결정
     * 허용된 이메일 목록에 있는 가족 구성원만 로그인 가능
     */
    async signIn({ user }) {
      const allowedEmails = getAllowedEmails();

      // ALLOWED_EMAILS가 설정되지 않은 경우 모든 로그인 차단
      if (allowedEmails.length === 0) {
        console.warn("ALLOWED_EMAILS 환경변수가 설정되지 않았습니다.");
        return false;
      }

      return allowedEmails.includes(user.email ?? "");
    },
    /**
     * JWT 토큰에 사용자 정보 추가
     */
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    /**
     * 세션에 사용자 정보 포함
     */
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    // 커스텀 로그인 페이지 경로
    signIn: "/login",
    // 접근 거부 페이지 (이메일이 허용 목록에 없을 때)
    error: "/login",
  },
});
