// PDF 생성 API Route
// 견적서 ID를 받아 @react-pdf/renderer로 PDF를 생성하고 반환합니다
// 서버 사이드에서만 동작합니다

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getInvoice } from "@/lib/notion";
import { InvoicePDF } from "@/lib/pdf";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId } = body as { invoiceId: string };

    if (!invoiceId) {
      return NextResponse.json(
        { error: "invoiceId가 필요합니다." },
        { status: 400 }
      );
    }

    // 노션에서 견적서 데이터 조회
    const invoice = await getInvoice(invoiceId);

    if (!invoice) {
      return NextResponse.json(
        { error: "견적서를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // PDF 버퍼 생성 후 Uint8Array로 변환 (NextResponse 호환)
    const pdfBuffer = await renderToBuffer(InvoicePDF({ invoice }));
    const pdfBytes = new Uint8Array(pdfBuffer);

    // PDF Response 반환
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(`견적서_${invoice.invoiceNumber}`)}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF 생성 오류:", error);
    return NextResponse.json(
      { error: "PDF 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
