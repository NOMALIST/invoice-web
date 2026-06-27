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

function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export function InvoiceTable({ invoice }: InvoiceTableProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
        견적 내역
      </p>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[50%] font-semibold text-foreground">항목</TableHead>
              <TableHead className="text-right font-semibold text-foreground">수량</TableHead>
              <TableHead className="text-right font-semibold text-foreground">단가</TableHead>
              <TableHead className="text-right font-semibold text-foreground">금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                  견적 항목이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              invoice.items.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatKRW(item.unitPrice)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatKRW(item.amount)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 합계 영역 */}
      <div className="flex justify-end pt-2">
        <div className="w-full sm:w-72 space-y-2 rounded-xl bg-muted/50 border border-border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">소계</span>
            <span className="font-medium tabular-nums">{formatKRW(invoice.totalAmount)}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">합계</span>
            <span className="text-lg font-bold tabular-nums">{formatKRW(invoice.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
