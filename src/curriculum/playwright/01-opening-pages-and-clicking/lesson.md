**Playwright** drives a real browser from code. It opens pages, clicks, types and reads what's on screen, exactly like a person would, but at the speed of a script. You'll use it for QA, for screenshots, for screen recordings and for tests that run before every deploy. The rest of this track builds on this lesson.

## The browser is already here

Playwright needs its own copy of Chromium. It keeps browsers in a shared cache folder on your computer, and Chromium is already in there. Your lesson's `npm install` adds only the small Playwright library, so there's **no browser to download**. If a script ever says "Executable doesn't exist", run `npx playwright install chromium` once. Because it's a download, that one needs the internet.

## The shape of every script

```js
import { chromium } from 'playwright';

const browser = await chromium.launch();   // start Chromium (no window: it's headless)
const page = await browser.newPage();      // a fresh tab
await page.goto('http://127.0.0.1:4851/'); // go there and wait for it to load
console.log(await page.title());
await browser.close();                     // always close it
```

Launch one browser, use it, close it. A browser costs a lot of memory, so never leave one open or run several at once. That's how a laptop runs out of RAM.

## Finding things like a person does

Playwright's best locators describe what you'd say out loud:

```js
page.getByRole('button', { name: 'Menu' })
page.getByRole('link', { name: 'Contact' })
page.getByLabel('Email')
page.locator('#thanks')           // plain CSS when nothing else fits
```

Prefer roles and labels. They keep working when someone changes a class name, and they quietly check your accessibility too: if Playwright can't find a button *by role and name*, neither can a screen reader. Then act on them:

```js
await page.getByLabel('Email').fill('sam@example.com');
await page.getByRole('button', { name: 'Send enquiry' }).click();
const text = await page.locator('#thanks').textContent();
```

Playwright **waits** for an element to be ready before clicking, so you almost never need a manual pause.

## Don't pollute the numbers

If you point a script at a real site, every visit fires that site's Google Analytics and Hotjar. Run it fifty times and you've added fifty fake visitors to somebody's numbers. So any script that visits a **real** site blocks trackers first. You do that by intercepting requests:

```js
const TRACKERS = ['googletagmanager.com', 'google-analytics.com', 'hotjar.com'];
await page.route('**/*', (route) =>
  TRACKERS.some((t) => route.request().url().includes(t)) ? route.abort() : route.continue(),
);
```

In these lessons you'll only ever run against **local pages**, but build the habit now. The page here has a stand-in tracker that reports to a log file, so you can see whether your block works.

## Your turn

`tour.mjs` starts a local server, opens the page and reads the title. Finish it:

1. Block the trackers: fill in `blockTrackers` and call it before `page.goto`. The local stand-in lives at `/analytics/`, and you should also list the three real hosts above.
2. Open the menu, then read the text of its links.
3. Read the three services.
4. Submit the empty form and record whether the error appears.
5. Fill in a name and email, submit again, and read the thank-you message.
6. Run `node tour.mjs`, look at `result.json`, then press **Check my work**.
