import { test, expect } from "@playwright/test";

// 견적서 조회 E2E 테스트
// 실제 Notion 데이터에 의존하므로 NOTION_API_KEY 환경변수가 있을 때만 실행
const hasNotionConfig =
  !!process.env.NOTION_API_KEY && !!process.env.NOTION_DATABASE_ID;

test.describe("견적서 공개 페이지", () => {
  test("랜딩 페이지(/)가 정상 렌더링된다", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
    // 관리자 로그인 링크 존재 확인
    await expect(page.getByText("관리자 로그인")).toBeVisible();
  });

  test("랜딩 페이지의 관리자 로그인 링크가 /login으로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.getByText("관리자 로그인").click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("존재하지 않는 견적서 ID 접근 시 404 또는 에러 페이지를 반환한다", async ({ page }) => {
    const response = await page.goto("/invoice/00000000-0000-0000-0000-000000000000");
    // 404 상태코드이거나 not-found 페이지로 이동
    const is404 = response?.status() === 404;
    const hasNotFoundText = await page.getByText(/찾을 수 없|not found/i).isVisible().catch(() => false);
    expect(is404 || hasNotFoundText).toBeTruthy();
  });

  test.describe("Notion 연동 테스트 (환경변수 필요)", () => {
    test.skip(!hasNotionConfig, "NOTION_API_KEY 미설정으로 건너뜁니다");

    test("유효한 견적서 ID로 견적서 페이지가 렌더링된다", async ({ page }) => {
      // 실제 테스트 시 환경변수 TEST_INVOICE_ID에 유효한 Notion 페이지 ID를 설정하세요
      const invoiceId = process.env.TEST_INVOICE_ID;
      test.skip(!invoiceId, "TEST_INVOICE_ID 미설정으로 건너뜁니다");

      await page.goto(`/invoice/${invoiceId}`);
      await expect(page.getByText(/견적서/)).toBeVisible();
    });

    test("견적서 페이지에서 PDF 다운로드 버튼이 표시된다", async ({ page }) => {
      const invoiceId = process.env.TEST_INVOICE_ID;
      test.skip(!invoiceId, "TEST_INVOICE_ID 미설정으로 건너뜁니다");

      await page.goto(`/invoice/${invoiceId}`);
      await expect(page.getByRole("button", { name: /PDF|다운로드/ })).toBeVisible();
    });
  });
});
