"""Your regression tests. Each one gets the report module as an argument and uses plain assert.

A good regression test FAILS on the buggy code (bugged.py) and PASSES on your fix (report.py).
check.py runs every test against both, so a test that always passes doesn't count.

Call everything through the argument, like report.parse_line(...), not by importing report here.
"""


def test_top_paths(report):
    pass  # Bug 1: write a test that fails while the list is one item short


def test_slowest(report):
    pass  # Bug 2: write a test that fails while the slowest request is wrong


def test_error_paths(report):
    pass  # Bug 3: write a test that fails when a second call remembers the first
