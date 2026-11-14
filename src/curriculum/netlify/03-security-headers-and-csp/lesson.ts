import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Security headers and CSP',
  minutes: 40,
  kind: 'project',
  entry: 'site/_headers',
  checkEntry: 'check.mjs',
  devPort: 4821,
  devCommand: 'node dev-server.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'There is a Content-Security-Policy header', test: ({ output }) => passed(output, 'there is a Content-Security-Policy') },
    { label: 'It starts from default-src \'self\' and shuts off plugins, base tag tricks and framing', test: ({ output }) => passed(output, 'the CSP starts locked down') },
    { label: 'No unsafe-inline, unsafe-eval or wildcard sources', test: ({ output }) => passed(output, 'no unsafe-inline, unsafe-eval or wildcards') },
    { label: 'The other security headers are set', test: ({ output }) => passed(output, 'the other security headers are set') },
    { label: 'The page loads with nothing blocked', test: ({ output }) => passed(output, 'the page loads with nothing blocked') },
    { label: 'Everything the page needs still works', test: ({ output }) => passed(output, 'everything the page needs still works') },
    { label: 'The CSP only names hosts the page really uses', test: ({ output }) => passed(output, 'the CSP only names hosts the page uses') },
    { label: 'A script from an unknown host is blocked', test: ({ output }) => passed(output, 'a script from an unknown host is blocked') },
  ],
  hints: [
    'Open the dev server preview and the browser console. Each blocked item says which directive blocked it, for example "violates script-src".',
    'Add each third-party host to the directive for its type: scripts in script-src, images in img-src, fetch and beacons in connect-src, iframes in frame-src. Name the host, never a wildcard.',
    'After default-src \'self\', add object-src \'none\'; base-uri \'self\'; form-action \'self\'; frame-ancestors \'self\'. They have no fallback, so default-src doesn\'t cover them.',
  ],
} satisfies LessonMeta;
