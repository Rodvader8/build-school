import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'SQLite with Python',
  minutes: 35,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'connect() makes the checks table and returns rows you can read by name', test: ({ output }) => passed(output, 'connect makes the table') },
    { label: 'connect() is safe to call twice', test: ({ output }) => passed(output, 'connect is safe to call twice') },
    { label: 'add_check saves for other connections (it commits)', test: ({ output }) => passed(output, 'add_check commits') },
    { label: 'add_check is safe from SQL injection', test: ({ output }) => passed(output, 'add_check uses placeholders') },
    { label: 'latest_status finds the newest check by time', test: ({ output }) => passed(output, 'latest_status uses the time') },
    { label: 'latest_status is None for an unknown URL', test: ({ output }) => passed(output, 'latest_status is None when unknown') },
    { label: 'slowest returns the top (url, ms) pairs', test: ({ output }) => passed(output, 'slowest returns pairs') },
    { label: 'slowest skips checks with no timing', test: ({ output }) => passed(output, 'slowest skips missing timings') },
    { label: 'uptime_percent counts 2xx and 3xx as up', test: ({ output }) => passed(output, 'uptime_percent counts correctly') },
    { label: 'uptime_percent treats a failed connection as down', test: ({ output }) => passed(output, 'uptime_percent counts a failed connection') },
    { label: 'uptime_percent is None for an unknown URL', test: ({ output }) => passed(output, 'uptime_percent is None when unknown') },
  ],
  hints: [
    'conn = sqlite3.connect(path), then conn.row_factory = sqlite3.Row, then conn.executescript(SCHEMA). IF NOT EXISTS in the schema is what makes it safe to repeat.',
    'Use ? placeholders and pass the values as a tuple: conn.execute("INSERT ... VALUES (?, ?, ?, ?)", (url, status, ms, checked_at)). Then conn.commit().',
    'For uptime: SELECT COUNT(*), SUM(CASE WHEN status BETWEEN 200 AND 399 THEN 1 ELSE 0 END) FROM checks WHERE url = ?. A NULL status is never BETWEEN anything, so it counts as down.',
  ],
} satisfies LessonMeta;
