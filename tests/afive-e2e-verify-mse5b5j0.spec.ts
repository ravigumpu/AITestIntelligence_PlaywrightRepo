import { expect, test } from "@playwright/test";
import { mountDemoPage, selectors } from "./support/demo-page";

test("afive e2e verify: counter section visible", async ({ page }) => {
  await mountDemoPage(page);
  await expect(page.locator(selectors.incrementButton)).toBeVisible();
  await expect(page.locator(selectors.count)).toBeVisible();
});
