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

/** Makes "current" point at releases/<id> in ONE atomic step: make a new link beside it, then rename it over the top.
 *  Never delete "current" first: for a moment the live site would not exist. */
export function switchTo(root, id) {
  // TODO
  throw new Error('switchTo is not written yet');
}

/** Copies siteDir into releases/<id> (id from nextId), writes release.json inside it, adds the id to the history,
 *  makes it live with switchTo, then calls prune(root, keep). Returns the id. */
export function release(root, siteDir, { keep = 5 } = {}) {
  // TODO
  throw new Error('release is not written yet');
}

/** A preview build: copies siteDir into previews/<name>, replacing anything already there. Never touches "current".
 *  Returns the folder. */
export function preview(root, siteDir, name) {
  // TODO
  throw new Error('preview is not written yet');
}

/** Points "current" at the release before the live one (use the history). Leave the bad release on disk.
 *  Throws Error('Nothing to roll back to') when there's no earlier release. Returns the id it switched to. */
export function rollback(root) {
  // TODO
  throw new Error('rollback is not written yet');
}

/** Deletes old releases, keeping the newest `keep`, the live release and the one before it.
 *  Also removes them from the history. Returns the ids it removed. */
export function prune(root, keep = 5) {
  // TODO
  throw new Error('prune is not written yet');
}
