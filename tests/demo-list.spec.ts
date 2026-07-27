import { expect, test } from "@playwright/test";
import { mountDemoPage, selectors, expectCount } from "./support/demo-page";

test("add item labeled Phase3ResetCheck and clear the list", async ({ page }) => {
  await mountDemoPage(page);
  await page.locator(selectors.nameInput).fill("Phase3ResetCheck");
  await page.locator(selectors.addItemButton).click();
  const items = await page.locator(selectors.items).allTextContents();
  expect(items).toContain("Phase3ResetCheck");

  await page.locator(selectors.clearItemsButton).click();
  const clearedItems = await page.locator(selectors.items).allTextContents();
  expect(clearedItems).toEqual([]);
});