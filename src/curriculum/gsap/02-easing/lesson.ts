import type { LessonMeta } from '../../types';
import { errors, waitFor } from '../../helpers';

type Tween = { vars: Record<string, unknown>; duration: () => number };
const tweensOf = (win: Window, sel: string, doc: Document): Tween[] => {
  const el = doc.querySelector(sel);
  return el ? ((win as any).gsap.getTweensOf(el) as Tween[]) : [];
};
const easeIs = (name: string, sel: string): ((c: { doc: Document; win: Window }) => boolean) => ({ doc, win }) =>
  tweensOf(win, sel, doc).some((t) => String(t.vars.ease).replace(/\s/g, '') === name.replace(/\s/g, ''));

export default {
  title: 'Easing: the feel of a movement',
  minutes: 15,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'gsap.defaults sets a 1.2 second duration for every tween', test: ({ win }) => (win as any).gsap?.defaults?.().duration === 1.2 },
    { label: 'Ball 1 moves with ease "none" (constant speed)', test: easeIs('none', '.gs-ball-1') },
    { label: 'Ball 2 uses "power3.out" (fast start, soft landing)', test: easeIs('power3.out', '.gs-ball-2') },
    { label: 'Ball 3 uses "back.out(1.7)" (overshoots, then settles)', test: easeIs('back.out(1.7)', '.gs-ball-3') },
    { label: 'Ball 4 uses "elastic.out(1, 0.4)" (springs)', test: easeIs('elastic.out(1,0.4)', '.gs-ball-4') },
    {
      label: 'All four balls land exactly 600px along',
      test: ({ doc, win }) =>
        waitFor(() => [1, 2, 3, 4].every((n) => (win as any).gsap.getProperty(doc.querySelector(`.gs-ball-${n}`), 'x') === 600), 6000),
    },
    { label: 'Reduced motion is respected', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'gsap.defaults({ duration: 1.2 }) goes before the tweens. Any tween that leaves duration out picks it up.',
    'The ease goes inside the same object as x: gsap.to(\'.gs-ball-2\', { x: 600, ease: \'power3.out\' }).',
    'Spell the ease exactly as it is written beside the lane, including the brackets and numbers.',
  ],
} satisfies LessonMeta;
