// 관리자 로그인 페이지
// 화면 중앙에 로그인 카드를 배치하고, 폼은 클라이언트 컴포넌트로 분리합니다.

import { ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 로그인",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          {/* 로고/아이콘 영역 */}
          <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">관리자 로그인</CardTitle>
          <CardDescription>
            견적서 관리 대시보드에 접근하려면 로그인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
