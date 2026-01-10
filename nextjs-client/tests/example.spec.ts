import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
    await page.goto("/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/재고 관리/);
});

test("redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/");

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
});
