Git on its own keeps history on your laptop. **GitHub** is the shared copy: the backup, the place a teammate (or client's developer) pulls from, and the place a **pull request** happens, where changes get reviewed before they reach main.

You don't need a GitHub account for this lesson, and nothing here goes near one. Git doesn't care whether the other copy is on github.com or in the next folder, so we'll use a folder.

## Remotes

A **remote** is another copy of the repo with a nickname. By convention the main one is called `origin`.

```bash
git remote add origin ../origin.git   # nickname -> where it lives
git remote -v                          # list them
git push -u origin main                # send main to origin, and remember the link
git pull                               # fetch and merge what others pushed
```

On GitHub the address looks like `git@github.com:you/site.git`. Everything else works the same. `-u` is only needed on the first push of a branch.

`origin.git` is a **bare** repo: history only, no working files. That's what a server holds. You make one with `git init --bare`.

## The pull request loop

1. Branch off main: `git switch -c add-footer`.
2. Commit, then push the branch: `git push -u origin add-footer`.
3. Open a pull request. On GitHub that's `gh pr create --fill` from the terminal (you have `gh` installed), or the green "Compare & pull request" button in the browser. It shows the diff in **Files changed**, where reviewers comment.
4. Merge it. On GitHub that's the "Merge pull request" button.
5. Pull main back down, and delete the branch.

Your pull request is just a *discussion on top of a merge*. The button does `git merge --no-ff add-footer` on the server, which makes a merge commit, so the history shows that a feature was merged. We'll do that step by hand, in the terminal, since the origin here is a folder.

## Keys never go up

A push copies the history, and the history is forever. Before you push, run `git diff --cached` at commit time and look at `git log -p` if you're unsure. The `.gitignore` in `site/` is already set up to keep `.env` out. If a real key ever does reach GitHub, deleting the file isn't enough: **rotate the key** (make a new one, revoke the old).

## Your turn

`steps.txt` lists the commands. You'll do all of it.

1. In the lesson folder, run `git init --bare -b main origin.git`.
2. `cd site`, make it a repo (`git init -b main`), and set a name and email for this repo only. Run `cp .env.example .env`, then `git status`: `.env` should be ignored already.
3. Commit the page, then add the remote and run `git push -u origin main`.
4. Make a branch `add-footer`. Replace the footer comment in `index.html` with `<footer>...</footer>`, commit, and push the branch.
5. Switch to main. Run `git merge --no-ff add-footer -m "Merge pull request: add footer"`.
6. Push main, and delete the branch with `git branch -d add-footer`.

> To see your work the way a teammate would, run `git clone ../origin.git ../review-copy` from inside `site` and open it. It's a fresh copy built from nothing but what you pushed.
