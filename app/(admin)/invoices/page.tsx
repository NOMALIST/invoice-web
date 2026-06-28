// 관리자 견적서 목록 페이지 — Notion DB에서 데이터를 가져와 테이블로 표시
import { getInvoiceList } from "@/lib/notion";
import InvoiceListTable from "@/components/admin/InvoiceListTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "견적서 목록",
};

export default async function AdminInvoicesPage() {
  const invoices = await getInvoiceList();

  return (
    <div className="space-y-6">
      {/* 페이지 헤더: 제목과 총 건수 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">견적서 목록</h2>
        <span className="text-sm text-muted-foreground">{invoices.length}건</span>
      </div>

      {/* 견적서 목록 테이블 */}
      <InvoiceListTable invoices={invoices} />
    </div>
  );
}
