// 견적서 조회 페이지
// 노션 페이지 ID로 견적서를 조회하고 표시합니다
// 존재하지 않는 ID 요청 시 404 페이지로 리다이렉트

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInvoice } from "@/lib/notion";
import { InvoiceView } from "@/components/invoice/InvoiceView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const invoice = await getInvoice(id);

  if (!invoice) {
    return { title: "견적서를 찾을 수 없습니다" };
  }

  return {
    title: `견적서 ${invoice.invoiceNumber}`,
    description: `${invoice.clientName} 님의 견적서입니다.`,
  };
}

export default async function InvoicePage({ params }: PageProps) {
  const { id } = await params;
  const invoice = await getInvoice(id);

  // 존재하지 않는 견적서 → 404
  if (!invoice) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 w-full">
      <InvoiceView invoice={invoice} />
    </div>
  );
}
