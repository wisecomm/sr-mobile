import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("Board Master Management", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test("should manage board masters (create, search, delete)", async ({ page, authenticatedPage }) => {
        await page.goto("/boards/master");

        // 1. Verify List is loaded
        await expect(page.locator("table")).toBeVisible();

        const timestamp = Date.now();
        const brdId = `B_${timestamp.toString().slice(-10)}`;
        const brdNm = `Board ${timestamp}`;

        // 2. Create Board Master
        await page.click('button:has-text("추가")');
        await expect(page.locator("label:has-text('게시판 코드')")).toBeVisible();

        await page.fill('input[name="brdId"]', brdId);
        await page.fill('input[name="brdNm"]', brdNm);
        await page.fill('textarea[name="brdDesc"]', "Test Board Description");
        await page.fill('input[name="fileMaxCnt"]', "5");

        await page.click('button[type="submit"]');

        // Wait for form to close
        await expect(page.locator("label:has-text('게시판 코드')")).not.toBeVisible({ timeout: 10000 });

        // 3. Search for the created board to make it visible in the list
        await page.fill('input[placeholder="게시판명 입력"]', brdNm);
        await page.click('button:has-text("조회")');

        // Verify in table
        await expect(page.getByRole("cell", { name: brdId })).toBeVisible({ timeout: 10000 });

        // 4. Delete
        const row = page.locator("tr").filter({ hasText: brdId });
        await row.getByRole('checkbox').click();

        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        await expect(page.getByRole("cell", { name: brdId })).not.toBeVisible({ timeout: 10000 });
    });
});
