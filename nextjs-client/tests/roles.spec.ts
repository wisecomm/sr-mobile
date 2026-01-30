import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("Role Management", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test("should manage roles (create, search, delete)", async ({ page, authenticatedPage }) => {
        await page.goto("/roles");

        // 1. Verify Role List
        await expect(page.locator("table")).toBeVisible();

        const timestamp = Date.now();
        const roleId = `ROLE_TEST_${timestamp}`;
        const roleName = `Test Role ${timestamp}`;

        // 2. Create Role
        await page.click('button:has-text("추가")');
        await expect(page.getByText("권한 ID")).toBeVisible();

        await page.fill('input[name="roleId"]', roleId);
        await page.fill('input[name="roleName"]', roleName);
        await page.fill('textarea[name="roleDesc"]', "Test Description");

        // Select a menu permission (first checkbox in the tree)
        const menuTreeContainer = page.locator('div.border.rounded-lg.max-h-\\[300px\\]');
        await menuTreeContainer.getByRole('checkbox').first().click();

        await page.click('button[type="submit"]');

        // Wait for list update
        await expect(page.getByText("권한 ID")).not.toBeVisible({ timeout: 10000 });

        // 3. Search for the role
        await page.fill('input[placeholder="권한 아이디 입력"]', roleId);
        await page.click('button:has-text("조회")');

        // Verify role in table
        await expect(page.getByRole("cell", { name: roleId })).toBeVisible({ timeout: 10000 });

        // 4. Delete Role
        const roleRow = page.locator("tr").filter({ hasText: roleId });
        await roleRow.getByRole('checkbox').click();

        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        // Setup promise to wait for delete API
        const deleteResponsePromise = page.waitForResponse(
            resp => resp.url().includes('/roles') && resp.request().method() === 'DELETE'
        );

        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        await deleteResponsePromise;
        await page.waitForLoadState('networkidle');

        // Search again to verify deletion
        await page.fill('input[placeholder="권한 아이디 입력"]', roleId);
        await page.click('button:has-text("조회")');
        await page.waitForLoadState('networkidle');

        await expect(page.getByRole("cell", { name: roleId })).not.toBeVisible({ timeout: 10000 });
    });
});
