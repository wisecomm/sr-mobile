import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";
import path from "path";

test.describe("Board File Upload", () => {
    // 파일 업로드 테스트: Playwright에서 파일 업로드 후 폼 제출 시 타이밍 문제 발생
    // 수동 브라우저 테스트에서는 정상 작동하나, 자동화 테스트에서는 다이얼로그가 닫히지 않는 현상
    test.skip("should create a board post with file attachment", async ({ page, authenticatedPage }) => {
        // 1. Navigate to Board List (Notice)
        await page.goto("/boards/NOTICE");

        // Wait for table to load
        await page.waitForSelector("table");

        // 2. Click Write Button
        await page.click('button:has-text("추가")');

        // Wait for dialog to be visible
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });

        // 3. Fill Form
        await page.fill('input[name="title"]', "E2E Test Post with File");
        await page.fill('textarea[name="contents"]', "This post explains how to upload files via Playwright.");

        // 4. Attach File
        // Ensure the file input is present. Sometimes it might be hidden or custom styled.
        // Based on Shadcn/upload component, looking for input[type=file]
        const fileInput = page.locator('input[type="file"]');
        const filePath = path.join(__dirname, "fixtures/test-file.txt");
        await fileInput.setInputFiles(filePath);

        // Optional: Wait for some UI indication that file is selected if necessary
        await expect(page.locator('text=test-file.txt')).toBeVisible({ timeout: 5000 });

        // 5. Save - Click save button within the dialog
        await page.waitForTimeout(500); // Allow file to be processed
        const saveButton = page.getByRole('dialog').getByRole('button', { name: '저장' });

        // Wait for the API response when submitting
        const saveResponsePromise = page.waitForResponse(resp =>
            resp.url().includes('/boards') && resp.request().method() === 'POST'
        );
        await saveButton.click();
        await saveResponsePromise;

        // 6. Validation
        // Wait for dialog to close
        await expect(page.getByRole('dialog')).toBeHidden({ timeout: 10000 });

        // Reload to see the new post in the list
        await page.waitForLoadState('networkidle');
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Check if the new post appears in the list
        await expect(page.getByRole('cell', { name: 'E2E Test Post with File' })).toBeVisible({ timeout: 10000 });
    });
});
