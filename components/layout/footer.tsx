// 견적서 시스템 푸터
// 저작권 정보를 표시합니다

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto flex h-14 items-center justify-center max-w-screen-2xl px-4">
        <p className="text-xs text-muted-foreground">
          © {currentYear} 견적서 시스템. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
