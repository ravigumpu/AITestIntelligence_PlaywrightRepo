import { expect, test } from "@playwright/test";
import { expectCount, mountDemoPage, selectors } from "./support/demo-page";

test.describe("counter increment behavior", () => {
  test("increments counter three times from zero", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 0 });
    await page.locator(selectors.incrementButton).click();
    await page.locator(selectors.incrementButton).click();
    await page.locator(selectors.incrementButton).click();
    await expectCount(page, 3);
  });
});