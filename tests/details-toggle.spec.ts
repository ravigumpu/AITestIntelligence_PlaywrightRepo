import { expect, test } from "@playwright/test";
import { mountDemoPage, selectors } from "./support/demo-page";

type ToggleCase = {
  name: string;
  initialVisible?: boolean;
  toggles: number;
  expectedVisible: boolean;
};

const toggleCases: ToggleCase[] = [
  { name: "no toggle keeps hidden by default", toggles: 0, expectedVisible: false },
  { name: "single toggle shows details", toggles: 1, expectedVisible: true },
  { name: "double toggle hides details", toggles: 2, expectedVisible: false },
  { name: "triple toggle shows details", toggles: 3, expectedVisible: true },
  { name: "quadruple toggle hides details", toggles: 4, expectedVisible: false },
  { name: "five toggles show details", toggles: 5, expectedVisible: true },
  { name: "initial visible with no toggles stays visible", initialVisible: true, toggles: 0, expectedVisible: true },
  { name: "initial visible with one toggle hides", initialVisible: true, toggles: 1, expectedVisible: false },
  { name: "initial visible with two toggles shows", initialVisible: true, toggles: 2, expectedVisible: true },
  { name: "initial visible with three toggles hides", initialVisible: true, toggles: 3, expectedVisible: false },
];

const stressCases: ToggleCase[] = [
  { name: "ten toggles from hidden ends hidden", toggles: 10, expectedVisible: false },
  { name: "eleven toggles from hidden ends visible", toggles: 11, expectedVisible: true },
  { name: "ten toggles from visible ends visible", initialVisible: true, toggles: 10, expectedVisible: true },
  { name: "eleven toggles from visible ends hidden", initialVisible: true, toggles: 11, expectedVisible: false },
  { name: "twenty toggles from hidden ends hidden", toggles: 20, expectedVisible: false },
  { name: "twenty one toggles from hidden ends visible", toggles: 21, expectedVisible: true },
  { name: "twenty toggles from visible ends visible", initialVisible: true, toggles: 20, expectedVisible: true },
  { name: "twenty one toggles from visible ends hidden", initialVisible: true, toggles: 21, expectedVisible: false },
  { name: "thirty toggles from hidden ends hidden", toggles: 30, expectedVisible: false },
  { name: "thirty one toggles from hidden ends visible", toggles: 31, expectedVisible: true },
];

test.describe("details toggle behavior", () => {
  test("toggle button is visible", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.toggleDetailsButton)).toBeVisible();
  });

  test("details section exists in DOM", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.details)).toHaveCount(1);
  });

  test("details text content is stable when hidden", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.details)).toContainText("Extra details");
  });

  test("details text content remains after showing", async ({ page }) => {
    await mountDemoPage(page);
    await page.locator(selectors.toggleDetailsButton).click();
    await expect(page.locator(selectors.details)).toContainText("Extra details");
  });

  test("details text content remains after show and hide", async ({ page }) => {
    await mountDemoPage(page);
    await page.locator(selectors.toggleDetailsButton).click();
    await page.locator(selectors.toggleDetailsButton).click();
    await expect(page.locator(selectors.details)).toContainText("Extra details");
  });

  for (const scenario of toggleCases) {
    test(`toggle scenario: ${scenario.name}`, async ({ page }) => {
      await mountDemoPage(page, { detailsVisible: scenario.initialVisible });
      for (let index = 0; index < scenario.toggles; index += 1) {
        await page.locator(selectors.toggleDetailsButton).click();
      }

      if (scenario.expectedVisible) {
        await expect(page.locator(selectors.details)).toBeVisible();
      } else {
        await expect(page.locator(selectors.details)).toBeHidden();
      }
    });
  }

  for (const scenario of stressCases) {
    test(`toggle stress scenario: ${scenario.name}`, async ({ page }) => {
      await mountDemoPage(page, { detailsVisible: scenario.initialVisible });
      for (let index = 0; index < scenario.toggles; index += 1) {
        await page.locator(selectors.toggleDetailsButton).click();
      }

      if (scenario.expectedVisible) {
        await expect(page.locator(selectors.details)).toBeVisible();
      } else {
        await expect(page.locator(selectors.details)).toBeHidden();
      }
    });
  }
});
