import { expect, test } from "@playwright/test";

test.describe("local interaction coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <main>
        <h1>Playwright Demo App</h1>
        <button id="increment">Increment</button>
        <button id="toggle">Toggle Details</button>
        <button id="append">Add Item</button>
        <p id="count">0</p>
        <section id="details" hidden>Extra details</section>
        <input id="name" placeholder="Enter name" />
        <ul id="items"></ul>
        <a id="docs" href="/docs/intro">Get started</a>
      </main>
      <script>
        let count = 0;
        const countEl = document.getElementById("count");
        const detailsEl = document.getElementById("details");
        const itemsEl = document.getElementById("items");
        const nameEl = document.getElementById("name");
        document.getElementById("increment").addEventListener("click", () => {
          count += 1;
          countEl.textContent = String(count);
        });
        document.getElementById("toggle").addEventListener("click", () => {
          detailsEl.hidden = !detailsEl.hidden;
        });
        document.getElementById("append").addEventListener("click", () => {
          const li = document.createElement("li");
          li.textContent = nameEl.value || "Anonymous";
          itemsEl.appendChild(li);
        });
      </script>
    `);
  });

  test("renders the main heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Playwright Demo App" })).toBeVisible();
  });

  test("starts with zero count", async ({ page }) => {
    await expect(page.locator("#count")).toHaveText("0");
  });

  test("increments count after one click", async ({ page }) => {
    await page.locator("#increment").click();
    await expect(page.locator("#count")).toHaveText("1");
  });

  test("increments count after multiple clicks", async ({ page }) => {
    await page.locator("#increment").click();
    await page.locator("#increment").click();
    await page.locator("#increment").click();
    await expect(page.locator("#count")).toHaveText("3");
  });

  test("details section starts hidden", async ({ page }) => {
    await expect(page.locator("#details")).toBeHidden();
  });

  test("toggle button shows details", async ({ page }) => {
    await page.locator("#toggle").click();
    await expect(page.locator("#details")).toBeVisible();
  });

  test("toggle button can hide details again", async ({ page }) => {
    await page.locator("#toggle").click();
    await page.locator("#toggle").click();
    await expect(page.locator("#details")).toBeHidden();
  });

  test("appends typed name to list", async ({ page }) => {
    await page.locator("#name").fill("Ravi");
    await page.locator("#append").click();
    await expect(page.locator("#items li")).toHaveText("Ravi");
  });

  test("uses fallback name when input is empty", async ({ page }) => {
    await page.locator("#append").click();
    await expect(page.locator("#items li")).toHaveText("Anonymous");
  });

  test("adds multiple list items in order", async ({ page }) => {
    await page.locator("#name").fill("One");
    await page.locator("#append").click();
    await page.locator("#name").fill("Two");
    await page.locator("#append").click();
    await expect(page.locator("#items li")).toHaveText(["One", "Two"]);
  });

  test("input accepts text entry", async ({ page }) => {
    await page.locator("#name").fill("Playwright User");
    await expect(page.locator("#name")).toHaveValue("Playwright User");
  });

  test("docs link has expected destination", async ({ page }) => {
    await expect(page.locator("#docs")).toHaveAttribute("href", "/docs/intro");
  });
});
