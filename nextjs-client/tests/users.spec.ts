import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("User Management", () => {
    test("should manage users (create, search, delete)", async ({ page, authenticatedPage }) => {
        await page.goto("/users");

        // 1. Verify User List 
        await expect(page.locator("table")).toBeVisible();
        await expect(page.getByRole("button", { name: "조회" })).toBeVisible();

        const timestamp = Date.now();
        const userId = `user_${timestamp}`;
        const userName = `Test User ${timestamp}`;
        const userEmail = `user${timestamp}@example.com`;

        // 2. Create User
        // Click Add button (ActionButtons component usually has '추가' text)
        await page.click('button:has-text("추가")');

        await expect(page.getByText("초기 비밀번호")).toBeVisible();

        await page.fill('input[name="userId"]', userId);
        await page.fill('input[name="userName"]', userName);
        await page.fill('input[name="userNick"]', "Tester");
        await page.fill('input[name="userEmail"]', userEmail);
        await page.fill('input[name="userPwd"]', "password123!");

        // Select a Role (assuming ROLE_USER or similar exists)
        // If roles are loaded dynamically, we might need to wait or verify
        // Let's select the first available role if specific names are not guaranteed
        // Or assume ROLE_ADMIN exists as per seed data
        const roleCheckbox = page.locator('input[type="checkbox"][name="roleIds"]').first();
        // Or find by label text if possible for better stability
        // await page.locator('label', { hasText: 'ROLE_ADMIN' }).locator('input[type="checkbox"]').check();
        // Let's just click the first available role checkbox to be safe
        await roleCheckbox.check();

        await page.click('button[type="submit"]');

        // Wait for dialog or form to close/submit
        // The list should refresh.
        // Dialog close might take animation time.
        await expect(page.getByText("초기 비밀번호")).not.toBeVisible();

        // 3. Search for the user
        await page.fill('input[placeholder="사용자명 입력"]', userName);
        await page.click('button:has-text("조회")');

        // Verify user in table
        await expect(page.getByRole("cell", { name: userId })).toBeVisible();
        await expect(page.getByRole("cell", { name: userName })).toBeVisible();
        // Check email cell
        await expect(page.getByRole("cell", { name: userEmail })).toBeVisible();

        // 4. Delete User
        // Click the checkbox for the created user
        // Find row with userId, then find checkbox in that row
        const userRow = page.locator("tr", { has: page.locator("td", { hasText: userId }) });
        await userRow.locator('input[type="checkbox"]').check();

        // Click delete
        // Handle dialog BEFORE click
        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        // Verify user is gone
        // Wait for table to reload
        await expect(page.getByRole("cell", { name: userId })).not.toBeVisible();
    });
});
