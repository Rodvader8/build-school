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


import http from 'node:http';
import { pathToFileURL } from 'node:url';

const FILE = 'netlify/functions/enquiry.mjs';
const source = read(FILE);
const code = codeOf(source);

/* ---- a pretend CRM on this machine ---- */
const crm = { calls: [], mode: 'ok' };
const server = http.createServer(async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  crm.calls.push({ method: req.method, auth: req.headers.authorization, body });
  res.writeHead(crm.mode === 'ok' ? 200 : 500, { 'Content-Type': 'application/json' }).end('{}');
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const KEY = 'lesson-key-' + Math.random().toString(36).slice(2);
process.env.CRM_URL = `http://127.0.0.1:${server.address().port}/leads`;
process.env.CRM_API_KEY = KEY;

/* ---- capture everything the function logs ---- */
const logged = [];
const real = { ...console };
for (const level of ['log', 'info', 'warn', 'error', 'debug']) console[level] = (...a) => logged.push(a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' '));

let handler = null;
let loadError = '';
try {
  handler = (await import(pathToFileURL(path.resolve(FILE)).href)).default;
} catch (e) {
  loadError = e.message;
}
const config = await import(pathToFileURL(path.resolve(FILE)).href).then((m) => m.config, () => null);

const URL_ = 'http://localhost/api/enquiry';
const person = { name: 'Priya Nandakumar', email: 'priya.n@example.com', message: 'Hi, I would love a quote for a front garden.' };
const post = (body, type = 'application/json') => new Request(URL_, { method: 'POST', headers: { 'content-type': type }, body });
const call = async (req) => {
  crm.calls.length = 0;
  try {
    const res = await handler(req);
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: res.status, headers: res.headers, json, text, calls: crm.calls.length };
  } catch (e) {
    return { status: 0, error: e.message, calls: crm.calls.length };
  }
};
const results = [];
const t = (name, fn, why) => results.push([name, fn, why]);

const r = {};
if (handler) {
  r.get = await call(new Request(URL_, { method: 'GET' }));
  r.broken = await call(post('{not json'));
  r.noName = await call(post(JSON.stringify({ ...person, name: '' })));
  r.badEmail = await call(post(JSON.stringify({ ...person, email: 'not-an-email' })));
  r.short = await call(post(JSON.stringify({ ...person, message: 'Hi' })));
  r.honey = await call(post(JSON.stringify({ ...person, website: 'http://spam.example' })));
  crm.mode = 'ok';
  r.good = await call(post(JSON.stringify(person)));
  const goodCall = crm.calls[0];
  r.goodAuth = goodCall?.auth;
  r.goodBody = goodCall ? JSON.parse(goodCall.body || '{}') : {};
  r.form = await call(post(new URLSearchParams(person).toString(), 'application/x-www-form-urlencoded'));
  crm.mode = 'down';
  r.down = await call(post(JSON.stringify(person)));
  crm.mode = 'ok';
  delete process.env.CRM_API_KEY;
  r.noKey = await call(post(JSON.stringify(person)));
  process.env.CRM_API_KEY = KEY;
}
Object.assign(console, real);
server.close();

const T = (name, ok, why) => check(name, !!handler && ok, handler ? why : `The function didn't load: ${loadError}`);
T('only POST is accepted', r.get?.status === 405 && /post/i.test(r.get.headers?.get('allow') ?? ''), `A GET gave ${r.get?.status}. Reply 405 with an Allow: POST header.`);
T('broken JSON gets a 400', r.broken?.status === 400, `Broken JSON gave ${r.broken?.status ?? 'a crash'}${r.broken?.error ? ` (${r.broken.error})` : ''}. Wrap the parsing in try/catch and reply 400.`);
T(
  'invalid fields get a 400 that names them',
  r.noName?.status === 400 && 'name' in (r.noName.json?.errors ?? {}) && r.badEmail?.status === 400 && 'email' in (r.badEmail.json?.errors ?? {}) && r.short?.status === 400 && 'message' in (r.short.json?.errors ?? {}) && r.noName.calls + r.badEmail.calls + r.short.calls === 0,
  'Reply 400 with { errors: { name, email, message } } naming each bad field, and never call the CRM for bad input.',
);
T('the honeypot is answered quietly', r.honey?.status === 200 && r.honey.calls === 0, `A bot got ${r.honey?.status} and the CRM was called ${r.honey?.calls} times. Reply 200 and do nothing.`);
T(
  'a valid enquiry reaches the CRM once',
  r.good?.status === 200 && r.good.json?.ok === true && r.good.calls === 1 && r.goodAuth === `Bearer ${KEY}` && r.goodBody.email === person.email && r.goodBody.name === person.name && r.goodBody.message === person.message,
  `Status ${r.good?.status}, CRM calls ${r.good?.calls}, auth header ${r.goodAuth ? 'sent' : 'missing'}. The CRM should get one POST with name, email, message and Authorization: Bearer <CRM_API_KEY>.`,
);
T('a plain HTML form post works', r.form?.status === 200 && r.form.calls === 1, 'A form-encoded post should work too: use await req.formData() when the content type isn\'t JSON.');
T('a CRM failure becomes a 502', r.down?.status === 502 && r.down.calls === 1, `When the CRM says no, reply 502. Got ${r.down?.status}.`);
T('a missing key is a 500', r.noKey?.status === 500 && r.noKey.calls === 0 && !r.noKey.text?.includes('CRM_API_KEY'), `With CRM_API_KEY unset the function gave ${r.noKey?.status}. Reply 500 with a vague message, and don't call the CRM.`);
const leaked = logged.filter((l) => [person.name, person.email, person.message, 'priya'].some((p) => l.toLowerCase().includes(p.toLowerCase())));
T('personal data never reaches the logs', leaked.length === 0, `The function logged: ${leaked[0]?.slice(0, 80)}...  Log a reason or a status code, never what the person typed.`);
check('the key is not hard-coded', /process\.env\.CRM_API_KEY|CRM_API_KEY\s*[,}]/.test(code) && !/fake_crm_key|(?:sk|key|crm)_[A-Za-z0-9_]{8,}/i.test(code) && !/Bearer\s+[A-Za-z0-9_-]{8,}/.test(code), 'Read the key from process.env.CRM_API_KEY and build the header with a template string.');
check('.env is git-ignored', /^\.env\s*$/m.test(read('.gitignore')) && existsSync('.env.example'), 'Add a line ".env" to .gitignore (and keep .env.example, which holds fake values only).');
check('the function has a public path', config?.path === '/api/enquiry', 'Add: export const config = { path: \'/api/enquiry\' };');
