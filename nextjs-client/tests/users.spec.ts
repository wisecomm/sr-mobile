import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("User Management", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test("should manage users (create, search, delete)", async ({ page, authenticatedPage }) => {
        await page.goto("/users");

        // 1. Verify User List 
        await expect(page.locator("table")).toBeVisible();

        const timestamp = Date.now();
        const userId = `user_${timestamp}`;
        const userName = `Test User ${timestamp}`;
        const userEmail = `user${timestamp}@example.com`;

        // 2. Create User
        await page.click('button:has-text("추가")');
        await expect(page.getByText("초기 비밀번호")).toBeVisible();

        await page.fill('input[name="userId"]', userId);
        await page.fill('input[name="userName"]', userName);
        await page.fill('input[name="userNick"]', "Tester");
        await page.fill('input[name="userEmail"]', userEmail);
        await page.fill('input[name="userPwd"]', "password123!");

        // Select a Role - use Radix UI checkbox
        const roleCheckboxes = page.locator('div.space-y-2').getByRole('checkbox');
        await roleCheckboxes.first().click();

        await page.click('button[type="submit"]');

        // Wait for dialog to close
        await expect(page.getByText("초기 비밀번호")).not.toBeVisible({ timeout: 10000 });

        // 3. Search for the user
        await page.fill('input[placeholder="사용자명 입력"]', userName);
        await page.click('button:has-text("조회")');

        // Verify user in table
        await expect(page.getByRole("cell", { name: userId })).toBeVisible({ timeout: 10000 });

        // 4. Delete User
        const userRow = page.locator("tr").filter({ hasText: userId });
        await userRow.getByRole('checkbox').click();

        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        await expect(page.getByRole("cell", { name: userId })).not.toBeVisible({ timeout: 10000 });
    });
});
