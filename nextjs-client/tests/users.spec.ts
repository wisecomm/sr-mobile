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

        // 4. Delete User - wait for delete API
        const userRow = page.locator("tr").filter({ hasText: userId });
        const checkbox = userRow.getByRole('checkbox');
        await checkbox.click();
        await expect(checkbox).toBeChecked();

        // Wait for grid selection state to update
        await page.waitForTimeout(500);

        // Check if delete button triggers toast (selection failure) or request
        const deleteRequestPromise = page.waitForRequest(
            req => req.url().includes('/users') && req.method() === 'DELETE'
        ).catch(() => null); // Allow timeout without failing immediately to check toast

        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        // Check for failure toast
        const failureToast = page.getByText("삭제할 사용자를 선택해주세요."); // Users page toast text (needs verification of exact text)
        if (await failureToast.isVisible()) {
            throw new Error("Selection failed: '삭제할 사용자를 선택해주세요.' toast visible");
        }

        const request = await deleteRequestPromise;
        if (!request) {
            // Check if confirmation dialog actually happened?
            // If request didn't happen and no toast, maybe dialog wasn't accepted?
            // Re-try with reload approach if this continues failing.
            throw new Error("DELETE request was not sent within timeout");
        }

        const deleteResponsePromise = page.waitForResponse(
            resp => resp.url().includes('/users') && resp.request().method() === 'DELETE'
        );
        await deleteResponsePromise;
        await page.waitForLoadState('networkidle');

        // 5. Verify deletion - search again for deleted user
        await page.fill('input[placeholder="사용자명 입력"]', userName);
        await page.click('button:has-text("조회")');
        await page.waitForLoadState('networkidle');

        // Deleted user should not appear in results
        await expect(page.getByRole("cell", { name: userId })).not.toBeVisible({ timeout: 10000 });
    });
});
