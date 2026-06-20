// 견적서 헤더 컴포넌트
// 견적서 번호, 발행일, 유효기간, 클라이언트 정보, 상태 배지를 표시합니다

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

interface InvoiceHeaderProps {
  invoice: Invoice;
}

/** 상태별 배지 스타일 매핑 */
const statusVariantMap: Record<InvoiceStatus, "default" | "secondary" | "destructive"> = {
  대기: "secondary",
  승인: "default",
  거절: "destructive",
};

/** 날짜 문자열을 한국어 형식으로 포맷 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  return format(new Date(dateStr), "yyyy년 MM월 dd일", { locale: ko });
}

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  return (
    <div className="space-y-6">
      {/* 상단: 제목 + 상태 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">견적서</h1>
          <p className="text-muted-foreground text-sm mt-1">
            No. {invoice.invoiceNumber}
          </p>
        </div>
        <Badge
          variant={statusVariantMap[invoice.status]}
          className={cn("text-sm px-3 py-1")}
        >
          {invoice.status}
        </Badge>
      </div>

      {/* 정보 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/60">
        {/* 수신자 정보 */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            수신
          </p>
          <p className="text-lg font-semibold">{invoice.clientName}</p>
        </div>

        {/* 날짜 정보 */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              발행일
            </p>
            <p className="text-sm font-medium">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              유효기간
            </p>
            <p className="text-sm font-medium">{formatDate(invoice.validUntil)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
