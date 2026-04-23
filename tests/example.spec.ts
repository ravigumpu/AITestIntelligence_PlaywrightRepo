import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await expect(page).toHaveTitle(/Playwright/);
});

test("shows Playwright heading", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await expect(page.getByRole("heading", { name: /Playwright/ }).first()).toBeVisible();
});

test("get started link navigates to intro page", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await page.getByRole("link", { name: "Get started" }).click();
  await expect(page).toHaveURL(/.*intro/);
});

test("verify the title of the page", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await expect(page).toHaveTitle(/PlaywrightFAILBOT/);
});