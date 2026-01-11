import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("Role Management", () => {
    test("should manage roles (create, search, delete)", async ({ page, authenticatedPage }) => {
        await page.goto("/roles");

        // 1. Verify Role List
        await expect(page.locator("table")).toBeVisible();
        await expect(page.getByRole("button", { name: "조회" })).toBeVisible();

        const timestamp = Date.now();
        const roleId = `ROLE_TEST_${timestamp}`;
        const roleName = `Test Role ${timestamp}`;

        // 2. Create Role
        await page.click('button:has-text("추가")');

        await expect(page.getByText("권한 ID")).toBeVisible();

        await page.fill('input[name="roleId"]', roleId);
        await page.fill('input[name="roleName"]', roleName);
        await page.fill('textarea[name="roleDesc"]', "Test Description");

        // Select a menu permission if possible (first checkbox in the tree)
        // Targeted locator for the menu tree container
        // The container has max-h-[300px] class, but let's be more specific by finding the form item
        const menuTreeContainer = page.locator('div.border.rounded-lg.max-h-\\[300px\\]');
        // Click the checkbox element directly or its wrapper. 
        // Trying click() on the input might work better if it's a controlled component that doesn't respond to 'check' event consistently
        await menuTreeContainer.locator('input[type="checkbox"]').first().click({ force: true });

        await page.click('button[type="submit"]');

        // Wait for list update
        await expect(page.getByText("권한 ID")).not.toBeVisible();

        // 3. Search for the role
        await page.fill('input[placeholder="권한 아이디 입력"]', roleId);
        await page.click('button:has-text("조회")');

        // Verify role in table
        await expect(page.getByRole("cell", { name: roleId })).toBeVisible();
        await expect(page.getByRole("cell", { name: roleName })).toBeVisible();

        // 4. Delete Role
        // Select row
        const roleRow = page.locator("tr", { has: page.locator("td", { hasText: roleId }) });
        await roleRow.locator('input[type="checkbox"]').check();

        // Click delete
        // Handle dialog BEFORE click
        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        // Verify role is gone
        await expect(page.getByRole("cell", { name: roleId })).not.toBeVisible();
    });
});
