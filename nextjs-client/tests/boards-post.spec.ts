import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("Board Post Management", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test("should manage board posts (create, search, delete)", async ({ page, authenticatedPage }) => {
        const timestamp = Date.now();
        const brdId = `B_${timestamp.toString().slice(-10)}`;
        const brdNm = `PostBoard ${timestamp}`;
        const postTitle = `Post ${timestamp}`;

        // --- Setup: Create a Board Master first ---
        await page.goto("/boards/master");
        await expect(page.locator("table")).toBeVisible();

        await page.click('button:has-text("추가")');
        await expect(page.locator("label:has-text('게시판 코드')")).toBeVisible();

        await page.fill('input[name="brdId"]', brdId);
        await page.fill('input[name="brdNm"]', brdNm);
        await page.fill('textarea[name="brdDesc"]', "For Post Testing");
        await page.fill('input[name="fileMaxCnt"]', "5");

        await page.click('button[type="submit"]');
        await expect(page.locator("label:has-text('게시판 코드')")).not.toBeVisible({ timeout: 10000 });

        // --- Test: Board Post Management ---
        await page.goto(`/boards/${brdId}`);
        await expect(page.locator("table")).toBeVisible();

        // Create Post
        await page.click('button:has-text("추가")');
        await expect(page.locator("label:has-text('제목')")).toBeVisible();

        await page.fill('input[name="title"]', postTitle);
        await page.fill('textarea[name="contents"]', "This is a test post content.");

        await page.click('button[type="submit"]');
        await expect(page.locator("label:has-text('제목')")).not.toBeVisible({ timeout: 30000 });

        // Verify post in list
        await expect(page.getByRole("cell", { name: postTitle })).toBeVisible({ timeout: 10000 });

        // Delete Post - Click toolbar delete button
        const postRow = page.locator("tr").filter({ hasText: postTitle });
        await postRow.getByRole('checkbox').click();
        await page.click('button:has-text("삭제")');

        // Wait for confirmation dialog and confirm delete
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
        await page.getByRole('dialog').getByRole('button', { name: '삭제' }).click();

        // Wait for delete to complete and reload to verify
        await page.waitForLoadState('networkidle');
        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole("cell", { name: postTitle })).toBeHidden({ timeout: 10000 });

        // --- Teardown: Delete Board Master ---
        await page.goto("/boards/master");
        await expect(page.locator("table")).toBeVisible();

        // Search for the board to make it visible in paginated list
        await page.fill('input[placeholder="게시판명 입력"]', brdNm);
        await page.click('button:has-text("조회")');

        // Wait for the row to be visible
        await expect(page.getByRole("cell", { name: brdId })).toBeVisible({ timeout: 10000 });

        const boardRow = page.locator("tr").filter({ hasText: brdId });
        await boardRow.getByRole('checkbox').click();

        // Boards master uses native window.confirm()
        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        await page.waitForLoadState('networkidle');
        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole("cell", { name: brdId })).toBeHidden({ timeout: 10000 });
    });
});
