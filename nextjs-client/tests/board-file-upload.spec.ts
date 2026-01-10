import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";
import path from "path";

test.describe("Board File Upload", () => {
    test("should create a board post with file attachment", async ({ page, authenticatedPage }) => {
        // 1. Navigate to Board List (Notice)
        await page.goto("/boards/board?brdId=NOTICE");

        // Wait for table to load
        await page.waitForSelector("table");

        // 2. Click Write Button
        const writeButton = page.locator('button:has-text("추가")').first();
        await writeButton.click();

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
        // await page.waitForSelector("text=test-file.txt"); 

        // 5. Save
        await page.click('button:has-text("저장")');

        // 6. Validation
        // Wait for dialog to close (check if dialog is detached or hidden)
        await expect(page.locator('div[role="dialog"]')).toHaveCount(0);

        // Check if the new post appears in the list (Top or reload)
        // Ideally, we search for the title
        await expect(page.locator(`text="E2E Test Post with File"`).first()).toBeVisible();
    });
});
