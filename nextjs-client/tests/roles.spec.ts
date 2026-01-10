import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("Role Management", () => {
    test("should list roles", async ({ page, authenticatedPage }) => {
        await page.goto("/roles");
        await expect(page.locator("table")).toBeVisible();
        // Check for default role 'ROLE_ADMIN'
        await expect(page.locator("body")).toContainText("ROLE_ADMIN");
    });
});
