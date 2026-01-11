import { expect } from "@playwright/test";
import { test } from "./fixtures/auth";

test.describe("Menu Management", () => {
    test("should manage menus (create, update, delete)", async ({ page, authenticatedPage }) => {
        await page.goto("/menus");

        // 1. Verify Tree is visible
        await expect(page.locator("span.text-base", { hasText: "최상위메뉴" })).toBeVisible();

        // Use a unique ID for the test menu to avoid conflicts
        const timestamp = Date.now();
        const rootMenuId = `TEST_ROOT_${timestamp}`;
        const rootMenuName = `Test Root ${timestamp}`;
        const childMenuId = `TEST_CHILD_${timestamp}`;
        const childMenuName = `Test Child ${timestamp}`;

        // 2. Create Root Menu
        await page.getByLabel("최상위 메뉴 추가").click();

        await page.fill('input[name="menuId"]', rootMenuId);
        await page.fill('input[name="menuName"]', rootMenuName);
        await page.fill('input[name="menuUri"]', "/test-root");
        await page.fill('input[name="menuLvl"]', "1");
        await page.fill('input[name="menuSeq"]', "1");

        // Save
        await page.click('button[type="submit"]');

        // Verify Root Menu appears in tree
        // Filter by class to avoid matching the option in the select box
        const rootMenuLocator = page.locator("span.flex-1.truncate", { hasText: rootMenuName });
        await expect(rootMenuLocator).toBeVisible();

        // 3. Create Child Menu
        // Hover over the root menu item to reveal the + button
        await rootMenuLocator.hover();
        // Click the + button next to the root menu. 
        // Logic: find the container of the root menu item, then find the plus button inside it.
        // Based on menu-tree.tsx, the plus button is a sibling in the flex container.
        // We can traverse up to the parent div and find the button with Plus icon.
        // Or cleaner: Click the item to select it, then maybe the Add Child button appears? 
        // No, the code says `opacity-0 group-hover:opacity-100` for the Plus button. 
        // So hovering is key.
        await rootMenuLocator.locator("xpath=..").locator("button:has(svg.lucide-plus)").click();

        // Form should be cleared/ready for child
        await expect(page.getByText("Add Child Menu")).toBeVisible();

        await page.fill('input[name="menuId"]', childMenuId);
        await page.fill('input[name="menuName"]', childMenuName);
        await page.fill('input[name="menuUri"]', "/test-child");
        await page.fill('input[name="menuLvl"]', "2");
        await page.fill('input[name="menuSeq"]', "1");

        await page.click('button[type="submit"]');

        // Verify Child Menu appears
        const childMenuLocator = page.locator("span.flex-1.truncate", { hasText: childMenuName });

        // Use expand button if needed. The tree auto-expands on selection? 
        // `menu-tree.tsx` saves expanded state. 
        // If we added a child, we might need to expand the parent.
        // Let's check if the child is visible.
        // Note: The tree might require manual expansion if it was collapsed.
        // But usually, refreshing or state updates might reset or keep it.
        // Let's try expanding just in case if not visible.
        const expandButton = rootMenuLocator.locator("xpath=..").locator("button:has(svg.lucide-chevron-right)");
        if (await expandButton.isVisible()) {
            await expandButton.click();
        }
        await expect(childMenuLocator).toBeVisible();

        // 4. Update Child Menu
        await childMenuLocator.click();
        await page.fill('input[name="menuName"]', childMenuName + " Updated");
        await page.click('button[type="submit"]');

        const childMenuUpdatedLocator = page.locator("span.flex-1.truncate", { hasText: childMenuName + " Updated" });
        await expect(childMenuUpdatedLocator).toBeVisible();

        // 5. Delete Child Menu
        await childMenuUpdatedLocator.click();
        // Ensure delete button is visible (it should be when editing)
        // Handle dialog - MUST be set up before interaction
        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');

        // Wait for it to disappear
        await expect(childMenuUpdatedLocator).not.toBeVisible();

        // 6. Delete Root Menu
        await rootMenuLocator.click();
        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("삭제")');
        await expect(rootMenuLocator).not.toBeVisible();
    });
});
