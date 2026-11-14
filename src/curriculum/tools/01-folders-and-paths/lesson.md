Every tool you'll point at on your computer (a site monitor, a traffic reporter, a video converter) is a folder, and every error that says "No such file or directory" is a path that went to the wrong place. This lesson is the map. No commands to learn yet, just how to read and write a path.

## Folders are a tree

Your files live in a tree. At the top is `/`, the root. Your home folder is `/home/yourname`, and you can write that as `~`. Everything else hangs off those.

```
projects/
  site-monitor/
    monitor.py
    config/settings.json
    reports/2026-11/summary.md
  traffic-reporter/
    report.py
  shared/logo.svg
```

Open the Explorer on the left and you'll see exactly this under `projects`.

## Absolute paths

An **absolute path** starts at the root and works from anywhere:

```
/home/yourname/projects/site-monitor/monitor.py
~/projects/site-monitor/monitor.py
```

It's unambiguous, which is why scheduled jobs (cron) use absolute paths. Nobody's "standing" anywhere when cron runs.

## Relative paths

A **relative path** starts from wherever you are now, your **working directory**. Three bits of shorthand:

- `.` is this folder.
- `..` is the folder above.
- `name/` goes down into a folder.

If you're standing in `projects/site-monitor`, then `config/settings.json` goes down, and `../shared/logo.svg` goes up one, then down into shared. That's how an `<img src="../images/hero.jpg">` in HTML works too. Same idea, same dots.

> Working directory is the thing that trips people up. A script run from the wrong folder looks for `config/settings.json` in the wrong place and fails, even though your code is fine. When something can't find a file, ask "where am I standing?" first.

## Finding out where you are

The terminal panel under the editor has a command for it:

```bash
pwd
```

That prints your working directory as an absolute path. Next lesson you'll move around properly. For now you only need `pwd` and `cd`:

```bash
cd projects/site-monitor
pwd
```

## Your turn

Open `paths.txt`. Write each answer after its colon.

1. **A:** you're standing in `projects/site-monitor`. What's the relative path to `shared/logo.svg`?
2. **B:** you're standing in `projects/traffic-reporter`. What's the relative path to the November `summary.md` inside site-monitor?
3. **C:** you're standing in `projects/site-monitor/reports/2026-11`. What's the relative path to `config/settings.json`?
4. **D:** what's the absolute path of `monitor.py`? Use `cd` and `pwd` in the terminal to get the front half, and don't guess it.

Press Check my work when you're done.
