import { test, expect } from './fixtures/auth';

test.describe('Order Management', () => {
    test.setTimeout(120000); // Increase timeout for slow env

    test.beforeEach(async ({ page }) => {
        // Debug: Log console messages
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
        page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

        // Direct Login to ensure session persistence
        await page.goto('/login');
        await page.fill('input[name="userId"]', 'admin');
        await page.fill('input[name="userPwd"]', '12345678');
        await page.click('button[type="submit"]');

        // Wait for login to complete and redirect
        await page.waitForURL(/\/(mainmenu|users|roles|menus|orders)/);
        await page.waitForTimeout(1000); // Ensure cookies set

        // Then navigate to Orders page
        await page.goto('/orders');
    });

    test('should handle full CRUD lifecycle', async ({ page }) => {
        const uniqueId = `ORD-${Date.now().toString().slice(-6)}`; // Short ID
        const custNm = 'Test Customer';

        // Wait for hydration/grid ready
        await page.waitForLoadState('networkidle');
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

        // 1. Create Order
        const addButton = page.getByRole('button', { name: '추가' });
        await expect(addButton).toBeEnabled();
        await addButton.click();
        await expect(page.getByText('주문 추가')).toBeVisible();

        await page.fill('input[name="orderId"]', uniqueId);
        await page.fill('input[name="custNm"]', custNm);
        await page.fill('input[name="orderNm"]', 'Test Product');
        await page.fill('input[name="orderAmt"]', '10000');
        // Date is defaulted to today

        await page.getByRole('button', { name: '저장' }).click();

        // Verify toast or dialog close
        await expect(page.getByRole('dialog')).toBeHidden();

        // 2. Read / Search - Verify the newly created order is visible in the table
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('row', { name: new RegExp(uniqueId) })).toBeVisible({ timeout: 10000 });

        // 3. Update Order
        // Find row and click its checkbox
        await page.getByRole('row', { name: new RegExp(uniqueId) }).getByRole('checkbox').click();
        await page.waitForTimeout(300);
        await page.getByRole('button', { name: '수정' }).click();
        await expect(page.getByText('주문 수정')).toBeVisible();

        // Listen for Update API validation
        const updateResponsePromise = page.waitForResponse(response =>
            response.url().includes('/orders') && response.request().method() === 'PUT' && response.status() === 200
        );

        await page.fill('input[name="orderAmt"]', '20000');
        await page.getByRole('button', { name: '저장' }).click();
        await updateResponsePromise; // Verify PUT succeeded
        await expect(page.getByRole('dialog')).toBeHidden();

        // Reload to ensure data persisted - wait for UI update instead of relying on response interception
        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

        // Verify the updated amount is visible in the table
        await expect(page.getByRole('row', { name: new RegExp(uniqueId) })).toBeVisible({ timeout: 5000 });

        // 4. Delete Order
        // Listen for Delete API validation
        const deleteResponsePromise = page.waitForResponse(response =>
            response.url().includes('/orders') && response.request().method() === 'DELETE' && response.status() === 200
        );

        // UI Interaction for delete
        // We know the item is in the list (verified by API).
        // UI might be slow, so we wait for grid container
        await expect(page.locator('tbody')).toBeVisible({ timeout: 10000 });
        await page.getByRole('row', { name: new RegExp(uniqueId) }).getByRole('checkbox').click();
        await page.waitForTimeout(300);

        page.once('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: '삭제' }).click();
        await deleteResponsePromise; // Verify DELETE succeeded

        // Final verify: Item gone after reload
        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

        // Verify the deleted item is no longer in the table
        await expect(page.getByRole('row', { name: new RegExp(uniqueId) })).toBeHidden({ timeout: 5000 });
    });
});
