import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'What an API is',
  minutes: 25,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'build_url joins the base and the path', test: ({ output }) => passed(output, 'build_url joins the pieces') },
    { label: 'build_url adds ?status=down&limit=5', test: ({ output }) => passed(output, 'build_url adds a query string') },
    { label: 'build_url escapes spaces and ampersands', test: ({ output }) => passed(output, 'build_url escapes awkward characters') },
    { label: 'status_class names success, redirect, client and server errors', test: ({ output }) => passed(output, 'status_class names the families') },
    { label: 'get_json returns (200, data) from the pretend API', test: ({ output }) => passed(output, 'get_json returns the status and the data') },
    { label: 'get_json returns (404, ...) instead of crashing', test: ({ output }) => passed(output, 'get_json treats a 404 as an answer') },
    { label: 'summarise says "3 sites, 1 down: larkfield.example"', test: ({ output }) => passed(output, 'summarise reports what\'s down') },
    { label: 'summarise says "all up" when nothing is down', test: ({ output }) => passed(output, 'summarise says all up') },
  ],
  hints: [
    'urllib.parse.urlencode({"a": 1, "b": "x y"}) gives "a=1&b=x+y". It does the escaping for you, so never build a query string by hand.',
    'Strip the slashes at the join: base.rstrip("/") + "/" + path.lstrip("/"). Then you can\'t get "//" or no slash at all.',
    'In get_json, wrap urlopen in try/except urllib.error.HTTPError. The error object has .code, and error.read() gives the body, just like a response.',
  ],
} satisfies LessonMeta;
