import { test, expect } from "./fixtures/auth";

test.describe("Order Management", () => {
    test.beforeEach(async ({ authenticatedPage, page }) => {
        await page.goto("/orders");
    });

    test("should perform CRUD operations on orders", async ({ page }) => {
        const timestamp = Date.now();
        const orderId = `ORD-${timestamp}`;
        const custNm = "Test Customer";
        const orderNm = `Test Order ${timestamp}`;
        const updatedCustNm = `Updated Customer ${timestamp}`;

        // 1. Create Order
        await test.step("Create Order", async () => {
            await page.click('button:has-text("추가")'); // Click "Add" button

            await expect(page.getByText("주문 등록")).toBeVisible();

            await page.fill('input[name="orderId"]', orderId);
            await page.fill('input[name="custNm"]', custNm);
            await page.fill('input[name="orderNm"]', orderNm);

            // Select Status
            await page.getByRole("combobox", { name: "주문 상태" }).click();
            await page.getByRole("option", { name: "주문됨" }).click();

            await page.fill('input[name="orderAmt"]', "10000");

            // Set Date (Current time)
            const now = new Date();
            const dateString = now.toISOString().slice(0, 16);
            await page.fill('input[name="orderDate"]', dateString);

            // Select Use Y/N
            await page.getByRole("combobox", { name: "사용 여부" }).click();
            await page.getByRole("option", { name: "사용", exact: true }).click();


            await page.click('button[type="submit"]:has-text("등록")');

            // Verify Success
            await expect(page.getByText("새 주문이 등록되었습니다.")).toBeVisible();
            await expect(page.getByText("주문 등록")).not.toBeVisible();

            // Search and Verify in List
            await page.fill('input[placeholder="고객명 입력"]', custNm);
            await page.keyboard.press("Enter");
            await expect(page.getByRole("cell", { name: orderId })).toBeVisible();
            await expect(page.getByRole("cell", { name: orderNm })).toBeVisible();
        });

        // 2. Update Order
        await test.step("Update Order", async () => {
            // Select the row (assuming it's the first one after search)
            await page.click(`tr:has-text("${orderId}")`);

            await page.click('button:has-text("수정")');
            await expect(page.getByText("주문 수정")).toBeVisible();

            await page.fill('input[name="custNm"]', updatedCustNm);
            await page.click('button[type="submit"]:has-text("수정")');

            // Verify Success
            await expect(page.getByText("주문 정보가 수정되었습니다.")).toBeVisible();
            await expect(page.getByText("주문 수정")).not.toBeVisible();

            // Refresh Search
            await page.fill('input[placeholder="고객명 입력"]', updatedCustNm);
            await page.keyboard.press("Enter");

            // Verify Update in List
            await expect(page.getByRole("cell", { name: updatedCustNm })).toBeVisible();
        });

        // 3. Delete Order
        await test.step("Delete Order", async () => {
            const row = page.locator(`tr:has-text("${orderId}")`);
            const dataState = await row.getAttribute("data-state");
            if (!dataState?.includes("selected")) {
                await row.click();
            }

            // Setup dialog listener
            page.once("dialog", dialog => dialog.accept());

            await page.click('button:has-text("삭제")');

            // Verify Success
            await expect(page.getByText("1개의 주문이 삭제되었습니다.")).toBeVisible();

            // Verify Removal
            await expect(page.getByRole("cell", { name: orderId })).not.toBeVisible();
        });
    });
});
