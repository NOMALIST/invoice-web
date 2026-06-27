# 노션 기반 견적서 관리 시스템 — AI Agent 개발 규칙

## 1. 프로젝트 개요

- **목적**: 노션을 단일 데이터 소스로 활용하는 견적서 조회 및 PDF 다운로드 시스템
- **현재 상태**: Phase 1~3 코드 구현 완료, 단 `.env.local` 미생성으로 Notion 연동 실제 동작 불가 (⚠️ 부분 완료)
- **진행 중**: Phase 4 — Task 4.0 (.env.local 생성) 최우선, 이후 에러 처리·성능 최적화·배포
- **핵심 원칙**: Notion이 유일한 데이터 소스, 별도 DB 없음, 과도한 엔지니어링 금지

---

## 2. 기술 스택

| 패키지 | 버전 | 용도 |
|--------|------|------|
| Next.js | 15.5.3 | 프레임워크 (App Router, Turbopack) |
| React | 19 | UI |
| TypeScript | 5.x | 언어 |
| TailwindCSS | 4.x | 스타일링 |
| shadcn/ui (New York) | — | UI 컴포넌트 |
| @notionhq/client | — | Notion API |
| @react-pdf/renderer | — | 서버사이드 PDF 생성 |
| date-fns | — | 날짜 포맷 (한국어) |
| next-themes | 0.4.6 | 다크모드 |
| lucide-react | — | 아이콘 |

---

## 3. 디렉토리 구조 (실제 구현 기준)

```
app/
├── invoice/[id]/
│   ├── page.tsx          ← 견적서 조회 Server Component (핵심)
│   ├── loading.tsx       ← ❌ 미생성 (Phase 4 Task 4.1 구현 예정)
│   └── error.tsx         ← ❌ 미생성 (Phase 4 Task 4.1 구현 예정)
├── api/
│   └── generate-pdf/
│       └── route.ts      ← PDF 생성 API Route (POST, 서버 전용)
├── (public)/             ← MVP 이후 블로그/갤러리 예정 (현재 미사용)
├── (admin)/              ← Phase 5 관리자 기능 예정 (현재 미사용)
├── (auth)/               ← Phase 5 인증 예정 (현재 미사용)
├── layout.tsx
├── page.tsx
└── not-found.tsx

components/
├── invoice/
│   ├── InvoiceView.tsx   ← 견적서 전체 컨테이너 (헤더 + 테이블 + 버튼 조합)
│   ├── InvoiceHeader.tsx ← 견적서 번호, 발행일, 유효기간, 클라이언트명, 상태
│   ├── InvoiceTable.tsx  ← 항목 테이블 + 합계 행
│   └── DownloadButton.tsx ← PDF 다운로드 버튼 (Client Component)
├── ui/                   ← shadcn/ui 전용, 직접 편집 금지 (skeleton.tsx, sonner.tsx ❌ 미설치)
├── layout/               ← navbar.tsx, footer.tsx, theme-toggle.tsx
└── providers/            ← theme-provider.tsx

lib/
├── notion.ts             ← Notion 클라이언트 싱글톤 + 모든 Notion API 함수
├── pdf.tsx               ← InvoicePDF 컴포넌트 (서버사이드 전용)
├── auth.ts               ← Phase 5 인증 예정 (현재 미사용)
├── cloudinary.ts         ← Phase 5 예정 (현재 미사용)
└── utils.ts              ← cn() 유틸리티

types/
├── invoice.ts            ← Invoice, InvoiceItem, InvoiceStatus (핵심)
├── notion.ts             ← Notion API 응답 타입
├── post.ts               ← Phase 5 블로그 예정
└── gallery.ts            ← Phase 5 갤러리 예정
```

---

## 4. 핵심 데이터 파이프라인

### 견적서 조회 흐름

```
URL /invoice/[id]
  → app/invoice/[id]/page.tsx (Server Component)
  → getInvoice(pageId)        [lib/notion.ts]
      → notion.pages.retrieve({ page_id })       ← Invoices DB
      → Promise.all(itemRelations.map(retrieve))  ← Items DB 병렬 조회
      → notionPageToInvoice(page, items)
      → notionPageToInvoiceItem(itemPage)
  → Invoice 타입 반환
  → null이면 notFound() 호출 → not-found.tsx
  → <InvoiceView invoice={invoice} />
```

### PDF 다운로드 흐름

```
DownloadButton 클릭 (Client Component)
  → fetch('/api/generate-pdf', { method: 'POST', body: { invoiceId } })
  → app/api/generate-pdf/route.ts
      → getInvoice(invoiceId)    [lib/notion.ts]
      → renderToBuffer(InvoicePDF({ invoice }))  [lib/pdf.tsx]
      → Response(pdfBytes, { 'Content-Type': 'application/pdf' })
  → blob URL 생성 → <a> 태그 클릭 → 다운로드
```

---

## 5. Notion API 규칙

### 클라이언트 초기화

- **`lib/notion.ts`에서만 `new Client()` 호출** — 다른 파일에서 Notion 클라이언트 초기화 절대 금지
- 싱글톤 패턴: 파일 최상단에 한 번만 초기화

```typescript
// lib/notion.ts — 유일한 Notion 클라이언트 초기화 위치
const notion = new Client({ auth: process.env.NOTION_API_KEY });
```

### 속성 접근 패턴 (필수)

- Notion 속성 접근 시 반드시 optional chaining + null 병합 사용
- 속성이 없으면 적절한 기본값 반환

```typescript
// 올바른 방법
props.invoice_number?.title?.[0]?.plain_text ?? ""
props.status?.select?.name ?? "대기"
props.total_amount?.number ?? 0

// 금지 — TypeError 발생 위험
props.invoice_number.title[0].plain_text
```

### 변환 함수 규칙

- `notionPageToInvoice()` — `lib/notion.ts` 내부 전용 함수, 외부 export 금지
- `notionPageToInvoiceItem()` — `lib/notion.ts` 내부 전용 함수, 외부 export 금지
- 변환 함수 추가 시 `lib/notion.ts`에만 작성

### 에러 처리

- `getInvoice()` 내부의 try/catch에서 모든 Notion 에러 처리
- 존재하지 않는 페이지, 접근 불가, 네트워크 오류 → 모두 `null` 반환
- 호출 측에서 null 체크 후 `notFound()` 호출

### notionAny 패턴 (기존 코드 호환)

- `databases.query`가 타입상 제거된 경우 `const notionAny = notion as any` 사용 중
- 신규 함수에서도 `databases.query` 사용 시 동일 패턴 유지

---

## 6. PDF 생성 규칙

- **`lib/pdf.tsx`는 서버사이드 전용** — `"use client"` 컴포넌트에서 import 절대 금지
- `InvoicePDF` 컴포넌트는 `@react-pdf/renderer`의 `Document`, `Page`, `Text`, `View`, `StyleSheet`만 사용
- HTML 태그 혼용 금지 (`<div>`, `<p>` 등은 @react-pdf/renderer 안에서 작동하지 않음)
- 한국어 폰트: 현재 Helvetica 사용 (ASCII만 지원) — 한국어 텍스트는 노션에서 영문/숫자 위주 데이터만 담길 것을 가정
- 한국 원화 포맷: `amount.toLocaleString('ko-KR') + '원'` 패턴 사용
- 날짜 포맷: `dateStr.replace(/-/g, '/')` 패턴 (YYYY/MM/DD 형식)
- API Route에서 `renderToBuffer()` 사용 후 `new Uint8Array(buffer)`로 변환

---

## 7. 견적서 컴포넌트 규칙

### InvoiceView.tsx (Server Component 가능)

- `InvoiceHeader`, `InvoiceTable`, `DownloadButton`을 조합하는 컨테이너
- Invoice 타입 전체를 prop으로 받아 하위 컴포넌트에 분배

### DownloadButton.tsx (Client Component 필수)

- 반드시 `"use client"` 지시어 포함
- PDF 다운로드 트리거: `fetch('/api/generate-pdf', { method: 'POST', body: JSON.stringify({ invoiceId }) })`
- 로딩 상태 UI 포함 (다운로드 중 버튼 비활성화)
- 현재 에러 시 `alert()` 사용 → Phase 4에서 toast로 교체 예정
- 인쇄 시 숨김: `className="print:hidden"` 적용

### 새 Invoice 컴포넌트 추가 시

- `components/invoice/` 폴더에 배치
- Client Component 필요 시에만 `"use client"` 추가 (기본: Server Component)

---

## 8. 환경변수 규칙

### **⚠️ 현재 상태: `.env.local` 파일 없음 — 모든 Notion 관련 기능 동작 불가**

- `.env.local` 파일이 존재하지 않음 (`.env.example`만 있음)
- 개발/구현 작업 전에 반드시 `.env.local`을 생성하고 실제 값을 입력해야 함
- 생성 방법: `.env.example`을 복사 후 실제 API 키로 채울 것

### MVP 필수 환경변수

```bash
NOTION_API_KEY=secret_xxxxx          # Notion Integration Token
NOTION_DATABASE_ID=xxxxx             # Invoices 데이터베이스 ID
NOTION_ITEMS_DATABASE_ID=xxxxx       # Items 데이터베이스 ID
```

### 환경변수 변경 시 동시 수정 파일

- `.env.local` (실제 값)
- `.env.example` (빈 값, 키만)

### 환경변수 접근

- `process.env.NOTION_API_KEY` — 서버사이드에서만 접근 가능
- Client Component에서 환경변수 노출 금지 (`NEXT_PUBLIC_` 없이는 클라이언트에서 undefined)

---

## 9. TailwindCSS v4 스타일링 규칙

- **`tailwind.config.ts` 파일 생성 금지** — v4는 CSS 기반 설정 사용
- CSS 변수 추가 시 → `app/globals.css`의 `@theme inline` 블록에만 추가
- 다크모드 클래스 → `@custom-variant dark (&:is(.dark *))` 패턴 사용
- 컨테이너 레이아웃 → 반드시 `mx-auto max-w-screen-2xl px-4` 사용
- 색상 → OKLCH 값 사용 (`oklch(0.205 0 0)` 형식)
- Border radius → CSS 변수 사용 (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`)
- Inline style 사용 금지

---

## 10. shadcn/ui 컴포넌트 규칙

- 컴포넌트 추가: `npx shadcn@latest add [component-name]` 명령만 사용
- `components/ui/` 파일 직접 수정 금지 (shadcn CLI가 관리)
- 스타일 오버라이드 필요 시 → 상위 컴포넌트에서 `className` prop으로 처리
- 컴포넌트 조합 시 → `cn()` 유틸리티 (`lib/utils.ts`) 반드시 사용
- Import 경로: `@/ui/[component]` 또는 `@/components/ui/[component]`

---

## 11. 파일 동시 수정 규칙

| 작업 | 동시 수정 필요 파일 |
|------|-------------------|
| Notion 속성 필드 추가/변경 | `lib/notion.ts` 변환 함수 + `types/invoice.ts` |
| Invoice 타입 변경 | `types/invoice.ts` + `lib/notion.ts` + 영향받는 컴포넌트 |
| 환경변수 추가 | `.env.local` + `.env.example` |
| PDF 레이아웃 변경 | `lib/pdf.tsx`만 수정 (API Route는 건드리지 않음) |
| 새 API Route 추가 | 라우트 파일 + 필요 시 `middleware.ts` 보호 경로 추가 |
| Invoice 컴포넌트 prop 변경 | 해당 컴포넌트 + `InvoiceView.tsx` (prop 전달 조정) |

---

## 12. Phase 4 작업 가이드 (현재 진행 중)

### 🚨 Task 4.0: .env.local 생성 (모든 작업의 전제 조건)

- `.env.local` 파일이 없으면 Notion API 호출 전체가 실패함
- 구현 시작 전 반드시 `.env.local` 생성 및 3개 환경변수 설정 확인

### 에러 처리 개선 (Task 4.1, 우선)

- `app/invoice/[id]/loading.tsx` — 스켈레톤 UI 추가
- `app/invoice/[id]/error.tsx` — API 오류 시 에러 바운더리
- `DownloadButton.tsx`의 `alert()` → shadcn/ui toast로 교체 (sonner 또는 toast 컴포넌트)
- `getInvoice()` 에러 분류: 404 vs 권한 오류 vs 네트워크 오류

### 성능 최적화

- `app/invoice/[id]/page.tsx`에 `export const revalidate = 60` 추가 (ISR)
- PDF 생성 API 폰트 최적화 검토

### 보안 헤더

- `next.config.ts`에 `X-Frame-Options`, `Content-Security-Policy` 추가

---

## 13. 금지 사항

- **별도 DB 추가 금지** (Prisma, Supabase, MySQL 등) — Notion이 유일한 데이터 소스
- **`lib/notion.ts` 외 파일에서 `new Client()` 호출 금지**
- **`lib/pdf.tsx`를 Client Component에서 import 금지** — 서버사이드 전용
- **`tailwind.config.ts` 파일 생성 금지** — v4는 CSS 기반 설정
- **`components/ui/` 파일 직접 수정 금지** — shadcn CLI 전용
- **HTML `<img>` 태그 사용 금지** — Next.js `<Image>` 사용
- **Notion 속성 접근 시 optional chaining 생략 금지** — undefined 런타임 오류 발생
- **Notion 첨부파일 URL 직접 사용 금지** — 1시간 후 만료됨 (Cloudinary 경유 필요)
- **`@react-pdf/renderer` 컴포넌트에 HTML 태그 혼용 금지** (`<div>`, `<p>` 등)
- **MVP 범위 외 기능 구현 금지** — Phase 5 이후 기능(인증, 대시보드, 이메일)은 현재 구현 대상 아님

---

## 14. AI 의사결정 기준

### 새 기능 구현 시 판단 순서

1. **`.env.local` 존재 여부 확인** → 없으면 생성 후 진행 (Notion 관련 작업의 전제 조건)
2. `docs/ROADMAP.md` Phase 확인 → 현재 Phase 4에 해당하는 기능인가?
3. Notion 데이터 관련이라면 → `lib/notion.ts`에 함수 추가
3. UI 변경이라면 → `components/invoice/` 내 컴포넌트 수정 또는 추가
5. PDF 관련이라면 → `lib/pdf.tsx` 수정 + `app/api/generate-pdf/route.ts` 확인
6. 새 패키지 필요하다면 → `docs/PRD.md` 확정 목록에 있는 패키지만 추가

### 컴포넌트 선택 기준

- shadcn/ui에 있는 컴포넌트 → `npx shadcn@latest add` 사용
- 없는 경우 → `components/invoice/` 또는 `components/layout/`에 직접 작성
- 서드파티 UI 라이브러리 추가 금지 (MUI, Chakra 등)

### Server vs Client Component 판단

- 기본값: Server Component (파일 최상단에 `"use client"` 없이 시작)
- Client Component 필요 조건: `useState`, `useEffect`, 이벤트 핸들러, `useRouter`, 브라우저 API 사용 시
- `DownloadButton.tsx`처럼 fetch + 상태 관리가 필요한 경우만 Client Component

### Notion 데이터 타입 오류 시

- Notion 속성 타입 변경 순서: `types/invoice.ts` → `lib/notion.ts` 변환 함수 → 컴포넌트
- 속성이 없을 때는 기본값 반환 (에러 throw 금지, `null` 반환 또는 빈 문자열 사용)
