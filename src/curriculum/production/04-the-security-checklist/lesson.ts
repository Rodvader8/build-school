import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'The security checklist',
  minutes: 75,
  kind: 'node',
  entry: 'src/headers.js',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the CSP starts from default-src self and sets the directives that have no fallback',
    'HSTS, nosniff, a referrer policy and a permissions policy are set',
    'validateSignup accepts a good signup and returns only the allowed fields, cleaned',
    'it rejects bad input with a message for each field',
    'the limiter allows the limit, then blocks with a retry time',
    'every key has its own allowance, and the window resets',
    'the app sends the security headers on every response',
    'the app answers 400 for bad input and bad JSON, and 413 for an oversized body',
    'the app answers 429 with a Retry-After header once the limit is hit',
    'the scanner exits 1 on key-shaped strings and says where, never what',
    'the scanner exits 0 on a clean folder, and this project is clean',
    '.env is git-ignored, and .env.example holds placeholders only',
    'the audit fails on high and critical findings, naming the package',
    'it passes a clean report, honours an allow list entry with a reason, and ignores an expired one',
    'every table in schema.sql has row level security switched on',
    'every table has policies tied to auth.uid(), and none is open to everyone',
    'the service role key stays out of anything the browser loads',
  ]),
  hints: [
    'Do the three src files first: they are plain functions with a comment that says exactly what to return. Then the two scripts, which are small command-line programs.',
    'For the scanner: an array of [label, regex] pairs, walk the folder, test each line, and print file:line plus the label. Print at most the first four characters of a match.',
    'RLS pattern, per table: alter table public.x enable row level security; then one create policy per action, with owner = auth.uid() in using (...) and in with check (...) for anything that writes.',
  ],
} satisfies LessonMeta;
