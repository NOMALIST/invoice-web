// 로그인 페이지
// Google OAuth를 통한 가족 구성원 로그인 처리

import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "로그인 | 우리 가족 이야기",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-20 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">가족 로그인</CardTitle>
          <CardDescription>
            허용된 가족 이메일로만 로그인 가능합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: NextAuth 연동 후 signIn 액션 추가 */}
          <form
            action={async () => {
              "use server";
              // signIn("google") 을 NextAuth 설정 후 활성화하세요
            }}
          >
            <Button type="submit" className="w-full" size="lg">
              {/* Google 아이콘 추후 추가 */}
              Google로 로그인
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">
            가족 구성원만 글 작성 및 사진 업로드가 가능합니다
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
