import type { LessonMeta } from '../../types';
import { errors, wait, waitFor } from '../../helpers';

type ST = { start: number; end: number; vars: { pin?: unknown; scrub?: unknown } };
const pinned = (win: Window) => ((win as any).ScrollTrigger?.getAll?.() as ST[] | undefined)?.find((s) => s.vars.pin);
const chapters = (doc: Document) => Array.from(doc.querySelectorAll('.gs-chapter'));
const opacities = (win: Window, doc: Document) => chapters(doc).map((c) => parseFloat(win.getComputedStyle(c).opacity));
async function at(win: Window, doc: Document, progress: number) {
  const st = pinned(win)!;
  doc.scrollingElement!.scrollTop = st.start + (st.end - st.start) * progress;
  (win as any).ScrollTrigger.update();
  await wait(60);
}
const near = (v: number, target: number) => Math.abs(v - target) < 0.06;

export default {
  title: 'Pin and scrub: Larkfield\'s chapters',
  minutes: 30,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'The section is pinned and scrubbed by a ScrollTrigger', test: ({ win }) => !!pinned(win) && !!pinned(win)!.vars.scrub },
    {
      label: 'The pin lasts about three screens of scrolling (end: "+=300%")',
      test: ({ win }) => {
        const st = pinned(win);
        return !!st && st.end - st.start > 2000 && st.end - st.start < 3000;
      },
    },
    {
      label: 'At the start of the pin you see only chapter 1',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 0);
        return waitFor(() => { const o = opacities(win, doc); return near(o[0], 1) && near(o[1], 0) && near(o[2], 0); }, 4000);
      },
    },
    {
      label: 'Halfway through, chapter 2 is showing, and the section is holding still at the top',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 0.5);
        const held = () => Math.abs(doc.querySelector('.gs-chapters')!.getBoundingClientRect().top) < 2;
        return waitFor(() => { const o = opacities(win, doc); return near(o[0], 0) && near(o[1], 1) && near(o[2], 0) && held(); }, 4000);
      },
    },
    {
      label: 'At the end of the pin, chapter 3 holds',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 1);
        return waitFor(() => { const o = opacities(win, doc); return near(o[0], 0) && near(o[1], 0) && near(o[2], 1); }, 4000);
      },
    },
    {
      label: 'After the pin, the page scrolls on normally',
      test: async ({ doc, win }) => {
        const st = pinned(win);
        if (!st) return false;
        doc.scrollingElement!.scrollTop = st.end + 400;
        (win as any).ScrollTrigger.update();
        await wait(100);
        return doc.querySelector('.gs-chapters')!.getBoundingClientRect().top < -300;
      },
    },
    { label: 'Reduced motion and small screens keep the plain stacked chapters', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') && /min-width/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'gsap.timeline({ scrollTrigger: { trigger: section, start: \'top top\', end: \'+=300%\', pin: true, scrub: 1 } }) is the whole setup. Everything after that is just tweens on the timeline.',
    'The third argument of .to() is a time in seconds on the timeline: .to(chapters[1], { autoAlpha: 1 }, 1) starts at the 1 second mark. Several tweens at the same time play together.',
    'autoAlpha is opacity plus visibility, so a faded chapter stops blocking clicks and screen readers skip it.',
  ],
} satisfies LessonMeta;
