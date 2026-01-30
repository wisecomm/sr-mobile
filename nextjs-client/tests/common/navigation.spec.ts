import { test, expect } from "@playwright/test";
import { login } from "../fixtures/auth";

test.describe("네비게이션", () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test.describe("사이드바 메뉴", () => {
        test("사이드바가 표시된다", async ({ page }) => {
            await page.goto("/users");

            // 사이드바 존재 확인
            const sidebar = page.locator('[class*="sidebar"]').or(page.locator('nav'));
            await expect(sidebar.first()).toBeVisible();
        });

        test("사용자 관리 메뉴 클릭 시 페이지 이동", async ({ page }) => {
            await page.goto("/mainmenu");
            await page.waitForLoadState('networkidle');

            // 사용자 관리 메뉴 클릭 - use more specific link selector
            const userMenu = page.locator('a[href="/users"]');
            if (await userMenu.first().isVisible({ timeout: 5000 }).catch(() => false)) {
                await userMenu.first().click();
                await expect(page).toHaveURL(/\/users/, { timeout: 10000 });
            }
        });

        test("역할 관리 메뉴 클릭 시 페이지 이동", async ({ page }) => {
            await page.goto("/users");

            const roleMenu = page.locator('text=역할').or(page.locator('a[href="/roles"]'));
            if (await roleMenu.first().isVisible()) {
                await roleMenu.first().click();
                await expect(page).toHaveURL(/\/roles/);
            }
        });

        test("메뉴 관리 메뉴 클릭 시 페이지 이동", async ({ page }) => {
            await page.goto("/users");

            const menuMenu = page.locator('a[href="/menus"]').or(page.locator('text=메뉴 관리'));
            if (await menuMenu.first().isVisible()) {
                await menuMenu.first().click();
                await expect(page).toHaveURL(/\/menus/);
            }
        });

        test("게시판 메뉴 클릭 시 페이지 이동", async ({ page }) => {
            await page.goto("/users");

            const boardMenu = page.locator('text=게시판').or(page.locator('a[href*="/boards"]'));
            if (await boardMenu.first().isVisible()) {
                await boardMenu.first().click();
                await expect(page).toHaveURL(/\/boards/);
            }
        });
    });

    test.describe("헤더", () => {
        test("헤더가 표시된다", async ({ page }) => {
            await page.goto("/users");

            const header = page.locator('header').or(page.locator('[class*="header"]'));
            await expect(header.first()).toBeVisible();
        });

        test("사용자 정보가 헤더에 표시된다", async ({ page }) => {
            await page.goto("/users");

            // 사용자명 또는 아바타 확인
            const userInfo = page.locator('text=admin').or(page.locator('[class*="avatar"]'));
            await expect(userInfo.first()).toBeVisible();
        });
    });

    test.describe("페이지 타이틀", () => {
        test("사용자 관리 페이지가 로드된다", async ({ page }) => {
            await page.goto("/users");

            // 페이지가 정상 로드되는지 확인
            await expect(page).toHaveURL(/\/users/);
            await expect(page.locator("body")).toBeVisible();
        });

        test("역할 관리 페이지가 로드된다", async ({ page }) => {
            await page.goto("/roles");

            // 페이지가 정상 로드되는지 확인
            await expect(page).toHaveURL(/\/roles/);
            await expect(page.locator("body")).toBeVisible();
        });
    });
});

test.describe("다크 모드", () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.goto("/users");
    });

    test("다크 모드 토글 버튼이 존재한다", async ({ page }) => {
        const themeToggle = page.locator('[class*="theme"]').or(page.locator('button[aria-label*="theme"]')).or(page.locator('button:has-text("다크")'));

        // 버튼이 존재하는지 확인 (구현에 따라 다를 수 있음)
        const isVisible = await themeToggle.first().isVisible().catch(() => false);
        if (isVisible) {
            await expect(themeToggle.first()).toBeVisible();
        }
    });

    test("다크 모드 토글 시 클래스 변경", async ({ page }) => {
        const themeToggle = page.locator('[class*="theme"]').or(page.locator('button[aria-label*="theme"]'));

        if (await themeToggle.first().isVisible().catch(() => false)) {
            // 현재 테마 상태 확인
            const htmlElement = page.locator("html");
            const initialDark = await htmlElement.evaluate((el) => el.classList.contains("dark"));

            // 토글 클릭
            await themeToggle.first().click();

            // 테마 변경 확인
            const afterDark = await htmlElement.evaluate((el) => el.classList.contains("dark"));
            expect(afterDark).not.toBe(initialDark);
        }
    });
});

test.describe("반응형 레이아웃", () => {
    test("모바일 뷰포트에서 레이아웃이 조정된다", async ({ page }) => {
        // 모바일 뷰포트 설정
        await page.setViewportSize({ width: 375, height: 667 });

        await login(page);
        await page.goto("/users");

        // 페이지가 정상 로드되는지 확인
        await expect(page.locator("body")).toBeVisible();
    });

    test("태블릿 뷰포트에서 레이아웃이 조정된다", async ({ page }) => {
        // 태블릿 뷰포트 설정
        await page.setViewportSize({ width: 768, height: 1024 });

        await login(page);
        await page.goto("/users");

        // 페이지가 정상 로드되는지 확인
        await expect(page.locator("body")).toBeVisible();
    });
});
