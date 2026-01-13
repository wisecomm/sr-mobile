
import { test, expect } from "./fixtures/auth";

test.describe("Order Management", () => {
    test.beforeEach(async ({ authenticatedPage, page }) => {
        // Ensure authentication
        void authenticatedPage;
        await page.goto("/orders");
    });

    test("should perform CRUD operations on orders", async ({ page }) => {
        const timestamp = Date.now();
        const orderId = `ORD-${timestamp}`;
        // Unique customer name to easily find the row
        const custNm = `Test Customer ${timestamp}`;
        const orderNm = `Test Order ${timestamp}`;
        const updatedCustNm = `Updated Customer ${timestamp}`;

        // 1. Create Order
        await test.step("Create Order", async () => {
            // Click "Add" (Korean: "추가")
            await page.click('button:has-text("추가")');

            // Verify dialog opens
            await expect(page.getByText("주문 등록")).toBeVisible();

            // Fill form
            await page.fill('input[name="orderId"]', orderId);
            await page.fill('input[name="custNm"]', custNm);
            await page.fill('input[name="orderNm"]', orderNm);

            // Select Status (ComboBox trigger -> Option)
            await page.getByRole("combobox", { name: "주문 상태" }).click();
            await page.getByRole("option", { name: "주문됨" }).click();

            await page.fill('input[name="orderAmt"]', "10000");

            // Set Date
            const now = new Date();
            const dateString = now.toISOString().slice(0, 16);
            await page.fill('input[name="orderDate"]', dateString);

            // Select Use Y/N
            await page.getByRole("combobox", { name: "사용 여부" }).click();
            await page.getByRole("option", { name: "사용", exact: true }).click();

            // Submit
            await page.click('button[type="submit"]:has-text("등록")');

            // Verify Success
            await expect(page.getByText("새 주문이 등록되었습니다.")).toBeVisible();
            await expect(page.getByText("주문 등록")).not.toBeVisible();

            // Search to verify in list
            // Assuming Search Toolbar exists with '고객명' placeholder
            await page.fill('input[placeholder="고객명 입력"]', custNm);
            await page.keyboard.press("Enter");

            // Wait for grid to update
            await page.waitForTimeout(500);

            // Verify Row exists
            await expect(page.getByRole("cell", { name: orderId })).toBeVisible();
            await expect(page.getByRole("cell", { name: custNm })).toBeVisible();
        });

        // 2. Update Order
        await test.step("Update Order", async () => {
            // Select the row we just created
            // Using specific text selector for the row
            const rowSelector = `tr:has-text("${orderId}")`;
            const row = page.locator(rowSelector).first();
            await expect(row).toBeVisible();

            // Click row to select it (if selection required for toolbar Edit)
            // The code implies selection model, so clicking row handles selection
            await row.click();

            // Small delay for selection state
            await page.waitForTimeout(200);

            // Click "Edit" (Korean: "수정") button in toolbar
            // Note: There might be two "수정" buttons (one in dialog, one in toolbar).
            // Toolbar buttons are usually distinguishable or we can use specific container
            // Based on prev context, toolbar has "수정"
            await page.click('button:has-text("수정")');

            // Verify Edit Dialog
            await expect(page.getByText("주문 수정")).toBeVisible();

            // Update Field
            await page.fill('input[name="custNm"]', updatedCustNm);

            // Wait before submit to avoid flake
            await page.waitForTimeout(500);

            // Submit Update
            await page.click('button[type="submit"]:has-text("수정")');

            // Verify Success
            await expect(page.getByText("주문 정보가 수정되었습니다.")).toBeVisible();
            await expect(page.getByText("주문 수정")).not.toBeVisible();

            // Search for updated name
            await page.fill('input[placeholder="고객명 입력"]', updatedCustNm);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(500);

            // Verify Updated Row
            await expect(page.getByRole("cell", { name: updatedCustNm })).toBeVisible();
        });

        // 3. Delete Order
        await test.step("Delete Order", async () => {
            const rowSelector = `tr:has-text("${orderId}")`;
            const row = page.locator(rowSelector).first();
            await expect(row).toBeVisible();

            // Select row if not selected
            const dataState = await row.getAttribute("data-state");
            if (!dataState?.includes("selected")) {
                await row.click();
            }

            // Handle Confirm Dialog
            page.once("dialog", dialog => dialog.accept());

            // Click "Delete" (Korean: "삭제") button in toolbar
            await page.click('button:has-text("삭제")');

            // Verify Success Toast
            await expect(page.getByText("1개의 주문이 삭제되었습니다.")).toBeVisible();

            // Verify Gone from List
            await expect(page.getByRole("cell", { name: orderId })).not.toBeVisible();
        });
    });
});
