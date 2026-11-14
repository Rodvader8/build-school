import type { LessonMeta } from '../../types';
import { errors, globalValue, wait, waitFor } from '../../helpers';

const frameFetches = (win: Window) => win.performance.getEntriesByType('resource').filter((e) => /frames\/frame-\d+\.jpg/.test(e.name)).length;
const shown = (win: Window) => globalValue(win, 'shownFrame') as number;
const rect = (doc: Document, sel: string) => doc.querySelector(sel)!.getBoundingClientRect();
async function sizeTo(win: Window, width: number, height: number) {
  const frame = win.frameElement as HTMLIFrameElement;
  frame.setAttribute('width', String(width));
  frame.setAttribute('height', String(height));
  await wait(500);
}
const heroTop = (win: Window, doc: Document) => doc.querySelector('[data-hero]')!.getBoundingClientRect().top + win.scrollY;
const travel = (win: Window, doc: Document) => doc.querySelector('[data-hero]')!.getBoundingClientRect().height - win.innerHeight;
async function scrubTo(win: Window, doc: Document, progress: number) {
  doc.scrollingElement!.scrollTop = heroTop(win, doc) + travel(win, doc) * progress;
  (win as any).ScrollTrigger.update();
  await wait(80);
}

export default {
  title: 'Project: phone pinning and performance',
  minutes: 60,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'At rest, the page is polite: only the opening frame has downloaded', test: async ({ win }) => { await wait(800); return frameFetches(win) === 1; } },
    {
      label: 'On a phone (390px wide), the hero holds still with position: sticky',
      test: async ({ doc, win }) => { await sizeTo(win, 390, 520); return win.getComputedStyle(doc.querySelector('.cv-hero__inner')!).position === 'sticky'; },
    },
    {
      label: 'Nothing above the hero is an overflow-hidden scroll container (that silently kills sticky)',
      test: ({ doc, win }) => {
        for (let el = doc.querySelector('.cv-hero__inner')!.parentElement; el; el = el.parentElement) {
          const o = win.getComputedStyle(el);
          if (['hidden', 'auto', 'scroll'].some((v) => o.overflowX === v || o.overflowY === v)) return false;
        }
        return true;
      },
    },
    {
      label: 'The scene sits under the copy with a 14px gap, and fits the screen without scrolling',
      test: ({ doc, win }) => {
        const copy = rect(doc, '[data-hero-copy]');
        const scene = rect(doc, '.cv-scene');
        const c = doc.querySelector('.cv-scene') as HTMLCanvasElement;
        const sharp = c.width === Math.round(c.clientWidth * (win.devicePixelRatio || 1));
        return scene.top >= copy.bottom + 13 && scene.bottom <= win.innerHeight && scene.height >= 100 && sharp;
      },
    },
    {
      label: 'A height-only change (the address bar) doesn\'t re-lay out, so the scene doesn\'t jump',
      test: async ({ doc, win }) => {
        const before = rect(doc, '.cv-scene');
        await sizeTo(win, 390, 460);
        const after = rect(doc, '.cv-scene');
        await sizeTo(win, 390, 520);
        return Math.abs(before.height - after.height) < 1 && Math.abs(before.top - after.top) < 1 && before.height >= 100;
      },
    },
    {
      label: 'Scrolling through the hero plays the sequence from frame 0 to frame 47',
      test: async ({ doc, win }) => {
        await scrubTo(win, doc, 0);
        if (!(await waitFor(() => shown(win) === 0, 1500))) return false;
        await scrubTo(win, doc, 0.5);
        if (!(await waitFor(() => shown(win) >= 22 && shown(win) <= 25, 1500))) return false;
        await scrubTo(win, doc, 1);
        return waitFor(() => shown(win) === 47, 1500);
      },
    },
    {
      label: 'While the sequence plays, the hero stays pinned at the top of the screen',
      test: async ({ doc, win }) => { await scrubTo(win, doc, 0.5); return Math.abs(rect(doc, '.cv-hero__inner').top) < 2; },
    },
    {
      label: 'Once scrolling is engaged, all 48 frames download',
      test: async ({ win }) => waitFor(() => frameFetches(win) >= 48, 3000),
    },
    { label: 'Reduced motion is respected', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'position: sticky; top: 0 on .cv-hero__inner is the whole pin. If it still scrolls away, a parent has overflow set to hidden. Change it to overflow-x: clip.',
    'getBoundingClientRect().bottom of the copy minus getBoundingClientRect().top of the inner box is how far down the inner box the copy ends. Subtract that, the gap and the bottom padding from window.innerHeight to get the room left.',
    'Compare window.innerWidth with the width you last laid out for. If they match, return before doing anything.',
  ],
} satisfies LessonMeta;
