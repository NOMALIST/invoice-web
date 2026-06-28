// 관리자 영역 상단 헤더 — 테마 토글 + 로그아웃 버튼 포함
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

export default function AdminHeader() {
  return (
    <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-background">
      <h1 className="font-semibold">관리자</h1>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* 로그아웃 — logout Server Action을 form action으로 호출 */}
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">로그아웃</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
