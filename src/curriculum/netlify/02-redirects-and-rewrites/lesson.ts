import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'netlify.toml and redirects',
  minutes: 30,
  kind: 'node',
  entry: 'netlify.toml',
  checkEntry: 'check.mjs',
  checks: [
    { label: 'Every rule is valid: it starts with /, has a sensible status, and any * is at the very end', test: ({ output }) => passed(output, 'every rule is valid') },
    { label: '/services.html moves to /services with a 301', test: ({ output }) => passed(output, '/services.html moves to /services with a 301') },
    { label: '/old-contact moves to /contact with a 301', test: ({ output }) => passed(output, '/old-contact moves to /contact with a 301') },
    { label: '/news/* moves to /blog/* and keeps the rest of the path', test: ({ output }) => passed(output, '/news/* moves to /blog/*') },
    { label: '/app/* is a 200 rewrite to /app/index.html', test: ({ output }) => passed(output, '/app/* is a 200 rewrite') },
    { label: 'Real pages are never shadowed by a rule', test: ({ output }) => passed(output, 'real pages are left alone') },
    { label: 'Unknown paths get the 404 page, and that catch-all comes last', test: ({ output }) => passed(output, 'unknown paths get the 404 page, last') },
  ],
  hints: [
    'Rules run top to bottom and the first match wins, so the catch-all /* has to be the last [[redirects]] block.',
    'A splat is a * at the end of a path. Capture it in from = "/news/*" and use it in to = "/blog/:splat". Something like /*/blog is not valid.',
    'A 301 changes the address in the browser. A 200 keeps the address and quietly serves a different file (a rewrite). Use 200 only for /app/*.',
  ],
} satisfies LessonMeta;
