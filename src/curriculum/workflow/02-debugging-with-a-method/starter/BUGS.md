# Three bug reports

A small log summariser, `report.py`, has been giving wrong answers. Run `python3 run_report.py` to see the output for two sample days.

1. **"The top 3 pages list only shows two."** Reported by the dashboard team.
2. **"Slowest request says /about at 95 ms, but /search took 1,200 ms."** Reported by someone watching the numbers.
3. **"Tuesday's report lists pages that only failed on Monday."** Reported by support.

Don't guess and patch. For each one: reproduce it, isolate it to a function, say what you think is wrong, fix that, and prove the fix with a test that fails on `bugged.py` first. Then fill in `DEBUG_LOG.md`.
