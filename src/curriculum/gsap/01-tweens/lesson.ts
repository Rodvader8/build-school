import type { LessonMeta } from '../../types';
import { errors, waitFor } from '../../helpers';

type Tween = { vars: Record<string, unknown>; duration: () => number };
const tweensOf = (win: Window, el: Element | null): Tween[] => (el ? ((win as any).gsap.getTweensOf(el) as Tween[]) : []);

export default {
  title: 'Tweens: to, from, fromTo',
  minutes: 20,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'GSAP is loaded on the page', test: ({ win }) => typeof (win as any).gsap?.to === 'function' },
    {
      label: 'The headline animates in with gsap.from (starts invisible, 40px low)',
      test: ({ doc, win }) => tweensOf(win, doc.querySelector('.gs-title')).some((t) => t.vars.opacity === 0 && t.vars.y === 40),
    },
    {
      label: 'The button pulses forever: repeat -1 with yoyo',
      test: ({ doc, win }) => tweensOf(win, doc.querySelector('.gs-cta')).some((t) => t.vars.repeat === -1 && t.vars.yoyo === true && t.vars.scale !== undefined),
    },
    {
      label: 'All three cards animate with gsap.fromTo (opacity 0 to 1)',
      test: ({ doc, win }) => {
        const cards = Array.from(doc.querySelectorAll('.gs-card'));
        return cards.length === 3 && cards.every((c) => tweensOf(win, c).some((t) => t.vars.opacity === 1 && (t.vars.startAt as Record<string, unknown> | undefined)?.opacity === 0));
      },
    },
    {
      label: 'When it finishes, the headline and cards are fully visible again',
      test: async ({ doc, win }) =>
        waitFor(() => {
          const els = [doc.querySelector('.gs-title'), ...Array.from(doc.querySelectorAll('.gs-card'))];
          return els.every((el) => !!el && win.getComputedStyle(el).opacity === '1');
        }, 5000),
    },
    { label: 'Reduced motion is respected', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'gsap.from(target, { y: 40, opacity: 0, duration: 1 }) describes where it starts. It ends where the CSS already put it.',
    'A pulse needs three things together: repeat: -1 (forever), yoyo: true (go back the way it came) and a property to change, like scale.',
    'fromTo takes two objects: gsap.fromTo(targets, { start values }, { end values, duration }). Passing a selector that matches three cards animates all three.',
  ],
} satisfies LessonMeta;
