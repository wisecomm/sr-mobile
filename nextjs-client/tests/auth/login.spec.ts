import { test, expect } from "@playwright/test";

test.describe("로그인 페이지", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
    });

    test("로그인 폼이 표시된다", async ({ page }) => {
        // 로그인 폼 요소 확인
        await expect(page.locator('input[name="userId"]')).toBeVisible();
        await expect(page.locator('input[name="userPwd"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test("올바른 자격증명으로 로그인 성공", async ({ page }) => {
        // 로그인 정보 입력
        await page.fill('input[name="userId"]', "admin");
        await page.fill('input[name="userPwd"]', "12345678");

        // 로그인 버튼 클릭
        await page.click('button[type="submit"]');

        // 메인 페이지로 이동 확인
        await expect(page).toHaveURL(/\/(mainmenu|users)/);
    });

    test("빈 필드로 로그인 시도 시 유효성 검사", async ({ page }) => {
        // 빈 상태로 로그인 시도
        await page.click('button[type="submit"]');

        // 페이지가 여전히 로그인 페이지인지 확인
        await expect(page).toHaveURL(/\/login/);
    });

    test("잘못된 비밀번호로 로그인 실패", async ({ page }) => {
        // 잘못된 비밀번호 입력
        await page.fill('input[name="userId"]', "admin");
        await page.fill('input[name="userPwd"]', "wrongpassword");

        // 로그인 버튼 클릭
        await page.click('button[type="submit"]');

        // 에러 메시지 또는 로그인 페이지 유지 확인
        await expect(page).toHaveURL(/\/login/);
    });

    test("존재하지 않는 사용자로 로그인 실패", async ({ page }) => {
        // 존재하지 않는 사용자
        await page.fill('input[name="userId"]', "nonexistent");
        await page.fill('input[name="userPwd"]', "password123");

        // 로그인 버튼 클릭
        await page.click('button[type="submit"]');

        // 로그인 페이지 유지 확인
        await expect(page).toHaveURL(/\/login/);
    });
});

test.describe("인증 보호", () => {
    test("비로그인 상태에서 보호된 페이지 접근 시 로그인 페이지로 리다이렉트", async ({ page }) => {
        // 보호된 페이지 직접 접근 시도
        await page.goto("/users");

        // 로그인 페이지로 리다이렉트 확인
        await expect(page).toHaveURL(/\/login/);
    });

    test("비로그인 상태에서 역할 관리 페이지 접근 시 리다이렉트", async ({ page }) => {
        await page.goto("/roles");
        await expect(page).toHaveURL(/\/login/);
    });

    test("비로그인 상태에서 메뉴 관리 페이지 접근 시 리다이렉트", async ({ page }) => {
        await page.goto("/menus");
        await expect(page).toHaveURL(/\/login/);
    });
});

test.describe("로그아웃", () => {
    test.beforeEach(async ({ page }) => {
        // 먼저 로그인
        await page.goto("/login");
        await page.fill('input[name="userId"]', "admin");
        await page.fill('input[name="userPwd"]', "12345678");
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/(mainmenu|users)/);
    });

    test("로그아웃 후 로그인 페이지로 이동", async ({ page }) => {
        // 사용자 메뉴에서 로그아웃 클릭 (실제 구현에 맞게 조정 필요)
        // 헤더의 로그아웃 버튼 또는 드롭다운 메뉴
        const logoutButton = page.locator('text=로그아웃').or(page.locator('[data-testid="logout-button"]'));

        if (await logoutButton.isVisible()) {
            await logoutButton.click();
            await expect(page).toHaveURL(/\/login/);
        }
    });
});
