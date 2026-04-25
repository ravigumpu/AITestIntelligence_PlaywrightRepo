import { expect, test } from "@playwright/test";
import { mountDemoPage, selectors } from "./support/demo-page";

type LinkCase = {
  name: string;
  href: string;
};

type StepCase = {
  name: string;
  initialCount: number;
  stepValue: string;
  expectedCount: number;
};

const linkCases: LinkCase[] = [
  { name: "docs intro", href: "/docs/intro" },
  { name: "docs api", href: "/docs/api" },
  { name: "docs assertions", href: "/docs/test-assertions" },
  { name: "community page", href: "/community/welcome" },
  { name: "root path", href: "/" },
  { name: "nested path", href: "/guides/setup/quickstart" },
  { name: "path with query", href: "/docs/intro?lang=ts" },
  { name: "path with hash", href: "/docs/intro#overview" },
  { name: "path with query and hash", href: "/docs/intro?lang=js#usage" },
  { name: "relative file-like path", href: "/index.html" },
];

const stepCases: StepCase[] = [
  { name: "add 0 keeps count unchanged", initialCount: 2, stepValue: "0", expectedCount: 2 },
  { name: "add 1 increases count by one", initialCount: 2, stepValue: "1", expectedCount: 3 },
  { name: "add 2 increases count by two", initialCount: 2, stepValue: "2", expectedCount: 4 },
  { name: "add 5 increases count by five", initialCount: 2, stepValue: "5", expectedCount: 7 },
  { name: "subtract one via -1", initialCount: 2, stepValue: "-1", expectedCount: 1 },
  { name: "subtract three via -3", initialCount: 2, stepValue: "-3", expectedCount: -1 },
  { name: "large positive value", initialCount: 10, stepValue: "100", expectedCount: 110 },
  { name: "large negative value", initialCount: 10, stepValue: "-100", expectedCount: -90 },
  { name: "decimal value converts as number", initialCount: 10, stepValue: "1.5", expectedCount: 11.5 },
  { name: "empty value coerces to zero", initialCount: 10, stepValue: "", expectedCount: 10 },
];

test.describe("form and link configuration", () => {
  test("heading is always rendered", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.heading)).toHaveText("Playwright Demo App");
  });

  test("name input is visible and editable", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.nameInput)).toBeVisible();
    await page.locator(selectors.nameInput).fill("Sample User");
    await expect(page.locator(selectors.nameInput)).toHaveValue("Sample User");
  });

  test("step input is visible and editable", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.stepInput)).toBeVisible();
    await page.locator(selectors.stepInput).fill("9");
    await expect(page.locator(selectors.stepInput)).toHaveValue("9");
  });

  test("default docs link text is stable", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.docsLink)).toHaveText("Get started");
  });

  test("reset button is visible", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.resetButton)).toBeVisible();
  });

  for (const scenario of linkCases) {
    test(`docs link supports configuration: ${scenario.name}`, async ({ page }) => {
      await mountDemoPage(page, { docsHref: scenario.href });
      await expect(page.locator(selectors.docsLink)).toHaveAttribute("href", scenario.href);
    });
  }

  for (const scenario of stepCases) {
    test(`step input applies value: ${scenario.name}`, async ({ page }) => {
      await mountDemoPage(page, { initialCount: scenario.initialCount });
      await page.locator(selectors.stepInput).fill(scenario.stepValue);
      await page.locator(selectors.applyStepButton).click();
      await expect(page.locator(selectors.count)).toHaveText(String(scenario.expectedCount));
    });
  }
});
