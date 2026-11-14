import type { LessonMeta } from '../../types';
import { errors, globalValue, wait, waitFor } from '../../helpers';

type ST = { start: number; end: number; vars: { pin?: unknown; scrub?: unknown } };
const pinned = (win: Window) => ((win as any).ScrollTrigger?.getAll?.() as ST[] | undefined)?.find((s) => s.vars.pin);
const shown = (win: Window) => globalValue(win, 'shownFrame') as number;
async function at(win: Window, doc: Document, progress: number) {
  const st = pinned(win)!;
  doc.scrollingElement!.scrollTop = st.start + (st.end - st.start) * progress;
  (win as any).ScrollTrigger.update();
  await wait(80);
}
/** Brightness (r+g+b) of the canvas pixel where the sun sits at the end of the sequence. */
function sunBrightness(doc: Document) {
  const c = doc.querySelector('.cv-scene') as HTMLCanvasElement;
  const d = c.getContext('2d')!.getImageData(Math.floor(c.width * 0.68), Math.floor(c.height * 0.35), 1, 1).data;
  return d[0] + d[1] + d[2];
}

export default {
  title: 'Scrubbing frames with ScrollTrigger',
  minutes: 30,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'The hero is pinned and scrubbed for about three screens of scrolling', test: ({ win }) => { const st = pinned(win); return !!st && !!st.vars.scrub && st.end - st.start > 1600 && st.end - st.start < 3200; } },
    {
      label: 'At the start of the pin, frame 0 is showing: a dark sky, no sun yet',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 0);
        return waitFor(() => shown(win) === 0 && sunBrightness(doc) < 300, 4000);
      },
    },
    {
      label: 'Halfway through the pin, it\'s on frame 23 or 24',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 0.5);
        return waitFor(() => shown(win) >= 22 && shown(win) <= 25, 4000);
      },
    },
    {
      label: 'At the end of the pin, it\'s on the last frame (47) and the sun is up',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 1);
        return waitFor(() => shown(win) === 47 && sunBrightness(doc) > 600, 4000);
      },
    },
    {
      label: 'Scrolling back rewinds it',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 0.25);
        return waitFor(() => shown(win) >= 11 && shown(win) <= 13, 4000);
      },
    },
    { label: 'Reduced motion jumps to the last frame instead of scrubbing', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') && /TOTAL - 1/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'You can tween any object. gsap.to(state, { frame: TOTAL - 1, ... }) moves state.frame from 0 to 47 as the scroll bar moves.',
    'snap: \'frame\' rounds that one property to whole numbers on every update. Math.round in render() is a second safety net, and it\'s the one that fills shownFrame.',
    'onUpdate: render runs after every change, including while scrubbing backwards, so one function covers both directions.',
  ],
} satisfies LessonMeta;
