// A tiny linter. Real projects use ESLint, but the contract is the same: print every problem, exit 1 if there are any.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const rules = [
  { test: /\bconsole\.log\(/, message: 'no console.log in committed code' },
  { test: /\bdebugger\b/, message: 'no debugger statements' },
  { test: /^\s*var\s/, message: 'use const or let, not var' },
];

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(path.join(dir, f)).isDirectory() ? walk(path.join(dir, f)) : [path.join(dir, f)]));
const files = ['src', 'lib', 'tests'].flatMap(walk).filter((f) => f.endsWith('.js') || f.endsWith('.mjs'));

let problems = 0;
for (const file of files) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const rule of rules) {
      if (rule.test.test(line)) {
        console.log(`${file}:${i + 1}  ${rule.message}`);
        problems++;
      }
    }
  });
}
console.log(problems === 0 ? `lint: ${files.length} files clean` : `lint: ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
