// 공개 페이지 레이아웃
// 별도 레이아웃이 필요 없으므로 루트 레이아웃을 그대로 사용합니다

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
