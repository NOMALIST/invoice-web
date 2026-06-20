# 가족 웹 블로그 — AI Agent 개발 규칙

## 1. 프로젝트 개요

- **목적**: 가족 전용 블로그 (공개 읽기, 가족 구성원만 쓰기)
- **현재 상태**: Next.js 15.5.2 + shadcn/ui 스타터 킷 단계 (블로그 기능 미구현)
- **핵심 원칙**: Notion이 유일한 데이터 소스, 별도 DB 없음, 과도한 엔지니어링 금지

---

## 2. 기술 스택

### 설치 완료 (현재 코드베이스)

| 패키지 | 용도 |
|--------|------|
| Next.js 15.5.2 | 프레임워크 (App Router, Turbopack) |
| React 19.1.0 | UI |
| TypeScript 5.x | 언어 |
| TailwindCSS 4.x | 스타일링 |
| shadcn/ui (New York) | UI 컴포넌트 |
| next-themes 0.4.6 | 다크모드 |
| lucide-react | 아이콘 |

### 추가 설치 필요 (기능 구현 시)

| 패키지 | 용도 | 설치 명령 |
|--------|------|-----------|
| `@notionhq/client` | Notion API | `npm install @notionhq/client` |
| `next-auth@beta` | 인증 (Auth.js v5) | `npm install next-auth@beta` |
| `react-markdown` + `remark-gfm` | 마크다운 렌더링 | `npm install react-markdown remark-gfm` |
| `date-fns` | 날짜 처리 (한국어 로케일) | `npm install date-fns` |
| `yet-another-react-lightbox` | 갤러리 라이트박스 | `npm install yet-another-react-lightbox` |
| `zod` | 환경변수 검증 | `npm install zod` |

---

## 3. 디렉토리 구조 규칙

### 라우트 그룹 패턴 (준수 필수)

```
app/
├── (public)/          # 인증 불필요 — 블로그, 갤러리, 홈
├── (auth)/            # 인증 관련 — 로그인 페이지, NextAuth API Route
├── (admin)/           # 인증 필요 — /write, /edit/[slug], /upload
└── api/               # API Routes
```

### 컴포넌트 배치 규칙

- `components/ui/` — shadcn/ui 컴포넌트 전용, **직접 편집 금지**
- `components/layout/` — Navbar, Footer, ThemeToggle
- `components/blog/` — PostCard, PostList, PostForm (신규 생성)
- `components/gallery/` — AlbumCard, PhotoGrid, Lightbox (신규 생성)
- `components/auth/` — LoginForm, UserMenu (신규 생성)

### lib/ 파일 배치 규칙

- `lib/utils.ts` — cn() 유틸리티, 범용 헬퍼만
- `lib/notion.ts` — Notion API 클라이언트 + 포스트/앨범/사진 조회 함수
- `lib/notion-renderer.tsx` — Notion 블록 → React 컴포넌트 변환
- `lib/cloudinary.ts` — Cloudinary 업로드 헬퍼
- `lib/auth.ts` — NextAuth.js 설정 (providers, callbacks)

### types/ 파일 배치 규칙

- `types/post.ts` — Post, PostMeta 타입
- `types/gallery.ts` — Album, Photo 타입
- `types/notion.ts` — Notion API 응답 타입

---

## 4. TailwindCSS v4 스타일링 규칙

- **`tailwind.config.ts` 파일 생성 금지** — v4는 CSS 기반 설정 사용
- CSS 변수 추가 시 → `app/globals.css`의 `@theme inline` 블록에만 추가
- 다크모드 클래스 → `@custom-variant dark (&:is(.dark *))` 패턴 사용
- 컨테이너 레이아웃 → 반드시 `mx-auto max-w-screen-2xl px-4` 사용
- 색상 → OKLCH 값 사용 (`oklch(0.205 0 0)` 형식)
- Border radius → CSS 변수 사용 (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`)

---

## 5. shadcn/ui 컴포넌트 규칙

- 컴포넌트 추가: `npx shadcn@latest add [component-name]` 명령만 사용
- `components/ui/` 파일 직접 수정 금지 (shadcn CLI가 관리)
- 스타일 오버라이드 필요 시 → 상위 컴포넌트에서 `className` prop으로 처리
- 컴포넌트 조합 시 → `cn()` 유틸리티 (`lib/utils.ts`) 반드시 사용
- Import 경로: `@/ui/[component]` 또는 `@/components/ui/[component]`

---

## 6. Notion 연동 규칙

### 데이터베이스 구조

| DB 이름 | 환경변수 | 주요 필드 |
|---------|---------|----------|
| `Blog Posts` | `NOTION_BLOG_DB_ID` | Title, Slug, Status(Published/Draft), Category, Tags, Author, Published At, Cover Image, Excerpt |
| `Gallery Albums` | `NOTION_ALBUMS_DB_ID` | Name, Slug, Description, Cover Image, Date, Published |
| `Gallery Photos` | `NOTION_PHOTOS_DB_ID` | Title, Album(Relation), Image URL, Taken At, Order |

### Notion 읽기 패턴

```typescript
// lib/notion.ts에서만 Notion 클라이언트 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 포스트 목록 기본 쿼리 조건
filter: { property: "Status", select: { equals: "Published" } }
sorts: [{ property: "Published At", direction: "descending" }]
```

### Notion 쓰기 패턴

- 웹 에디터 → 마크다운 작성 → Notion 블록으로 변환 후 저장
- 이미지 → 반드시 Cloudinary에 먼저 업로드 → 영구 URL을 Notion `image` 블록으로 저장
- Server Action 또는 API Route (`/api/posts`)에서만 Notion 쓰기 호출

### ISR 캐싱 전략

```typescript
// 블로그 목록: 60초
export const revalidate = 60;

// 블로그 상세 및 갤러리: 300초
export const revalidate = 300;

// 쓰기/수정/삭제 후 즉시 갱신
revalidatePath('/blog');
revalidatePath(`/blog/${slug}`);
```

---

## 7. 이미지 처리 규칙

- **Notion 첨부파일 URL 직접 사용 절대 금지** — 1시간 후 만료됨
- 모든 이미지는 Cloudinary에 업로드 후 영구 URL만 사용
- Notion에 저장하는 이미지 URL은 반드시 Cloudinary URL
- `next.config.ts`에 Cloudinary 도메인 추가 필수:
  ```typescript
  images: { domains: ['res.cloudinary.com'] }
  ```
- 업로드 제한: 최대 10MB, JPG/PNG/WebP만 허용
- Next.js `<Image>` 컴포넌트 사용 (HTML `<img>` 태그 사용 금지)

---

## 8. 인증 규칙

- **인증 시스템**: NextAuth.js v5 (Auth.js) — `lib/auth.ts`
- **API Route**: `app/(auth)/api/auth/[...nextauth]/route.ts`
- **미들웨어**: `middleware.ts` (루트 레벨) — 보호 경로 접근 제어

### 보호 경로 목록 (middleware.ts에 반드시 포함)

```
/write
/edit/:path*
/upload
/api/posts (POST, PUT, DELETE)
/api/upload (POST)
/api/photos (POST)
```

### 가족 인증 방식

- 허용 이메일: `ALLOWED_EMAILS` 환경변수 (콤마 구분)
- 별도 사용자 DB 없음 — 환경변수만으로 관리
- 미인증 사용자의 보호 경로 접근 → `/login` 리다이렉트

---

## 9. 환경변수 규칙

### 필수 환경변수 목록

```bash
# Notion
NOTION_API_KEY=
NOTION_BLOG_DB_ID=
NOTION_ALBUMS_DB_ID=
NOTION_PHOTOS_DB_ID=

# NextAuth.js
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# 허용된 가족 이메일 (콤마 구분)
ALLOWED_EMAILS=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

### 환경변수 변경 시 동시 수정 파일

- `.env.local` (실제 값)
- `.env.example` (빈 값, 키만)
- `docs/PRD.md` 섹션 8

---

## 10. 파일 동시 수정 규칙

| 작업 | 동시 수정 필요 파일 |
|------|-------------------|
| 새 라우트 그룹 추가 | `middleware.ts` (보호 여부 확인) |
| Notion DB 스키마 변경 | `types/notion.ts` + 해당 도메인 타입 파일 (`types/post.ts` 또는 `types/gallery.ts`) |
| 환경변수 추가 | `.env.local` + `.env.example` + `docs/PRD.md` 섹션 8 |
| Navbar 링크 추가 | `components/layout/navbar.tsx` (데스크탑 + 모바일 뷰 모두) |
| API Route 추가 | 인증 필요 여부 → `middleware.ts` 매처 업데이트 |
| Notion 필드 추가 | `lib/notion.ts` 쿼리 함수 + 해당 타입 파일 |

---

## 11. API Route 설계 규칙

```
GET    /api/posts                    → 포스트 목록 (page, category, tag 쿼리 파라미터)
GET    /api/posts/[slug]             → 포스트 상세 (Notion 블록 포함)
POST   /api/posts                   → 새 포스트 생성 (인증 필요)
PUT    /api/posts/[slug]             → 포스트 수정 (인증 필요, 작성자 본인만)
DELETE /api/posts/[slug]             → 포스트 삭제 (인증 필요, 작성자 본인만)
GET    /api/albums                   → 앨범 목록
GET    /api/albums/[slug]/photos     → 앨범 사진 목록
POST   /api/upload                   → Cloudinary 업로드 (인증 필요)
POST   /api/photos                   → 사진 메타데이터 Notion 저장 (인증 필요)
```

---

## 12. 금지 사항

- **Prisma, Supabase, MySQL, PostgreSQL 등 별도 DB 추가 금지** — Notion이 유일한 데이터 소스
- **Notion 첨부파일 URL(`attachment.notion.so`) 사용 금지** — 1시간 후 만료
- **`tailwind.config.ts` 파일 생성 금지** — v4는 CSS 기반 설정
- **`components/ui/` 파일 직접 수정 금지** — shadcn CLI 전용
- **HTML `<img>` 태그 사용 금지** — Next.js `<Image>` 사용
- **`/write`, `/edit`, `/upload` 경로를 인증 없이 접근 가능하게 하는 코드 금지**
- **AWS S3, Firebase Storage 등 Cloudinary 외 이미지 스토리지 추가 금지**
- **불필요한 추상화 레이어 추가 금지** — 작동하는 것이 완벽한 것보다 낫다

---

## 13. AI 의사결정 기준

### 새 기능 구현 시 판단 순서

1. PRD(`docs/PRD.md`) Phase 단계 확인 → 현재 Phase에 해당하는 기능인가?
2. Notion에서 처리 가능한가? → 가능하면 별도 구현 없이 Notion API 활용
3. 새 패키지 필요한가? → `docs/PRD.md` 섹션 4.2의 확정 목록에 있는 패키지만 추가
4. 인증이 필요한 기능인가? → `middleware.ts` 보호 경로에 추가

### 컴포넌트 선택 기준

- shadcn/ui에 있는 컴포넌트 → shadcn/ui 사용 (`npx shadcn@latest add`)
- 없는 경우 → `components/[도메인]/` 폴더에 직접 작성
- 서드파티 UI 라이브러리 추가 금지 (MUI, Chakra 등)

### 스타일링 충돌 시

- TailwindCSS 유틸리티 클래스 우선
- 커스텀 CSS 필요 시 `app/globals.css`에만 추가
- Inline style 사용 금지

### 캐싱 전략 선택 기준

- 읽기 빈도 높은 페이지 → ISR (`export const revalidate = N`)
- 쓰기 후 즉시 반영 필요 → `revalidatePath()` 호출
- 실시간 데이터 → `no-store` (최후 수단)
