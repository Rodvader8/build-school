import type { LessonMeta } from '../../types';
import { errors, wait, waitFor } from '../../helpers';

type ST = { start: number; end: number; vars: { scrub?: unknown } };
const scrubbed = (win: Window) => ((win as any).ScrollTrigger?.getAll?.() as ST[] | undefined)?.find((s) => s.vars.scrub);
const bg = (win: Window, doc: Document) => (win.getComputedStyle(doc.querySelector('.gs-day')!).backgroundColor.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const close = (a: number[], b: number[], tol = 6) => a.length === 3 && a.every((v, i) => Math.abs(v - b[i]) <= tol);
const sunY = (win: Window, doc: Document) => Number((win as any).gsap.getProperty(doc.querySelector('.gs-sun'), 'y'));
async function at(win: Window, doc: Document, progress: number) {
  const st = scrubbed(win)!;
  doc.scrollingElement!.scrollTop = st.start + (st.end - st.start) * progress;
  (win as any).ScrollTrigger.update();
  await wait(60);
}
const reaches = (win: Window, doc: Document, progress: number, colour: string) =>
  at(win, doc, progress).then(() => waitFor(() => close(bg(win, doc), hex(colour)), 4000));

export default {
  title: 'Colour shift on scroll: Brightwater\'s day',
  minutes: 25,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'A scrubbed ScrollTrigger covers the whole tall section', test: ({ doc, win }) => { const st = scrubbed(win); const d = doc.querySelector('.gs-day') as HTMLElement; return !!st && st.end - st.start > d.offsetHeight * 0.6; } },
    { label: 'It starts at dawn (peach)', test: async ({ doc, win }) => !!scrubbed(win) && reaches(win, doc, 0, '#f6d7b8') },
    { label: 'A third of the way, it\'s noon (pale blue)', test: async ({ doc, win }) => !!scrubbed(win) && reaches(win, doc, 1 / 3, '#bfe3f2') },
    {
      label: 'Between noon and sunset the colour is a blend of the two, not a jump',
      test: async ({ doc, win }) => {
        if (!scrubbed(win)) return false;
        await at(win, doc, 0.5);
        return waitFor(() => { const c = bg(win, doc); return !close(c, hex('#bfe3f2'), 12) && !close(c, hex('#c98468'), 12) && c[0] > 150 && c[0] < 240; }, 4000);
      },
    },
    { label: 'Two thirds of the way, it\'s sunset (warm clay)', test: async ({ doc, win }) => !!scrubbed(win) && reaches(win, doc, 2 / 3, '#c98468') },
    { label: 'At the end it\'s dusk (deep navy)', test: async ({ doc, win }) => !!scrubbed(win) && reaches(win, doc, 1, '#1a2748') },
    {
      label: 'The sun has risen by noon, and set by dusk',
      test: async ({ doc, win }) => {
        if (!scrubbed(win)) return false;
        await at(win, doc, 1 / 3);
        const up = await waitFor(() => Math.abs(sunY(win, doc) + 260) < 6, 4000);
        await at(win, doc, 1);
        return up && (await waitFor(() => Math.abs(sunY(win, doc) - 120) < 6, 4000));
      },
    },
    { label: 'The card stays on screen the whole way (sticky)', test: async ({ doc, win }) => { if (!scrubbed(win)) return false; await at(win, doc, 0.5); return Math.abs(doc.querySelector('.gs-day__stick')!.getBoundingClientRect().top) < 2; } },
    { label: 'Reduced motion is respected', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'You can tween a custom property like any other: tl.to(day, { \'--day-bg\': \'#bfe3f2\' }). GSAP blends the colour for you.',
    'With defaults of { ease: \'none\', duration: 1 } on the timeline, three .to() calls fill exactly three seconds, so noon, sunset and dusk land a third of the way apart.',
    'The sun tweens are positioned: .to(sun, { y: -260 }, 0) starts at 0 seconds, .to(sun, { y: 120 }, 2) starts at 2 seconds.',
  ],
} satisfies LessonMeta;
