// The deploy toolkit. Every function takes the project root as its first argument and is synchronous.
import { cpSync, existsSync, mkdirSync, readlinkSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { nextId, paths, readState, writeState } from './lib.mjs';

/** Which release is live: the id that "current" points at, or null if nothing is deployed. */
export function currentId(root) {
  const { current } = paths(root);
  try {
    return path.basename(readlinkSync(current));
  } catch {
    return null;
  }
}

/** Makes "current" point at releases/<id> in one atomic step: a new link is made beside it, then renamed over the top. */
export function switchTo(root, id) {
  const { releases, current } = paths(root);
  if (!existsSync(path.join(releases, id))) throw new Error(`No release called ${id}`);
  const temp = `${current}.${process.pid}.tmp`;
  rmSync(temp, { force: true });
  symlinkSync(path.join('releases', id), temp);
  renameSync(temp, current);
}

/** Copies siteDir into releases/<id>, records it, makes it live, then trims old ones. Returns the id. */
export function release(root, siteDir, { keep = 5 } = {}) {
  const { releases } = paths(root);
  const id = nextId(root);
  mkdirSync(releases, { recursive: true });
  cpSync(siteDir, path.join(releases, id), { recursive: true });
  writeFileSync(path.join(releases, id, 'release.json'), JSON.stringify({ id, createdAt: new Date().toISOString() }, null, 2));
  const state = readState(root);
  state.history.push(id);
  writeState(root, state);
  switchTo(root, id);
  prune(root, keep);
  return id;
}

/** A preview build: its own folder under previews/, safe to overwrite, never touching the live site. Returns the folder. */
export function preview(root, siteDir, name) {
  const target = path.join(paths(root).previews, name);
  rmSync(target, { recursive: true, force: true });
  mkdirSync(path.dirname(target), { recursive: true });
  cpSync(siteDir, target, { recursive: true });
  return target;
}

/** Points "current" at the release before the live one. The bad release stays on disk so you can look at it. */
export function rollback(root) {
  const { history } = readState(root);
  const at = history.indexOf(currentId(root));
  if (at < 1) throw new Error('Nothing to roll back to');
  switchTo(root, history[at - 1]);
  return history[at - 1];
}

/** Deletes old releases, keeping the newest `keep`, the live one and the one before it. Returns the ids it removed. */
export function prune(root, keep = 5) {
  const state = readState(root);
  const live = currentId(root);
  const at = state.history.indexOf(live);
  const safe = new Set([...state.history.slice(-keep), live, state.history[at - 1]].filter(Boolean));
  const removed = state.history.filter((id) => !safe.has(id));
  for (const id of removed) rmSync(path.join(paths(root).releases, id), { recursive: true, force: true });
  state.history = state.history.filter((id) => safe.has(id));
  writeState(root, state);
  return removed;
}
