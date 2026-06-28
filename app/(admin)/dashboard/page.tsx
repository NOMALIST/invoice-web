// 관리자 대시보드 — 통계 카드 + 최근 견적서 5건 미리보기
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { getInvoiceList } from "@/lib/notion";
import StatCard from "@/components/admin/StatCard";
import InvoiceListTable from "@/components/admin/InvoiceListTable";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드",
};

/** 원화 포맷 헬퍼 */
function formatKRW(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

export default async function AdminDashboardPage() {
  const invoices = await getInvoiceList();

  // 상태별 건수 통계 계산
  const total = invoices.length;
  const pending = invoices.filter((i) => i.status === "대기").length;
  const approved = invoices.filter((i) => i.status === "승인").length;
  const rejected = invoices.filter((i) => i.status === "거절").length;

  // 총 견적 금액 합산
  const totalAmount = invoices.reduce((sum, i) => sum + i.totalAmount, 0);

  // 최근 5건 미리보기 (getInvoiceList는 created_time 내림차순 정렬됨)
  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h2 className="text-xl font-semibold">대시보드</h2>
        <p className="text-sm text-muted-foreground mt-1">
          견적서 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="전체" value={total} icon={FileText} />
        <StatCard
          title="대기"
          value={pending}
          icon={Clock}
          accentClassName="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"
        />
        <StatCard
          title="승인"
          value={approved}
          icon={CheckCircle2}
          accentClassName="bg-green-500/10 text-green-600 dark:text-green-500"
        />
        <StatCard
          title="거절"
          value={rejected}
          icon={XCircle}
          accentClassName="bg-destructive/10 text-destructive"
        />
      </div>

      {/* 총 견적 금액 카드 */}
      <StatCard
        title="총 견적 금액"
        value={formatKRW(totalAmount)}
        icon={Wallet}
        accentClassName="bg-primary/10 text-primary"
      />

      {/* 최근 견적서 미리보기 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">최근 견적서</h3>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <Link href="/invoices">
              전체 목록 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <InvoiceListTable invoices={recentInvoices} />
      </section>
    </div>
  );
}
