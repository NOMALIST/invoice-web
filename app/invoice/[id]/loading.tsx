// 견적서 상세 페이지 로딩 스켈레톤 UI
// page.tsx + InvoiceView 레이아웃과 정확히 일치시켜 CLS를 방지합니다

import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceLoading() {
  return (
    // page.tsx 외부 컨테이너와 동일: max-w-4xl px-4 py-12
    <div className="mx-auto max-w-4xl px-4 py-12 w-full">
      {/* InvoiceView: space-y-6 */}
      <div className="space-y-6">
        {/* 카드: InvoiceView의 #invoice-content와 동일한 클래스 */}
        <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm p-8 space-y-8">

          {/* InvoiceHeader 스켈레톤 */}
          <div className="space-y-6">
            {/* 상단: 제목 + 상태 배지 */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>

            {/* 정보 그리드: 수신자 + 날짜 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/60">
              <div className="space-y-2">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            </div>
          </div>

          {/* InvoiceTable 스켈레톤 */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-border">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t border-border">
              <div className="space-y-2 w-52">
                <div className="flex justify-between gap-8">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between gap-8">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between gap-8 pt-2 border-t border-border">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DownloadButton 영역: InvoiceView와 동일 */}
        <div className="flex justify-end print:hidden">
          <Skeleton className="h-11 w-44" />
        </div>
      </div>
    </div>
  );
}
