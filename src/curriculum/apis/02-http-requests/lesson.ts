import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'HTTP requests with urllib and requests',
  minutes: 25,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'performance_score returns 93 for the mobile score', test: ({ output }) => passed(output, 'performance_score returns 93 for mobile') },
    { label: 'The page address and strategy go as query parameters', test: ({ output }) => passed(output, 'it sent the page address and strategy as query parameters') },
    { label: 'The strategy can be changed to desktop', test: ({ output }) => passed(output, 'the strategy can be changed') },
    { label: 'A 404 gives None instead of a crash', test: ({ output }) => passed(output, 'a 404 gives None, not a crash') },
    { label: 'post_score sends a JSON body and returns the id', test: ({ output }) => passed(output, 'post_score sends JSON and returns the id') },
    { label: 'The urllib version gets the same answer', test: ({ output }) => passed(output, 'the urllib version gets the same answer') },
    { label: 'The urllib version sends a User-Agent header', test: ({ output }) => passed(output, 'the urllib version sends a User-Agent') },
    { label: 'Every request sets a timeout', test: ({ output }) => passed(output, 'every call sets a timeout') },
  ],
  hints: [
    'Pass params={...} to requests.get and let it escape the page address. If you paste the address into the URL string yourself, the & inside it will break the query.',
    'response.raise_for_status() raises requests.HTTPError for a 4xx or 5xx. Catch that one, not a bare except.',
    'requests.post(url, json=payload) sets the JSON body and the Content-Type header for you. Don\'t json.dumps it first.',
  ],
} satisfies LessonMeta;
