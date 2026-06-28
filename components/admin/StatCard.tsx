// 대시보드 통계 카드 컴포넌트
// 제목, 큰 숫자(값), 아이콘을 표시합니다. shadcn/ui Card 기반.

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  /** 카드 제목 (예: "전체", "대기") */
  title: string;
  /** 표시할 값 (숫자 또는 포맷된 문자열) */
  value: string | number;
  /** Lucide 아이콘 컴포넌트 */
  icon: LucideIcon;
  /** 아이콘 강조 색상 클래스 (예: "text-yellow-500"). 미지정 시 muted */
  accentClassName?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  accentClassName,
}: StatCardProps) {
  return (
    <Card className="py-4">
      <CardContent className="flex items-center justify-between px-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg bg-muted",
            accentClassName
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
