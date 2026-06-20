// 견적서 시스템 홈 페이지
// 서비스 소개와 견적서 조회 안내를 제공합니다

import { FileText } from "lucide-react";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-20 md:py-32 w-full">
      <div className="flex flex-col items-center text-center space-y-6 max-w-xl mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          견적서 조회 서비스
        </h1>
        <p className="text-muted-foreground">
          발행자로부터 전달받은 견적서 링크를 통해 견적서를 확인하고
          PDF로 다운로드하실 수 있습니다.
        </p>
        <p className="text-sm text-muted-foreground/70">
          견적서 링크가 없으시면 발행자에게 문의해 주세요.
        </p>
      </div>
    </section>
  );
}
