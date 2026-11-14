When a page looks wrong, or a script does nothing, you don't guess. You open DevTools and ask the browser what happened. It's the same toolbox you'll use on every client site, every dashboard in this curriculum, and every "why is my PageSpeed score bad" question.

DevTools is built into Chrome and Brave (they share the same engine), so everything here works in your usual browser.

## Opening it

Press **F12**, or **Ctrl+Shift+I**. To go straight to the Console it's **Ctrl+Shift+J**, and **Ctrl+Shift+C** switches on the element picker. To reload without the cache, use **Ctrl+F5** (or Shift+F5).

## The three panels you'll live in

**Console** is where the page reports its errors and where `console.log` appears. A red line gives the message and the file and line that caused it. Read it from the top, since one early error often causes the rest.

**Elements** shows the live page, not your original HTML. Click the picker, click anything on the page, and you'll see its element and, on the right, the **Styles** pane: every rule that applies, with the winning one on top and the losers crossed out. That crossed-out line is the answer to most "why isn't my CSS working?" questions. You can double-click any value and edit it to try a fix instantly. Nothing is saved, so reload and it's gone.

**Network** lists every file the page asked for. Reload with it open and look at the **Status** column. 200 is fine, a red 404 means the address is wrong. Click a row to see the request, the response and how long it took. It's how you'd check what an API call returned.

## Debugging, in order

1. Open the Console. Is there a red error? Fix the first one.
2. Open Network. Is anything red or missing?
3. Open Elements. Is the element there at all? Is the rule you wrote the one that's winning?

> The preview inside this app is a small window. For DevTools, open it in a real tab: `http://localhost:4780/preview/tools-04-chrome-devtools/`. Your edits still show up when you reload it.

## Your turn

This page is meant to show four PageSpeed scores, and it's broken in three different ways. The data is in `results.json`.

1. Open the preview in its own tab and press F12. The cards are missing. Use **Network** to find the request that's failing, and fix the path in `script.js`.
2. Reload. The summary line is stuck on "Loading...". The **Console** names the problem. Fix it.
3. The cards appear, but the score numbers are invisible. Use the **Elements** picker on one, and look for the crossed-out rule in **Styles**. Delete the rule that's causing it in `style.css`.
4. Reload with the Console open and make sure it's clean, then press Check my work.
