import { expect, test } from "@playwright/test";
import { mountDemoPage, selectors } from "../support/demo-page";

test.describe("bulk generated suite 060", () => {
  test("count starts at configured seed", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 60 });
    await expect(page.locator(selectors.count)).toHaveText("60");
  });

  test("increment updates count", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 60 });
    await page.locator(selectors.incrementButton).click();
    await expect(page.locator(selectors.count)).toHaveText("61");
  });

  test("decrement updates count", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 60 });
    await page.locator(selectors.decrementButton).click();
    await expect(page.locator(selectors.count)).toHaveText("59");
  });

  test("toggle details visibility", async ({ page }) => {
    await mountDemoPage(page, { detailsVisible: false });
    await page.locator(selectors.toggleDetailsButton).click();
    await expect(page.locator(selectors.details)).toBeVisible();
  });

  test("add list item with deterministic value", async ({ page }) => {
    await mountDemoPage(page);
    await page.locator(selectors.nameInput).fill("bulk-item-060");
    await page.locator(selectors.addItemButton).click();
    await expect(page.locator(selectors.items).first()).toHaveText("bulk-item-060");
  });
});
