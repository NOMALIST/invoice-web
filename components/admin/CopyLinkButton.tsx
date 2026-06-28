"use client";

// 견적서 공개 링크를 클립보드에 복사하는 버튼 컴포넌트
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyLinkButtonProps {
  /** 복사할 견적서의 Notion 페이지 ID */
  invoiceId: string;
}

export default function CopyLinkButton({ invoiceId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  // 환경변수 우선, 없으면 현재 브라우저 origin 사용
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  const url = `${baseUrl}/invoice/${invoiceId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("링크가 복사되었습니다");
      // 1.5초 후 아이콘을 원래 상태로 되돌림
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("링크 복사에 실패했습니다");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      title="링크 복사"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="sr-only">링크 복사</span>
    </Button>
  );
}
