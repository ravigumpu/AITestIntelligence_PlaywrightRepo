import { expect, test } from "@playwright/test";
import { getItems, mountDemoPage, selectors } from "./support/demo-page";

type ItemCase = {
  name: string;
  input: string;
  expected: string;
  defaultName?: string;
};

const singleItemCases: ItemCase[] = [
  { name: "simple first name", input: "Ravi", expected: "Ravi" },
  { name: "simple lowercase", input: "alpha", expected: "alpha" },
  { name: "name with spaces around", input: "  Beta  ", expected: "Beta" },
  { name: "alphanumeric value", input: "user123", expected: "user123" },
  { name: "value with hyphen", input: "qa-lead", expected: "qa-lead" },
  { name: "value with underscore", input: "qa_lead", expected: "qa_lead" },
  { name: "empty string uses default", input: "", expected: "Anonymous" },
  { name: "spaces only uses default", input: "   ", expected: "Anonymous" },
  { name: "tab characters only uses default", input: "\t\t", expected: "Anonymous" },
  { name: "newline only uses default", input: "\n", expected: "Anonymous" },
];

const customDefaultCases: ItemCase[] = [
  { name: "custom default for empty", input: "", expected: "Guest", defaultName: "Guest" },
  { name: "custom default for spaces", input: "   ", expected: "Guest", defaultName: "Guest" },
  { name: "custom default for tabs", input: "\t", expected: "Guest", defaultName: "Guest" },
  { name: "custom default preserved with real input", input: "Valid", expected: "Valid", defaultName: "Guest" },
  { name: "custom default with number input fallback", input: "", expected: "0-User", defaultName: "0-User" },
  { name: "custom default with special chars fallback", input: " ", expected: "N/A", defaultName: "N/A" },
  { name: "custom default with long text fallback", input: "", expected: "Default User Name", defaultName: "Default User Name" },
  { name: "custom default with mixed case fallback", input: "", expected: "AnonymousUser", defaultName: "AnonymousUser" },
  { name: "custom default with punctuation fallback", input: "", expected: "User!", defaultName: "User!" },
  { name: "custom default with bracket fallback", input: " ", expected: "[unknown]", defaultName: "[unknown]" },
];

test.describe("list management behavior", () => {
  test("list starts empty", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.items)).toHaveCount(0);
  });

  test("add item button is visible", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.addItemButton)).toBeVisible();
  });

  test("clear items button is visible", async ({ page }) => {
    await mountDemoPage(page);
    await expect(page.locator(selectors.clearItemsButton)).toBeVisible();
  });

  test("can clear list after adding multiple items", async ({ page }) => {
    await mountDemoPage(page);
    await page.locator(selectors.nameInput).fill("One");
    await page.locator(selectors.addItemButton).click();
    await page.locator(selectors.nameInput).fill("Two");
    await page.locator(selectors.addItemButton).click();
    await expect(page.locator(selectors.items)).toHaveCount(2);
    await page.locator(selectors.clearItemsButton).click();
    await expect(page.locator(selectors.items)).toHaveCount(0);
  });

  test("clear on empty list is safe no-op", async ({ page }) => {
    await mountDemoPage(page);
    await page.locator(selectors.clearItemsButton).click();
    await expect(page.locator(selectors.items)).toHaveCount(0);
  });

  for (const scenario of singleItemCases) {
    test(`single item scenario: ${scenario.name}`, async ({ page }) => {
      await mountDemoPage(page);
      await page.locator(selectors.nameInput).fill(scenario.input);
      await page.locator(selectors.addItemButton).click();
      await expect(page.locator(selectors.items)).toHaveCount(1);
      await expect(page.locator(selectors.items).first()).toHaveText(scenario.expected);
    });
  }

  for (const scenario of customDefaultCases) {
    test(`custom default scenario: ${scenario.name}`, async ({ page }) => {
      await mountDemoPage(page, { defaultName: scenario.defaultName });
      await page.locator(selectors.nameInput).fill(scenario.input);
      await page.locator(selectors.addItemButton).click();
      await expect(page.locator(selectors.items).first()).toHaveText(scenario.expected);
    });
  }
});

test.describe("list ordering and persistence", () => {
  test("items preserve insertion order", async ({ page }) => {
    await mountDemoPage(page);
    const values = ["First", "Second", "Third", "Fourth", "Fifth"];
    for (const value of values) {
      await page.locator(selectors.nameInput).fill(value);
      await page.locator(selectors.addItemButton).click();
    }

    await expect(page.locator(selectors.items)).toHaveText(values);
  });

  test("list contains expected content after mixed valid and default inputs", async ({ page }) => {
    await mountDemoPage(page, { defaultName: "Fallback" });
    const values = ["Alpha", " ", "Gamma", "", "Epsilon"];
    for (const value of values) {
      await page.locator(selectors.nameInput).fill(value);
      await page.locator(selectors.addItemButton).click();
    }

    const rendered = await getItems(page);
    await expect(rendered).toEqual(["Alpha", "Fallback", "Gamma", "Fallback", "Epsilon"]);
  });
});
