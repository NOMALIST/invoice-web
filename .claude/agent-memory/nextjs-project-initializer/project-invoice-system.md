---
name: project-invoice-system
description: 노션 기반 견적서 관리 시스템 초기화 완료 — 핵심 결정 사항 및 구조
metadata:
  type: project
---

이 프로젝트는 가족 웹 블로그 스타터 킷에서 견적서 관리 시스템으로 전환 초기화가 완료된 상태입니다.

**Why:** 노션을 데이터베이스로 활용해 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 MVP 시스템 구축

**How to apply:** 새 기능 추가 시 아래 구조를 참고하여 견적서 도메인 파일과 분리된 형태로 유지

## 핵심 결정 사항

### @notionhq/client v5 이슈
`databases.query`가 v5에서 제거됨. 기존 블로그/갤러리 코드는 `notionAny.databases.query`로 우회 처리.
견적서 코드는 `notion.pages.retrieve`만 사용하므로 v5 완전 호환.
런타임에서 블로그/갤러리 기능은 작동하지 않을 가능성 있음 — 추후 `dataSources.query`로 마이그레이션 필요.

### PDF 생성
`@react-pdf/renderer`의 `renderToBuffer`는 `Buffer`를 반환하므로 `NextResponse`에 전달 시 `Uint8Array`로 변환 필요.
한국어 폰트 미포함 — 현재 PDF에서 한글이 깨질 수 있음. 추후 `@react-pdf/renderer`에 커스텀 폰트 등록 필요.

## 생성된 파일 목록
- `types/invoice.ts` — Invoice, InvoiceItem, InvoiceStatus 타입
- `app/invoice/[id]/page.tsx` — 견적서 조회 Server Component
- `app/api/generate-pdf/route.ts` — PDF 생성 API Route
- `app/not-found.tsx` — 404 에러 페이지
- `components/invoice/InvoiceView.tsx` — 견적서 전체 뷰
- `components/invoice/InvoiceHeader.tsx` — 헤더 (상태 배지, 날짜 포맷)
- `components/invoice/InvoiceTable.tsx` — 항목 테이블 (shadcn Table 사용)
- `components/invoice/DownloadButton.tsx` — PDF 다운로드 Client Component
- `lib/pdf.tsx` — @react-pdf/renderer 기반 PDF 레이아웃
- `.env.example` — NOTION_API_KEY, NOTION_DATABASE_ID, NOTION_ITEMS_DATABASE_ID

## 노션 데이터베이스 속성명 매핑
Invoices DB: `invoice_number`(title), `client_name`(text), `issue_date`(date), `valid_until`(date), `status`(select), `total_amount`(number), `items`(relation)
Items DB: `description`(title), `quantity`(number), `unit_price`(number), `amount`(formula)

[[pdf-korean-font-issue]]
