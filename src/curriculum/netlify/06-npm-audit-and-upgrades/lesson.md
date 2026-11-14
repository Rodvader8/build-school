Every project you ship stands on hundreds of packages you didn't write. `npm audit` checks them against a database of known vulnerabilities and tells you which ones need attention. Running it is easy. The skill is in deciding what to do with the answer.

## Reading a report

Offline, so you can see it clearly, this lesson ships a saved report in `audit.json`. Run this in the terminal and read the table:

```bash
node read-audit.mjs
```

Each finding has a **severity** (low, moderate, high, critical), the **range** of versions that are vulnerable, and the **first fixed version**. It also says whether the package is *direct* (listed in your `package.json`) or *transitive* (pulled in by something else). Direct ones you fix yourself. Transitive ones you fix by upgrading what pulls them in, or with an override.

## Semver ranges: what the symbols allow

A version is `major.minor.patch`. The range in `package.json` says which versions npm may install:

| Range | Allows |
|---|---|
| `2.3.4` | exactly 2.3.4 |
| `^2.3.4` | 2.3.4 up to, not including, 3.0.0 |
| `~2.3.4` | 2.3.4 up to, not including, 2.4.0 |
| `>=2.3.4` | 2.3.4 and anything newer, including breaking majors (risky) |

The lockfile pins what you actually have installed. The range controls what a fresh install or an update is allowed to pick. So when a fix lands in 3.1.0 and your range is `~3.0.2`, `npm update` can *never* reach it. The range is a ceiling.

Raise the **floor** too. If `^2.1.0` allows the vulnerable 2.2.0, a stale lockfile or a copied project can still install it. Changing it to `^2.3.4` says "never go below the fix".

## Overrides, and their ceilings

When a transitive package is vulnerable and its parent hasn't updated yet, an **override** forces a version across the whole tree:

```json
"overrides": { "glob-match": "^3.4.2" }
```

Overrides are powerful and easy to forget. Someone pins a package to dodge a bug, then the pin sits there for a year and holds back the very fix you now need. A ceiling like `"<=3.4.1"` is the worst kind. After every audit, read your overrides and ask: is this still needed, and does it block the fix?

## Not everything has a fix

Sometimes the report says no fix is available, or the fix is a breaking major you can't take this week. That's allowed. What isn't fine is silence. Write the decision down with the reason, so the next person (often you, in six months) knows it was a choice and not an oversight.

> `npm audit fix --force` upgrades through breaking changes without asking. Use plain `npm audit fix` first, read what changed, and never run `--force` on a project you can't test.

## Your turn

The report in `audit.json` is for this project's `package.json`.

1. Run `node read-audit.mjs` and read all five findings.
2. Raise **tiny-markdown** so its floor is the fixed version.
3. Widen **zip-sanitiser** so its range can reach the fix.
4. Replace the stale `glob-match` override so it forces the fixed version or newer.
5. **slugify-au** has no fix. Leave it in, and add a line to `audit-notes.md` that names it and says why you're accepting it for now.
6. Add a script called `audit` that runs `npm audit --audit-level=high`, so high and critical findings fail the build.
7. Press **Check my work**.
