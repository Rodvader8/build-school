// Check my work: runs your project and inspects what it does.
// Open this file if you're curious. Every check prints PASS or FAIL.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));
const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
/** Source code without comments, so a comment can't fool a check. */
const codeOf = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');


/* ---- a small TOML reader: tables, arrays of tables, strings, numbers, booleans, arrays, inline tables ---- */
function stripComment(line) {
  let q = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '\\' && q === '"') i++;
      else if (c === q) q = null;
    } else if (c === '"' || c === "'") q = c;
    else if (c === '#') return line.slice(0, i);
  }
  return line;
}
function depthOf(s) {
  let d = 0;
  let q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '\\' && q === '"') i++;
      else if (c === q) q = null;
    } else if (c === '"' || c === "'") q = c;
    else if (c === '[' || c === '{') d++;
    else if (c === ']' || c === '}') d--;
  }
  return d;
}
function splitTop(s) {
  const parts = [];
  let depth = 0;
  let q = null;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '\\' && q === '"') i++;
      else if (c === q) q = null;
      continue;
    }
    if (c === '"' || c === "'") q = c;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') depth--;
    else if (c === ',' && depth === 0) {
      parts.push(s.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(s.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}
function tomlKey(k) {
  k = k.trim();
  return k.startsWith('"') ? JSON.parse(k) : k.startsWith("'") ? k.slice(1, -1) : k;
}
function tomlValue(v) {
  v = v.trim();
  if (v.startsWith('"""') || v.startsWith("'''")) throw new Error('Multi-line strings are not supported here. Use a normal "quoted" string.');
  if (v.startsWith('"')) return JSON.parse(v);
  if (v.startsWith("'")) return v.slice(1, -1);
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v.startsWith('[')) return splitTop(v.slice(1, -1)).map(tomlValue);
  if (v.startsWith('{')) return Object.fromEntries(splitTop(v.slice(1, -1)).map((kv) => { const i = kv.indexOf('='); return [tomlKey(kv.slice(0, i)), tomlValue(kv.slice(i + 1))]; }));
  if (/^[-+]?\d[\d_]*(\.\d+)?$/.test(v)) return Number(v.replace(/_/g, ''));
  throw new Error(`Can't read the value: ${v}`);
}
function parseToml(src) {
  const root = {};
  let cur = root;
  const lines = src.split('\n').map(stripComment);
  const walk = (parts, create) => {
    let node = root;
    for (const p of parts) {
      if (Array.isArray(node[p])) node = node[p][node[p].length - 1];
      else node = node[p] ??= create && {};
    }
    return node;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    let m = /^\[\[\s*([^\]]+?)\s*\]\]$/.exec(line);
    if (m) {
      const parts = m[1].split('.').map(tomlKey);
      const parent = walk(parts.slice(0, -1), true);
      (parent[parts.at(-1)] ??= []).push((cur = {}));
      continue;
    }
    m = /^\[\s*([^\]]+?)\s*\]$/.exec(line);
    if (m) {
      cur = walk(m[1].split('.').map(tomlKey), true);
      continue;
    }
    const eq = line.indexOf('=');
    if (eq < 1) throw new Error(`Line ${i + 1}: expected key = value, found: ${line}`);
    let value = line.slice(eq + 1);
    while (depthOf(value) > 0 && i + 1 < lines.length) value += ' ' + lines[++i].trim();
    cur[tomlKey(line.slice(0, eq))] = tomlValue(value);
  }
  return root;
}
/** Reads and parses a TOML file, or returns { error } so a typo is a FAIL instead of a crash. */
function loadToml(file) {
  try {
    return { toml: parseToml(read(file)) };
  } catch (e) {
    return { toml: {}, error: e.message };
  }
}

const { toml, error } = loadToml('netlify.toml');
const b = toml.build ?? {};

check('netlify.toml has a build command and a publish folder', !error && typeof b.command === 'string' && typeof b.publish === 'string', error || 'Add a [build] table with command = "..." and publish = "...".');

/** What Netlify would use for a context: [build] first, then [context.<name>] on top. */
function effective(context) {
  const ctx = toml.context?.[context] ?? {};
  return {
    command: ctx.command ?? b.command,
    publish: ctx.publish ?? b.publish,
    env: { ...(b.environment ?? {}), ...(ctx.environment ?? {}), CONTEXT: context },
  };
}
const safeFolder = (p) => typeof p === 'string' && p !== '' && !p.startsWith('/') && !p.includes('..') && p !== '.';

/** Runs the build the way Netlify does: a clean slate, the command, then a look at the publish folder. */
function build(context) {
  const e = effective(context);
  rmSync('dist', { recursive: true, force: true });
  if (safeFolder(e.publish)) rmSync(e.publish, { recursive: true, force: true });
  if (typeof e.command !== 'string') return { ok: false, log: 'There is no build command.', html: '' };
  const r = spawnSync('sh', ['-c', e.command], { encoding: 'utf8', timeout: 60000, env: { ...process.env, ...e.env } });
  const html = safeFolder(e.publish) ? read(path.join(e.publish, 'index.html')) : '';
  return { ok: r.status === 0, log: (r.stdout + r.stderr).trim().split('\n').slice(-4).join('\n'), html };
}

const live = build('production');
check('the build command runs', live.ok, live.log || 'The command failed. Try it in the terminal.');
check('the publish folder is the one the build makes', live.html.length > 0, `After the build there's no index.html in "${b.publish}". Run npm run build and look at which folder appears.`);

const nodeMajor = parseInt(b.environment?.NODE_VERSION ?? '', 10);
check('node is pinned', nodeMajor >= 20, 'Add [build.environment] with NODE_VERSION = "22".');
check('deploy previews set SITE_ENV=preview', toml.context?.['deploy-preview']?.environment?.SITE_ENV === 'preview', 'Add [context.deploy-preview.environment] with SITE_ENV = "preview".');

const preview = build('deploy-preview');
check('a preview build is noindex', /name="robots"[^>]*noindex/.test(preview.html), 'A deploy-preview build should contain <meta name="robots" content="noindex">. That happens when SITE_ENV is "preview".');
const live2 = build('production');
check('the live build is not noindex', live2.html.length > 0 && !/noindex/.test(live2.html), 'The live site must never say noindex. Only the preview context should set SITE_ENV.');

check('no secrets in netlify.toml', !/(key|token|secret|password)\s*=\s*["'][^"']{6,}["']/i.test(read('netlify.toml')), 'Remove it from the file and put it in Netlify\'s environment variables instead.');
