// Local helper that runs inside the Vite dev server (127.0.0.1 only).
// It saves the student's files to ./workspace/<lesson>/, serves them as a live
// preview at /preview/<lesson>/, and runs Python and Rust (cargo) programs.
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';

const ROOT = process.cwd();
const WORKSPACE = path.join(ROOT, 'workspace');
const CARGO_TARGET = path.join(WORKSPACE, '.cargo-target');
const PROGRESS_FILE = path.join(WORKSPACE, 'progress.json');
const LESSON_ID = /^[a-z0-9-]+$/;
const SKIP_DIRS = new Set(['target', 'node_modules', '.git', '__pycache__', '.venv', 'venv', 'dist', '.astro', '.next', '.expo']);
const CURRICULUM = path.join(ROOT, 'src/curriculum');
/** Files the editor can't show. They're copied and served, but never read as text. */
export const BINARY = /\.(woff2?|ttf|otf|png|jpe?g|webp|avif|gif|ico|glb|mp3|wav|mp4|midi?)$/i;
const MAX_RUN_MS = 10 * 60 * 1000;

const VENDOR: Record<string, string> = {
  three: path.join(ROOT, 'node_modules/three'),
  gsap: path.join(ROOT, 'node_modules/gsap/dist'),
};

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.txt': 'text/plain; charset=utf-8',
};

// Forwards console output and errors from the preview to the app's terminal panel,
// and keeps a copy in window.__bsLog so lesson checks can read what the page logged.
const CONSOLE_BRIDGE = `(function(){
  window.__bsLog = [];
  function fmt(a){ if (typeof a === 'string') return a; try { return JSON.stringify(a); } catch (e) { return String(a); } }
  function send(level, args){
    var text = Array.prototype.map.call(args, fmt).join(' ');
    window.__bsLog.push({ level: level, text: text });
    try { parent.postMessage({ __buildSchool: true, level: level, text: text }, '*'); } catch (e) {}
  }
  ['log','info','warn','error'].forEach(function(level){
    var original = console[level];
    console[level] = function(){ send(level, arguments); original.apply(console, arguments); };
  });
  window.addEventListener('error', function(e){ send('error', [e.message + (e.lineno ? ' (line ' + e.lineno + ')' : '')]); });
})();`;

let current: ChildProcess | null = null;

/**
 * The environment for every program the app launches: this app's own, minus what Vite sets for itself.
 * Vite sets NODE_ENV=development while it runs, and a child that inherits it misbehaves
 * (a `next build` with NODE_ENV=development fails). Programs should behave as if run from your own terminal,
 * and must never see AI keys or the Claude app's session variables (when Claude started this server).
 */
/** Seeds in progress, by workspace folder (see /api/seed). */
const seeding = new Map<string, Promise<void>>();

function cleanEnv() {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key === 'NODE_ENV' || key.startsWith('VITE') || key.startsWith('VITEST') || key === '__VITEST_POOL_ID__') delete env[key];
    // Never hand AI credentials or Claude's own session details to lesson programs: a lesson only
    // ever uses the keys in its own git-ignored .env file.
    else if (/^(ANTHROPIC|CLAUDE|OPENAI)/.test(key)) delete env[key];
  }
  return env;
}

function lessonDir(id: unknown): string {
  if (typeof id !== 'string' || !LESSON_ID.test(id)) throw new Error('bad lesson id');
  return path.join(WORKSPACE, id);
}

function safeJoin(dir: string, rel: string): string {
  const full = path.resolve(dir, rel);
  if (full !== dir && !full.startsWith(dir + path.sep)) throw new Error('path escapes folder');
  return full;
}

async function readBody(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 5_000_000) throw new Error('request too large');
    chunks.push(chunk as Buffer);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

function json(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}

async function readTree(dir: string, base = dir, out = { files: {} as Record<string, string>, assets: [] as string[] }) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) await readTree(path.join(dir, entry.name), base, out);
    } else if (entry.isFile()) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(base, full);
      if (BINARY.test(rel)) out.assets.push(rel);
      else out.files[rel] = await fs.readFile(full, 'utf8');
    }
  }
  return out;
}

/** html-01-first-page -> src/curriculum/html/01-first-page/starter */
/** html-01-first-page -> src/curriculum/html/01-first-page/starter. Track ids can contain dashes
 *  (ai-apps, react-native), so match the longest track folder the id starts with. */
async function starterDir(id: string) {
  lessonDir(id); // validates the id
  const tracks = (await fs.readdir(CURRICULUM, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
  const track = tracks.filter((t) => id.startsWith(`${t}-`)).sort((a, b) => b.length - a.length)[0];
  if (!track) throw new Error('no such lesson');
  return safeJoin(CURRICULUM, path.join(track, id.slice(track.length + 1), 'starter'));
}

function stopCurrent() {
  if (current?.pid && current.exitCode === null) {
    try {
      process.kill(-current.pid, 'SIGTERM'); // whole process group, so cargo's child binary stops too
    } catch {
      current.kill('SIGTERM');
    }
  }
  current = null;
}

async function handleRun(req: IncomingMessage, res: ServerResponse) {
  const { lesson, kind, entry, stdin, test } = await readBody(req);
  const cwd = lessonDir(lesson);
  stopCurrent();

  let cmd: string;
  let args: string[];
  if (kind === 'python' || kind === 'terminal') {
    safeJoin(cwd, entry); // validates the entry path
    // Like VS Code: if the lesson folder has its own virtual environment, use its Python.
    const venvPython = path.join(cwd, '.venv/bin/python3');
    cmd = (await fs.access(venvPython).then(() => true, () => false)) ? venvPython : 'python3';
    args = ['-u', entry];
  } else if (kind === 'node' || kind === 'project') {
    safeJoin(cwd, entry);
    cmd = process.execPath; // the same Node that runs this app
    args = [entry];
  } else if (kind === 'rust') {
    cmd = 'cargo';
    args = test ? ['test'] : ['run']; // not --quiet: each test prints its own name, which the checks match exactly
  } else {
    return json(res, 400, { error: 'unknown kind' });
  }

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  res.write(`$ ${cmd} ${args.join(' ')}\n`);

  const child = spawn(cmd, args, {
    cwd,
    detached: true,
    env: { ...cleanEnv(), CARGO_TARGET_DIR: CARGO_TARGET, CARGO_TERM_COLOR: 'never', PYTHONUNBUFFERED: '1' },
  });
  current = child;
  if (typeof stdin === 'string') {
    // Checking work: feed the answers in, then close input so input() never waits forever.
    child.stdin.write(stdin);
    child.stdin.end();
  }
  const timer = setTimeout(() => {
    res.write('\n[Stopped after 10 minutes]\n');
    stopCurrent();
  }, MAX_RUN_MS);

  child.stdout.on('data', (d) => res.write(d));
  child.stderr.on('data', (d) => res.write(d));
  child.on('error', (err) => {
    res.write(`\n[Could not start ${cmd}: ${err.message}]\n`);
  });
  child.on('close', (code, signal) => {
    clearTimeout(timer);
    if (current === child) current = null;
    res.end(signal ? `\n[Stopped]\n` : `\n[Process exited with code ${code}]\n`);
  });
  // If the browser goes away (reload, new run), don't leave audio or loops running.
  res.on('close', () => {
    if (current === child) stopCurrent();
  });
}

async function servePreview(url: URL, res: ServerResponse) {
  const [, , id, ...rest] = url.pathname.split('/'); // /preview/<id>/<path>
  return serveFrom(lessonDir(id), rest, res);
}

/** /curriculum/<track>/<slug>/<starter|solution>/<path>: the lesson's own files, served like a preview (used by tests). */
async function serveCurriculum(url: URL, res: ServerResponse) {
  const [, , track, slug, which, ...rest] = url.pathname.split('/');
  if (!LESSON_ID.test(`${track}-${slug}`) || (which !== 'starter' && which !== 'solution')) return json(res, 404, { error: 'not found' });
  return serveFrom(safeJoin(CURRICULUM, path.join(track, slug, which)), rest, res);
}

async function serveFrom(dir: string, rest: string[], res: ServerResponse) {
  let rel = decodeURIComponent(rest.join('/')) || 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  const file = safeJoin(dir, rel);
  let body: Buffer;
  try {
    body = await fs.readFile(file);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end(`Not found: ${rel}`);
  }
  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext] ?? 'application/octet-stream';
  let out: Buffer | string = body;
  if (ext === '.html') {
    const tag = '<script src="/__bs/console.js" data-build-school></script>';
    const html = body.toString('utf8');
    out = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => m + tag) : tag + html;
  }
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(out);
}

async function serveVendor(url: URL, res: ServerResponse) {
  const [, , lib, ...rest] = url.pathname.split('/'); // /vendor/<lib>/<path>
  const base = VENDOR[lib];
  if (!base) return json(res, 404, { error: 'unknown library' });
  const file = safeJoin(base, decodeURIComponent(rest.join('/')));
  try {
    const body = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'max-age=3600' });
    res.end(body);
  } catch {
    json(res, 404, { error: 'not found' });
  }
}

/**
 * This server can write files and run programs, so it must only answer the app itself.
 * - The Host header must be localhost, which defeats DNS-rebinding attacks.
 * - Anything that writes or runs must carry X-Build-School: 1. Browsers won't let another
 *   website add a custom header to a cross-site request without a CORS preflight, which we never approve.
 */
const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
function trusted(req: IncomingMessage) {
  if (!LOCAL_HOST.test(req.headers.host ?? '')) return false;
  return req.method === 'GET' || req.method === 'HEAD' || req.headers['x-build-school'] === '1';
}

/* ---------- The terminal: run a shell command in the lesson's folder ---------- */
const shellCwd = new Map<string, string>(); // lesson id -> current folder, so cd sticks between commands
const SHELL_ENV = {
  // Nothing in the panel can answer an interactive prompt, so switch them off.
  GIT_TERMINAL_PROMPT: '0',
  GIT_EDITOR: 'true', // `git commit` without -m aborts instead of waiting for an editor
  EDITOR: 'true',
  PAGER: 'cat',
  GIT_PAGER: 'cat',
  TERM: 'dumb',
  NO_COLOR: '1',
  PIP_DISABLE_PIP_VERSION_CHECK: '1',
};

async function handleShell(req: IncomingMessage, res: ServerResponse) {
  const { lesson, command } = await readBody(req);
  const home = lessonDir(lesson);
  await fs.mkdir(home, { recursive: true });
  let cwd = shellCwd.get(lesson) ?? home;
  if (!(await fs.stat(cwd).then((st) => st.isDirectory(), () => false))) cwd = home;
  if (typeof command !== 'string' || !command.trim()) return json(res, 400, { error: 'empty command' });
  stopCurrent();

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  // fd 3 reports the folder the command finished in, without mixing it into the output.
  const child = spawn('bash', ['-c', `${command}\nstatus=$?\npwd -P >&3\nexit $status`], {
    cwd,
    detached: true,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    env: { ...cleanEnv(), ...SHELL_ENV, CARGO_TARGET_DIR: CARGO_TARGET },
  });
  current = child;
  let finalCwd = cwd;
  (child.stdio[3] as NodeJS.ReadableStream).on('data', (d) => {
    finalCwd = String(d).trim() || finalCwd;
  });
  const timer = setTimeout(() => {
    res.write('\n[Stopped after 10 minutes]\n');
    stopCurrent();
  }, MAX_RUN_MS);
  child.stdout!.on('data', (d) => res.write(d));
  child.stderr!.on('data', (d) => res.write(d));
  child.on('error', (err) => res.write(`\n[Could not start the shell: ${err.message}]\n`));
  child.on('close', (code) => {
    clearTimeout(timer);
    if (current === child) current = null;
    shellCwd.set(lesson, finalCwd);
    if (code) res.write(`[exit code ${code}]\n`);
    res.end(`\u0000CWD:${finalCwd}`); // the client strips this line and updates the prompt
  });
  res.on('close', () => {
    if (current === child) stopCurrent();
  });
}

/* ---------- Dev servers for project lessons (Astro, Next.js, React...) ---------- */
// One at a time: each one is a whole Node process, and the laptop has other work to do.
const devServers = new Map<string, { child: ChildProcess; log: string[]; command: string }>();

/**
 * Stops every process whose working folder is inside `dir`. Dev servers don't always stay in the
 * process group we start them in (Astro's re-launches itself in its own group, then npm exits),
 * so stopping by folder is the only reliable way. Linux /proc only, which is fine for a local tool.
 */
async function killProcessesIn(dir: string) {
  const prefix = dir + path.sep;
  for (const entry of await fs.readdir('/proc').catch(() => [] as string[])) {
    if (!/^\d+$/.test(entry) || Number(entry) === process.pid) continue;
    const cwd = await fs.readlink(`/proc/${entry}/cwd`).catch(() => '');
    if (cwd === dir || cwd.startsWith(prefix)) {
      try {
        process.kill(Number(entry), 'SIGTERM');
      } catch {
        /* already gone */
      }
    }
  }
}

/** True when something is accepting connections on the port. */
function portOpen(port: number) {
  return new Promise<boolean>((resolve) => {
    if (!Number.isInteger(port) || port < 1024 || port > 65535) return resolve(false);
    const socket = net.connect({ host: '127.0.0.1', port });
    const done = (ok: boolean) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(500, () => done(false));
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
  });
}

async function stopDev(lesson?: string) {
  for (const [id, dev] of devServers) {
    if (lesson && id !== lesson) continue;
    try {
      if (dev.child.pid) process.kill(-dev.child.pid, 'SIGTERM');
    } catch {
      dev.child.kill('SIGTERM');
    }
    devServers.delete(id);
    await killProcessesIn(lessonDir(id));
  }
  // A dev server that outlived its npm parent is no longer in the map, so also sweep the lesson folder itself.
  if (lesson) await killProcessesIn(lessonDir(lesson));
}

async function handleDev(req: IncomingMessage, res: ServerResponse) {
  const { lesson, action, command = 'npm run dev' } = await readBody(req);
  const cwd = lessonDir(lesson);
  if (action === 'stop') {
    await stopDev(lesson);
    return json(res, 200, { running: false });
  }
  if (typeof command !== 'string') return json(res, 400, { error: 'bad command' });
  await stopDev(); // only one dev server at a time
  const child = spawn('bash', ['-c', command], { cwd, detached: true, env: { ...cleanEnv(), ...SHELL_ENV, BROWSER: 'none' } });
  const dev = { child, log: [`$ ${command}`], command };
  devServers.set(lesson, dev);
  const add = (d: Buffer) => {
    dev.log.push(...String(d).split('\n').filter((l) => l.trim()));
    if (dev.log.length > 300) dev.log.splice(0, dev.log.length - 300);
  };
  child.stdout!.on('data', add);
  child.stderr!.on('data', add);
  child.on('close', (code) => {
    dev.log.push(code ? `[the dev command ended with exit code ${code}]` : '[the dev command handed over to the server]');
    if (devServers.get(lesson) === dev) devServers.delete(lesson);
    finished.set(lesson, dev.log);
  });
  return json(res, 200, { running: true });
}
const finished = new Map<string, string[]>(); // the last log of a dev server that stopped by itself

export function buildSchoolApi(): Plugin {
  return {
    name: 'build-school-api',
    configureServer(server) {
      // Never leave dev servers or programs running after the app stops.
      server.httpServer?.on('close', () => {
        stopDev();
        stopCurrent();
      });
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const ours = ['/api/', '/preview/', '/curriculum/', '/vendor/', '/__bs/'].some((p) => url.pathname.startsWith(p));
        if (ours && !trusted(req)) return json(res, 403, { error: 'Build School only answers itself.' });
        try {
          if (url.pathname === '/__bs/console.js') {
            res.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store' });
            return res.end(CONSOLE_BRIDGE);
          }
          if (url.pathname.startsWith('/preview/')) return await servePreview(url, res);
          if (url.pathname.startsWith('/curriculum/')) return await serveCurriculum(url, res);
          if (url.pathname.startsWith('/vendor/')) return await serveVendor(url, res);
          if (!url.pathname.startsWith('/api/')) return next();

          if (url.pathname === '/api/files' && req.method === 'GET') {
            const dir = lessonDir(url.searchParams.get('lesson'));
            try {
              await fs.access(dir);
            } catch {
              return json(res, 200, { files: null, assets: [] });
            }
            return json(res, 200, { ...(await readTree(dir)), folder: dir });
          }
          if (url.pathname === '/api/seed' && req.method === 'POST') {
            // Copies a lesson's starter folder (fonts and images included) into the workspace.
            // Tests pass from: 'solution' and into: 'test-...' to get a throwaway copy they can run.
            const { lesson, replace, from = 'starter', into } = await readBody(req);
            if (from !== 'starter' && from !== 'solution') return json(res, 400, { error: 'bad source' });
            if (into !== undefined && !/^test-[a-z0-9-]+$/.test(into)) return json(res, 400, { error: 'test copies must be named test-...' });
            const dir = lessonDir(into ?? lesson);
            const source = (await starterDir(lesson)).replace(/starter$/, from);
            // One copy per folder at a time: React's dev mode opens a lesson twice on load, and two
            // copies racing into the same new folder fail with EEXIST.
            const job = (seeding.get(dir) ?? Promise.resolve()).then(async () => {
              if (replace || into) await fs.rm(dir, { recursive: true, force: true });
              else if (await fs.access(dir).then(() => true, () => false)) return; // the other request already seeded it
              await fs.cp(source, dir, { recursive: true, force: true });
            });
            seeding.set(dir, job.catch(() => {}));
            await job;
            return json(res, 200, { ...(await readTree(dir)), folder: dir });
          }
          if (url.pathname === '/api/files' && req.method === 'POST') {
            const { lesson, files, replace } = await readBody(req);
            const dir = lessonDir(lesson);
            if (replace) await fs.rm(dir, { recursive: true, force: true });
            for (const [rel, content] of Object.entries(files as Record<string, string>)) {
              if (BINARY.test(rel)) continue; // never overwrite a font or image with text
              const full = safeJoin(dir, rel);
              await fs.mkdir(path.dirname(full), { recursive: true });
              await fs.writeFile(full, content);
            }
            return json(res, 200, { ok: true, folder: dir });
          }
          if (url.pathname === '/api/progress' && req.method === 'GET') {
            try {
              return json(res, 200, JSON.parse(await fs.readFile(PROGRESS_FILE, 'utf8')));
            } catch {
              return json(res, 200, { done: [] });
            }
          }
          if (url.pathname === '/api/progress' && req.method === 'POST') {
            const { done } = await readBody(req);
            await fs.mkdir(WORKSPACE, { recursive: true });
            await fs.writeFile(PROGRESS_FILE, JSON.stringify({ done }, null, 2));
            return json(res, 200, { ok: true });
          }
          if (url.pathname === '/api/run' && req.method === 'POST') return await handleRun(req, res);
          if (url.pathname === '/api/shell' && req.method === 'POST') return await handleShell(req, res);
          if (url.pathname === '/api/dev' && req.method === 'POST') return await handleDev(req, res);
          if (url.pathname === '/api/dev' && req.method === 'GET') {
            const id = url.searchParams.get('lesson') ?? '';
            const dev = devServers.get(id);
            // Judge "running" by whether the lesson's port answers: npm may exit while the real server carries on.
            const up = await portOpen(Number(url.searchParams.get('port')));
            return json(res, 200, { running: !!dev || up, log: dev?.log ?? finished.get(id) ?? [] });
          }
          if (url.pathname === '/api/shell' && req.method === 'GET') {
            const id = url.searchParams.get('lesson') ?? '';
            return json(res, 200, { cwd: shellCwd.get(id) ?? lessonDir(id), workspace: WORKSPACE });
          }
          if (url.pathname === '/api/stdin' && req.method === 'POST') {
            const { text } = await readBody(req);
            if (!current?.stdin?.writable) return json(res, 409, { error: 'nothing is running' });
            current.stdin.write(String(text) + '\n');
            return json(res, 200, { ok: true });
          }
          if (url.pathname === '/api/cleanup-tests' && req.method === 'POST') {
            for (const name of await fs.readdir(WORKSPACE).catch(() => [] as string[])) {
              if (/^test-[a-z0-9-]+$/.test(name)) await fs.rm(path.join(WORKSPACE, name), { recursive: true, force: true });
            }
            return json(res, 200, { ok: true });
          }
          if (url.pathname === '/api/stop' && req.method === 'POST') {
            stopCurrent();
            return json(res, 200, { ok: true });
          }
          return json(res, 404, { error: 'unknown route' });
        } catch (err) {
          if (!res.headersSent) json(res, 400, { error: (err as Error).message });
          else res.end();
        }
      });
    },
  };
}
