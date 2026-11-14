import type { LessonMeta } from '../../types';
import { errors, fire, globalValue, wait, waitFor } from '../../helpers';

const frameFetches = (win: Window) => win.performance.getEntriesByType('resource').filter((e) => /frames\/frame-\d+\.jpg/.test(e.name)).length;
const sequence = (win: Window) => globalValue(win, 'sequence') as (HTMLImageElement | null)[] | undefined;
const canvas = (doc: Document) => doc.querySelector('.cv-scene') as HTMLCanvasElement;
const painted = (doc: Document) => {
  const c = canvas(doc);
  const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
  for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 0) return true;
  return false;
};

export default {
  title: 'Loading image sequences without hurting LCP',
  minutes: 30,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'The opening frame is drawn on the canvas', test: ({ doc }) => waitFor(() => painted(doc), 4000) },
    { label: 'There is no big poster image: the canvas shows the first frame', test: ({ doc }) => doc.querySelectorAll('img').length === 0 },
    {
      label: 'At rest, only the opening frame has been downloaded',
      test: async ({ win }) => { await wait(900); return frameFetches(win) === 1; },
    },
    {
      label: 'Nothing else downloads until the visitor does something',
      test: async ({ win }) => { await wait(600); return frameFetches(win) === 1; },
    },
    {
      label: 'A first pointer move starts the download, and all 48 frames arrive',
      test: async (c) => {
        fire(c, c.doc.body, 'pointermove');
        fire(c, c.doc.body, 'keydown', { key: 'a' });
        const done = () => { const s = sequence(c.win); return !!s && s.length === 48 && s.every((img) => !!img && img.complete && img.naturalWidth > 0); };
        return waitFor(done, 8000);
      },
    },
    {
      label: 'Each frame is fetched once, even after more activity',
      test: async (c) => {
        const before = frameFetches(c.win);
        fire(c, c.doc.body, 'pointermove');
        fire(c, c.doc.body, 'pointerdown');
        await wait(500);
        return before >= 48 && frameFetches(c.win) === before;
      },
    },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'new Promise((resolve) => { const img = new Image(); img.onload = () => resolve(img); img.src = framePath(i); sequence[i] = img; }) is the whole of loadFrame.',
    'A flag does "only once": let started = false; then if (started) return; started = true; at the top of loadRest.',
    'window.removeEventListener needs the same function you added. Loop over the event names for both add and remove, and keep the handler in a named function.',
  ],
} satisfies LessonMeta;
