import type { LessonMeta } from '../../types';
import { errors, wait, waitFor } from '../../helpers';

type ST = { start: number; end: number; vars: { pin?: unknown; scrub?: unknown; invalidateOnRefresh?: unknown } };
const pinned = (win: Window) => ((win as any).ScrollTrigger?.getAll?.() as ST[] | undefined)?.find((s) => s.vars.pin);
const track = (doc: Document) => doc.querySelector('.gs-track') as HTMLElement;
const distance = (win: Window, doc: Document) => track(doc).scrollWidth - win.innerWidth;
const x = (win: Window, doc: Document) => Number((win as any).gsap.getProperty(track(doc), 'x'));
async function at(win: Window, doc: Document, progress: number) {
  const st = pinned(win)!;
  doc.scrollingElement!.scrollTop = st.start + (st.end - st.start) * progress;
  (win as any).ScrollTrigger.update();
  await wait(60);
}
async function resizeTo(win: Window, width: number) {
  (win.frameElement as HTMLIFrameElement).setAttribute('width', String(width));
  await wait(400);
}
const pinMatchesTrack = (win: Window, doc: Document) => { const st = pinned(win); return !!st && Math.abs(st.end - st.start - distance(win, doc)) < 3; };

export default {
  title: 'A horizontal pinned track: Anchorline\'s industries',
  minutes: 30,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'The section is pinned and scrubbed by a ScrollTrigger', test: ({ win }) => !!pinned(win) && !!pinned(win)!.vars.scrub },
    { label: 'The vertical scroll distance equals the sideways distance the track travels', test: ({ doc, win }) => pinMatchesTrack(win, doc) },
    {
      label: 'At the start of the pin the first card is in view (track at 0)',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 0);
        return waitFor(() => Math.abs(x(win, doc)) < 3, 4000);
      },
    },
    {
      label: 'Halfway through the scroll, the track is halfway along',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 0.5);
        return waitFor(() => Math.abs(x(win, doc) + distance(win, doc) / 2) < 6, 4000);
      },
    },
    {
      label: 'At the end, the last card has arrived and sits fully on screen',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        await at(win, doc, 1);
        const lastIn = () => { const r = doc.querySelector('.gs-slide:last-child')!.getBoundingClientRect(); return r.right <= win.innerWidth && r.left >= 0; };
        return waitFor(lastIn, 4000);
      },
    },
    {
      label: 'It re-measures when the window changes size (try 1000px wide)',
      test: async ({ doc, win }) => {
        if (!pinned(win)) return false;
        doc.scrollingElement!.scrollTop = 0;
        await resizeTo(win, 1000);
        const ok = await waitFor(() => pinMatchesTrack(win, doc), 4000);
        await resizeTo(win, 1200);
        await waitFor(() => pinMatchesTrack(win, doc), 4000);
        return ok && !!pinned(win)!.vars.invalidateOnRefresh;
      },
    },
    { label: 'Reduced motion and narrow screens keep the swipeable carousel', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') && /min-width/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'The tween is gsap.to(track, { x: () => -distance(), ease: \'none\', scrollTrigger: { ... } }). A function value is called again whenever ScrollTrigger refreshes.',
    'end: () => \'+=\' + distance() means "pin for as many pixels of scrolling as the track needs to travel". That keeps one pixel of scroll = one pixel of sideways movement.',
    'Without invalidateOnRefresh: true, GSAP remembers the numbers from page load, and a resized window ends up with a track that stops short or overshoots.',
  ],
} satisfies LessonMeta;
