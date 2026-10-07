import { expect, test } from "@playwright/test";
import { expectCount, mountDemoPage, selectors } from "./support/demo-page";

test("sets step to 3 and applies it twice, adds an item, toggles details, and resets", async ({ page }) => {
  await mountDemoPage(page);
  await page.locator(selectors.stepInput).fill("3");
  await page.locator(selectors.applyStepButton).click();
  await page.locator(selectors.applyStepButton).click();
  await expectCount(page, 6);

  await page.locator(selectors.nameInput).fill("Release");
  await page.locator(selectors.addItemButton).click();
  const items = await page.locator(selectors.items).allTextContents();
  expect(items).toContain("Release");

  await page.locator(selectors.toggleDetailsButton).click();
  await expect(page.locator(selectors.details)).toBeVisible();

  await page.locator(selectors.resetButton).click();
  await expectCount(page, 0);
  const itemsAfterReset = await page.locator(selectors.items).allTextContents();
  expect(itemsAfterReset).toContain("Release");
  await expect(page.locator(selectors.details)).toBeVisible();
});