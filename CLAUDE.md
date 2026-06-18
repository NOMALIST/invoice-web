# CLAUDE.md

이 파일은 이 레포지토리에서 Claude Code (claude.ai/code)가 작업할 때 필요한 지침을 제공합니다.

## 개발 명령어

```bash
# Turbopack을 사용한 개발 서버 실행
npm run dev

# Turbopack을 사용한 프로덕션 빌드  
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint

# TypeScript 타입 체크
npx tsc --noEmit

# shadcn/ui 컴포넌트 추가
npx shadcn@latest add [component-name]
```

## 아키텍처 개요

이 프로젝트는 한국어를 지원하는 **Next.js v15 스타터 킷**으로, App Router 아키텍처를 사용하여 구축되었습니다. 주요 특징:

### TailwindCSS v4 설정
- **tailwind.config 파일 없음** - CSS 기반 설정 사용
- `app/globals.css`에 `@theme inline` 블록으로 스타일 정의
- 커스텀 다크 모드 variant: `@custom-variant dark (&:is(.dark *))`
- PostCSS는 `@tailwindcss/postcss` 플러그인만 사용하도록 설정
- 추가 애니메이션을 위한 `tw-animate-css` 사용
- 라이트/다크 테마 모두에 OKLCH 값을 사용하는 색상 시스템

### 컴포넌트 아키텍처
- **shadcn/ui 컴포넌트**: `components/ui/`에 위치 (New York 스타일, RSC 활성화, Lucide 아이콘)
- **레이아웃 컴포넌트**: `components/layout/`에 위치 (navbar, footer, theme-toggle)
- **프로바이더**: `components/providers/`에 위치 (테마 프로바이더 래퍼)
- **유틸리티 함수**: `lib/utils.ts`에 위치 (클래스 병합을 위한 cn 함수)
- **컴포넌트 설정**: 커스텀 별칭이 포함된 `components.json`을 통해 관리

### 테마 시스템
- 시스템 감지가 활성화된 `next-themes` 사용
- `attribute="class"` 및 `defaultTheme="system"`으로 설정된 ThemeProvider
- 한국어 라벨(라이트, 다크, 시스템)로 라이트/다크/시스템 옵션을 제공하는 테마 토글 컴포넌트
- 테마 지속성을 위해 루트 레이아웃에 `suppressHydrationWarning` 포함

### 레이아웃 구조
- 루트 레이아웃(`app/layout.tsx`)이 모든 페이지를 ThemeProvider로 감쌈
- 고정된 navbar와 footer, 메인 콘텐츠는 flex-1 컨테이너에 배치
- HTML에 한국어 설정(`lang="ko"`)
- CSS 변수를 사용하는 Geist 폰트(sans 및 mono)

### 스타일링 패턴
- 일관된 중앙 정렬을 위해 모든 컨테이너에 `mx-auto max-w-screen-2xl px-4` 사용
- OKLCH 색상 값으로 라이트/다크 모드 간 더 나은 지각적 균일성 제공
- `cn()` 유틸리티로 클래스 조합하는 shadcn/ui 패턴을 따르는 컴포넌트
- Border radius 시스템: 기본값 `10px`로 `--radius-sm`부터 `--radius-xl`까지

## 환경 설정

환경변수를 위해 `.env.example`을 `.env.local`로 복사하세요. 스타터 킷에는 일반적인 서비스(데이터베이스, 인증, API)에 대한 샘플 설정이 포함되어 있습니다.

## Import 별칭

- `@/components` → `./components`
- `@/lib` → `./lib`  
- `@/app` → `./app`
- `@/ui` → `./components/ui`
- `@/hooks` → `./hooks`
- `@/` → `./` (루트)

## 한국어 지원

이 프로젝트는 한국어를 위해 설정되었습니다:
- HTML lang 속성을 "ko"로 설정
- 한국어 라벨(라이트, 다크, 시스템)이 포함된 테마 토글
- 한국어 설명이 포함된 환경변수
- 한국어로 작성된 README 및 문서