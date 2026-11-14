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
const rules = toml.redirects ?? [];

/* ---- a small matcher that behaves like Netlify's: top to bottom, first match wins, real files are not shadowed ---- */
const VALID_STATUS = [200, 301, 302, 303, 307, 308, 404, 410, 451];
const publishedFiles = new Set(['/', '/index.html', '/404.html', '/services/', '/contact/', '/blog/', '/blog/launch/', '/app/index.html']);
const fileExists = (p) => publishedFiles.has(p) || publishedFiles.has(p.endsWith('/') ? p : p + '/');

function problem(rule) {
  const { from, to, status } = rule;
  if (typeof from !== 'string' || !from.startsWith('/')) return `"from" must be a path starting with /, got ${JSON.stringify(from)}`;
  if (from.includes('*') && !(from.endsWith('/*') || from === '/*')) return `${from}: a splat * is only valid at the very end, like /blog/*`;
  if (from.indexOf('*') !== from.length - 1 && from.includes('*')) return `${from}: only one * is allowed, at the end`;
  if (typeof to !== 'string' || !to) return `${from}: needs a "to"`;
  if (to.includes(':splat') && !from.endsWith('*')) return `${from}: ":splat" in "to" needs a * at the end of "from"`;
  if (!VALID_STATUS.includes(status)) return `${from}: status ${status} isn't a valid choice`;
  return '';
}
function match(from, p) {
  const names = [];
  const escaped = from
    .split('/')
    .map((seg) => {
      if (seg === '*') return '(.*)';
      if (seg.startsWith(':')) {
        names.push(seg.slice(1));
        return '([^/]+)';
      }
      return seg.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  const m = new RegExp(`^${escaped}$`).exec(p);
  if (!m) return null;
  const values = Object.fromEntries(names.map((n, i) => [n, m[i + 1]]));
  if (from.endsWith('*')) values.splat = m[m.length - 1];
  return values;
}
function resolve(p) {
  for (const rule of rules) {
    if (problem(rule)) continue;
    if (fileExists(p) && rule.force !== true) continue;
    const v = match(rule.from, p);
    if (!v) continue;
    const to = rule.to.replace(/:(\w+)/g, (_, n) => v[n] ?? '');
    return { status: rule.status, to };
  }
  return null; // no rule applies: the file is served as it is
}
const is = (p, status, to) => {
  const r = resolve(p);
  return r?.status === status && r.to === to;
};
const why = (p) => {
  const r = resolve(p);
  return `${p} currently gives ${r ? `${r.status} -> ${r.to}` : 'no rule (served as it is)'}.`;
};

const bad = rules.map(problem).filter(Boolean);
check('every rule is valid', !error && rules.length >= 5 && bad.length === 0, error || bad.join('\n') || 'Add the rules from the lesson as [[redirects]] blocks.');
check('/services.html moves to /services with a 301', is('/services.html', 301, '/services'), why('/services.html'));
check('/old-contact moves to /contact with a 301', is('/old-contact', 301, '/contact'), why('/old-contact'));
check('/news/* moves to /blog/*', is('/news/2024/launch-day', 301, '/blog/2024/launch-day') && is('/news/spring', 301, '/blog/spring'), why('/news/2024/launch-day'));
check('/app/* is a 200 rewrite', is('/app/settings/profile', 200, '/app/index.html'), why('/app/settings/profile'));
check('real pages are left alone', resolve('/blog/launch') === null && resolve('/contact') === null, why('/blog/launch'));
const last = rules.at(-1);
check('unknown paths get the 404 page, last', is('/no-such-page', 404, '/404.html') && last?.from === '/*', 'Put a final rule: from = "/*", to = "/404.html", status = 404. ' + why('/no-such-page'));
