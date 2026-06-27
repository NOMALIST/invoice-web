"use client";

// 견적서 상세 페이지 에러 바운더리 컴포넌트
// Next.js App Router의 error.tsx 규칙에 따라 반드시 "use client" 필요
// 렌더링/데이터 패칭 오류 발생 시 표시됩니다

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InvoiceError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 외부 에러 트래커로 전송)
    console.error("견적서 페이지 오류:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 w-full">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">견적서를 불러올 수 없습니다</h2>
              <p className="text-sm text-muted-foreground">
                {error.message || "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground font-mono">
                  오류 코드: {error.digest}
                </p>
              )}
            </div>
            <Button onClick={reset} variant="outline" className="gap-2 mt-2">
              <RotateCcw className="h-4 w-4" />
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
