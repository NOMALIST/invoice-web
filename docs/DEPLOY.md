# Vercel 배포 가이드

노션 기반 견적서 관리 시스템을 Vercel에 배포하는 단계별 가이드입니다.

---

## 사전 준비

- GitHub 계정 및 이 프로젝트가 push된 레포지토리
- [Vercel 계정](https://vercel.com) (GitHub로 로그인 권장)
- Notion Integration API 키 및 데이터베이스 ID

---

## 1단계: Vercel 프로젝트 연결

1. [vercel.com/new](https://vercel.com/new) 접속
2. **Import Git Repository** 선택
3. GitHub 계정 연동 후 이 레포지토리 선택
4. **Framework Preset**: Next.js (자동 감지)
5. **Root Directory**: `.` (기본값 유지)
6. **Build Command**: `npm run build` (자동 감지)
7. **Output Directory**: `.next` (자동 감지)

---

## 2단계: 환경변수 설정

Vercel 대시보드 → **Settings** → **Environment Variables** 에서 아래 변수를 추가합니다.

| 변수명 | 설명 | 환경 |
|--------|------|------|
| `NOTION_API_KEY` | Notion Integration 시크릿 키 | Production, Preview, Development |
| `NOTION_DATABASE_ID` | 견적서 데이터베이스 ID | Production, Preview, Development |
| `NOTION_ITEMS_DATABASE_ID` | 견적 항목 데이터베이스 ID | Production, Preview, Development |
| `NEXT_PUBLIC_BASE_URL` | 배포 도메인 (예: `https://your-domain.vercel.app`) | Production |

### Notion API 키 발급 방법

1. [notion.so/my-integrations](https://www.notion.so/my-integrations) 접속
2. **New integration** 클릭
3. 이름 입력 후 **Submit**
4. **Internal Integration Secret** 복사 → `NOTION_API_KEY`에 입력

### Notion 데이터베이스 ID 확인 방법

1. Notion에서 견적서 데이터베이스 페이지 열기
2. 브라우저 URL에서 ID 추출:
   ```
   https://notion.so/workspace/{DATABASE_ID}?v=...
   ```
3. `{DATABASE_ID}` 부분(32자리 hex) 복사

### Notion Integration 연결

데이터베이스에서 **...** → **Connections** → Integration 추가

---

## 3단계: 배포

환경변수 설정 완료 후 **Deploy** 버튼 클릭.

최초 배포 이후에는 `main` 브랜치 push 시 자동 배포됩니다.

---

## 4단계: 커스텀 도메인 설정 (선택)

1. Vercel 대시보드 → **Settings** → **Domains**
2. 도메인 입력 후 **Add**
3. DNS 레코드 설정 (CNAME 또는 A 레코드)
4. SSL 인증서 자동 발급 확인 (수 분 소요)
5. 도메인 확정 후 `NEXT_PUBLIC_BASE_URL` 값을 실제 도메인으로 업데이트

---

## 5단계: 배포 검증

배포 완료 후 아래 항목을 순서대로 확인합니다.

### 공개 기능 확인
- [ ] 랜딩 페이지(`/`) 정상 접속
- [ ] 견적서 조회 페이지(`/invoice/[id]`) 데이터 로드
- [ ] PDF 다운로드 버튼 동작 확인

### 관리자 기능 확인
- [ ] `/login` 페이지 접속 및 로그인 (`admin` / `admin`)
- [ ] `/dashboard` 통계 카드 데이터 로드
- [ ] `/invoices` 견적서 목록 표시
- [ ] 링크 복사 버튼 동작 (복사된 URL의 도메인이 `NEXT_PUBLIC_BASE_URL`과 일치하는지 확인)
- [ ] 로그아웃 후 `/login` 리다이렉트

### 보안 헤더 확인

```bash
curl -I https://your-domain.vercel.app
```

응답 헤더에 아래 항목이 포함되어야 합니다:
- `x-frame-options: DENY`
- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`

---

## 트러블슈팅

### Notion API 오류 (500)
- Notion Integration이 해당 데이터베이스에 연결되어 있는지 확인
- `NOTION_API_KEY`, `NOTION_DATABASE_ID` 환경변수 오타 여부 확인
- Vercel 대시보드 → **Deployments** → 해당 배포 → **Functions** 로그 확인

### 환경변수 반영 안 됨
- 환경변수 수정 후 **Redeploy** 필요 (자동 반영 안 됨)
- `NEXT_PUBLIC_` 접두사 변수는 빌드 시점에 번들에 포함되므로 반드시 재배포

### PDF 생성 실패
- `@react-pdf/renderer`는 서버사이드 전용이므로 Edge Runtime 미지원
- Vercel Function timeout 기본값 10초 → 대용량 PDF 생성 시 초과 가능
  - Vercel Pro 플랜에서 timeout 증가 설정 가능
