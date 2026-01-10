import { test as base, expect } from "@playwright/test";

/**
 * 인증된 상태의 테스트 fixture
 * 로그인이 필요한 테스트에서 사용
 */
export const test = base.extend<{ authenticatedPage: void }>({
    authenticatedPage: async ({ page }, use) => {
        // 로그인 수행
        await page.goto("/login");
        await page.fill('input[name="userId"]', "admin");
        await page.fill('input[name="userPwd"]', "12345678");
        await page.click('button[type="submit"]');

        // 로그인 완료 대기
        await page.waitForURL(/\/(mainmenu|users|roles|menus)/);

        await use();
    },
});

/**
 * 로그인 헬퍼 함수
 */
export async function login(page: import("@playwright/test").Page, userId = "admin", userPwd = "12345678") {
    await page.goto("/login");
    await page.fill('input[name="userId"]', userId);
    await page.fill('input[name="userPwd"]', userPwd);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(mainmenu|users|roles|menus|boards)/);
}

/**
 * 로그아웃 헬퍼 함수
 */
export async function logout(page: import("@playwright/test").Page) {
    // 헤더의 사용자 메뉴 클릭
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL("/login");
}

export { expect };
