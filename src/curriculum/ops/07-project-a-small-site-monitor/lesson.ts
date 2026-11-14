import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Project: a small site monitor',
  minutes: 60,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'check_url returns the status and the time in ms', test: ({ output }) => passed(output, 'check_url reads status and timing') },
    { label: 'A 404 and a 500 come back as statuses, not crashes', test: ({ output }) => passed(output, 'check_url returns error statuses') },
    { label: 'A slow page really measures slow', test: ({ output }) => passed(output, 'check_url measures slow pages') },
    { label: 'An unreachable site gives status None', test: ({ output }) => passed(output, 'check_url handles an unreachable site') },
    { label: 'check_url gives up after its timeout', test: ({ output }) => passed(output, 'check_url has a timeout') },
    { label: 'run_once records one row per URL', test: ({ output }) => passed(output, 'run_once records every url') },
    { label: 'A site\'s first check never alerts', test: ({ output }) => passed(output, 'first check does not alert') },
    { label: 'Running again in the same hour changes nothing (idempotent)', test: ({ output }) => passed(output, 'same hour run is idempotent') },
    { label: 'A site going down alerts once', test: ({ output }) => passed(output, 'going down alerts once') },
    { label: 'A site that stays down doesn\'t alert again', test: ({ output }) => passed(output, 'staying down is quiet') },
    { label: 'A site coming back alerts once', test: ({ output }) => passed(output, 'coming back alerts once') },
    { label: 'latest() gives the newest result per URL for the dashboard', test: ({ output }) => passed(output, 'latest per url') },
  ],
  hints: [
    'check_url: start = time.perf_counter(), requests.get(url, timeout=timeout), then (reply.status_code, round((time.perf_counter() - start) * 1000, 1)). Wrap it in try/except requests.RequestException and return (None, None).',
    'record() relies on UNIQUE(url, bucket) and INSERT OR IGNORE. When the row was ignored, cursor.rowcount is 0, so you can return rowcount == 1.',
    'In run_once, read previous_status BEFORE you record the new row. Only alert when the row was newly inserted and there was a previous status.',
  ],
} satisfies LessonMeta;
