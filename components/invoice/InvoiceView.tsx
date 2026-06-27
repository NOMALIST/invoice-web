import type { Invoice } from "@/types/invoice";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { DownloadButton } from "./DownloadButton";

interface InvoiceViewProps {
  invoice: Invoice;
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  return (
    <div className="space-y-6">
      {/* 인쇄/PDF용 견적서 영역 */}
      <div
        id="invoice-content"
        className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm p-8 space-y-8"
      >
        <InvoiceHeader invoice={invoice} />
        <InvoiceTable invoice={invoice} />
      </div>

      {/* PDF 다운로드 버튼 — 인쇄 시 숨김 */}
      <div className="flex justify-end print:hidden">
        <DownloadButton invoiceId={invoice.id} invoiceNumber={invoice.invoiceNumber} />
      </div>
    </div>
  );
}
