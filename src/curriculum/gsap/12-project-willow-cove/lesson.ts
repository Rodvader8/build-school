import type { LessonMeta } from '../../types';
import { errors, wait, waitFor } from '../../helpers';

type ST = { start: number; end: number; vars: { pin?: unknown; scrub?: unknown } };
const triggers = (win: Window) => ((win as any).ScrollTrigger?.getAll?.() ?? []) as ST[];
const pinned = (win: Window) => triggers(win).find((s) => s.vars.pin);
const steps = (doc: Document) => Array.from(doc.querySelectorAll('.cb-step'));
const op = (win: Window, el: Element) => parseFloat(win.getComputedStyle(el).opacity);
const visible = (win: Window, doc: Document) => steps(doc).map((s) => op(win, s) > 0.9);
const only = (win: Window, doc: Document, n: number) => { const v = visible(win, doc); return v.length === 3 && v.every((x, i) => x === (i === n)); };
/** How much of the arc is still undrawn: 1 = nothing drawn, 0 = full circle. */
const undrawn = (win: Window, doc: Document) => {
  const cs = win.getComputedStyle(doc.querySelector('.cb-arc')!);
  const dash = parseFloat(cs.strokeDasharray);
  return dash ? parseFloat(cs.strokeDashoffset) / dash : 0; // no dasharray at all means a plain, complete circle
};
const fees = (win: Window, doc: Document) => Array.from(doc.querySelectorAll('.cb-fee')).map((e) => op(win, e));
async function at(win: Window, doc: Document, progress: number) {
  const st = pinned(win)!;
  doc.scrollingElement!.scrollTop = st.start + (st.end - st.start) * progress;
  (win as any).ScrollTrigger.update();
  await wait(60);
}
async function widthTo(win: Window, width: number) {
  (win.frameElement as HTMLIFrameElement).setAttribute('width', String(width));
  await wait(400);
}

export default {
  title: 'Project: rebuild Willow Cove\'s first-visit journey',
  minutes: 75,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'On a wide screen, the visit section is pinned and scrubbed for about three screens', test: ({ win }) => { const st = pinned(win); return !!st && !!st.vars.scrub && st.end - st.start > 1800 && st.end - st.start < 3000; } },
    {
      label: 'The fee cards wait out of sight until you reach them',
      test: async ({ doc, win }) => { doc.scrollingElement!.scrollTop = 0; await wait(100); return fees(win, doc).length === 3 && fees(win, doc).every((o) => o < 0.05); },
    },
    {
      label: 'Start of the pin: the arc is empty and only step 1 shows',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 0);
        return waitFor(() => undrawn(win, doc) > 0.97 && only(win, doc, 0), 4000);
      },
    },
    {
      label: 'Halfway: the arc is half drawn, only step 2 shows, and the section is held at the top',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 0.5);
        return waitFor(() => Math.abs(undrawn(win, doc) - 0.5) < 0.06 && only(win, doc, 1) && Math.abs(section(doc).getBoundingClientRect().top) < 2, 4000);
      },
    },
    {
      label: 'End of the pin: the circle is complete and only step 3 shows',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 1);
        return waitFor(() => undrawn(win, doc) < 0.03 && only(win, doc, 2), 4000);
      },
    },
    {
      label: 'The fee cards arrive in a wave when you scroll to them',
      test: async ({ doc, win }) => {
        doc.querySelector('.cb-fees')!.scrollIntoView({ block: 'center' });
        (win as any).ScrollTrigger.update();
        return waitFor(() => fees(win, doc).every((o) => o === 1), 5000);
      },
    },
    {
      label: 'On a phone-width screen there is no pin, the dial is complete and no layout class is left behind',
      test: async ({ doc, win }) => {
        doc.scrollingElement!.scrollTop = 0;
        await widthTo(win, 600);
        return waitFor(() => !pinned(win) && undrawn(win, doc) < 0.03 && !section(doc).classList.contains('is-live') && triggers(win).length > 0, 5000);
      },
    },
    {
      label: 'On a phone-width screen each step is readable as it arrives',
      test: async ({ doc, win }) => {
        for (const s of steps(doc)) {
          s.scrollIntoView({ block: 'center' });
          (win as any).ScrollTrigger.update();
          if (!(await waitFor(() => Array.from(s.children).every((c) => op(win, c) === 1), 5000))) return false;
        }
        return true;
      },
    },
    {
      label: 'Back to wide, the pinned journey returns from the start',
      test: async ({ doc, win }) => {
        doc.scrollingElement!.scrollTop = 0;
        await widthTo(win, 1200);
        const back = await waitFor(() => !!pinned(win) && section(doc).classList.contains('is-live'), 5000);
        if (!back) return false;
        await at(win, doc, 0);
        return waitFor(() => undrawn(win, doc) > 0.97 && only(win, doc, 0), 4000);
      },
    },
    { label: 'Uses gsap.matchMedia and respects reduced motion', test: ({ files }) => /gsap\.matchMedia\(\)/.test(files['script.js'] ?? '') && /prefers-reduced-motion/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Build it in the order the brief lists it: matchMedia skeleton first, then the wide pinned timeline, then the narrow reveals, then the fees. Test in the preview after each.',
    'For the crossfades, a loop saves typing: for (let k = 1; k < steps.length; k++) { tl.to(steps[k - 1], { autoAlpha: 0 }, k - 0.15).fromTo(steps[k], { autoAlpha: 0 }, { autoAlpha: 1 }, k - 0.1); }',
    'If a narrow check fails, ask what GSAP can\'t undo for you: the is-live class. Return a function that removes it.',
  ],
} satisfies LessonMeta;

function section(doc: Document) {
  return doc.querySelector('.cb-visit') as HTMLElement;
}
