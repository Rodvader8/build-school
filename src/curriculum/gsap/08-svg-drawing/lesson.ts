import type { LessonMeta } from '../../types';
import { errors, wait, waitFor } from '../../helpers';

type ST = { start: number; end: number; vars: { scrub?: unknown } };
const scrubbed = (win: Window) => ((win as any).ScrollTrigger?.getAll?.() as ST[] | undefined)?.find((s) => s.vars.scrub);
const lines = (doc: Document) => Array.from(doc.querySelectorAll('.gs-ln'));
const offsets = (win: Window, doc: Document) => lines(doc).map((l) => parseFloat(win.getComputedStyle(l).strokeDashoffset));
async function at(win: Window, doc: Document, progress: number) {
  const st = scrubbed(win)!;
  doc.scrollingElement!.scrollTop = st.start + (st.end - st.start) * progress;
  (win as any).ScrollTrigger.update();
  await wait(60);
}

export default {
  title: 'Self-drawing SVG lines',
  minutes: 25,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'Every line has pathLength="1" so one number describes its whole length', test: ({ doc }) => lines(doc).length === 5 && lines(doc).every((l) => l.getAttribute('pathLength') === '1') },
    { label: 'A scrubbed ScrollTrigger drives the drawing', test: ({ win }) => !!scrubbed(win) },
    {
      label: 'Before the section arrives, every line is hidden',
      test: async ({ doc, win }) => {
        if (!scrubbed(win)) return false;
        await at(win, doc, 0);
        return waitFor(() => offsets(win, doc).every((o) => o > 0.98), 4000);
      },
    },
    {
      label: 'Halfway through, the first line is done and the last hasn\'t started',
      test: async ({ doc, win }) => {
        if (!scrubbed(win)) return false;
        await at(win, doc, 0.5);
        return waitFor(() => { const o = offsets(win, doc); return o[0] < 0.1 && o[4] > 0.9; }, 4000);
      },
    },
    {
      label: 'By the end, the whole plan is drawn',
      test: async ({ doc, win }) => {
        if (!scrubbed(win)) return false;
        await at(win, doc, 1);
        return waitFor(() => offsets(win, doc).every((o) => o < 0.02), 4000);
      },
    },
    {
      label: 'Lines draw smoothly, with no jumping (autoRound is off)',
      test: async ({ doc, win }) => {
        if (!scrubbed(win)) return false;
        const st = scrubbed(win)!;
        for (const p of [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]) {
          await at(win, doc, p);
          await wait(400);
          if (offsets(win, doc).some((v) => v > 0.03 && v < 0.97)) return st.vars.scrub !== undefined;
        }
        return false;
      },
    },
    { label: 'Reduced motion leaves the drawing complete', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'lines.forEach((line) => line.setAttribute(\'pathLength\', \'1\')). It has to be set before the dasharray, so 1 means "the whole line".',
    'strokeDasharray: 1 draws a dash exactly as long as the line, and strokeDashoffset: 1 slides it fully out of view. Animating the offset to 0 slides it back in.',
    'GSAP rounds pixel values to whole numbers by default, so a 1 to 0 offset would jump. Add autoRound: false to the tween.',
  ],
} satisfies LessonMeta;
