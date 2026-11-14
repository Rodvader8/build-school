Python's standard library is big, but the real power is **PyPI**: over half a million free packages. Pillow for images, requests for APIs, Playwright for browsers, Whisper for transcription. Many real tools, from video clippers to audio converters, are mostly packages glued together.

## The problem packages cause

Install everything into your computer's one Python and projects start fighting. One needs torch 2.7, another needs 2.4, and the system's own tools break. The answer is a **virtual environment**: a private Python for each project, with its own packages.

## Doing it

This lesson is all terminal. Use the prompt under the editor.

```bash
python3 -m venv .venv
```

That creates a `.venv` folder with a private copy of Python. (The Explorer hides it, the way VS Code does.)

```bash
.venv/bin/pip install humanize
```

`pip` is Python's package installer. Using the venv's own pip puts the package inside `.venv`, not on your system.

```bash
.venv/bin/pip freeze > requirements.txt
```

`requirements.txt` lists every package and its exact version, so anyone (including you on a new laptop) can rebuild the same environment with `pip install -r requirements.txt`. Most real projects have one.

When a lesson folder has a `.venv`, this app's Run button uses it automatically, just like VS Code does.

> On your own projects you'll often see `uv` instead of pip. It does the same job, much faster: `uv venv` then `uv pip install humanize`. Install it from astral.sh/uv if you don't have it.

## Your turn

1. Create the venv, install `humanize`, and save `requirements.txt` with `pip freeze`.
2. In `main.py`, `import humanize` and print `humanize.intcomma(1284000)` and `humanize.naturalsize(1_500_000)`.
3. Press Run. The first line should now show a path ending in `.venv`.
