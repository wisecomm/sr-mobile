import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("User Management", () => {
    test("should list users", async ({ page, authenticatedPage }) => {
        await page.goto("/users");
        await expect(page.locator("table")).toBeVisible();
        // Check if at least one user row exists (admin)
        await expect(page.locator("tr")).not.toHaveCount(0);
    });

    // Note: Full CRUD is skipped for now to avoid side effects on production data if running on live DB.
    // Focusing on List View verification first.
});
