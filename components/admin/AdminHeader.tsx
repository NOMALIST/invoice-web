// 관리자 영역 상단 헤더 — 테마 토글 포함
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AdminHeader() {
  return (
    <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-background">
      <h1 className="font-semibold">관리자</h1>
      <ThemeToggle />
    </header>
  );
}
