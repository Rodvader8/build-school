"""The team's existing tests. They pass today, which is exactly why the bugs got through."""
import unittest

import report

LINES = [
    "2026-03-02 GET /home 200 45",
    "2026-03-02 GET /home 200 52",
    "2026-03-02 GET /about 404 20",
    "2026-03-02 GET /pay 500 910",
]


class ReportTests(unittest.TestCase):
    def setUp(self):
        self.entries = [report.parse_line(line) for line in LINES]

    def test_parse_line_reads_the_status_as_a_number(self):
        self.assertEqual(self.entries[0]["status"], 200)

    def test_top_paths_orders_by_count(self):
        self.assertEqual(report.top_paths(self.entries, 10)[0], ("/home", 2))

    def test_slowest_finds_the_slowest(self):
        self.assertEqual(report.slowest(self.entries)["path"], "/pay")

    def test_error_paths_lists_server_errors(self):
        self.assertEqual(report.error_paths(self.entries), ["/pay"])


if __name__ == "__main__":
    unittest.main()
