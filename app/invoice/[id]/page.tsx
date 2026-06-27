// 견적서 조회 페이지
// 노션 페이지 ID로 견적서를 조회하고 표시합니다
// 존재하지 않는 ID 요청 시 404 페이지로 리다이렉트

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInvoice, getInvoiceList } from "@/lib/notion";
import { InvoiceView } from "@/components/invoice/InvoiceView";

// 60초마다 ISR 재검증
export const revalidate = 60;
// 빌드 타임에 생성되지 않은 경로도 동적으로 허용
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ id: string }>;
}

// 빌드 타임에 Notion DB 견적서 목록을 조회하여 정적 경로 사전 생성
export async function generateStaticParams() {
  const invoices = await getInvoiceList();
  return invoices.map((invoice) => ({ id: invoice.id }));
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
    <div className="mx-auto max-w-4xl px-4 py-12 w-full">
      <InvoiceView invoice={invoice} />
    </div>
  );
}
