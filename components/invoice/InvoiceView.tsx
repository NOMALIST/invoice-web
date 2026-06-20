// 견적서 전체 뷰 컴포넌트
// 견적서 헤더, 항목 테이블, PDF 다운로드 버튼을 조합합니다

import type { Invoice } from "@/types/invoice";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { DownloadButton } from "./DownloadButton";

interface InvoiceViewProps {
  invoice: Invoice;
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 인쇄/PDF용 견적서 영역 */}
      <div
        id="invoice-content"
        className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-8 space-y-8"
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
