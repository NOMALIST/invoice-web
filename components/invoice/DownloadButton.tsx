"use client";

// PDF 다운로드 버튼 컴포넌트 (클라이언트 컴포넌트)
// /api/generate-pdf 엔드포인트를 호출해 PDF를 다운로드합니다

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  invoiceId: string;
  invoiceNumber: string;
}

export function DownloadButton({ invoiceId, invoiceNumber }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });

      if (!response.ok) {
        throw new Error("PDF 생성에 실패했습니다.");
      }

      // Blob으로 받아 브라우저 다운로드 트리거
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `견적서_${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF 다운로드 오류:", error);
      alert("PDF 다운로드 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      size="lg"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      {isLoading ? "PDF 생성 중..." : "PDF 다운로드"}
    </Button>
  );
}
