A site that looks perfect on your laptop can break on a phone, and a client will find that out before you do. The cure is to look at every page at the sizes people actually use. Doing that by hand with browser dev tools is slow, and nobody keeps doing it. A script takes four screenshots in a few seconds, every time.

## Why these four widths

| Width | Stands in for |
|---|---|
| **375** | A phone |
| **768** | A tablet, and where many layouts switch |
| **1280** | A laptop |
| **1920** | A big desktop monitor |

Together they cover the layout's big changes. Breakpoints usually sit between them, so you see each layout at least once.

## One browser, many sizes

You don't need four browsers. A page has a **viewport**, the size of its window, and you can change it any time:

```js
await page.setViewportSize({ width: 375, height: 800 });
```

Set the size, make sure the page has settled, then take the shot. The height you give is only the window: `fullPage: true` makes the screenshot as tall as the whole page.

```js
await page.screenshot({ path: 'shots/home-375.png', fullPage: true });
```

## Letting the page settle

Resizing triggers layout changes, and web fonts may still be loading. A screenshot taken too soon catches the page half-built. Wait for fonts, and turn off animations so the picture is the same every time:

```js
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path, fullPage: true, animations: 'disabled' });
```

## Reuse the lesson 1 habits

`lib.mjs` already contains `blockAnalytics(page)`, the tracker blocker from the last lesson. Call it before `page.goto`. It's now a one-line habit for every script that opens a page. And keep to one browser: launch it once at the top, close it in `finally`, and never open a second while the first is running. Several browsers at once can run a laptop out of memory, so serial is the rule.

## What to look for in the pictures

You're hunting for four things: text that overflows or gets cut off, images that don't scale, a menu that's still the desktop one on a phone, and big empty gaps at 1920. When something looks wrong, you've found a bug before the client did. In the next lessons you'll learn to compare shots automatically.

## Your turn

1. Open `shots.mjs`. It takes one screenshot at the default size. Turn it into a loop over `[375, 768, 1280, 1920]`.
2. Save each picture as `shots/home-<width>.png`, full page.
3. Call `blockAnalytics(page)` before going to the page.
4. Run `node shots.mjs`, then open the PNGs in the Explorer and compare them.
5. Press **Check my work**.
