import type { LessonMeta } from '../../types';
import { callGlobal, errors, globalValue, wait, waitFor } from '../../helpers';

type ST = { start: number; end: number; vars: { pin?: unknown } };
type Spring = { x: number; v: number };
const pinned = (win: Window) => ((win as any).ScrollTrigger?.getAll?.() as ST[] | undefined)?.find((s) => s.vars.pin);
const spring = (win: Window) => globalValue(win, 'spring') as Spring | undefined;
const canvas = (doc: Document) => doc.querySelector('.cv-scene') as HTMLCanvasElement;
async function at(win: Window, doc: Document, progress: number) {
  const st = pinned(win)!;
  doc.scrollingElement!.scrollTop = st.start + (st.end - st.start) * progress;
  (win as any).ScrollTrigger.update();
}

/** Runs the student's springStep on its own for a few seconds of pretend time. */
function simulate(win: Window, to: number, seconds: number) {
  const s: Spring = { x: 0, v: 0 };
  let peak = 0;
  for (let i = 0; i < seconds * 60; i++) {
    const out = callGlobal(win, 'springStep', s, to, 1 / 60) as Spring | undefined;
    if (!out) return null;
    peak = Math.max(peak, s.x);
  }
  return { x: s.x, peak };
}

export default {
  title: 'Spring easing and crossfades',
  minutes: 35,
  kind: 'web',
  entry: 'script.js',
  checks: [
    {
      label: 'springStep nudges the spring toward its target, one small step at a time',
      test: ({ win }) => { const s: Spring = { x: 0, v: 0 }; const out = callGlobal(win, 'springStep', s, 10, 1 / 60) as Spring | undefined; return !!out && out.x > 0 && out.x < 5 && s.x === out.x; },
    },
    {
      label: 'It settles on the target within three seconds, without overshooting it',
      test: ({ win }) => { const r = simulate(win, 10, 3); return !!r && Math.abs(r.x - 10) < 0.05 && r.peak < 10.1; },
    },
    {
      label: 'drawBlend(20.5) is half frame 20 and half frame 21',
      test: async ({ doc, win }) => {
        const seq = globalValue(win, 'sequence') as HTMLImageElement[] | undefined;
        if (!seq || !(await waitFor(() => seq.every((i) => i.complete && i.naturalWidth > 0), 5000))) return false;
        const c = canvas(doc);
        const grab = (draw: () => void) => { c.getContext('2d')!.clearRect(0, 0, c.width, c.height); draw(); return c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data; };
        const a = grab(() => callGlobal(win, 'drawBlend', 20));
        const b = grab(() => callGlobal(win, 'drawBlend', 21));
        const mid = grab(() => callGlobal(win, 'drawBlend', 20.5));
        let tested = 0;
        let good = 0;
        for (let i = 0; i < a.length; i += 4 * 3) {
          for (const k of [0, 1, 2]) {
            const diff = b[i + k] - a[i + k];
            if (Math.abs(diff) < 50) continue;
            tested++;
            const t = (mid[i + k] - a[i + k]) / diff;
            if (t > 0.3 && t < 0.7) good++;
          }
        }
        return tested > 30 && good / tested > 0.9;
      },
    },
    {
      label: 'drawBlend(47) works at the very last frame, without error',
      test: ({ doc, win }) => { callGlobal(win, 'drawBlend', 47); const c = canvas(doc); const d = c.getContext('2d')!.getImageData(Math.floor(c.width * 0.68), Math.floor(c.height * 0.35), 1, 1).data; return d[0] + d[1] + d[2] > 600; },
    },
    {
      label: 'After a big jump of the scroll bar, the sequence glides there instead of snapping',
      test: async ({ doc, win }) => {
        if (!pinned(win) || !spring(win)) return false;
        await at(win, doc, 0);
        await wait(1500);
        await at(win, doc, 0.5);
        await wait(40);
        const early = spring(win)!.x;
        const arrived = await waitFor(() => Math.abs(spring(win)!.x - 23.5) < 0.3, 5000);
        return early < 15 && arrived;
      },
    },
    {
      label: 'It glides back down too, ending on frame 0',
      test: async ({ doc, win }) => {
        if (!pinned(win) || !spring(win)) return false;
        await at(win, doc, 0);
        return waitFor(() => spring(win)!.x < 0.1, 5000);
      },
    },
    { label: 'Reduced motion skips the spring and shows the last frame', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') && /gsap\.ticker\.add/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'springStep follows the three lines in the comment: work out the force from how far you are from the target and how fast you\'re going, add it to the velocity, then add the velocity to the position. Multiply both additions by dt.',
    'In drawBlend: const a = Math.floor(position); const b = Math.min(a + 1, TOTAL - 1); ctx.globalAlpha = position - a is the strength of frame b.',
    'gsap.ticker.add((time, deltaTime) => { ... }): deltaTime is in milliseconds, so divide by 1000 to get seconds for dt.',
  ],
} satisfies LessonMeta;
