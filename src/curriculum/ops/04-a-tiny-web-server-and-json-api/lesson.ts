import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'A tiny web server and JSON API',
  minutes: 40,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'The server listens on 127.0.0.1 only', test: ({ output }) => passed(output, 'server listens on loopback only') },
    { label: 'GET /health answers 200 with ok', test: ({ output }) => passed(output, 'health check answers ok') },
    { label: 'GET /api/status returns the data as JSON', test: ({ output }) => passed(output, 'api returns the data as json') },
    { label: 'The JSON has the right Content-Type and Content-Length', test: ({ output }) => passed(output, 'json has the right headers') },
    { label: 'The data is fresh on every request', test: ({ output }) => passed(output, 'data is fresh on every request') },
    { label: '?down=1 returns only the sites that are down', test: ({ output }) => passed(output, 'down filter works') },
    { label: 'GET / serves the dashboard page', test: ({ output }) => passed(output, 'dashboard page is served') },
    { label: 'dashboard.html fetches /api/status and uses textContent', test: ({ output }) => passed(output, 'dashboard fetches the api safely') },
    { label: 'An unknown path gives a 404 with a JSON error', test: ({ output }) => passed(output, 'unknown path is a json 404') },
  ],
  hints: [
    'send() needs four steps in order: send_response(status), send_header for Content-Type and Content-Length, end_headers(), then wfile.write(bytes). Encode a string with .encode().',
    'self.path includes the query string. urlparse(self.path) splits it into .path and .query, and parse_qs(query) gives a dict of lists, so ?down=1 is {"down": ["1"]}.',
    'In the page script: const res = await fetch("/api/status"); const sites = await res.json(); then for each site make a <tr>, and set each cell with td.textContent = value.',
  ],
} satisfies LessonMeta;
