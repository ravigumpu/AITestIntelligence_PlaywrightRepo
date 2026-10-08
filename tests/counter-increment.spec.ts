import { expect, test } from "@playwright/test";
import { expectCount, mountDemoPage, selectors } from "./support/demo-page";

test.describe("counter increment behavior", () => {
  test("increments counter six times from zero", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 0 });
    for (let i = 0; i < 6; i++) {
      await page.locator(selectors.incrementButton).click();
    }
    await expectCount(page, 6);
  });
});