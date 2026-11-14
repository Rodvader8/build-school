import type { LessonMeta } from '../../types';
import { errors, waitFor } from '../../helpers';

type Tween = { vars: Record<string, unknown>; pause: () => Tween; time: (t?: number) => number; totalDuration: () => number; progress: (p?: number) => number; delay: () => number };
const tweenOf = (win: Window, el: Element | null) => ((el ? (win as any).gsap.getTweensOf(el) : []) as Tween[]).find((t) => t.vars.stagger !== undefined);
const opacities = (win: Window, doc: Document, sel: string) => Array.from(doc.querySelectorAll(sel)).map((e) => parseFloat(win.getComputedStyle(e).opacity));

/** Freeze the tween part-way, read every target's opacity, then finish it so later checks see the end state. */
function sample(win: Window, doc: Document, sel: string, at: number) {
  const tw = tweenOf(win, doc.querySelector(sel));
  if (!tw) return null;
  tw.pause();
  tw.time(at * tw.totalDuration());
  const o = opacities(win, doc, sel);
  tw.progress(1);
  return o;
}

export default {
  title: 'Stagger: one tween, many elements',
  minutes: 15,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'The tiles share one tween with a stagger', test: ({ doc, win }) => !!tweenOf(win, doc.querySelector('.gs-tile')) },
    {
      label: 'Part-way through, the tiles are in a wave: each one behind the one before',
      test: ({ doc, win }) => {
        const o = sample(win, doc, '.gs-tile', 0.45);
        return !!o && o.length === 8 && o.every((v, i) => i === 0 || v <= o[i - 1] + 0.001) && o[0] > o[7] + 0.2;
      },
    },
    {
      label: 'The dots use a stagger object (amount and from)',
      test: ({ doc, win }) => {
        const s = tweenOf(win, doc.querySelector('.gs-dot'))?.vars.stagger as { amount?: number; from?: unknown } | number | undefined;
        return typeof s === 'object' && s !== null && typeof s.amount === 'number' && s.from !== undefined;
      },
    },
    {
      label: 'The dots ripple out from the center',
      test: ({ doc, win }) => {
        const o = sample(win, doc, '.gs-dot', 0.55);
        return !!o && o.length === 12 && o[5] > o[0] + 0.1 && o[6] > o[11] + 0.1 && Math.abs(o[5] - o[6]) < 0.05;
      },
    },
    {
      label: 'The whole entrance takes under 2.5 seconds',
      test: ({ doc, win }) => {
        const t = tweenOf(win, doc.querySelector('.gs-dot'));
        return !!t && t.totalDuration() + t.delay() < 2.5;
      },
    },
    { label: 'Everything ends up fully visible', test: ({ doc, win }) => waitFor(() => [...opacities(win, doc, '.gs-tile'), ...opacities(win, doc, '.gs-dot')].every((v) => v === 1), 5000) },
    { label: 'Reduced motion is respected', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'stagger: 0.08 is a gap between each element. The more elements, the longer the whole wave takes.',
    'stagger: { amount: 0.9, from: \'center\' } fixes the TOTAL spread instead, however many elements there are.',
    'from also accepts \'start\', \'end\', \'edges\', \'random\', or an index number.',
  ],
} satisfies LessonMeta;
