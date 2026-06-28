"use client";

// 관리자 로그인 폼 (Client Component)
// useActionState로 login Server Action을 호출하고, 검증 실패 시 에러 메시지를 표시합니다.

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Lock } from "lucide-react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** 제출 버튼 — pending 상태에 따라 비활성화/문구 변경 */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "로그인 중..." : "로그인"}
    </Button>
  );
}

export default function LoginForm() {
  // login Server Action과 폼 상태 연결
  const [state, formAction] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-4">
      {/* 아이디 입력 */}
      <div className="space-y-2">
        <Label htmlFor="username">아이디</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="admin"
          autoComplete="username"
          required
          autoFocus
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {/* 에러 메시지 */}
      {state?.error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <Lock className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
