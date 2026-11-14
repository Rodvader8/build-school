// Check my work: runs your deploy toolkit in throwaway folders. Nothing is deployed anywhere.
// Every check prints PASS or FAIL. Open this file if you're curious.
import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const out = console.log.bind(console);
const check = (name, ok, why = '') => {
  out(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 5)) out(`  ${line}`);
};
const here = process.cwd();
const sandbox = mkdtempSync(path.join(os.tmpdir(), 'bs-deploy-'));
process.on('exit', () => rmSync(sandbox, { recursive: true, force: true }));

/** A fresh project folder with the site in it, plus the scripts, so the real commands can run there. */
function project(name, version = '1') {
  const root = path.join(sandbox, name);
  mkdirSync(path.join(root, 'site'), { recursive: true });
  writeFileSync(path.join(root, 'site/index.html'), `<h1>v${version}</h1>`);
  cpSync(path.join(here, 'scripts'), path.join(root, 'scripts'), { recursive: true });
  writeFileSync(path.join(root, 'package.json'), JSON.stringify({ type: 'module' }));
  return root;
}
const setVersion = (root, v) => writeFileSync(path.join(root, 'site/index.html'), `<h1>v${v}</h1>`);
const live = (root) => (existsSync(path.join(root, 'current/index.html')) ? readFileSync(path.join(root, 'current/index.html'), 'utf8') : null);

let d = null;
let loadError = '';
try {
  d = await import(pathToFileURL(path.join(here, 'scripts/deploy.mjs')).href);
} catch (e) {
  loadError = e.message;
}
const T = (name, fn, why) => {
  try {
    const result = d ? fn(d) : false;
    check(name, result === true, d ? why : `deploy.mjs didn't load: ${loadError}`);
  } catch (e) {
    check(name, false, e.message.split('\n')[0]);
  }
};

T('release copies the site into releases/<id> and writes release.json', (x) => {
  const root = project('a');
  const id = x.release(root, path.join(root, 'site'));
  const meta = JSON.parse(readFileSync(path.join(root, 'releases', id, 'release.json'), 'utf8'));
  return /^r\d{4}$/.test(id) && existsSync(path.join(root, 'releases', id, 'index.html')) && meta.id === id && !!meta.createdAt;
}, 'release(root, siteDir) should copy the site to releases/<id> (use nextId) and write releases/<id>/release.json with the id and a createdAt time.');

T('current is a symlink that points at the new release', (x) => {
  const root = project('b');
  const id = x.release(root, path.join(root, 'site'));
  const link = path.join(root, 'current');
  return lstatSync(link).isSymbolicLink() && path.basename(readlinkSync(link)) === id && live(root) === '<h1>v1</h1>' && x.currentId(root) === id;
}, '"current" should be a symlink to releases/<id>. Then the web server only ever serves current/.');

T('every release gets its own folder, and the history grows', (x) => {
  const root = project('c');
  const ids = [1, 2, 3].map((v) => (setVersion(root, v), x.release(root, path.join(root, 'site'))));
  return new Set(ids).size === 3 && JSON.parse(readFileSync(path.join(root, 'state.json'), 'utf8')).history.join() === ids.join() && live(root) === '<h1>v3</h1>';
}, 'Push each id onto state.json history (readState, then writeState) so the order is remembered.');

// The proof of atomicity: a reader hammers current/index.html while 80 releases switch under it.
{
  const root = project('atomic');
  const base = d ? (() => { try { return d.release(root, path.join(root, 'site')); } catch { return null; } })() : null;
  if (!base) check('switching never leaves a moment with no working site (80 switches under load)', false, 'release() needs to work first.');
  else {
    const reader = `
      const fs = require('fs');
      let reads = 0, failed = 0;
      while (!fs.existsSync(${JSON.stringify(path.join(root, 'stop.flag'))})) {
        try { fs.readFileSync(${JSON.stringify(path.join(root, 'current/index.html'))}, 'utf8'); reads++; } catch { failed++; }
      }
      console.log(JSON.stringify({ reads, failed }));`;
    const child = spawn(process.execPath, ['-e', reader], { stdio: ['ignore', 'pipe', 'inherit'] });
    let text = '';
    child.stdout.on('data', (b) => (text += b));
    await new Promise((r) => setTimeout(r, 150));
    let error = '';
    try {
      for (let v = 2; v < 82; v++) {
        setVersion(root, v);
        d.release(root, path.join(root, 'site'), { keep: 3 });
      }
    } catch (e) {
      error = e.message;
    }
    writeFileSync(path.join(root, 'stop.flag'), '');
    await new Promise((r) => child.on('close', r));
    const { reads, failed } = JSON.parse(text || '{"reads":0,"failed":-1}');
    check('switching never leaves a moment with no working site (80 switches under load)', !error && failed === 0 && reads > 100, error || `A reader failed ${failed} time(s) in ${reads} reads. Create the new link beside "current" and rename it over the top: renameSync is atomic.`);
  }
}

const code = readFileSync(path.join(here, 'scripts/deploy.mjs'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const switchBody = /function switchTo\([^)]*\)\s*\{([\s\S]*?)\n\}/.exec(code)?.[1] ?? '';
check('the switch renames a temporary link over "current" and never deletes it first', /renameSync\(/.test(switchBody) && /symlinkSync\(/.test(switchBody) && !/(rmSync|unlinkSync|rmdirSync)\(\s*current\s*[,)]/.test(switchBody), 'In switchTo: symlinkSync to a temp name beside "current", then renameSync(temp, current). Never remove "current" first.');

T('a preview build goes to previews/<name> and never touches the live site', (x) => {
  const root = project('d');
  const id = x.release(root, path.join(root, 'site'));
  setVersion(root, 2);
  const folder = x.preview(root, path.join(root, 'site'), 'pr-14');
  setVersion(root, 3);
  x.preview(root, path.join(root, 'site'), 'pr-14');
  return existsSync(path.join(folder, 'index.html')) && readFileSync(path.join(folder, 'index.html'), 'utf8') === '<h1>v3</h1>' && x.currentId(root) === id && live(root) === '<h1>v1</h1>' && JSON.parse(readFileSync(path.join(root, 'state.json'), 'utf8')).history.length === 1;
}, 'preview(root, siteDir, name) copies into previews/<name> (replacing what was there) and changes nothing else: not current, not the history.');

T('rolling back points current at the previous release', (x) => {
  const root = project('e');
  const ids = [1, 2, 3].map((v) => (setVersion(root, v), x.release(root, path.join(root, 'site'))));
  const back = x.rollback(root);
  const twice = x.rollback(root);
  return back === ids[1] && twice === ids[0] && x.currentId(root) === ids[0] && live(root) === '<h1>v1</h1>';
}, 'rollback(root) reads the history, finds the live release and switches to the one before it. Roll back twice and you should be on the first release.');

T('rolling back keeps the bad release on disk, and refuses when there is nothing earlier', (x) => {
  const root = project('f');
  const first = x.release(root, path.join(root, 'site'));
  let refused = false;
  try { x.rollback(root); } catch (e) { refused = /Nothing to roll back to/.test(e.message); }
  setVersion(root, 2);
  const second = x.release(root, path.join(root, 'site'));
  x.rollback(root);
  return refused && existsSync(path.join(root, 'releases', second, 'index.html')) && x.currentId(root) === first;
}, 'Throw Error("Nothing to roll back to") when there is no earlier release, and never delete the release you rolled back from.');

T('prune keeps the newest few, plus the live release and the one before it', (x) => {
  const root = project('g');
  const ids = [1, 2, 3, 4, 5, 6].map((v) => (setVersion(root, v), x.release(root, path.join(root, 'site'), { keep: 100 })));
  x.switchTo(root, ids[1]); // live is the old r0002
  const removed = x.prune(root, 2);
  const left = readdirSync(path.join(root, 'releases')).sort();
  const history = JSON.parse(readFileSync(path.join(root, 'state.json'), 'utf8')).history;
  return left.join() === [ids[0], ids[1], ids[4], ids[5]].join() && removed.length === 2 && history.join() === left.join();
}, 'With keep 2, the newest two (r0005, r0006) survive. So do the live release (r0002) and the one before it (r0001). The rest go, and leave the history too.');

// The real commands, the way you'd run them.
{
  const root = project('cli');
  const run = (script, args = []) => spawnSync(process.execPath, [path.join(root, 'scripts', script), ...args], { cwd: root, encoding: 'utf8' });
  const first = run('release.mjs');
  setVersion(root, 2);
  const second = run('release.mjs');
  const liveV2 = live(root) === '<h1>v2</h1>';
  const back = run('rollback.mjs');
  const nothing = run('rollback.mjs');
  const prev = run('preview.mjs', ['pr-7']);
  check('npm run release deploys the site, and npm run rollback undoes it in one command', first.status === 0 && second.status === 0 && liveV2 && back.status === 0 && live(root) === '<h1>v1</h1>' && nothing.status === 1 && /Nothing to roll back to/.test(nothing.stderr) && prev.status === 0 && existsSync(path.join(root, 'previews/pr-7/index.html')), `release: ${second.stderr.trim().split('\n')[0] || 'ok'}\nrollback: ${back.stderr.trim().split('\n')[0] || 'ok'}\nA second rollback should exit 1 with "Nothing to roll back to".`);
}
