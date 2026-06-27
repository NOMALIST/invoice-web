import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Clock, CheckCircle2, XCircle, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

interface InvoiceHeaderProps {
  invoice: Invoice;
}

const statusConfig: Record<
  InvoiceStatus,
  {
    variant: "default" | "secondary" | "destructive";
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  대기: { variant: "secondary", icon: Clock, color: "text-amber-500" },
  승인: { variant: "default", icon: CheckCircle2, color: "text-emerald-500" },
  거절: { variant: "destructive", icon: XCircle, color: "text-red-500" },
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  return format(new Date(dateStr), "yyyy년 MM월 dd일", { locale: ko });
}

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  const { variant, icon: StatusIcon, color } = statusConfig[invoice.status];

  return (
    <div className="space-y-6">
      {/* 상단: 제목 + 상태 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
            견적서
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            No. {invoice.invoiceNumber}
          </h1>
        </div>
        <Badge
          variant={variant}
          className={cn("gap-1.5 px-3 py-1 text-sm font-medium")}
        >
          <StatusIcon className={cn("h-3.5 w-3.5", color)} />
          {invoice.status}
        </Badge>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-border" />

      {/* 정보 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* 수신자 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <User className="h-3 w-3" />
            수신
          </div>
          <p className="text-base font-semibold">{invoice.clientName}</p>
        </div>

        {/* 발행일 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Calendar className="h-3 w-3" />
            발행일
          </div>
          <p className="text-base font-medium">{formatDate(invoice.issueDate)}</p>
        </div>

        {/* 유효기간 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Calendar className="h-3 w-3" />
            유효기간
          </div>
          <p className="text-base font-medium">{formatDate(invoice.validUntil)}</p>
        </div>
      </div>
    </div>
  );
}
