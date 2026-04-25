import { expect, test } from "@playwright/test";
import { expectCount, mountDemoPage, selectors } from "./support/demo-page";

type CounterCase = {
  name: string;
  initialCount?: number;
  steps: Array<"increment" | "decrement">;
  expected: number;
};

const incrementalCases: CounterCase[] = [
  { name: "single increment", steps: ["increment"], expected: 1 },
  { name: "double increment", steps: ["increment", "increment"], expected: 2 },
  { name: "triple increment", steps: ["increment", "increment", "increment"], expected: 3 },
  { name: "single decrement", steps: ["decrement"], expected: -1 },
  { name: "double decrement", steps: ["decrement", "decrement"], expected: -2 },
  { name: "increment then decrement", steps: ["increment", "decrement"], expected: 0 },
  { name: "decrement then increment", steps: ["decrement", "increment"], expected: 0 },
  { name: "two up one down", steps: ["increment", "increment", "decrement"], expected: 1 },
  { name: "one up two down", steps: ["increment", "decrement", "decrement"], expected: -1 },
  { name: "four up two down", steps: ["increment", "increment", "increment", "increment", "decrement", "decrement"], expected: 2 },
];

const initialStateCases: CounterCase[] = [
  { name: "start at 5 and increment once", initialCount: 5, steps: ["increment"], expected: 6 },
  { name: "start at 5 and decrement once", initialCount: 5, steps: ["decrement"], expected: 4 },
  { name: "start at -3 and increment twice", initialCount: -3, steps: ["increment", "increment"], expected: -1 },
  { name: "start at -3 and decrement twice", initialCount: -3, steps: ["decrement", "decrement"], expected: -5 },
  { name: "start at 10 and mixed updates", initialCount: 10, steps: ["decrement", "increment", "increment"], expected: 11 },
  { name: "start at 1 and no clicks", initialCount: 1, steps: [], expected: 1 },
  { name: "start at 0 and five increments", initialCount: 0, steps: ["increment", "increment", "increment", "increment", "increment"], expected: 5 },
  { name: "start at 0 and five decrements", initialCount: 0, steps: ["decrement", "decrement", "decrement", "decrement", "decrement"], expected: -5 },
  { name: "start at 2 and net zero", initialCount: 2, steps: ["increment", "decrement", "increment", "decrement"], expected: 2 },
  { name: "start at 100 and net minus three", initialCount: 100, steps: ["decrement", "decrement", "decrement"], expected: 97 },
];

test.describe("counter behavior", () => {
  test("counter section is visible and accessible", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.incrementButton)).toBeVisible();
    await expect(page.locator(selectors.decrementButton)).toBeVisible();
    await expect(page.locator(selectors.count)).toBeVisible();
  });

  test("reset returns counter to initial value", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 7 });
    await page.locator(selectors.incrementButton).click();
    await page.locator(selectors.incrementButton).click();
    await expectCount(page, 9);
    await page.locator(selectors.resetButton).click();
    await expectCount(page, 7);
  });

  test("apply-step uses default step value of one", async ({ page }) => {
    await mountDemoPage(page);
    await page.locator(selectors.applyStepButton).click();
    await expectCount(page, 1);
  });

  test("apply-step can add positive values", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 2 });
    await page.locator(selectors.stepInput).fill("5");
    await page.locator(selectors.applyStepButton).click();
    await expectCount(page, 7);
  });

  test("apply-step can add negative values", async ({ page }) => {
    await mountDemoPage(page, { initialCount: 2 });
    await page.locator(selectors.stepInput).fill("-3");
    await page.locator(selectors.applyStepButton).click();
    await expectCount(page, -1);
  });

  for (const scenario of incrementalCases) {
    test(`updates counter for scenario: ${scenario.name}`, async ({ page }) => {
      await mountDemoPage(page, { initialCount: scenario.initialCount });
      for (const step of scenario.steps) {
        const target = step === "increment" ? selectors.incrementButton : selectors.decrementButton;
        await page.locator(target).click();
      }
      await expectCount(page, scenario.expected);
    });
  }

  for (const scenario of initialStateCases) {
    test(`respects configured initial state: ${scenario.name}`, async ({ page }) => {
      await mountDemoPage(page, { initialCount: scenario.initialCount });
      for (const step of scenario.steps) {
        const target = step === "increment" ? selectors.incrementButton : selectors.decrementButton;
        await page.locator(target).click();
      }
      await expectCount(page, scenario.expected);
    });
  }
});
