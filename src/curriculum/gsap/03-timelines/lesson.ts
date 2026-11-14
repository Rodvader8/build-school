import type { LessonMeta } from '../../types';
import { errors, fire, globalValue, waitFor } from '../../helpers';

type TL = {
  getChildren: (nested?: boolean, tweens?: boolean, timelines?: boolean) => { targets: () => Element[]; startTime: () => number; endTime: () => number }[];
  progress: (v?: number) => number;
  isActive: () => boolean;
};
const intro = (win: Window) => globalValue(win, 'intro') as TL | undefined;
const stepFor = (win: Window, doc: Document, sel: string) => {
  const el = doc.querySelector(sel);
  return intro(win)?.getChildren(false, true, false).find((t) => t.targets().includes(el as Element));
};

export default {
  title: 'Timelines: choreographing a hero',
  minutes: 25,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'There is a timeline called intro with four steps', test: ({ win }) => (intro(win)?.getChildren(false, true, false).length ?? 0) === 4 },
    {
      label: 'The steps run in order: kicker, title, lede, button',
      test: ({ doc, win }) => {
        const s = ['.gs-kicker', '.gs-title', '.gs-lede', '.gs-cta'].map((sel) => stepFor(win, doc, sel)?.startTime());
        return s.every((t) => typeof t === 'number') && s.every((t, i) => i === 0 || (t as number) > (s[i - 1] as number));
      },
    },
    {
      label: 'The title starts before the kicker has finished (they overlap)',
      test: ({ doc, win }) => {
        const k = stepFor(win, doc, '.gs-kicker');
        const t = stepFor(win, doc, '.gs-title');
        return !!k && !!t && t.startTime() < k.endTime();
      },
    },
    {
      label: 'The lede starts 0.15s after the title (using "<")',
      test: ({ doc, win }) => {
        const t = stepFor(win, doc, '.gs-title');
        const l = stepFor(win, doc, '.gs-lede');
        return !!t && !!l && Math.abs(l.startTime() - t.startTime() - 0.15) < 0.01;
      },
    },
    { label: 'The timeline finishes and everything is visible', test: ({ doc, win }) => waitFor(() => intro(win)?.progress() === 1 && win.getComputedStyle(doc.querySelector('.gs-cta')!).opacity === '1', 6000) },
    {
      label: 'Clicking Replay restarts it, and it finishes again',
      test: async (c) => {
        fire(c, c.doc.querySelector('.gs-replay'), 'click');
        const restarted = (intro(c.win)?.progress() ?? 1) < 1;
        return restarted && (await waitFor(() => intro(c.win)?.progress() === 1, 6000));
      },
    },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'const intro = gsap.timeline({ defaults: { duration: 0.8, ease: \'power3.out\' } }); then chain .from(...) calls onto it.',
    'The third argument is the position. \'-=0.5\' means 0.5s before the previous step ends. \'<\' means the same start as the previous step, and \'<0.15\' means 0.15s after that.',
    'intro.restart() plays it from the start again. Add it in a click listener on .gs-replay.',
  ],
} satisfies LessonMeta;
