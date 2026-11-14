// Runs in real Chromium. Every lesson's model solution must pass all its checks, and its starter must not.
import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { LESSONS, TRACKS, pageOf } from '../src/curriculum';
import type { Lesson } from '../src/curriculum/types';

let frame: HTMLIFrameElement | null = null;
afterEach(() => frame?.remove());

const HEADERS = { 'Content-Type': 'application/json', 'X-Build-School': '1' };
const post = (path: string, body: unknown) => fetch(path, { method: 'POST', headers: HEADERS, body: JSON.stringify(body) });
afterAll(() => post('/api/cleanup-tests', {}));

/** Python and Rust: copy the lesson into a throwaway test- folder, run its check the way the app does, return the output. */
async function runOutput(lesson: Lesson, which: 'starter' | 'solution') {
  const into = `test-${lesson.id}-${which}`;
  await post('/api/seed', { lesson: lesson.id, from: which, into });
  if (lesson.testSetup) await (await post('/api/shell', { lesson: into, command: lesson.testSetup })).text();
  const res = await post('/api/run', { lesson: into, kind: lesson.kind, entry: lesson.checkEntry ?? lesson.entry, stdin: lesson.stdin ?? '', test: lesson.cargoTest });
  return res.text();
}

/** Loads the lesson's starter or solution page in an iframe, served the same way as the app's preview. */
async function render(lesson: Lesson, which: 'starter' | 'solution') {
  const slug = lesson.id.slice(lesson.trackId.length + 1);
  frame = document.createElement('iframe');
  frame.width = '1200'; // a laptop-ish preview, so layout checks behave the same every run
  frame.height = '800';
  const loaded = new Promise((resolve) => frame!.addEventListener('load', resolve, { once: true }));
  frame.src = `/curriculum/${lesson.trackId}/${slug}/${which}/${pageOf(lesson)}`;
  document.body.append(frame);
  await loaded;
  const doc = frame.contentDocument!;
  await doc.fonts.ready;
  return { doc, win: frame.contentWindow! };
}

async function results(lesson: Lesson, which: 'starter' | 'solution') {
  const ran = lesson.kind === 'web' ? null : await runOutput(lesson, which);
  const { doc, win } = ran === null ? await render(lesson, which) : { doc: document, win: window };
  const files = which === 'starter' ? lesson.starter : lesson.solution;
  const out: { label: string; pass: boolean }[] = [];
  for (const c of lesson.checks) {
    let pass = false;
    try {
      pass = !!(await c.test({ doc, win, files, output: ran ?? '' }));
    } catch {
      pass = false;
    }
    out.push({ label: c.label, pass });
  }
  return out;
}

describe('curriculum', () => {
  it('loads every track in order', () => {
    for (const { id: track } of TRACKS) {
      const orders = LESSONS.filter((l) => l.trackId === track).map((l) => l.order);
      expect(orders, track).toEqual(orders.map((_, i) => i + 1));
    }
  });

  it('gives every lesson text, a starter and a solution', () => {
    for (const l of LESSONS.filter((x) => x.checks.length > 0)) {
      expect(l.body.length, l.id).toBeGreaterThan(200);
      expect(l.starter[l.entry], l.id).toBeDefined();
      expect(l.solution[l.entry], l.id).toBeDefined();
    }
  });

  it('loads the six playgrounds', () => {
    expect(LESSONS.filter((l) => l.trackId === 'playgrounds')).toHaveLength(6);
  });

  it('has no em dashes in lesson text', () => {
    for (const l of LESSONS) expect(l.body.includes('—'), l.id).toBe(false);
  });
});

const withChecks = LESSONS.filter((l) => l.checks.length > 0);

describe.each(withChecks.map((l) => [l.id, l] as const))('%s', (_id, lesson) => {
  // Compiling Rust can take a while the first time.
  const timeout = lesson.kind === 'web' ? 15000 : 480000; // project lessons install, build and run a quality gate

  it('solution passes every check', { timeout }, async () => {
    const failed = (await results(lesson, 'solution')).filter((r) => !r.pass);
    expect(failed).toEqual([]);
  });

  it('starter does not pass yet', { timeout }, async () => {
    expect((await results(lesson, 'starter')).some((r) => !r.pass)).toBe(true);
  });
});
