One clip is a script. Fifty clips is a **batch job**, and it asks different questions. What if clip 31 fails? What if the laptop sleeps at clip 20? How do you know it's still working? A podcast clip tool answers all of that, and so will yours.

## What's in the box

`toolkit.py` bundles everything from this track: cutting, burning in captions, drawing a title card, and the SRT helpers. Its `render_clip(source, start, end, title, cues, out)` makes one finished clip: a short title card, then the cut section with captions burned in. Read it, but you won't change it.

Your job is the part that turns one clip into many: `clipmaker.py`.

## A jobs file

The list of clips is data, not code, so you can change it without touching Python:

```json
[
  {"title": "Cron jobs, explained", "start": 12.5, "end": 38.0},
  {"title": "Why alerts fire on change", "start": 61.0, "end": 84.5}
]
```

Validate it **up front**, and say which job is wrong and why: `job 2: "end" must be after "start"`. A typo found before the run costs nothing. The same typo found at clip 40 costs an hour.

## Idempotent, again

Same idea as the server lesson: running the batch twice shouldn't redo work. Number each output (`01-cron-jobs-explained.mp4`) and **skip any file that already exists**. If it dies half way, you start it again and it carries on. A `--force` flag is the way to say "yes, I do want them all remade".

## Fail one, not all

Wrap each clip in `try/except`. If one job fails, record the error, **delete the half-written file** (otherwise the next run would see it and skip it as finished), and move on. At the end, report what was made, what was skipped and what failed, and exit with a non-zero code if anything failed so a scheduler knows.

## Progress

A long job that prints nothing looks frozen. A simple bar costs a few lines:

```
[#########-----------]  45% 02-why-alerts-fire-on-change.mp4
```

Printing `\r` (carriage return) moves back to the start of the line, so each update overwrites the last. The batch function doesn't print anything itself. It calls an `on_progress(done, total, name)` function you pass in, and only the command line decides how to show it. That keeps the logic testable.

Passing in the thing that does the work (`maker=make_clip`) is the same trick. The tests hand in a fake clip maker that fails on purpose, so they can check failure handling without waiting for ffmpeg.

## The command line

```bash
python3 clipmaker.py talk.mp4 --jobs jobs.json --captions talk.srt --out clips
```

`argparse` turns that into values. A bad jobs file should print one clear line to stderr and exit with code 2, never a wall of traceback.

## Your turn

Open `clipmaker.py`. `output_name` is written for you. Fill in the rest.

1. `progress_bar(done, total, width=20)`.
2. `load_jobs(path)`: read the JSON list. Each job needs a non-empty `title` and numeric `start` and `end`, with `end` after `start`. Raise `ValueError("job N: ...")` (counting from 1) otherwise.
3. `make_clip(source, job, out_path, cues)`: call `toolkit.render_clip`.
4. `run_batch(...)`: skip, make or fail each job, report progress, and return `{"made", "skipped", "failed"}`.
5. `main(argv)`: the command line.

The tests build a short test video, run your batch on it, and check the clips come out the right length and size. An example `jobs.example.json` is included for when you try it on your own video.

> To go further: run clips in parallel with `concurrent.futures`, or add a `--size 1080x1920` option. Keep ffmpeg to two jobs at once, though. Each one already uses several cores.
