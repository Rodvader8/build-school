import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Project: take a dashboard to production',
  minutes: 120,
  kind: 'node',
  entry: 'server.js',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the CI workflow is valid and runs install, lint, test and build in order',
    'the workflow pins its actions, is read-only, has a timeout and cancels stale runs',
    'npm run ci passes: secrets scan, lint, tests and a build within budget',
    'the build fails when a budget is broken',
    'the security headers are on every response, including 404s and crashes',
    'a crash in a route is reported scrubbed, and the visitor gets a plain 500',
    'GET /healthz answers 200 with status, version and uptime',
    'the health check answers 503 when something it depends on is missing',
    'the page works under its own CSP, with no inline code and no console errors',
    'a browser error is reported to the server, scrubbed',
    'the secrets scan passes, .env is git-ignored and .env.example has placeholders only',
    'RUNBOOK.md is short and covers deploy, roll back, errors, health, budgets and secrets',
  ]),
  hints: [
    'The four TODO comments say exactly what to do. The headers loop is one line: for (const [name, value] of Object.entries(securityHeaders())) res.setHeader(name, value).',
    'health(res): build a checks object with existsSync(dataFile) and existsSync(path.join(distDir, "index.html")), then sendJson with 200 if every value is "ok" and 503 if not.',
    'Look at your finished lessons for the workflow and the budget wiring. The workflow from lesson 1 needs only one extra step (npm run scan) and you can copy its shape.',
  ],
} satisfies LessonMeta;
