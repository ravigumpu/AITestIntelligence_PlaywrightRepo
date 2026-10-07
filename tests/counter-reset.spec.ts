import { expect, test } from "@playwright/test";
import { expectCount, mountDemoPage, selectors } from "./support/demo-page";

test.describe("counter reset behavior", () => {
  test("counter resets to zero", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 5 });
    await page.locator(selectors.incrementButton).click();
    await page.locator(selectors.incrementButton).click();
    await expectCount(page, 7);
    await page.locator(selectors.resetButton).click();
    await expectCount(page, 5);
  });
});