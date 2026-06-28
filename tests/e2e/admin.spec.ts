import { test, expect } from "@playwright/test";

// 각 테스트 전에 쿠키를 초기화하여 인증 상태를 리셋
test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test.describe("관리자 인증 플로우", () => {
  test("미인증 상태에서 /dashboard 접근 시 /login으로 리다이렉트", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("미인증 상태에서 /invoices 접근 시 /login으로 리다이렉트", async ({ page }) => {
    await page.goto("/invoices");
    await expect(page).toHaveURL(/\/login/);
  });

  test("올바른 자격증명(admin/admin)으로 로그인 성공 후 /dashboard 이동", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "admin");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("잘못된 자격증명 입력 시 에러 메시지 표시", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "wrong-password");
    await page.click('button[type="submit"]');

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("alert")).toContainText("올바르지 않습니다");
  });

  test("로그인 후 로그아웃 시 /login으로 이동", async ({ page }) => {
    // 로그인
    await page.goto("/login");
    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "admin");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // 로그아웃 버튼 클릭
    await page.click('button[type="submit"]:has-text("로그아웃"), form button[type="submit"]');
    await expect(page).toHaveURL(/\/login/);
  });

  test("로그인 후 /dashboard에서 통계 카드가 표시된다", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "admin");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText("대시보드")).toBeVisible();
  });

  test("로그인 후 /invoices 페이지에 접근 가능하다", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "admin");
    await page.click('button[type="submit"]');

    await page.goto("/invoices");
    await expect(page).toHaveURL(/\/invoices/);
  });
});
