# 가족 웹 블로그 PRD (Product Requirements Document)

**문서 버전**: 1.0  
**작성일**: 2026-06-19  
**상태**: 초안

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목적

가족 구성원들이 일상, 여행, 추억을 기록하고 공유하는 가족 전용 블로그.  
누구나 방문해서 읽을 수 있으며, 로그인한 가족 구성원만 글과 사진을 올릴 수 있다.

### 1.2 핵심 원칙

- **Notion이 백엔드다**: 글 작성과 관리는 Notion에서도 가능하고, 웹에서도 가능하다.
- **공개 읽기, 인증된 쓰기**: 방문자는 누구나 읽지만, 작성은 가족만.
- **심플하게 시작**: MVP를 빠르게 출시하고 필요한 기능을 추가한다.

### 1.3 비고

- 솔로 개발자 (1인 개발)
- 초기 배포 후 가족에게 Notion 사용법 안내 예정
- 과도한 엔지니어링 금지 — 작동하는 것이 완벽한 것보다 낫다

---

## 2. 사용자 스토리

### 방문자 (누구나)

- 홈 화면에서 최신 글 목록을 볼 수 있다.
- 블로그 글을 읽을 수 있다.
- 사진 갤러리를 둘러볼 수 있다.
- 앨범별로 사진을 필터링할 수 있다.
- 카테고리/태그로 글을 필터링할 수 있다.

### 가족 구성원 (로그인 사용자)

- 이메일/비밀번호 또는 구글 계정으로 로그인할 수 있다.
- 웹에서 직접 새 글을 작성할 수 있다.
- 자신이 쓴 글을 수정하거나 삭제할 수 있다.
- 사진을 업로드하고 앨범에 추가할 수 있다.
- 로그아웃할 수 있다.

### 관리자 (나)

- 모든 글과 사진을 Notion에서 직접 관리할 수 있다.
- 가족 구성원 계정을 추가/삭제할 수 있다.
- 앨범을 생성하고 관리할 수 있다.

---

## 3. 기능 요구사항

### 3.1 핵심 기능 (MVP — 1~2개월 목표)

#### 블로그 포스트

- 포스트 목록 페이지 (페이지네이션, 최신순)
- 포스트 상세 페이지 (제목, 본문, 작성자, 날짜, 태그, 커버 이미지)
- 포스트 작성 폼 (제목, 본문 마크다운 에디터, 태그, 커버 이미지)
- 포스트 수정/삭제 (작성자 본인만)
- 카테고리/태그 필터링

#### 갤러리

- 앨범 목록 페이지
- 앨범 내 사진 목록 (그리드 레이아웃)
- 사진 라이트박스 (클릭 시 확대)
- 사진 업로드 (최대 10MB, JPG/PNG/WebP)

#### 인증

- 로그인 페이지
- 로그아웃
- 로그인 상태에 따른 UI 분기 (네브바 버튼, 글쓰기 버튼 노출)
- 미인증 사용자의 쓰기 경로 접근 시 로그인 페이지로 리다이렉트

#### 기본 레이아웃

- 네브바: 로고, 블로그, 갤러리, 로그인/로그아웃 버튼
- 홈 페이지: 최신 포스트 3~5개 + 갤러리 미리보기
- 푸터: 가족 이름, 연도

### 3.2 선택 기능 (MVP 이후)

- 댓글 기능 (giscus 또는 Notion 댓글 연동)
- 검색 기능 (포스트 제목/내용 검색)
- RSS 피드
- OG 이미지 자동 생성
- 관리자 대시보드 (통계 등)
- 다중 언어 지원

---

## 4. 기술 스택

### 4.1 확정된 기술 (현재 코드베이스)

| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js | 15.5.2 |
| UI 라이브러리 | React | 19.1.0 |
| 언어 | TypeScript | 5.x |
| 스타일링 | TailwindCSS | 4.x |
| UI 컴포넌트 | shadcn/ui | New York 스타일 |
| 다크모드 | next-themes | 0.4.6 |

### 4.2 추가해야 할 기술

| 항목 | 선택지 | 결정 | 이유 |
|------|--------|------|------|
| Notion 연동 | `@notionhq/client` | 확정 | 공식 SDK, 타입 지원 |
| 인증 | NextAuth.js v5 (Auth.js) | 확정 | App Router 완전 지원, 구글 OAuth 간편 |
| 이미지 스토리지 | Cloudinary | 확정 | 무료 플랜 넉넉, Next.js Image 최적화 연동 쉬움 |
| 마크다운 렌더링 | `react-markdown` + `remark-gfm` | 확정 | Notion 내보내기 마크다운 호환 |
| 이미지 갤러리 | `yet-another-react-lightbox` | 권장 | 가볍고 Next.js 최적화 이미지와 호환 |
| 날짜 처리 | `date-fns` | 확정 | 한국어 로케일 지원 |
| 환경변수 검증 | `zod` | 권장 | 환경변수 누락 시 빌드 타임 오류 |
| 배포 | Vercel | 확정 | Next.js 최적화, 무료 플랜 |

### 4.3 보류/제외

- **Supabase Auth**: Notion-only 스택에서 추가 DB가 필요해 복잡도 증가. NextAuth.js로 충분.
- **Prisma/DB**: Notion이 유일한 데이터 소스이므로 별도 DB 불필요.
- **AWS S3**: Cloudinary가 설정이 훨씬 간단하고 무료 플랜으로 커버 가능.

---

## 5. Notion 데이터 모델

Notion에 아래 3개의 데이터베이스를 생성한다.

### 5.1 블로그 포스트 데이터베이스

**데이터베이스 이름**: `Blog Posts`

| 속성 이름 | Notion 타입 | 설명 |
|-----------|-------------|------|
| `Title` | Title | 포스트 제목 (기본 속성) |
| `Slug` | Rich Text | URL 슬러그 (예: `2024-summer-trip`) |
| `Status` | Select | `Published` / `Draft` |
| `Category` | Select | `일상` / `여행` / `요리` / `육아` 등 |
| `Tags` | Multi-select | 태그 복수 선택 |
| `Author` | Rich Text | 작성자 이름 |
| `Published At` | Date | 발행일 |
| `Cover Image` | Rich Text | Cloudinary 이미지 URL |
| `Excerpt` | Rich Text | 목록에 표시할 요약문 |

포스트 본문은 Notion 페이지 본문(블록)을 그대로 사용한다.

**쿼리 기본값**: `Status = Published`, `Published At` 내림차순 정렬

### 5.2 갤러리 앨범 데이터베이스

**데이터베이스 이름**: `Gallery Albums`

| 속성 이름 | Notion 타입 | 설명 |
|-----------|-------------|------|
| `Name` | Title | 앨범 이름 |
| `Slug` | Rich Text | URL 슬러그 |
| `Description` | Rich Text | 앨범 설명 |
| `Cover Image` | Rich Text | Cloudinary 커버 이미지 URL |
| `Date` | Date | 앨범 날짜 |
| `Published` | Checkbox | 공개 여부 |

### 5.3 갤러리 사진 데이터베이스

**데이터베이스 이름**: `Gallery Photos`

| 속성 이름 | Notion 타입 | 설명 |
|-----------|-------------|------|
| `Title` | Title | 사진 설명 |
| `Album` | Relation | Gallery Albums와 관계 연결 |
| `Image URL` | Rich Text | Cloudinary URL |
| `Taken At` | Date | 촬영일 |
| `Order` | Number | 앨범 내 정렬 순서 |

> **이미지 저장 전략**: Notion 첨부 파일은 URL이 1시간 후 만료되므로,
> Cloudinary에 업로드 후 영구 URL을 Notion에 저장하는 방식으로 한다.

---

## 6. 페이지 및 화면 목록

### 6.1 라우트 구조

```
app/
├── (public)/                        # 공개 라우트 그룹
│   ├── page.tsx                     # 홈 — 최신 포스트 + 갤러리 미리보기
│   ├── blog/
│   │   ├── page.tsx                 # 블로그 목록
│   │   └── [slug]/
│   │       └── page.tsx             # 블로그 상세
│   └── gallery/
│       ├── page.tsx                 # 앨범 목록
│       └── [albumSlug]/
│           └── page.tsx             # 앨범 내 사진 목록
│
├── (auth)/                          # 인증 관련 라우트 그룹
│   ├── login/
│   │   └── page.tsx                 # 로그인 페이지
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts         # Auth.js API 핸들러
│
├── (admin)/                         # 인증 필요 라우트 그룹
│   ├── write/
│   │   └── page.tsx                 # 새 포스트 작성
│   ├── edit/
│   │   └── [slug]/
│   │       └── page.tsx             # 포스트 수정
│   └── upload/
│       └── page.tsx                 # 사진 업로드
│
└── api/
    ├── posts/
    │   ├── route.ts                 # GET(목록), POST(생성)
    │   └── [slug]/
    │       └── route.ts             # GET(상세), PUT(수정), DELETE(삭제)
    ├── albums/
    │   └── route.ts                 # GET(앨범 목록)
    ├── photos/
    │   └── route.ts                 # GET(사진 목록), POST(업로드)
    └── upload/
        └── route.ts                 # 이미지 → Cloudinary 업로드
```

### 6.2 각 페이지 상세

**홈 (`/`)**
- 히어로 섹션: 블로그 이름, 가족 소개 한 줄
- 최신 포스트 3개 (카드 형태)
- 최신 앨범 미리보기 (최근 앨범 2~3개)
- "더 보기" 링크

**블로그 목록 (`/blog`)**
- 카테고리/태그 필터 (상단)
- 포스트 카드 그리드 (커버 이미지, 제목, 날짜, 작성자, 요약)
- 페이지네이션 (10개씩)
- 로그인 상태이면 "새 글 쓰기" 버튼 표시

**블로그 상세 (`/blog/[slug]`)**
- 커버 이미지 (있으면 표시)
- 제목, 작성자, 날짜, 태그
- Notion 본문 렌더링 (마크다운 or Notion 블록 파싱)
- 로그인 상태이면 수정/삭제 버튼 (작성자일 경우)
- 이전/다음 포스트 링크

**갤러리 목록 (`/gallery`)**
- 앨범 카드 그리드 (커버, 이름, 날짜, 사진 수)

**앨범 상세 (`/gallery/[albumSlug]`)**
- 사진 그리드 (Masonry or 균등 그리드)
- 클릭 시 라이트박스
- 로그인 상태이면 "사진 추가" 버튼

**로그인 (`/login`)**
- 이메일/비밀번호 입력 + 구글 로그인 버튼
- 로그인 성공 시 이전 페이지 or 홈으로 리다이렉트

**글 작성 (`/write`)**
- 제목, 카테고리, 태그 입력
- 마크다운 에디터 (미리보기 토글)
- 커버 이미지 업로드
- 임시저장 / 발행 버튼

---

## 7. API 설계 (내부 API Route)

### 7.1 주요 엔드포인트

```
GET    /api/posts?page=1&category=여행&tag=제주   → 포스트 목록
GET    /api/posts/[slug]                           → 포스트 상세 (Notion 블록 포함)
POST   /api/posts                                   → 새 포스트 (인증 필요) → Notion 페이지 생성
PUT    /api/posts/[slug]                            → 수정 (인증 필요)
DELETE /api/posts/[slug]                            → 삭제 (인증 필요)

GET    /api/albums                                  → 앨범 목록
GET    /api/albums/[slug]/photos                    → 앨범 사진 목록

POST   /api/upload                                  → Cloudinary 업로드 (인증 필요)
POST   /api/photos                                  → 사진 메타데이터 Notion 저장 (인증 필요)
```

### 7.2 Notion API 호출 패턴

```
Notion 읽기  → ISR (revalidate 60초) or On-demand Revalidation
Notion 쓰기  → 서버 액션 or API Route에서 직접 호출
캐싱 전략    → Next.js fetch cache + revalidatePath
```

---

## 8. 환경변수 목록

`.env.local`에 설정해야 할 항목:

```bash
# Notion
NOTION_API_KEY=secret_xxx
NOTION_BLOG_DB_ID=xxx
NOTION_ALBUMS_DB_ID=xxx
NOTION_PHOTOS_DB_ID=xxx

# NextAuth.js
NEXTAUTH_SECRET=랜덤문자열(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# 구글 OAuth (구글 로그인 사용 시)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# 허용된 가족 이메일 목록 (콤마 구분)
ALLOWED_EMAILS=member1@gmail.com,member2@gmail.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
```

---

## 9. 개발 우선순위 및 마일스톤

### Phase 1: Notion 읽기 연동 (1~2주)

목표: Notion에서 데이터를 읽어 화면에 표시

- [ ] Notion 데이터베이스 3개 생성 및 샘플 데이터 입력
- [ ] Notion Integration 생성 후 API 키 발급, 데이터베이스에 연결
- [ ] `@notionhq/client` 설치 및 기본 연동 (`lib/notion.ts`)
- [ ] Notion 블록 렌더러 구현 (`lib/notion-renderer.tsx`)
- [ ] 블로그 목록 페이지 구현 (`/blog`)
- [ ] 블로그 상세 페이지 구현 (`/blog/[slug]`)
- [ ] 홈 페이지 구현 (최신 포스트 목록)
- [ ] 네브바/푸터를 가족 블로그 버전으로 교체

**완료 기준**: Notion에서 글을 쓰면 블로그에 자동으로 표시된다.

### Phase 2: 갤러리 (1~2주)

목표: 사진 앨범 기능 완성

- [ ] Cloudinary 계정 설정 및 환경변수 세팅
- [ ] 앨범 목록 페이지 (`/gallery`)
- [ ] 앨범 상세 페이지 (`/gallery/[albumSlug]`)
- [ ] 라이트박스 구현 (`yet-another-react-lightbox`)
- [ ] Next.js Image 최적화 적용 (Cloudinary 도메인 허용)

**완료 기준**: 갤러리에서 사진을 클릭하면 라이트박스로 볼 수 있다.

### Phase 3: 인증 및 쓰기 기능 (2~3주)

목표: 가족이 웹에서 직접 글 작성 가능

- [ ] NextAuth.js v5 설치 및 설정 (`lib/auth.ts`)
- [ ] 로그인 페이지 구현 (이메일 + 구글)
- [ ] 미들웨어로 `/write`, `/edit`, `/upload` 경로 보호 (`middleware.ts`)
- [ ] 글 작성 폼 구현 (마크다운 에디터 포함)
- [ ] Notion API 쓰기 연동 (새 페이지 생성)
- [ ] 이미지 업로드 → Cloudinary API Route
- [ ] 사진 업로드 페이지 구현

**완료 기준**: 로그인한 가족이 웹에서 글을 쓰면 Notion과 블로그에 모두 반영된다.

### Phase 4: 마무리 및 배포 (1주)

- [ ] Vercel 배포 설정
- [ ] 환경변수 Vercel에 등록
- [ ] OG 메타태그 설정 (공유 시 미리보기)
- [ ] 모바일 반응형 점검
- [ ] 가족에게 Notion 사용법 안내

---

## 10. 주요 기술 결정 사항

### Notion 쓰기 제한 대응

Notion API는 일부 블록 타입 생성을 지원하지 않는다. 웹 에디터에서 작성하는 경우:
- 마크다운으로 작성 → Notion 블록으로 변환하여 저장
- 이미지는 Cloudinary URL을 Notion `image` 블록으로 저장
- 복잡한 레이아웃(컬럼 등)은 Notion에서만 작성 가능하다고 가족에게 안내

### 이미지 URL 만료 문제

Notion 첨부 파일의 URL은 1시간 후 만료된다.

- **권장 방식**: 모든 이미지를 Cloudinary에 업로드하고 영구 URL만 Notion에 저장

### 인증 전략

- **NextAuth.js v5 (Auth.js)**: App Router와 궁합이 좋고, 이메일 + 구글 동시 지원
- 별도 사용자 DB 없이 허용된 이메일 목록을 환경변수로 관리 (`ALLOWED_EMAILS`)
- 가족 구성원이 많지 않으므로 이 방법이 가장 간단

### ISR(Incremental Static Regeneration) 전략

```
/blog            → revalidate: 60초 (1분)
/blog/[slug]     → revalidate: 300초 (5분) + On-demand Revalidation
/gallery         → revalidate: 300초 (5분)
```

글 작성/수정 후 해당 경로를 `revalidatePath()`로 즉시 갱신.

---

## 11. 파일 구조 최종안

```
.
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── blog/
│   │   └── gallery/
│   ├── (auth)/
│   │   └── login/
│   ├── (admin)/
│   │   ├── write/
│   │   ├── edit/[slug]/
│   │   └── upload/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── posts/
│   │   ├── albums/
│   │   ├── photos/
│   │   └── upload/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/              # 기존 (navbar, footer 수정 필요)
│   ├── providers/           # 기존
│   ├── ui/                  # 기존 shadcn/ui
│   ├── blog/                # 신규: PostCard, PostList, PostForm
│   ├── gallery/             # 신규: AlbumCard, PhotoGrid, Lightbox
│   └── auth/                # 신규: LoginForm, UserMenu
├── lib/
│   ├── utils.ts             # 기존
│   ├── notion.ts            # 신규: Notion API 클라이언트 + 헬퍼
│   ├── notion-renderer.tsx  # 신규: Notion 블록 → React 컴포넌트
│   ├── cloudinary.ts        # 신규: Cloudinary 업로드 헬퍼
│   └── auth.ts              # 신규: NextAuth.js 설정
├── types/
│   ├── post.ts              # 신규: Post, PostMeta 타입
│   ├── gallery.ts           # 신규: Album, Photo 타입
│   └── notion.ts            # 신규: Notion API 응답 타입
├── docs/
│   └── PRD.md               # 이 문서
├── middleware.ts             # 신규: 인증 필요 경로 보호
└── .env.local
```

---

## 12. 즉시 시작할 수 있는 첫 번째 작업

1. Notion 워크스페이스에 `Blog Posts`, `Gallery Albums`, `Gallery Photos` 데이터베이스 생성
2. Notion Integration 생성 후 API 키 발급, 각 데이터베이스에 Integration 연결
3. `.env.local` 파일 생성 및 Notion 관련 환경변수 입력
4. 의존성 설치:
   ```bash
   npm install @notionhq/client react-markdown remark-gfm date-fns next-auth@beta
   ```
5. `lib/notion.ts` 파일 생성 — 포스트 목록 조회 함수부터 구현
6. `/blog` 페이지에서 Notion 데이터 표시 확인
