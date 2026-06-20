// 견적서 항목 테이블 컴포넌트
// 견적 항목(설명, 수량, 단가, 금액)과 합계를 표 형식으로 표시합니다

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Invoice } from "@/types/invoice";

interface InvoiceTableProps {
  invoice: Invoice;
}

/** 숫자를 한국 원화 형식으로 포맷 */
function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export function InvoiceTable({ invoice }: InvoiceTableProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        견적 내역
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">항목</TableHead>
            <TableHead className="text-right">수량</TableHead>
            <TableHead className="text-right">단가</TableHead>
            <TableHead className="text-right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoice.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                견적 항목이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            invoice.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatKRW(item.unitPrice)}</TableCell>
                <TableCell className="text-right">{formatKRW(item.amount)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 합계 영역 */}
      <div className="flex justify-end border-t border-border pt-4">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-8">
            <span className="text-sm text-muted-foreground">소계</span>
            <span className="text-sm font-medium">{formatKRW(invoice.totalAmount)}</span>
          </div>
          <div className="flex items-center gap-8 pt-2 border-t border-border">
            <span className="text-base font-semibold">합계</span>
            <span className="text-base font-bold">{formatKRW(invoice.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
