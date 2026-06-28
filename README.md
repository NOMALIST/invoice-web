# 노션 기반 견적서 관리 시스템

노션을 단일 데이터 소스로 활용하는 견적서 조회 및 PDF 다운로드 시스템입니다.
클라이언트는 고유 URL로 견적서를 확인하고 PDF를 다운로드할 수 있으며, 관리자는 대시보드에서 견적서를 관리합니다.

## 기술 스택

- **[Next.js v16](https://nextjs.org)** - App Router, Server Components, Server Actions
- **[TypeScript](https://www.typescriptlang.org)** - 타입 안전성
- **[TailwindCSS v4](https://tailwindcss.com)** - 유틸리티 기반 스타일링
- **[shadcn/ui](https://ui.shadcn.com)** - UI 컴포넌트 (New York 스타일)
- **[@notionhq/client](https://github.com/makenotion/notion-sdk-js)** - Notion API
- **[@react-pdf/renderer](https://react-pdf.org)** - 서버사이드 PDF 생성
- **[next-themes](https://github.com/pacocoursey/next-themes)** - 라이트/다크 테마

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local`에 실제 값을 입력합니다:

```env
NOTION_API_KEY=secret_...          # Notion Integration 시크릿 키
NOTION_DATABASE_ID=...             # 견적서 데이터베이스 ID
NOTION_ITEMS_DATABASE_ID=...       # 견적 항목 데이터베이스 ID
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> Notion API 키 발급 및 데이터베이스 ID 확인 방법은 [배포 가이드](docs/DEPLOY.md)를 참조하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

---

## 주요 기능

### 클라이언트 공개 기능
- **견적서 조회**: `/invoice/[id]` — 노션 데이터베이스에서 견적서 데이터를 가져와 웹으로 표시
- **PDF 다운로드**: 견적서 페이지에서 즉시 PDF 생성 및 다운로드

### 관리자 기능
- **관리자 로그인**: `/login` — ID: `admin` / PW: `admin` (MVP 하드코딩)
- **대시보드**: `/dashboard` — 견적서 상태별 통계 카드 + 최근 5건 미리보기
- **견적서 목록**: `/invoices` — 전체 견적서 목록 테이블 + 클라이언트 링크 복사

---

## 프로젝트 구조

```
app/
├── (public)/           # 공개 라우트 (Navbar + Footer 레이아웃)
│   └── page.tsx        # 랜딩 페이지
├── (admin)/            # 관리자 라우트 (AdminSidebar + AdminHeader 레이아웃)
│   ├── dashboard/      # 통계 대시보드
│   └── invoices/       # 견적서 목록
├── (auth)/
│   └── login/          # 관리자 로그인 페이지
├── invoice/[id]/       # 클라이언트 견적서 조회 페이지
└── api/generate-pdf/   # PDF 생성 API Route

components/
├── admin/              # 관리자 전용 컴포넌트
├── invoice/            # 견적서 뷰 컴포넌트
├── layout/             # Navbar, Footer, ThemeToggle
└── ui/                 # shadcn/ui 컴포넌트

lib/
├── notion.ts           # Notion API 클라이언트 + 헬퍼 함수
└── pdf.tsx             # PDF 렌더링 컴포넌트

proxy.ts                # 관리자 라우트 보호 미들웨어
```

---

## 개발 명령어

```bash
npm run dev          # 개발 서버 실행 (Turbopack)
npm run build        # 프로덕션 빌드
npm run check-all    # 타입 체크 + 린트 + 포맷 검사 통합 실행
npm run test         # 단위 테스트 실행 (Vitest)
npm run test:e2e     # E2E 테스트 실행 (Playwright)
```

---

## 배포

Vercel 배포를 권장합니다. 단계별 가이드는 [docs/DEPLOY.md](docs/DEPLOY.md)를 참조하세요.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
