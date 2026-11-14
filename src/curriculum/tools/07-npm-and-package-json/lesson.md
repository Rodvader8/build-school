JavaScript projects (your Astro and Next.js sites, the Brightwater and Willow Cove builds, even this app) are built from other people's packages: Astro itself, GSAP, Three.js. **npm** is the tool that fetches them, and **package.json** is the file that lists what each project needs.

## The files

```bash
npm init -y
```

That creates `package.json`: the project's name, version, scripts and dependencies. Open it and read it. It's the first file to look at in any JavaScript project you meet.

```json
{
  "name": "tool",
  "scripts": { "slugs": "node slugs.js" },
  "dependencies": { "slug-lite": "file:packages/slug-lite" }
}
```

## Installing a package

```bash
npm install dayjs
```

That downloads the package into a folder called **node_modules**, and adds it under `dependencies` in `package.json`. Anything you `require` or `import` in your code comes from there.

You'll also get **package-lock.json**: the exact version of every package, and every package those packages need. It's what makes the project install the same way next month, on a server, or on a new laptop.

To keep this lesson offline, and predictable, you'll install a small package that lives in the folder next to you instead of one from the internet. The commands and the files it makes are the same.

## Scripts

`scripts` are named shortcuts for commands:

```bash
npm run slugs
```

Now every project answers the same questions the same way: `npm run dev` to start, `npm run build` to build. That's why you'll see `npm run dev` on almost every project, even though the commands behind it differ.

## What goes in Git, and what doesn't

| File | In Git? |
|---|---|
| `package.json` | Yes |
| `package-lock.json` | Yes, so installs match |
| `node_modules/` | **No.** It's huge and rebuilt by `npm install` |
| `.env` | **Never.** It holds secrets |
| `.env.example` | Yes, with placeholder values only |

Anyone who clones your repo runs `npm install` and gets the same node_modules back. That's the point of the lock file.

Packages are code from strangers, so be choosy. Check how many people use one, and when it was last updated, before you add it. If you get an audit warning on a package you use, it's worth reading it properly rather than clicking past.

## Your turn

`steps.txt` has the list. Work inside `tool/`.

1. Run `cd tool`, then `npm init -y`.
2. Install the local package: `npm install ./packages/slug-lite`.
3. Add a script called `slugs` that runs `node slugs.js`, then run it with `npm run slugs`. You should see three slugs.
4. Create a `.gitignore` with `node_modules/`, `.env`, `.env.*` and `!.env.example`, one per line.
5. Open `package.json` and `package-lock.json` and see where `slug-lite` appears in each.
