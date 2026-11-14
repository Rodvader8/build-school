"""Your regression tests. Each one gets the report module as an argument and uses plain assert.

A good regression test FAILS on the buggy code (bugged.py) and PASSES on your fix (report.py).
check.py runs every test against both, so a test that always passes doesn't count.

Call everything through the argument, like report.parse_line(...), not by importing report here.
"""


def _entries(report, lines):
    return [report.parse_line(line) for line in lines]


def test_top_paths(report):
    entries = _entries(report, ["2026-03-02 GET /a 200 1", "2026-03-02 GET /b 200 1", "2026-03-02 GET /c 200 1"])
    assert len(report.top_paths(entries, 3)) == 3, "asked for the top 3 pages of 3, didn't get 3"
    assert len(report.top_paths(entries, 1)) == 1, "asked for the top 1 page, didn't get 1"


def test_slowest(report):
    entries = _entries(report, ["2026-03-02 GET /fast 200 95", "2026-03-02 GET /slow 200 1200"])
    assert report.slowest(entries)["path"] == "/slow", "95 was treated as bigger than 1200"


def test_error_paths(report):
    first = _entries(report, ["2026-03-02 GET /one 500 5"])
    second = _entries(report, ["2026-03-03 GET /two 503 5"])
    report.error_paths(first)
    assert report.error_paths(second) == ["/two"], "the second call remembered the first call's errors"
