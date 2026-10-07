import { expect, test } from "@playwright/test";

test.describe("Playwright navigation", () => {
  test("navigates through documentation sections", async ({ page }) => {
    await page.goto("https://playwright.dev/");
    await page.getByRole("link", { name: "Docs" }).click();
    await expect(page).toHaveURL(/.*\/docs\/intro/);

    await page.getByRole("link", { name: "Writing tests" }).first().click();
    await expect(page).toHaveURL(/.*writing-tests/);

    await page.getByRole("link", { name: "Running and debugging tests" }).first().click();
    await expect(page).toHaveURL(/.*running-tests/);

    await page.goBack();
    await expect(page).toHaveURL(/.*writing-tests/);

    await page.goForward();
    await expect(page).toHaveURL(/.*running-tests/);
  });
});