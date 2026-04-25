import { expect, test } from "@playwright/test";
import { mountDemoPage, selectors } from "../support/demo-page";

test.describe("bulk generated suite 076", () => {
  test("count starts at configured seed", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 76 });
    await expect(page.locator(selectors.count)).toHaveText("76");
  });

  test("increment updates count", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 76 });
    await page.locator(selectors.incrementButton).click();
    await expect(page.locator(selectors.count)).toHaveText("77");
  });

  test("decrement updates count", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 76 });
    await page.locator(selectors.decrementButton).click();
    await expect(page.locator(selectors.count)).toHaveText("75");
  });

  test("toggle details visibility", async ({ page }) => {
    await mountDemoPage(page, { detailsVisible: false });
    await page.locator(selectors.toggleDetailsButton).click();
    await expect(page.locator(selectors.details)).toBeVisible();
  });

  test("add list item with deterministic value", async ({ page }) => {
    await mountDemoPage(page);
    await page.locator(selectors.nameInput).fill("bulk-item-076");
    await page.locator(selectors.addItemButton).click();
    await expect(page.locator(selectors.items).first()).toHaveText("bulk-item-076");
  });
});
