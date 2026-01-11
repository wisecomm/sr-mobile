import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("Board Master Management", () => {
    test("should manage board masters (create, search, delete)", async ({ page, authenticatedPage }) => {
        await page.goto("/boards/master");

        // 1. Verify List
        await expect(page.locator("table")).toBeVisible();
        await expect(page.getByRole("button", { name: "조회" })).toBeVisible();

        const timestamp = Date.now();
        // brdId max length 20
        const brdId = `B_${timestamp.toString().slice(-10)}`;
        const brdNm = `Board ${timestamp}`;

        // 2. Create Board Master
        await page.click('button:has-text("추가")');

        // Target label specifically to avoid strict mode violations (e.g. versus column headers or buttons)
        await expect(page.locator("label:has-text('게시판 코드')")).toBeVisible();

        await page.fill('input[name="brdId"]', brdId);
        await page.fill('input[name="brdNm"]', brdNm);
        await page.fill('textarea[name="brdDesc"]', "Test Board Description");

        // Set fileMaxCnt to ensure no validation error "must be >= 0" if default is missing/empty
        await page.fill('input[name="fileMaxCnt"]', "5");

        await page.click('button[type="submit"]');

        // Wait for list update - verify form label is gone
        await expect(page.locator("label:has-text('게시판 코드')")).not.toBeVisible();

        // 3. Search / Verify in table
        // We can just verify the row exists
        await expect(page.getByRole("cell", { name: brdId })).toBeVisible();
        await expect(page.getByRole("cell", { name: brdNm })).toBeVisible();

        // 4. Delete
        const row = page.locator("tr", { has: page.locator("td", { hasText: brdId }) });
        await row.locator('input[type="checkbox"]').check();

        // Handle dialog BEFORE click
        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        // Verify gone
        await expect(page.getByRole("cell", { name: brdId })).not.toBeVisible();
    });
});
