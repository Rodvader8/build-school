import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Error monitoring',
  minutes: 60,
  kind: 'node',
  entry: 'src/reporter.js',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'scrub hides email addresses and phone numbers',
    'scrub hides API keys, bearer tokens, JWTs and password=... values',
    'scrubUrl hides sensitive query values and drops the fragment',
    'scrub masks sensitive keys, deeply, without changing the original',
    'the reporter sends message, stack, type, release, time and a fingerprint',
    'the reporter scrubs the event before it leaves',
    'the same error is sent once inside the dedupe window, and again after it',
    'sampling keeps the configured share of distinct errors',
    'the browser reporter catches errors and unhandled rejections',
    'the server handler reports the error and answers 500 without leaking the stack',
    'process-level handlers report uncaught exceptions and unhandled rejections',
    'a real browser error reaches the collector, scrubbed, and a repeat is sent only once',
    'a secret in a server error never reaches the collector',
  ]),
  hints: [
    'scrubString is a list of [pattern, replacement] pairs run in order with String.replace. Put the specific patterns (keys, tokens) before the broad ones (emails, phone numbers).',
    'createReporter keeps a Map of fingerprint to last-sent time. Check it before you roll the dice for sampling, and only record a fingerprint when you actually send.',
    'wrapHandler: try { await handler(req, res) } catch (error) { ... }. Report first, then answer, and check res.headersSent before you write a status.',
  ],
} satisfies LessonMeta;
