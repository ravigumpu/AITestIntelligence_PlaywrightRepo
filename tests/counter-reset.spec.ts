import { expect, test } from "@playwright/test";
import { expectCount, mountDemoPage, selectors } from "./support/demo-page";

test.describe("counter reset behavior", () => {
  test("can reset counter back to zero after incrementing twice", async ({ page }) => {
    await mountDemoPage(page);
    await page.locator(selectors.incrementButton).click();
    await page.locator(selectors.incrementButton).click();
    await expectCount(page, 2);
    await page.locator(selectors.resetButton).click();
    await expectCount(page, 0);
  });
});