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
    if total <= 0:
        done = total = 1
    filled = width * done // total
    percent = 100 * done // total
    return f"[{'#' * filled}{'-' * (width - filled)}] {percent:3d}%"


def load_jobs(path):
    """Read the jobs JSON: a list of {"title", "start", "end"}. Raise ValueError("job N: ...") (N counts from 1)
    for a job with no title, a missing or non-numeric start or end, or an end that isn't after the start.
    Raise ValueError if the file isn't JSON or isn't a list."""
    try:
        jobs = json.loads(Path(path).read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise ValueError(f"{path} isn't valid JSON: {error}") from error
    if not isinstance(jobs, list):
        raise ValueError(f"{path} should hold a list of jobs")
    for number, job in enumerate(jobs, start=1):
        if not isinstance(job, dict) or not str(job.get("title", "")).strip():
            raise ValueError(f'job {number}: needs a "title"')
        for key in ("start", "end"):
            if isinstance(job.get(key), bool) or not isinstance(job.get(key), (int, float)):
                raise ValueError(f'job {number}: "{key}" must be a number of seconds')
        if job["end"] <= job["start"]:
            raise ValueError(f'job {number}: "end" must be after "start"')
    return jobs


def make_clip(source, job, out_path, cues):
    """Make one finished clip with toolkit.render_clip."""
    toolkit.render_clip(source, job["start"], job["end"], job["title"], cues, out_path)


def run_batch(source, jobs, out_dir, cues=(), force=False, maker=make_clip, on_progress=None):
    """Make a clip for each job in out_dir (create it if needed).
    - Skip a job whose output file already exists, unless force is True.
    - If maker(source, job, out_path, cues) raises, delete any half-made file, record the failure, and carry on.
    - After EVERY job (made, skipped or failed) call on_progress(done, total, name) if it was given.
    Return {"made": [names], "skipped": [names], "failed": [(name, message)]}."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    result = {"made": [], "skipped": [], "failed": []}
    for number, job in enumerate(jobs, start=1):
        name = output_name(number, job)
        out_path = out_dir / name
        if out_path.exists() and not force:
            result["skipped"].append(name)
        else:
            try:
                maker(source, job, out_path, cues)
                result["made"].append(name)
            except Exception as error:
                out_path.unlink(missing_ok=True)
                result["failed"].append((name, str(error)))
        if on_progress:
            on_progress(number, len(jobs), name)
    return result


def main(argv=None):
    """The command line: source, --jobs (required), --captions (optional .srt), --out (default "clips"), --force.
    Show progress with progress_bar, rewriting one line with "\\r". Finish with a line like
    "2 made, 0 skipped, 0 failed". Return 0 if nothing failed, 1 if a clip failed, 2 for a bad jobs file
    (print the error to stderr, no traceback)."""
    parser = argparse.ArgumentParser(description="Make captioned, titled clips from one video.")
    parser.add_argument("source")
    parser.add_argument("--jobs", required=True)
    parser.add_argument("--captions")
    parser.add_argument("--out", default="clips")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args(argv)

    try:
        jobs = load_jobs(args.jobs)
    except (ValueError, OSError) as error:
        print(f"Can't use the jobs file: {error}", file=sys.stderr)
        return 2
    cues = toolkit.parse_srt(Path(args.captions).read_text(encoding="utf-8")) if args.captions else []

    def show(done, total, name):
        print(f"\r{progress_bar(done, total)} {name}", end="", flush=True)

    result = run_batch(args.source, jobs, args.out, cues, args.force, on_progress=show)
    print()
    print(f"{len(result['made'])} made, {len(result['skipped'])} skipped, {len(result['failed'])} failed")
    for name, message in result["failed"]:
        print(f"  failed: {name}: {message}", file=sys.stderr)
    return 1 if result["failed"] else 0


if __name__ == "__main__":
    sys.exit(main())
