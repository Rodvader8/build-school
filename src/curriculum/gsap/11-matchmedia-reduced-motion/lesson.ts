import type { LessonMeta } from '../../types';
import { errors, wait, waitFor } from '../../helpers';

type ST = { vars: { pin?: unknown } };
const triggers = (win: Window) => ((win as any).ScrollTrigger?.getAll?.() ?? []) as ST[];
const hasPin = (win: Window) => triggers(win).some((s) => s.vars.pin);
const band = (doc: Document) => doc.querySelector('.gs-band')!;
const fades = (win: Window, doc: Document) => Array.from(doc.querySelectorAll('.gs-fade')).map((e) => parseFloat(win.getComputedStyle(e).opacity));
async function widthTo(win: Window, width: number) {
  (win.frameElement as HTMLIFrameElement).setAttribute('width', String(width));
  await wait(400);
}

export default {
  title: 'matchMedia and reduced motion',
  minutes: 30,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'Uses gsap.matchMedia()', test: ({ files }) => /gsap\.matchMedia\(\)/.test(files['script.js'] ?? '') },
    { label: 'On a wide screen the band is pinned and has the is-pinned class', test: ({ doc, win }) => hasPin(win) && band(doc).classList.contains('is-pinned') },
    {
      label: 'On a narrow screen the pin goes, and the class comes off with it (cleanup)',
      test: async ({ doc, win }) => {
        await widthTo(win, 600);
        return waitFor(() => !hasPin(win) && !band(doc).classList.contains('is-pinned'), 5000);
      },
    },
    {
      label: 'On a narrow screen the cards wait out of sight, then fade in as you reach them',
      test: async ({ doc, win }) => {
        const hidden = await waitFor(() => fades(win, doc).length === 3 && fades(win, doc).every((o) => o < 0.05), 4000);
        doc.querySelector('.gs-fades')!.scrollIntoView({ block: 'center' });
        (win as any).ScrollTrigger.update();
        return hidden && (await waitFor(() => fades(win, doc).every((o) => o === 1), 5000));
      },
    },
    {
      label: 'Back to a wide screen, the pin returns and the cards are plainly visible again',
      test: async ({ doc, win }) => {
        doc.scrollingElement!.scrollTop = 0;
        await widthTo(win, 1200);
        return waitFor(() => hasPin(win) && band(doc).classList.contains('is-pinned') && fades(win, doc).every((o) => o === 1), 5000);
      },
    },
    { label: 'Reduced motion is its own named condition', test: ({ files }) => /\(prefers-reduced-motion:\s*reduce\)/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'mm.add({ wide: \'(min-width: 900px)\', narrow: \'(max-width: 899px)\', calm: \'(prefers-reduced-motion: reduce)\' }, (context) => { const { wide, calm } = context.conditions; ... }) is the whole skeleton.',
    'matchMedia only runs your function when at least one condition matches. If the phone version never runs, check you gave it a condition of its own, like narrow: \'(max-width: 899px)\'.',
    'If the narrow checks fail, make sure the class removal is returned as a function, not called: return () => ..., not return band.classList.remove(...).',
  ],
} satisfies LessonMeta;
