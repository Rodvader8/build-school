// Fails when a file contains something shaped like a live key. Run it before every commit and in CI.
// Usage: node scripts/scan-secrets.mjs [folder]. Exit code 0 means clean, 1 means something was found.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const RULES = [
  ['an OpenAI-style secret key', /\bsk-[A-Za-z0-9_-]{20,}/],
  ['an AWS access key id', /\bAKIA[0-9A-Z]{16}\b/],
  ['a GitHub token', /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ['a Slack token', /\bxox[abp]-[A-Za-z0-9-]{10,}/],
  ['a private key block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['a hard-coded secret', /\b(api[_-]?key|secret|token|password)\b["']?\s*[:=]\s*["'][A-Za-z0-9_\-+/=]{16,}["']/i],
];
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'releases']);
const SKIP_FILES = /\.(png|jpe?g|gif|webp|avif|ico|woff2?|ttf|pdf|zip|lock)$/i;

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : walk(path.join(dir, entry.name));
    return SKIP_FILES.test(entry.name) ? [] : [path.join(dir, entry.name)];
  });

const root = process.argv[2] ?? '.';
let found = 0;
for (const file of walk(root)) {
  if (statSync(file).size > 1_000_000) continue;
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const [label, pattern] of RULES) {
      const match = pattern.exec(line);
      if (match) {
        // Say where, never what: a report that prints the key is a second leak.
        console.log(`${path.relative(root, file)}:${i + 1}  looks like ${label} (${match[0].slice(0, 4)}...)`);
        found++;
        break;
      }
    }
  });
}
console.log(found === 0 ? 'secrets scan: clean' : `secrets scan: ${found} problem(s). Rotate anything that was real, then remove it.`);
process.exit(found === 0 ? 0 : 1);
