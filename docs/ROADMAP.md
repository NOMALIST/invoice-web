# 노션 기반 견적서 관리 시스템 개발 로드맵

노션을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 시스템

## 개요

노션 기반 견적서 관리 시스템은 프리랜서/소규모 기업을 위한 견적서 공유 솔루션으로 다음 기능을 제공합니다:

- **Notion API 연동**: 노션 데이터베이스를 단일 데이터 소스로 활용한 실시간 견적서 조회
- **견적서 웹 뷰어**: 고유 URL(`/invoice/[id]`)로 접근하는 공개 견적서 조회 페이지
- **PDF 다운로드**: `@react-pdf/renderer` 기반 서버사이드 PDF 생성 및 다운로드

## 개발 워크플로우

1. **작업 계획**: 기존 코드베이스 현황 파악 후 `ROADMAP.md` 업데이트
2. **작업 구현**: 작업 명세에 따라 기능 구현, API/비즈니스 로직은 Playwright MCP로 테스트
3. **로드맵 업데이트**: 완료된 작업을 ✅로 표시

---

## 상태 표기 기준

이 로드맵은 **실제 파일 존재 여부**와 **실제 동작 가능 여부**를 기준으로 상태를 구분합니다.

| 표기 | 의미 |
|------|------|
| ✅ 완료 | 코드 구현 완료 + 실제 동작 가능 |
| ⚠️ 부분 완료 | 코드는 작성됐으나 환경변수/외부 설정 미완료로 실제 동작 불가 |
| ❌ 미완료 | 파일/코드 자체가 존재하지 않음 |

> ✅ `.env.local` 설정 완료 — Notion API 키가 설정되어 견적서 조회 및 PDF 다운로드가 실제로 동작합니다.

---

## Phase 0 — 프로젝트 규칙 정의 ✅

### Task 0.1: 작업 규칙 가이드라인 초기화 ✅ — 완료

- ✅ `shrimp-rules.md` 초기화 완료 (프로젝트 전용 작업 규칙 및 개발 표준 정의)
- ✅ 프로젝트 아키텍처, 코딩 컨벤션, 파일 구조 표준 문서화
- ✅ AI 에이전트 작업 시 준수할 핵심 규칙 및 금지 사항 명시

---

## Phase 1 — 애플리케이션 골격 구축 ✅

### Task 1.1: 프로젝트 초기 설정 ✅ — 완료

- ✅ Next.js 15.5.3 App Router 프로젝트 생성 (Turbopack 활성화)
- ✅ TypeScript, TailwindCSS v4, shadcn/ui (New York 스타일) 설정
- ✅ `@notionhq/client`, `@react-pdf/renderer` 의존성 설치
- ✅ `.env.example` 환경변수 구조 정의 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NOTION_ITEMS_DATABASE_ID`)
- ✅ Import 별칭 구성 (`@/components`, `@/lib`, `@/types`)
- ✅ `.env.local` 생성 및 실제 환경변수 값 설정 — **완료**

### Task 1.2: 타입 시스템 정의 ✅ — 완료

- ✅ `types/invoice.ts` — `Invoice`, `InvoiceItem`, `InvoiceStatus` 도메인 타입 정의
- ✅ `types/notion.ts` — `NotionPage`, `NotionRichText`, `NotionBlockBase`, `NotionFilter` 타입 정의
- ✅ `InvoiceStatus` 유니온 타입 (`'대기' | '승인' | '거절'`) 정의
- ✅ Notion API 응답과 도메인 타입 간 매핑 구조 설계

### Task 1.3: 라우팅 구조 구축 ✅ — 완료

- ✅ `app/invoice/[id]/page.tsx` — 동적 견적서 조회 페이지 라우팅 (Server Component)
- ✅ `app/not-found.tsx` — 존재하지 않는 견적서 접근 시 404 에러 페이지
- ✅ `app/layout.tsx` — 루트 레이아웃 (ThemeProvider, `lang="ko"`, Geist 폰트)
- ✅ `middleware.ts` — 인증 필요 경로 보호 구조 (`/write`, `/edit`, `/upload`)
- ✅ Route Group 구조 설계: `(public)`, `(admin)`, `(auth)`

---

## Phase 2 — UI/UX 완성 ✅

### Task 2.1: shadcn/ui 컴포넌트 구성 ✅ — 완료

- ✅ `components/ui/button.tsx` — 버튼 컴포넌트 (variant: default, outline, destructive)
- ✅ `components/ui/badge.tsx` — 상태 배지 컴포넌트 (secondary, default, destructive)
- ✅ `components/ui/card.tsx` — 카드 컨테이너 컴포넌트
- ✅ `components/ui/table.tsx` — 테이블 컴포넌트 (TableHeader, TableBody, TableRow, TableCell)
- ✅ `components/ui/input.tsx`, `label.tsx`, `dropdown-menu.tsx` — 폼 기반 UI 컴포넌트

### Task 2.2: 견적서 뷰 컴포넌트 구현 ✅ — 완료

- ✅ `components/invoice/InvoiceView.tsx` — 견적서 전체 뷰 컨테이너 (헤더 + 테이블 + 다운로드 버튼 조합)
- ✅ `components/invoice/InvoiceHeader.tsx` — 견적서 번호, 발행일, 유효기간, 클라이언트명, 상태 배지 표시
- ✅ `components/invoice/InvoiceTable.tsx` — 견적 항목 테이블 (항목/수량/단가/금액) 및 합계 행
- ✅ `components/invoice/DownloadButton.tsx` — PDF 다운로드 버튼 (Client Component, 로딩 상태 포함)
- ✅ 반응형 레이아웃 구현, 인쇄 시 버튼 숨김 (`print:hidden`)
- ✅ `date-fns` 라이브러리로 한국어 날짜 포맷 처리

### Task 2.3: 에러 페이지 UI 구현 ✅ — 완료

- ✅ Lucide `FileX` 아이콘 기반 404 에러 시각화
- ✅ "견적서를 찾을 수 없습니다" 친화적 메시지 및 발행자 문의 안내
- ✅ "홈으로 돌아가기" 버튼 구현

---

## Phase 3 — 핵심 기능 구현 ✅

### Task 3.1: Notion API 연동 ✅ — 완료

- ✅ `lib/notion.ts` — `@notionhq/client` 싱글톤 인스턴스 초기화 (코드 작성 완료)
- ✅ `getInvoice(pageId)` — 노션 페이지 ID로 견적서 + 연결된 Items 병렬 조회 (코드 작성 완료)
- ✅ `notionPageToInvoice()` — Notion 페이지 객체 → `Invoice` 도메인 타입 변환
- ✅ `notionPageToInvoiceItem()` — Notion Items 페이지 → `InvoiceItem` 변환 (수량×단가 자동 계산)
- ✅ 존재하지 않는 페이지 / 접근 불가 시 `null` 반환 처리 (try/catch)
- ✅ 실제 Notion API 키 설정 및 라이브 데이터 조회 검증 — **완료**

### Task 3.2: PDF 생성 기능 구현 ✅ — 완료

- ✅ `lib/pdf.tsx` — `@react-pdf/renderer`로 A4 견적서 PDF 레이아웃 컴포넌트 정의 (`InvoicePDF`)
- ✅ PDF 구성: 헤더(견적서 번호), 정보 그리드(수신/발행일/유효기간/상태), 항목 테이블, 합계 행
- ✅ 한국 원화 포맷 (`toLocaleString('ko-KR')`) 및 날짜 포맷 헬퍼 함수 정의
- ✅ `app/api/generate-pdf/route.ts` — POST API Route: invoiceId 수신 → Notion 조회 → `renderToBuffer` → PDF 응답 (코드 작성 완료)
- ✅ 한국어 파일명 인코딩 처리 (`Content-Disposition: filename*=UTF-8''...`)
- ✅ API Route 내부 PDF 다운로드 동작 가능
- ✅ `public/fonts/NotoSansKR-Regular.ttf`, `NotoSansKR-Bold.ttf` — Google Fonts에서 다운로드하여 배치
- ✅ `Font.register()` 로 NotoSansKR 한글 폰트 등록 — PDF 한글 깨짐 문제 해결

### Task 3.3: 견적서 페이지 통합 ✅ — 완료

- ✅ `app/invoice/[id]/page.tsx` — Server Component에서 `getInvoice()` 호출 및 404 처리 (`notFound()`)
- ✅ `generateMetadata()` — 견적서 번호/클라이언트명 기반 동적 메타데이터 생성
- ✅ Notion 데이터 → `InvoiceView` 컴포넌트 렌더링 파이프라인 완성
- ✅ 실제 Notion 데이터 기반 견적서 페이지 조회 검증 — **완료**

---

## Phase 4 — 품질 강화 및 배포 (진행 중)

### Task 4.0: 환경변수 설정 (로컬 동작 활성화) ✅ — 완료

- [x] `.env.example`을 복사하여 `.env.local` 생성
- [x] Notion Integration 생성 및 `NOTION_API_KEY` 발급/입력
- [x] `NOTION_DATABASE_ID`(Invoices DB), `NOTION_ITEMS_DATABASE_ID`(Items DB) 값 입력
- [x] Notion Integration을 두 데이터베이스에 연결(공유)
- [x] 로컬 개발 서버에서 실제 견적서 조회 및 PDF 다운로드 동작 확인

### Task 4.1: 에러 처리 및 로딩 UI 개선 ✅ — 완료

- ✅ `app/invoice/[id]/loading.tsx` — 견적서 조회 중 스켈레톤 로딩 UI 구현
- ✅ `app/invoice/[id]/error.tsx` — Notion API 오류 시 에러 바운더리 페이지 구현
- ✅ PDF 다운로드 실패 시 토스트 알림 (`sonner`) 적용 — `toast.error()` / `toast.success()` 완료
- ✅ Notion API 응답 지연 대비 타임아웃 처리 (`timeoutMs: 15_000`) — 완료
- ✅ `getInvoice` 함수에 에러 타입 분류 (404/권한오류 → `null`, 그 외 → `throw`) — 완료

### Task 4.2: 성능 최적화 — 대기

- [ ] Next.js `revalidate` 설정으로 Notion 데이터 캐싱 전략 수립 (ISR, 권장: 60초)
- [ ] `generateStaticParams` 검토 (자주 조회되는 견적서 사전 생성)
- [ ] PDF 생성 API 응답 크기 최적화 (폰트 서브셋)
- [ ] Core Web Vitals 측정 및 LCP/CLS 개선
- [ ] Vercel Edge Config 및 환경변수 보안 검토

### Task 4.3: 테스트 — 대기

- [ ] `lib/notion.ts` 단위 테스트 — `notionPageToInvoice`, `notionPageToInvoiceItem` 변환 함수 검증
- [ ] `lib/pdf.tsx` 통합 테스트 — `InvoicePDF` 렌더링 및 버퍼 생성 검증
- [ ] `app/api/generate-pdf/route.ts` API Route 테스트 — 정상/404/오류 시나리오
- [ ] Playwright MCP E2E 테스트 — 견적서 페이지 접근 → PDF 다운로드 전체 플로우 검증
- [ ] 모바일/태블릿 반응형 렌더링 및 브라우저 호환성 테스트

### Task 4.4: 배포 및 운영 준비 — 대기

- [ ] Vercel 프로젝트 연결 및 환경변수 설정 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NOTION_ITEMS_DATABASE_ID`)
- [ ] Vercel 커스텀 도메인 설정
- [ ] Notion Integration 프로덕션 권한 확인 (Invoices DB, Items DB 연결)
- [ ] `next.config.ts` 보안 헤더 설정 (`X-Frame-Options`, `Content-Security-Policy`)
- [ ] 배포 후 실제 노션 데이터로 견적서 조회 및 PDF 다운로드 E2E 검증

---

## Phase 5 — 관리 기능 (MVP 이후)

### Task 5.1: 관리자 인증 시스템

- `lib/auth.ts` NextAuth.js v5 Google OAuth 실제 연동 완성
- `middleware.ts` 세션 기반 인증으로 교체 (`(admin)` 라우트 그룹 보호)
- `app/(auth)/login/page.tsx` — Google 로그인 페이지 UI 구현
- `ALLOWED_EMAILS` 환경변수로 허용된 관리자 이메일 화이트리스트 관리
- 로그인 세션 만료 처리 및 callbackUrl 리다이렉트 구현
- Playwright MCP로 로그인 → 관리자 페이지 접근 E2E 테스트

### Task 5.2: 관리자 대시보드

- `app/(admin)/dashboard/page.tsx` — 발행된 견적서 목록 페이지 구현
- `lib/notion.ts`에 `getInvoiceList()` 함수 추가 (Notion DB 전체 쿼리, 페이지네이션 지원)
- 견적서 목록 테이블: 번호, 클라이언트명, 발행일, 유효기간, 상태, 액션 버튼
- 견적서 상태별 통계 카드 (대기/승인/거절 건수, 총 견적 금액)
- 견적서 공유 URL 원클릭 클립보드 복사 기능

### Task 5.3: 견적서 검색 및 필터링

- 클라이언트명, 견적서 번호 기반 검색 기능 구현
- 상태별 필터링 (대기 / 승인 / 거절 / 전체)
- 발행일 기간 필터 (`date-fns`로 날짜 범위 계산)
- URL 쿼리 파라미터로 검색/필터 상태 유지 (`?status=승인&q=홍길동`)
- 검색 결과 없을 때 빈 상태 UI 처리

### Task 5.4: 견적서 상태 관리

- `lib/notion.ts`에 `updateInvoiceStatus(pageId, status)` 함수 추가 (Notion `pages.update` API)
- 관리자 대시보드에서 견적서 상태 변경 버튼 구현 (승인/거절/대기)
- 상태 변경 시 낙관적 업데이트 UI (즉시 배지 색상 변경 후 API 확인)
- 견적서 유효기간 만료 시 자동 만료 상태 표시
- Playwright MCP로 상태 변경 플로우 E2E 테스트

---

## Phase 6 — 자동화 및 고급 기능 (장기 계획)

### Task 6.1: 이메일 자동 발송

- Resend SDK 연동 (`resend` 패키지 설치)
- `app/api/send-invoice/route.ts` — 견적서 이메일 발송 API Route 구현
- 이메일 템플릿: 견적서 요약, 조회 링크, PDF 첨부 옵션
- 관리자 대시보드에서 이메일 발송 버튼 추가
- 발송 성공/실패 상태 피드백 및 발송 이력 기록

### Task 6.2: 견적서 만료 알림

- Vercel Cron Jobs 기반 만료 임박 자동 알림 시스템 (D-3, D-1)
- `app/api/check-expiry/route.ts` — 만료 임박 견적서 조회 및 알림 발송 API
- 관리자 이메일로 만료 예정 견적서 목록 발송
- 클라이언트에게 "견적서 만료 임박" 리마인더 이메일 발송
- Notion `valid_until` 필드 기반 날짜 필터 쿼리 구현

### Task 6.3: 클라이언트 응답 트래킹

- 견적서 조회 시 접근 로그 기록 (Vercel Analytics)
- 클라이언트가 견적서 최초 조회 시 관리자 알림 (이메일 또는 Slack Webhook)
- Notion DB에 조회 횟수 및 최초 조회 일시 업데이트
- PDF 다운로드 이벤트 트래킹 및 기록
- 관리자 대시보드에 클라이언트 응답 현황 표시

### Task 6.4: 다중 템플릿 및 커스터마이징

- 견적서 PDF 템플릿 다중 지원 (기본형, 상세형, 간소형)
- 발행자 회사 로고, 서명, 인감 이미지 삽입 기능
- `lib/pdf.tsx` 템플릿 팩토리 패턴으로 리팩터링
- 견적서 색상 테마 커스터마이징 (브랜드 컬러 적용)
- 견적서 하단 약관/메모 텍스트 자유 입력 지원

### Task 6.5: 다국어 및 전자 서명

- `next-intl` 도입으로 한국어/영어 견적서 발행 지원
- 언어별 PDF 생성 (한국어 폰트: Noto Sans KR, 영어: Helvetica)
- 전자 서명 기능 연동 (캔버스 기반 간편 서명)
- 서명된 견적서 PDF 저장 및 관리

### Task 6.6: 견적서 버전 관리

- 견적서 수정 시 이전 버전 스냅샷 저장 구조 설계
- 버전 히스토리 조회 페이지 구현
- 특정 버전 견적서 복원 기능
- 버전 간 변경 사항 diff 표시

---

## 진행 현황 요약

| Phase | 내용 | 상태 |
|-------|------|------|
| Phase 0 | 프로젝트 규칙 정의 (shrimp-rules.md) | ✅ 완료 |
| Phase 1 | 애플리케이션 골격 구축 | ✅ 완료 |
| Phase 2 | UI/UX 완성 | ✅ 완료 |
| Phase 3 | 핵심 기능 구현 (Notion API + PDF) | ✅ 완료 |
| Phase 4 | 품질 강화 및 배포 | 🚧 진행 중 (Task 4.2~4.4 대기) |
| Phase 5 | 관리 기능 (대시보드, 상태 관리) | 계획됨 |
| Phase 6 | 자동화 및 고급 기능 | 장기 계획 |

### 실제 동작 가능 여부 점검 (코드 vs 런타임)

| 항목 | 코드 작성 | 실제 동작 | 비고 |
|------|:--------:|:--------:|------|
| 견적서 페이지 (`app/invoice/[id]/page.tsx`) | ✅ | ✅ | 정상 동작 |
| Notion 연동 (`lib/notion.ts`) | ✅ | ✅ | `.env.local` 설정 완료 |
| PDF 생성 (`lib/pdf.tsx`) | ✅ | ✅ | 정상 동작 (한글 폰트 NotoSansKR 적용) |
| PDF API (`app/api/generate-pdf/route.ts`) | ✅ | ✅ | 정상 동작 |
| 견적서 UI 컴포넌트 (`components/invoice/*`) | ✅ | ✅ | 정상 렌더 |
| 404 페이지 (`app/not-found.tsx`) | ✅ | ✅ | 정상 |
| 로딩 UI (`app/invoice/[id]/loading.tsx`) | ✅ | ✅ | 스켈레톤 UI 구현 완료 |
| 에러 바운더리 (`app/invoice/[id]/error.tsx`) | ✅ | ✅ | 에러 바운더리 구현 완료 |

### Phase 4 세부 진행 현황

| Task | 내용 | 상태 |
|------|------|------|
| Task 4.0 | 환경변수 설정 (`.env.local` 생성) | ✅ 완료 |
| Task 4.1 | 에러 처리 및 로딩 UI 개선 | ✅ 완료 |
| Task 4.2 | 성능 최적화 (ISR 캐싱) | ⏳ 대기 |
| Task 4.3 | 테스트 (단위/API/E2E) | ⏳ 대기 |
| Task 4.4 | 배포 및 운영 준비 (Vercel) | ⏳ 대기 |

---

**PRD 참조**: docs/PRD.md
**작성일**: 2025-10-02
**최종 수정**: 2026-06-28 (Task 4.1 에러 처리 및 로딩 UI 개선 완료)
