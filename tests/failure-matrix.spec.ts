import { expect, test } from "@playwright/test";
import { mountDemoPage, selectors } from "./support/demo-page";

test.describe("intentional failure matrix", () => {
  // 1) Common assertion mismatches (10 failures)
  for (let index = 1; index <= 10; index += 1) {
    test(`common assertion mismatch #${index}`, async ({ page }) => {
      await mountDemoPage(page, { initialCount: index });
      await expect(page.locator(selectors.count)).toHaveText(String(index + 1000));
    });
  }

  // 2) Visibility expectation mismatches (10 failures)
  for (let index = 1; index <= 10; index += 1) {
    test(`visibility mismatch #${index}`, async ({ page }) => {
      await mountDemoPage(page, { detailsVisible: false });
      await expect(page.locator(selectors.details)).toBeVisible();
    });
  }

  // 3) Timeout failures with impossible condition (10 failures)
  for (let index = 1; index <= 10; index += 1) {
    test(`timeout waiting for impossible condition #${index}`, async ({ page }) => {
      await mountDemoPage(page, { initialCount: index });
      await page.waitForFunction(
        () => document.querySelector('[data-testid="count"]')?.textContent === "never-true",
        undefined,
        { timeout: 150 }
      );
      await expect(page.locator(selectors.count)).toHaveText("never-true");
    });
  }

  // 4) Wrong collection/count assumptions (10 failures)
  for (let index = 1; index <= 10; index += 1) {
    test(`list count mismatch #${index}`, async ({ page }) => {
      await mountDemoPage(page);
      await page.locator(selectors.nameInput).fill(`item-${index}`);
      await page.locator(selectors.addItemButton).click();
      await expect(page.locator(selectors.items)).toHaveCount(5);
    });
  }

  // 5) Explicit thrown/rejected failures (12 failures)
  for (let index = 1; index <= 6; index += 1) {
    test(`explicit thrown error #${index}`, async ({ page }) => {
      await mountDemoPage(page);
      throw new Error(`Intentional thrown failure ${index}`);
    });
  }

  for (let index = 1; index <= 6; index += 1) {
    test(`explicit rejected promise #${index}`, async ({ page }) => {
      await mountDemoPage(page);
      await Promise.reject(new Error(`Intentional rejected failure ${index}`));
    });
  }
});
