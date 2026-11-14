import type { LessonMeta } from '../../types';
import { errors, texts, wait, waitFor } from '../../helpers';

const stats = (doc: Document) => texts(doc, '.gs-stat');
const FINAL = ['184', '1,284', '97'];

export default {
  title: 'Count-ups and the results strip',
  minutes: 25,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'The numbers wait at 0 until you scroll to them', test: async ({ doc }) => { await wait(400); return stats(doc).every((t) => t === '0'); } },
    { label: 'Each of the three stats has its own ScrollTrigger that fires once', test: ({ win }) => { const all = (win as any).ScrollTrigger?.getAll?.() ?? []; return all.length >= 3 && all.every((s: { vars: { once?: boolean } }) => s.vars.once === true); } },
    {
      label: 'Scrolled into view, they count up to 184, 1,284 and 97',
      test: async ({ doc }) => {
        doc.querySelector('.gs-results')!.scrollIntoView({ block: 'center' });
        return waitFor(() => JSON.stringify(stats(doc)) === JSON.stringify(FINAL), 6000);
      },
    },
    {
      label: 'They stay at the final numbers after scrolling away and back',
      test: async ({ doc, win }) => {
        doc.scrollingElement!.scrollTop = 0;
        (win as any).ScrollTrigger.update();
        await wait(300);
        doc.querySelector('.gs-results')!.scrollIntoView({ block: 'center' });
        (win as any).ScrollTrigger.update();
        await wait(300);
        return JSON.stringify(stats(doc)) === JSON.stringify(FINAL);
      },
    },
    { label: 'Reduced motion shows the final numbers straight away', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') && /textContent/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'You can tween any number on any plain object: const counter = { value: 0 }; gsap.to(counter, { value: 184, onUpdate: () => { ... } }).',
    'onUpdate runs on every frame. Inside it, write format(counter.value) into el.textContent. Math.round in format hides the decimals.',
    'once: true kills the trigger after it fires, so scrolling away and back never restarts it.',
  ],
} satisfies LessonMeta;
