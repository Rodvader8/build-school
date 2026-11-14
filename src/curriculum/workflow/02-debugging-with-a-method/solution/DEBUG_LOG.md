# Debug log

Keep a log as you go. It stops you chasing the same idea twice, and it's what you'd paste into a bug report.
For each bug, fill in all five lines (a sentence each is plenty).

## Bug 1: the "top 3 pages" list shows two

Reproduce: python3 run_report.py prints two pages under "top 3 pages" for Monday, every time.
Isolate: top_paths(entries, 3) on its own returns a list of length 2, so the problem is inside that function.
Hypothesis: the slice ranked[: n - 1] stops one item early, because slice ends are exclusive and I already count from the start.
Fix: changed the slice to ranked[:n].
Proof: test_top_paths fails on bugged.py and passes on report.py.

## Bug 2: "slowest request" names the wrong page

Reproduce: Monday's slowest request prints /about at 95 ms, though /search took 1200 ms.
Isolate: max over the entries picks "95" because parse_line leaves ms as text, and text compares character by character.
Hypothesis: if ms is a string, "95" sorts after "1200" because "9" comes after "1", so converting to int should fix it.
Fix: parse_line now stores int(ms).
Proof: test_slowest fails on bugged.py and passes on report.py.

## Bug 3: Tuesday's report lists Monday's errors

Reproduce: running Monday's report and then Tuesday's in one process lists /checkout under Tuesday too.
Isolate: calling error_paths twice in a Python shell shows the second result includes the first call's pages.
Hypothesis: the default argument found=[] is created once when the function is defined, so every call without an argument shares one list.
Fix: default found to None and make a fresh list inside the function.
Proof: test_error_paths fails on bugged.py and passes on report.py.
