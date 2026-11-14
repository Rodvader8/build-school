import type { LessonMeta } from '../../types';
import { errors, waitFor, wait } from '../../helpers';

const panels = (doc: Document) => Array.from(doc.querySelectorAll('.gs-panel'));
const opacity = (win: Window, el: Element) => parseFloat(win.getComputedStyle(el).opacity);
const topOf = (win: Window, el: Element) => el.getBoundingClientRect().top + win.scrollY;
async function scrollTo(win: Window, doc: Document, y: number) {
  doc.scrollingElement!.scrollTop = y;
  (win as any).ScrollTrigger?.update();
  await wait(60);
}

export default {
  title: 'ScrollTrigger: animate when it arrives',
  minutes: 25,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'ScrollTrigger is registered and each of the four panels has a trigger', test: ({ win }) => ((win as any).ScrollTrigger?.getAll?.().length ?? 0) >= 4 },
    { label: 'Panels wait out of sight until you scroll to them', test: ({ doc, win }) => panels(doc).length === 4 && panels(doc).every((p) => opacity(win, p) === 0) },
    {
      label: 'Scrolling to the first panel reveals it, and the last stays hidden',
      test: async ({ doc, win }) => {
        const [first, , , last] = panels(doc);
        await scrollTo(win, doc, topOf(win, first) - 400);
        return (await waitFor(() => opacity(win, first) === 1, 4000)) && opacity(win, last) === 0;
      },
    },
    {
      label: 'Scrolling to the bottom reveals them all',
      test: async ({ doc, win }) => {
        await scrollTo(win, doc, doc.scrollingElement!.scrollHeight);
        return waitFor(() => panels(doc).every((p) => opacity(win, p) === 1), 4000);
      },
    },
    {
      label: 'Scrolling back to the top hides the last panel again, but not the others',
      test: async ({ doc, win }) => {
        await scrollTo(win, doc, 0);
        const gone = await waitFor(() => opacity(win, panels(doc)[3]) === 0, 4000);
        return gone && panels(doc).slice(0, 3).every((p) => opacity(win, p) === 1);
      },
    },
    { label: 'Markers are switched off before you finish', test: ({ win }) => (win as any).ScrollTrigger.getAll().every((st: { vars: { markers?: unknown } }) => !st.vars.markers) },
    { label: 'Reduced motion is respected', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'gsap.utils.toArray(\'.gs-panel\').forEach((panel) => { gsap.from(panel, { ..., scrollTrigger: { trigger: panel, start: \'top 85%\' } }); });',
    'start: \'top 85%\' reads "when the TOP of the trigger meets 85% down the VIEWPORT". The first word is the element, the second is the screen.',
    'toggleActions has four words: onEnter, onLeave, onEnterBack, onLeaveBack. \'play none none reverse\' only changes the last one.',
  ],
} satisfies LessonMeta;
