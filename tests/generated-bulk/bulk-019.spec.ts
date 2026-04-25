import { expect, test } from "@playwright/test";
import { mountDemoPage, selectors } from "../support/demo-page";

test.describe("bulk generated suite 019", () => {
  test("count starts at configured seed", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 19 });
    await expect(page.locator(selectors.count)).toHaveText("19");
  });

  test("increment updates count", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 19 });
    await page.locator(selectors.incrementButton).click();
    await expect(page.locator(selectors.count)).toHaveText("20");
  });

  test("decrement updates count", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 19 });
    await page.locator(selectors.decrementButton).click();
    await expect(page.locator(selectors.count)).toHaveText("18");
  });

  test("toggle details visibility", async ({ page }) => {
    await mountDemoPage(page, { detailsVisible: false });
    await page.locator(selectors.toggleDetailsButton).click();
    await expect(page.locator(selectors.details)).toBeVisible();
  });

  test("add list item with deterministic value", async ({ page }) => {
    await mountDemoPage(page);
    await page.locator(selectors.nameInput).fill("bulk-item-019");
    await page.locator(selectors.addItemButton).click();
    await expect(page.locator(selectors.items).first()).toHaveText("bulk-item-019");
  });
});
