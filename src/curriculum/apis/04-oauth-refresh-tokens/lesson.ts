import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'OAuth and refresh tokens',
  minutes: 35,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'get_token swaps the refresh token for an access token', test: ({ output }) => passed(output, 'get_token swaps the refresh token for an access token') },
    { label: 'The token is reused while it\'s still good', test: ({ output }) => passed(output, 'it reuses the token while it\'s still good') },
    { label: 'It refreshes shortly before the token expires', test: ({ output }) => passed(output, 'it refreshes shortly before the token expires') },
    { label: 'api_get sends the access token and returns the data', test: ({ output }) => passed(output, 'api_get sends the access token and returns the data') },
    { label: 'api_get recovers from a 401 by refreshing once', test: ({ output }) => passed(output, 'api_get recovers from a 401 by refreshing once') },
    { label: 'A refused refresh raises an error instead of looping', test: ({ output }) => passed(output, 'a refused refresh raises an error instead of looping') },
    { label: 'The refresh token never goes to the API itself', test: ({ output }) => passed(output, 'the refresh token never goes to the API itself') },
    { label: 'from_env names whichever variable is missing', test: ({ output }) => passed(output, 'from_env names the variable that\'s missing') },
    { label: 'from_env builds a working manager', test: ({ output }) => passed(output, 'from_env builds a working manager') },
  ],
  hints: [
    'The token call needs data={...} (form encoding), not json={...}. OAuth servers expect application/x-www-form-urlencoded.',
    'Store the expiry as a time, not a number of seconds: self.expires_at = self.clock() + body["expires_in"]. Then "is it expired?" is just a comparison with self.clock().',
    'In api_get, loop twice. On a 401 during the first pass, call manager.refresh() and continue. On the second pass, let raise_for_status() deal with whatever comes back.',
  ],
} satisfies LessonMeta;
