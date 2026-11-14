Tests you run by hand are tests you skip. Usually on the one Friday afternoon when it matters. Continuous integration (CI) takes the decision away from you: every push, on a clean machine, the same checks run, and a red cross appears next to the commit if anything fails. It's the cheapest quality control in software, and nearly every production project has some version of it.

The standard is simple. A change shouldn't be mergeable until install, lint, tests and build have all passed on a machine that isn't yours.

## What a workflow is

On GitHub, CI is a YAML file in `.github/workflows/`. It says when to run (`on`), where (`runs-on`) and what to do (`steps`). Each step either uses a ready-made action (`uses:`) or runs a shell command (`run:`). That's all. Netlify, GitLab and every other CI system have the same shape with different spelling.

A few habits separate a workflow you can trust from one that merely exists:

- **`npm ci`, not `npm install`.** It installs exactly what `package-lock.json` says, and fails if the lock and `package.json` disagree. The same versions run on your laptop, in CI and in production.
- **Cheapest check first.** Lint takes a second. A build takes a minute. Fail fast.
- **Pin your actions** to a version (`actions/checkout@v4`). A branch name can change under you.
- **Least privilege.** `permissions: contents: read` means a compromised step can't push code.
- **A timeout**, so a hung job doesn't burn six hours. And **concurrency**, so a new push cancels the run it replaces.

## Your turn

This is `tally-ci`, a small word counter that already has a linter, tests and a build script. It's also got two problems that CI exists to catch.

1. Run `npm install` in the terminal. That creates `package-lock.json`, which `npm ci` needs.
2. Run `npm run ci`. That's the whole pipeline on your machine: lint, tests, build. Read the two failures and fix them in `src/tally.js`.
3. Open `.github/workflows/ci.yml`. It's a stub. Write the real workflow: triggers, a job on `ubuntu-latest` with a timeout, checkout, Node with npm caching, `npm ci`, then lint, test and build in that order.
4. Add the safety habits from the list above: read-only permissions, concurrency, pinned actions.
5. Press **Check my work**. It parses your YAML with a real parser and then runs the same commands your workflow lists.

The folder starts with a dot, so some file lists hide it. It's in the explorer, and your editor will open it by name.

> Tip: you don't need a GitHub account for any of this. The check proves two things: the YAML says the right thing, and the commands it names actually pass. Push it to a real repository later and the first green tick should come straight away.
