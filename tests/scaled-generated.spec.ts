import { expect, test } from "@playwright/test";
import { mountDemoPage, selectors } from "./support/demo-page";

type StepAction = "increment" | "decrement";

function buildStepActions(increments: number, decrements: number): StepAction[] {
  return [
    ...Array.from({ length: increments }, () => "increment" as const),
    ...Array.from({ length: decrements }, () => "decrement" as const),
  ];
}

function expectedFromActions(initial: number, actions: StepAction[]): number {
  return actions.reduce((value, action) => value + (action === "increment" ? 1 : -1), initial);
}

test.describe("generated counter matrix", () => {
  const initialValues = [-10, -5, 0, 5, 10, 25, 50, 100];
  const actionPatterns = [
    buildStepActions(0, 0),
    buildStepActions(1, 0),
    buildStepActions(0, 1),
    buildStepActions(2, 1),
    buildStepActions(1, 2),
    buildStepActions(3, 3),
    buildStepActions(5, 2),
    buildStepActions(2, 5),
    buildStepActions(8, 0),
    buildStepActions(0, 8),
  ];

  for (const initial of initialValues) {
    for (const [patternIndex, actions] of actionPatterns.entries()) {
      test(`counter pattern ${patternIndex + 1} with initial ${initial}`, async ({ page }) => {
        await mountDemoPage(page, { initialCount: initial });
        for (const action of actions) {
          const button = action === "increment" ? selectors.incrementButton : selectors.decrementButton;
          await page.locator(button).click();
        }

        const expected = expectedFromActions(initial, actions);
        await expect(page.locator(selectors.count)).toHaveText(String(expected));
      });
    }
  }
});

test.describe("generated details visibility matrix", () => {
  const startsVisible = [true, false];
  const toggles = Array.from({ length: 40 }, (_, index) => index);

  for (const startVisible of startsVisible) {
    for (const toggleCount of toggles) {
      test(`details start=${startVisible} toggles=${toggleCount}`, async ({ page }) => {
        await mountDemoPage(page, { detailsVisible: startVisible });
        for (let index = 0; index < toggleCount; index += 1) {
          await page.locator(selectors.toggleDetailsButton).click();
        }

        const shouldBeVisible = startVisible ? toggleCount % 2 === 0 : toggleCount % 2 === 1;
        if (shouldBeVisible) {
          await expect(page.locator(selectors.details)).toBeVisible();
        } else {
          await expect(page.locator(selectors.details)).toBeHidden();
        }
      });
    }
  }
});

test.describe("generated list item matrix", () => {
  const values = [
    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
    "zeta",
    "eta",
    "theta",
    "iota",
    "kappa",
    "lambda",
    "mu",
    "nu",
    "xi",
    "omicron",
    "pi",
    "rho",
    "sigma",
    "tau",
    "upsilon",
    "phi",
    "chi",
    "psi",
    "omega",
  ];

  const defaultNames = ["Anonymous", "Guest", "Fallback", "Unknown", "N/A"];

  for (const defaultName of defaultNames) {
    for (const [index, value] of values.entries()) {
      test(`list add value=${value} default=${defaultName}`, async ({ page }) => {
        await mountDemoPage(page, { defaultName });
        await page.locator(selectors.nameInput).fill(value);
        await page.locator(selectors.addItemButton).click();
        await expect(page.locator(selectors.items).first()).toHaveText(value);
      });

      test(`list add blank uses default #${index + 1} default=${defaultName}`, async ({ page }) => {
        await mountDemoPage(page, { defaultName });
        await page.locator(selectors.nameInput).fill(" ");
        await page.locator(selectors.addItemButton).click();
        await expect(page.locator(selectors.items).first()).toHaveText(defaultName);
      });
    }
  }
});
