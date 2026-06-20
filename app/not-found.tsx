// 404 에러 페이지
// 존재하지 않는 견적서 ID 접근 또는 잘못된 URL 접근 시 표시됩니다

import Link from "next/link";
import { FileX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-20 md:py-32 w-full">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <FileX className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            견적서를 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground">
            요청하신 견적서가 존재하지 않거나 삭제되었습니다.
            <br />
            견적서 링크가 올바른지 확인하거나 발행자에게 문의해 주세요.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </section>
  );
}
