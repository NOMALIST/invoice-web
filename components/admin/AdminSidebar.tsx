"use client";

// 관리자 사이드바 — 데스크톱: 고정 aside, 모바일: Sheet 슬라이드 메뉴
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// 네비게이션 메뉴 항목 정의
// (admin) route group은 URL에 영향 없으므로 /admin 접두사 없이 매핑됨
const navItems = [
  { href: "/dashboard", label: "대시보드", icon: FileText },
  { href: "/invoices", label: "견적서 관리", icon: FileText },
];

/** 네비게이션 링크 목록 — 데스크톱/모바일 공용 */
function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            // 현재 경로와 일치하면 활성 스타일 적용
            pathname === href
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

/** 사이드바 상단 로고/타이틀 영역 */
function SidebarBrand() {
  return (
    <div className="border-b border-border px-6 py-4">
      <Link href="/dashboard" className="flex items-center gap-2 font-bold">
        <FileText className="h-5 w-5" />
        <span>관리자 패널</span>
      </Link>
    </div>
  );
}

export default function AdminSidebar() {
  return (
    <>
      {/* 데스크톱 사이드바 (md 이상에서만 표시) */}
      <aside className="w-64 border-r border-border flex-col hidden md:flex bg-background h-screen">
        <SidebarBrand />
        <NavLinks />
      </aside>

      {/* 모바일 햄버거 버튼 + Sheet 슬라이드 메뉴 (md 미만에서만 표시) */}
      <div className="md:hidden fixed top-3 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="메뉴 열기">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b border-border px-6 py-4">
              <SheetTitle className="flex items-center gap-2 font-bold text-left">
                <FileText className="h-5 w-5" />
                관리자 패널
              </SheetTitle>
            </SheetHeader>
            <NavLinks />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
