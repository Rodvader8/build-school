Almost everything on your list of tools (Git, npm, Python venvs, ffmpeg, cron) is driven from a terminal. It looks like a black box, but it's just a text version of the file manager you already know, and once you can move around in it you'll be faster than clicking.

The terminal panel under the editor is a real bash shell, started in this lesson's folder.

## Where am I, and what's here?

```bash
pwd          # print working directory
ls           # list what's in this folder
ls -la       # include hidden files (like .env), with sizes and dates
```

Hidden files start with a dot. That's why `.env` and `.gitignore` don't show in a plain `ls`.

## Moving around

```bash
cd inbox     # go down into a folder
cd ..        # go up one
cd ~         # go home
cd -         # go back to where you just were
```

`cd` sticks between commands in this app, like a real terminal. Tab completes names, and the up arrow brings back the last command.

## Making things

```bash
mkdir images
mkdir -p archive/2026/reports    # -p builds every missing level
```

## Copy, move, rename, delete

```bash
cp notes.txt backup.txt          # copy
mv notes.txt meeting-notes.txt   # move, which is also how you rename
mv shot.png images/              # move into a folder
rm old-draft.tmp                 # delete
```

**`rm` has no bin.** The file is gone for good. Two habits that save you:

1. Run `ls` with the same pattern first, so you see exactly what `rm` will take.
2. Never run `rm -rf` on a path you haven't just checked with `pwd`.

## Globbing

The `*` is a wildcard the shell expands before the command even starts:

```bash
ls inbox/*.csv        # every .csv in inbox
cp inbox/report-*.csv archive/    # report-oct.csv and report-nov.csv
```

`*.png` matches any name ending in `.png`. `shot-?.png` matches exactly one character. Glob first with `ls`, then swap `ls` for the real command.

> Copy a command from this page with the clipboard, but type your own paths. Pasting a command you don't understand into a terminal is how files vanish.

## Your turn

`tasks.txt` has the job. In the terminal:

1. Run `ls inbox` to see what you've got.
2. Make `archive/2026/reports` in one command.
3. Copy the two `report-*.csv` files into it with a glob.
4. Make an `images` folder and move both `shot-*.png` files into it.
5. Rename `inbox/notes.txt` to `inbox/meeting-notes.txt`.
6. Run `ls inbox/*.tmp`, and only then `rm inbox/*.tmp`. `keep-me.txt` has to survive.

Then press Check my work.
