// 견적서 시스템 네비게이션 바
// 로고와 테마 토글만 포함하는 간단한 헤더

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { FileText } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        {/* 로고 */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <FileText className="h-5 w-5" />
            <span>견적서 시스템</span>
          </Link>
        </div>

        {/* 테마 토글 */}
        <ThemeToggle />
      </div>
    </header>
  );
}
