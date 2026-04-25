import { expect, Page } from "@playwright/test";

export type DemoPageConfig = {
  initialCount?: number;
  detailsVisible?: boolean;
  defaultName?: string;
  docsHref?: string;
};

export const selectors = {
  heading: '[data-testid="heading"]',
  count: '[data-testid="count"]',
  incrementButton: '[data-testid="increment"]',
  decrementButton: '[data-testid="decrement"]',
  resetButton: '[data-testid="reset"]',
  stepInput: '[data-testid="step-input"]',
  applyStepButton: '[data-testid="apply-step"]',
  details: '[data-testid="details"]',
  toggleDetailsButton: '[data-testid="toggle-details"]',
  nameInput: '[data-testid="name-input"]',
  addItemButton: '[data-testid="add-item"]',
  clearItemsButton: '[data-testid="clear-items"]',
  items: '[data-testid="items"] li',
  docsLink: '[data-testid="docs-link"]',
} as const;

export async function mountDemoPage(page: Page, config: DemoPageConfig = {}): Promise<void> {
  const {
    initialCount = 0,
    detailsVisible = false,
    defaultName = "Anonymous",
    docsHref = "/docs/intro",
  } = config;

  await page.setContent(`
    <main>
      <h1 data-testid="heading">Playwright Demo App</h1>
      <div>
        <button data-testid="decrement">-</button>
        <p data-testid="count">${initialCount}</p>
        <button data-testid="increment">+</button>
      </div>
      <div>
        <input data-testid="step-input" type="number" value="1" />
        <button data-testid="apply-step">Apply Step</button>
        <button data-testid="reset">Reset</button>
      </div>
      <section data-testid="details" ${detailsVisible ? "" : "hidden"}>Extra details</section>
      <button data-testid="toggle-details">Toggle Details</button>
      <div>
        <input data-testid="name-input" placeholder="Enter name" />
        <button data-testid="add-item">Add Item</button>
        <button data-testid="clear-items">Clear Items</button>
      </div>
      <ul data-testid="items"></ul>
      <a data-testid="docs-link" href="${docsHref}">Get started</a>
    </main>
    <script>
      const state = {
        count: ${initialCount},
        defaultName: ${JSON.stringify(defaultName)},
      };

      const countEl = document.querySelector('[data-testid="count"]');
      const stepInput = document.querySelector('[data-testid="step-input"]');
      const detailsEl = document.querySelector('[data-testid="details"]');
      const nameInput = document.querySelector('[data-testid="name-input"]');
      const itemsEl = document.querySelector('[data-testid="items"]');

      const renderCount = () => {
        countEl.textContent = String(state.count);
      };

      document.querySelector('[data-testid="increment"]').addEventListener("click", () => {
        state.count += 1;
        renderCount();
      });

      document.querySelector('[data-testid="decrement"]').addEventListener("click", () => {
        state.count -= 1;
        renderCount();
      });

      document.querySelector('[data-testid="reset"]').addEventListener("click", () => {
        state.count = ${initialCount};
        renderCount();
      });

      document.querySelector('[data-testid="apply-step"]').addEventListener("click", () => {
        const value = Number(stepInput.value || 0);
        state.count += value;
        renderCount();
      });

      document.querySelector('[data-testid="toggle-details"]').addEventListener("click", () => {
        detailsEl.hidden = !detailsEl.hidden;
      });

      document.querySelector('[data-testid="add-item"]').addEventListener("click", () => {
        const li = document.createElement("li");
        const cleanValue = nameInput.value.trim();
        li.textContent = cleanValue.length ? cleanValue : state.defaultName;
        itemsEl.appendChild(li);
      });

      document.querySelector('[data-testid="clear-items"]').addEventListener("click", () => {
        itemsEl.replaceChildren();
      });
    </script>
  `);
}

export async function expectCount(page: Page, expected: number): Promise<void> {
  await expect(page.locator(selectors.count)).toHaveText(String(expected));
}

export async function getItems(page: Page): Promise<string[]> {
  return page.locator(selectors.items).allTextContents();
}
