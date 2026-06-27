// 견적서 상세 페이지 로딩 스켈레톤 UI
// InvoiceView → InvoiceHeader + InvoiceTable 구조를 그대로 따릅니다

import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceLoading() {
  return (
    // page.tsx의 외부 컨테이너와 동일한 구조
    <div className="mx-auto max-w-screen-2xl px-4 py-10 w-full">
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 견적서 카드 영역 (InvoiceView의 #invoice-content와 동일한 클래스) */}
      <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-8 space-y-8">

        {/* InvoiceHeader 스켈레톤 */}
        <div className="space-y-6">
          {/* 상단: 제목 + 상태 배지 */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              {/* h1 "견적서" 텍스트 */}
              <Skeleton className="h-8 w-24" />
              {/* No. 인보이스 번호 */}
              <Skeleton className="h-4 w-36" />
            </div>
            {/* 상태 배지 */}
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>

          {/* 정보 그리드: 수신자 + 날짜 정보 (border-t 구분선 포함) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/60">
            {/* 수신자 정보 */}
            <div className="space-y-2">
              {/* 라벨 */}
              <Skeleton className="h-3 w-8" />
              {/* 클라이언트명 */}
              <Skeleton className="h-6 w-40" />
            </div>

            {/* 날짜 정보 */}
            <div className="space-y-3">
              {/* 발행일 */}
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-36" />
              </div>
              {/* 유효기간 */}
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>

        {/* InvoiceTable 스켈레톤 */}
        <div className="space-y-4">
          {/* 테이블 헤더 행 */}
          <div className="grid grid-cols-4 gap-4 pb-2 border-b border-border">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* 테이블 데이터 행 (4개) */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 py-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}

          {/* 합계 영역 (우측 정렬) */}
          <div className="flex justify-end pt-4 border-t border-border">
            <div className="space-y-2 w-52">
              {/* 소계 */}
              <div className="flex justify-between gap-8">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
              {/* 세금 */}
              <div className="flex justify-between gap-8">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-16" />
              </div>
              {/* 합계 (굵게 표시) */}
              <div className="flex justify-between gap-8 pt-2 border-t border-border">
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF 다운로드 버튼 영역 */}
      <div className="flex justify-end">
        <Skeleton className="h-11 w-44" />
      </div>
    </div>
    </div>
  );
}
