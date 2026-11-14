So far you've used Playwright as a remote control. Its second job is the one agencies rely on: **end-to-end tests**. A test opens the real site in a real browser, does what a visitor does and *asserts* what should happen. Run before every deploy, it's the net that catches the day a menu quietly stops opening.

## @playwright/test

For tests you use the `@playwright/test` package, which adds a test runner, assertions that wait, and reports. A test looks like this:

```js
import { test, expect } from '@playwright/test';

test('the menu opens', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
});
```

Playwright hands each test a fresh, isolated `page`. Run them all with `npx playwright test`.

## Assertions that wait

`expect(locator).toBeVisible()` retries for a few seconds before it gives up, so you don't write sleeps. Use these:

| Assertion | Checks |
|---|---|
| `toBeVisible()` / `toBeHidden()` | is it on screen? |
| `toHaveText('...')` | its text |
| `toHaveAttribute('aria-expanded', 'true')` | an attribute |
| `toHaveTitle('...')` | the page title |

## The config file

`playwright.config.mjs` says how to run. Three settings matter most:

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:4891' },
  webServer: { command: 'node start-server.mjs', url: 'http://127.0.0.1:4891/', reuseExistingServer: false },
});
```

- **`workers: 1`** runs one test at a time with one browser. By default Playwright starts several workers, and several Chromium browsers at once can run a laptop out of memory. Always one worker.
- **`webServer`** starts your local page before the tests and stops it afterwards, so a single command does everything.
- A relative `page.goto('/')` uses `baseURL`.

## Never run tests against someone's live site

Tests belong on a **local** copy of the page. Against a client's real site, they'd add fake visitors to their analytics on every run, and they might submit real enquiries into their CRM. Block trackers in `test.beforeEach` anyway, so a test can never pollute numbers even if someone points it at the wrong URL.

## A test that can't fail is worth nothing

A test that always passes gives false comfort. How do you know yours would notice a break? **Break the page on purpose and watch the test fail.** This is called mutation testing. Check my work does exactly that: it runs your tests against the good page, then three times against a page that's been broken (the menu doesn't open, the error never appears, the thank-you never appears). Each time, at least one of your tests has to fail.

## Your turn

1. In `playwright.config.mjs`, set one worker, no parallel files, and add the `webServer`.
2. In `tests/site.spec.mjs`, add a `test.beforeEach` that blocks `**/analytics/**`.
3. Write the three tests marked TODO: the menu opens, an empty form shows the error, and a filled form shows the thank-you.
4. Run `npx playwright test` in the terminal and read the output.
5. Press **Check my work**.
