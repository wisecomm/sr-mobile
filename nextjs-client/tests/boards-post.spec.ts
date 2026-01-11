import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("Board Post Management", () => {
    test("should manage board posts (create, search, delete)", async ({ page, authenticatedPage }) => {
        const timestamp = Date.now();
        // brdId max length 20. 
        const brdId = `B_${timestamp.toString().slice(-10)}`;
        const brdNm = `PostBoard ${timestamp}`;
        const postTitle = `Post ${timestamp}`;

        // --- Setup: Create a Board Master first ---
        await page.goto("/boards/master");
        await page.click('button:has-text("추가")');
        // Use specific label locator
        await expect(page.locator("label:has-text('게시판 코드')")).toBeVisible();

        await page.fill('input[name="brdId"]', brdId);
        await page.fill('input[name="brdNm"]', brdNm);
        await page.fill('textarea[name="brdDesc"]', "For Post Testing");
        await page.fill('input[name="fileMaxCnt"]', "5");

        await page.click('button[type="submit"]');
        await expect(page.locator("label:has-text('게시판 코드')")).not.toBeVisible();

        // --- Test: Board Post Management ---
        // Navigate to the board posts page with the new brdId
        await page.goto(`/boards/board?brdId=${brdId}`);

        // 1. Verify Post List
        await expect(page.locator("table")).toBeVisible();

        // 2. Create Post
        await page.click('button:has-text("추가")');

        // Specific locator for Title label to avoid strict mode violation (label vs button vs combobox)
        await expect(page.locator("label:has-text('제목')")).toBeVisible();

        await page.fill('input[name="title"]', postTitle);
        await page.fill('textarea[name="contents"]', "This is a test post content.");

        // Submit
        await page.click('button[type="submit"]');

        // Wait for list update - verify form is gone
        // Wait for list update - verify form is gone
        // Using a longer timeout or waiting for the dialog content to detach
        await expect(page.locator("label:has-text('제목')")).not.toBeVisible({ timeout: 30000 });

        // 3. Search / Verify in list
        await expect(page.getByRole("cell", { name: postTitle })).toBeVisible();

        // 4. Delete Post
        const row = page.locator("tr", { has: page.locator("td", { hasText: postTitle }) });
        await row.locator('input[type="checkbox"]').check();

        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        await expect(page.getByRole("cell", { name: postTitle })).not.toBeVisible();

        // --- Teardown: Delete Board Master ---
        await page.goto("/boards/master");
        const boardRow = page.locator("tr", { has: page.locator("td", { hasText: brdId }) });
        await boardRow.locator('input[type="checkbox"]').check();

        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');
        await expect(page.getByRole("cell", { name: brdId })).not.toBeVisible();
    });
});
