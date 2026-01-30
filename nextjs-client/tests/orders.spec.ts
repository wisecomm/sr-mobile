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
        await expect(page.locator('.ag-root-wrapper')).toBeVisible({ timeout: 10000 });

        // 1. Create Order
        await page.getByRole('button', { name: '추가' }).click({ force: true });
        await expect(page.getByText('주문 추가')).toBeVisible();

        await page.fill('input[name="orderId"]', uniqueId);
        await page.fill('input[name="custNm"]', custNm);
        await page.fill('input[name="orderNm"]', 'Test Product');
        await page.fill('input[name="orderAmt"]', '10000');
        // Date is defaulted to today

        await page.getByRole('button', { name: '저장' }).click();

        // Verify toast or dialog close
        await expect(page.getByRole('dialog')).toBeHidden();

        // 2. Read / Search
        // Verify via Network Response to avoid UI overlay flakes
        const searchResponsePromise = page.waitForResponse(response =>
            response.url().includes('/orders') &&
            response.status() === 200 &&
            response.request().method() === 'GET'
        );

        // Search broadly (no custNm filter)
        // await page.fill('input[placeholder="고객명 입력"]', custNm);
        await page.keyboard.press('Enter');

        const response = await searchResponsePromise;
        const body = await response.json();

        // Assert backend returned the data
        expect(JSON.stringify(body)).toContain(uniqueId);

        // 3. Update Order
        await page.getByText(uniqueId).click();
        await page.waitForTimeout(500);
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

        // Reload to ensure data persisted (and verify via GET)
        const getAfterUpdatePromise = page.waitForResponse(response =>
            response.url().includes('/orders') && response.request().method() === 'GET' && response.status() === 200
        );
        await page.reload();
        const getResponse = await getAfterUpdatePromise;
        const getBody = await getResponse.json();

        // Verify update in the list data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedItem = getBody.data.list.find((item: any) => item.orderId === uniqueId);
        expect(updatedItem).toBeTruthy();
        expect(updatedItem.orderAmt).toBe(20000);

        // 4. Delete Order
        // Listen for Delete API validation
        const deleteResponsePromise = page.waitForResponse(response =>
            response.url().includes('/orders') && response.request().method() === 'DELETE' && response.status() === 200
        );

        // UI Interaction for delete
        // We know the item is in the list (verified by API).
        // UI might be slow, so we wait for grid container
        await expect(page.locator('.ag-center-cols-container')).toBeVisible({ timeout: 10000 });
        await page.getByText(uniqueId).click();
        await page.waitForTimeout(500);

        page.once('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: '삭제' }).click();
        await deleteResponsePromise; // Verify DELETE succeeded

        // Final verify: Item gone
        const finalGetPromise = page.waitForResponse(response =>
            response.url().includes('/orders') && response.request().method() === 'GET' && response.status() === 200
        );
        await page.reload();
        const finalBody = await (await finalGetPromise).json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const deletedItem = finalBody.data.list.find((item: any) => item.orderId === uniqueId);
        expect(deletedItem).toBeUndefined();
    });
});
