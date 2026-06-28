// 관리자 전용 레이아웃 — 사이드바 + 헤더 + 메인 콘텐츠 영역
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 관리자 사이드바 (데스크톱: 고정, 모바일: Sheet) */}
      <AdminSidebar />

      {/* 오른쪽 콘텐츠 영역 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
