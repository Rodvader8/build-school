The scariest moment in a project is the minute after you deploy. If something's wrong, how long until it's right again? If the answer is "however long it takes me to find the bug", you don't have a deployment process, you have a gamble.

Production sites answer with two ideas, and both are simple. **Every build gets its own folder and nothing is ever overwritten.** And **the live site is a pointer to one of those folders**, so changing which version is live is a single, instant, atomic move.

## How Netlify does it

You've used both without knowing how they work. A **deploy preview** is a full build of a branch or pull request, on its own URL, that never touches the live site. Reviewers look at the real thing before it merges. **Instant rollback** is the second idea: every production deploy is kept, and "publish this deploy" just moves the pointer back. No rebuild, no waiting. Vercel, Cloudflare Pages and every serious host work the same way.

In this lesson you'll build the same machine with folders and a symlink, so you know what's under the button.

## The shape

```
releases/r0001/   releases/r0002/   releases/r0003/
current  ->  releases/r0003
previews/pr-14/
```

The web server only ever serves `current/`. A release is a copy of the site. A preview is the same copy somewhere else. Rolling back is moving the pointer one step down the history.

The trap is the word *atomic*. The obvious way to switch is to delete `current` and make a new one. For a few microseconds there's no site, and any visitor in that gap gets an error. The safe way is to make a new link *beside* `current` and `rename` it over the top. A rename is one operation the operating system guarantees can't be seen half-done.

## Your turn

Everything is in `scripts/deploy.mjs`, where the functions are stubs. The helpers (`nextId`, `readState`, `writeState`, `paths`) are in `scripts/lib.mjs`, and the three commands are written for you.

1. Write `switchTo(root, id)`: a temporary symlink beside `current`, then `renameSync` it over `current`.
2. Write `release`: copy the site into a new folder, write `release.json` inside it, record it in the history, switch to it, then prune.
3. Write `preview`, which copies to `previews/<name>` and touches nothing else.
4. Write `rollback`: find the live release in the history and switch to the one before it. Keep the bad release on disk, and throw `Nothing to roll back to` if there's nothing earlier.
5. Write `prune`, which keeps the newest few, the live release and the one before it.
6. Press **Check my work**. One check runs 80 releases while another process reads `current/index.html` as fast as it can. If your switch isn't atomic, it'll catch you.

> Tip: try the commands for real once it passes. `npm run release`, edit `site/index.html`, `npm run release` again, then `npm run rollback`. Watch `current` move.
