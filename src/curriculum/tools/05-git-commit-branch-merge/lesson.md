Git is a save system for a whole project: every save is a **commit**, and you can go back to any of them. It's also how you try something risky without breaking the site that works. Almost every professional project (sites, tools, dashboards) runs on it, and you'll use it daily.

All of this happens in the terminal panel. The app switches off Git's editor and pager, so always give commit messages with `-m`.

## The basics

```bash
git init -b main          # start a repo, with the first branch called main
git status                # what's changed? run this constantly
git add .                 # stage everything for the next commit
git diff --cached         # read exactly what's about to be saved
git commit -m "message"   # save it
git log --oneline         # the history so far
```

**Staging** is a step between editing and saving. `git add` picks what goes in, and `git commit` saves just that. It's why you can review first.

Git needs a name and email on each commit. Set them for this repo only, with no `--global`, so it never touches your machine-wide settings:

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```

## Secrets: check before you commit

A key committed to Git is a key everyone with the repo can read, forever. Deleting it in a later commit doesn't help, because the history keeps it. If one ever slips in, **rotate it**: make a new key at the provider and revoke the old one. So prevention matters:

1. Put real keys in `.env`, and commit only `.env.example` with fake placeholders.
2. Write `.gitignore` before the first `git add`:

```
.env
.env.*
!.env.example
```

3. Read `git status` and `git diff --cached` before every commit. If you see a key, stop.

## Branches and merging

A **branch** is a separate line of work. You try a change on it, and if it's good you **merge** it back.

```bash
git switch -c nav-links   # make a branch and move onto it
git commit -am "Add a nav"
git switch main           # back to main
git merge nav-links       # bring the work in
```

If main has moved on while you worked, Git makes a **merge commit** that joins both lines. If the same line was changed on both, you get a conflict: Git marks the file, you pick the right version, then add and commit.

## Your turn

`steps.txt` has the checklist. Everything happens in `site/`.

1. `cd site`, then `git init -b main` and set a name and email for this repo.
2. Run `cp .env.example .env`. Then create `.gitignore` with the three lines above, before anything else.
3. Run `git status`. `.env` must not appear. Then `git add .` and `git diff --cached`, and commit as "First version of the page".
4. Make a branch called `nav-links`. Replace the `<!-- nav goes here -->` comment in `index.html` with a `<nav>` and commit.
5. Switch back to main. Change the `--accent` colour in `style.css` and commit.
6. Run `git merge nav-links -m "Merge nav-links"`. Finish with `git log --oneline --graph --all`.

> If a command seems stuck, press Ctrl+C. And if you ever commit on the wrong branch, don't panic: nothing is lost, and `git log --oneline --all` shows where everything is.
