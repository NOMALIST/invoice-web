// 관리자용 견적서 목록 테이블 컴포넌트
// 견적서 번호, 클라이언트, 발행일, 상태, 금액, 링크 복사 컬럼을 표시합니다
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CopyLinkButton from "@/components/admin/CopyLinkButton";
import type { InvoiceListItem, InvoiceStatus } from "@/types/invoice";

/** 상태별 Badge variant 매핑 */
const statusVariantMap: Record<
  InvoiceStatus,
  "default" | "secondary" | "destructive"
> = {
  대기: "secondary",
  승인: "default",
  거절: "destructive",
};

interface InvoiceListTableProps {
  invoices: InvoiceListItem[];
}

export default function InvoiceListTable({ invoices }: InvoiceListTableProps) {
  // 데이터가 없을 때 빈 상태 UI 표시
  if (invoices.length === 0) {
    return (
      <div className="border border-dashed rounded-xl py-20 text-center text-muted-foreground">
        등록된 견적서가 없습니다.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>견적서 번호</TableHead>
            <TableHead>클라이언트</TableHead>
            <TableHead>발행일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">금액</TableHead>
            <TableHead className="text-center">링크</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              {/* 견적서 번호 */}
              <TableCell className="font-medium">
                No. {invoice.invoiceNumber}
              </TableCell>

              {/* 클라이언트명 */}
              <TableCell className="text-muted-foreground">
                {invoice.clientName}
              </TableCell>

              {/* 발행일 */}
              <TableCell className="text-muted-foreground">
                {invoice.issueDate
                  ? new Date(invoice.issueDate).toLocaleDateString("ko-KR")
                  : "-"}
              </TableCell>

              {/* 상태 배지 */}
              <TableCell>
                <Badge variant={statusVariantMap[invoice.status]}>
                  {invoice.status}
                </Badge>
              </TableCell>

              {/* 금액 (우측 정렬, 천 단위 구분) */}
              <TableCell className="text-right font-semibold tabular-nums">
                {invoice.totalAmount.toLocaleString("ko-KR")}원
              </TableCell>

              {/* 링크 복사 버튼 */}
              <TableCell className="text-center">
                <CopyLinkButton invoiceId={invoice.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
