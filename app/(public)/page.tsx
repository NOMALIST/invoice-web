import Link from "next/link";
import { FileText, Calendar, ArrowRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getInvoiceList } from "@/lib/notion";
import { Badge } from "@/components/ui/badge";
import type { InvoiceStatus } from "@/types/invoice";

const statusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive"; icon: React.ComponentType<{ className?: string }> }> = {
  대기: { label: "대기", variant: "secondary", icon: Clock },
  승인: { label: "승인", variant: "default", icon: CheckCircle2 },
  거절: { label: "거절", variant: "destructive", icon: XCircle },
};

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return format(new Date(dateStr), "yyyy. MM. dd", { locale: ko });
}

function formatKRW(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

export default async function HomePage() {
  const invoices = await getInvoiceList();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 w-full space-y-12">
      {/* 히어로 섹션 */}
      <section className="text-center space-y-4 py-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-2">
          <FileText className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          견적서 조회 서비스
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          발행된 견적서를 확인하고 PDF로 다운로드하실 수 있습니다.
        </p>
      </section>

      {/* 견적서 목록 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">최근 견적서</h2>
          <span className="text-sm text-muted-foreground">{invoices.length}건</span>
        </div>

        {invoices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">등록된 견적서가 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border overflow-hidden bg-card">
            {invoices.map((invoice) => {
              const { variant, icon: StatusIcon } = statusConfig[invoice.status];
              return (
                <Link
                  key={invoice.id}
                  href={`/invoice/${invoice.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors group"
                >
                  {/* 번호 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold truncate">
                        No. {invoice.invoiceNumber}
                      </span>
                      <Badge variant={variant} className="text-xs gap-1 px-2 py-0.5 shrink-0">
                        <StatusIcon className="h-3 w-3" />
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{invoice.clientName}</p>
                  </div>

                  {/* 날짜 */}
                  <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(invoice.issueDate)}</span>
                  </div>

                  {/* 금액 */}
                  <div className="text-sm font-semibold shrink-0 tabular-nums">
                    {formatKRW(invoice.totalAmount)}
                  </div>

                  {/* 화살표 */}
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 관리자 로그인 — subtle한 링크로 페이지 하단에 배치 */}
      <div className="pt-4 text-center">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          관리자 로그인
        </Link>
      </div>
    </div>
  );
}
