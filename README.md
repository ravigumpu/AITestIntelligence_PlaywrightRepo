# Playwright Simple Demo

[![Playwright Tests](https://github.com/ravigumpu/AITestIntelligence_PlaywrightRepo/actions/workflows/playwright.yml/badge.svg)](https://github.com/ravigumpu/AITestIntelligence_PlaywrightRepo/actions/workflows/playwright.yml)

Basic Playwright test project.

## Local setup

```bash
npm install
npx playwright install
npm test
```

## Helpful scripts

- `npm test` - run all tests
- `npm run test:ui` - open Playwright UI mode
- `npm run test:headed` - run tests with headed browsers
- `npm run report` - open the HTML report

## GitHub Actions

Playwright tests run automatically via `.github/workflows/playwright.yml` on:

- push to `master`
- pull requests targeting `master`
- manual trigger from the Actions tab

It runs a matrix build on Node.js 18 and 20.
