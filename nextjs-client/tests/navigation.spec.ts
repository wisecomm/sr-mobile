import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("Navigation", () => {
    test("should navigate via sidebar", async ({ page, authenticatedPage }) => {
        // Start from dashboard or mainmenu
        await page.goto("/mainmenu");

        // Verify side menu exists
        await expect(page.locator("nav")).toBeVisible();

        // Navigate to Users
        await page.locator('a[href="/users"]').click();
        await expect(page).toHaveURL(/\/users/);
        await expect(page.locator('a[href="/users"]')).toHaveClass(/text-primary/); // Check active state

        // Navigate to Boards (Notice) - Assuming it's in a collapsed menu or direct link
        // This might need adjustments based on actual Sidebar structure (Collapsible)
        // await page.locator('a[href*="/boards/board"]').click();
        // await expect(page).toHaveURL(/\/boards\/board/);
    });
});
