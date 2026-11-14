// Small helpers for deploy.mjs. Provided for you: read it, but you don't need to change it.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/** Where everything lives under a project root. */
export const paths = (root) => ({
  releases: path.join(root, 'releases'),
  previews: path.join(root, 'previews'),
  current: path.join(root, 'current'),
  state: path.join(root, 'state.json'),
});

/** state.json remembers the order releases were made in: { history: ["r0001", "r0002"] }. */
export function readState(root) {
  const file = paths(root).state;
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { history: [] };
}

export function writeState(root, state) {
  mkdirSync(root, { recursive: true });
  writeFileSync(paths(root).state, JSON.stringify(state, null, 2) + '\n');
}

/** The next release id: r0001, r0002... They sort in the order they were made, and never repeat. */
export function nextId(root) {
  const { history } = readState(root);
  const last = history.length ? Number(history[history.length - 1].slice(1)) : 0;
  return `r${String(last + 1).padStart(4, '0')}`;
}
