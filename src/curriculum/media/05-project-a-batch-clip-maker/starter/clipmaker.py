"""Make a batch of captioned, titled clips from one long video.

    python3 clipmaker.py talk.mp4 --jobs jobs.json --captions talk.srt --out clips
"""
import argparse
import json
import sys
from pathlib import Path

import toolkit


def output_name(index, job):
    """01-cron-jobs-explained.mp4"""
    return f"{index:02d}-{toolkit.slugify(job['title'])}.mp4"


def progress_bar(done, total, width=20):
    """[#####---------------]  25%  (round down; a total of 0 counts as finished)"""
    pass


def load_jobs(path):
    """Read the jobs JSON: a list of {"title", "start", "end"}. Raise ValueError("job N: ...") (N counts from 1)
    for a job with no title, a missing or non-numeric start or end, or an end that isn't after the start.
    Raise ValueError if the file isn't JSON or isn't a list."""
    pass


def make_clip(source, job, out_path, cues):
    """Make one finished clip with toolkit.render_clip."""
    pass


def run_batch(source, jobs, out_dir, cues=(), force=False, maker=make_clip, on_progress=None):
    """Make a clip for each job in out_dir (create it if needed).
    - Skip a job whose output file already exists, unless force is True.
    - If maker(source, job, out_path, cues) raises, delete any half-made file, record the failure, and carry on.
    - After EVERY job (made, skipped or failed) call on_progress(done, total, name) if it was given.
    Return {"made": [names], "skipped": [names], "failed": [(name, message)]}."""
    pass


def main(argv=None):
    """The command line: source, --jobs (required), --captions (optional .srt), --out (default "clips"), --force.
    Show progress with progress_bar, rewriting one line with "\\r". Finish with a line like
    "2 made, 0 skipped, 0 failed". Return 0 if nothing failed, 1 if a clip failed, 2 for a bad jobs file
    (print the error to stderr, no traceback)."""
    pass


if __name__ == "__main__":
    sys.exit(main())
