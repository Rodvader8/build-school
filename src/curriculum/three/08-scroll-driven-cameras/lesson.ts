import type { LessonMeta } from '../../types';
import { errors, respectsReducedMotion, threeApp, wait } from '../../helpers';
import type { CheckContext } from '../../types';

/** Scrolls the page to a fraction of its length and lets the camera settle. */
async function scrollTo(c: CheckContext, fraction: number, settle = true) {
  const el = c.doc.scrollingElement!;
  el.scrollTop = (el.scrollHeight - c.win.innerHeight) * fraction;
  c.win.dispatchEvent(new Event('scroll'));
  await wait(30);
  if (settle) threeApp(c.win)?.update?.(10);
}
const near = (v: number, goal: number, tol = 0.05) => Math.abs(v - goal) < tol;

export default {
  title: 'Scroll-driven cameras',
  minutes: 40,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'The page is tall enough to scroll', test: ({ doc, win }) => doc.scrollingElement!.scrollHeight > win.innerHeight * 2 },
    { label: 'window.__app exposes an update(delta) function', test: ({ win }) => typeof threeApp(win)?.update === 'function' },
    { label: 'At the top of the page the camera is at (0, 2, 12)', test: async (c) => { await scrollTo(c, 0); const p = threeApp(c.win)?.camera?.position; return !!p && near(p.x, 0) && near(p.y, 2) && near(p.z, 12); } },
    { label: 'At the bottom it has flown to (0, 1.5, -14)', test: async (c) => { await scrollTo(c, 1); const p = threeApp(c.win)?.camera?.position; return !!p && near(p.x, 0) && near(p.y, 1.5) && near(p.z, -14); } },
    {
      label: 'Halfway down, it\'s halfway along: in between, and still heading forward',
      test: async (c) => {
        const cam = threeApp(c.win)?.camera;
        if (!cam) return false;
        await scrollTo(c, 0);
        const z0 = cam.position.z;
        await scrollTo(c, 0.5);
        const zMid = cam.position.z;
        await scrollTo(c, 1);
        return z0 > zMid && zMid > cam.position.z && zMid < 6 && zMid > -8;
      },
    },
    {
      label: 'It eases: a jump to the end moves only partway in one frame, and arrives given time',
      test: async (c) => {
        const a = threeApp(c.win);
        if (!a) return false;
        await scrollTo(c, 0);
        // Scroll, step exactly one frame and measure, all in the same tick: the page's own
        // animation loop can't run in between, so the result doesn't depend on machine speed.
        const el = c.doc.scrollingElement!;
        el.scrollTop = el.scrollHeight - c.win.innerHeight;
        c.win.dispatchEvent(new Event('scroll'));
        a.update(0.016);
        const early = a.camera.position.z;
        a.update(10);
        return early > -2 && near(a.camera.position.z, -14);
      },
    },
    {
      label: 'The camera faces down the corridor, towards (0, 1, -20)',
      test: async (c) => {
        const a = threeApp(c.win);
        if (!a) return false;
        await scrollTo(c, 0.5);
        const dir = a.camera.getWorldDirection(new a.camera.position.constructor());
        const want = new a.camera.position.constructor(0, 1, -20).sub(a.camera.position).normalize();
        return dir.dot(want) > 0.99;
      },
    },
    { label: 'The scroll listener is passive', test: ({ files }) => /addEventListener\(\s*['"]scroll['"][^)]*passive\s*:\s*true/.test(files['main.js'] ?? '') },
    { label: 'Reduced motion gets a still view with no scroll hijack', test: ({ files }) => respectsReducedMotion(files, 'main.js') && /calm/.test(files['main.js'] ?? '') && /place\(1\)/.test(files['main.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'path.getPointAt(0) is the first point and path.getPointAt(1) the last. A CatmullRomCurve3 draws a smooth curve through your points, so the camera swings rather than snapping from corner to corner.',
    'target jumps whenever you scroll. smoothed chases it a little every frame: smoothed += (target - smoothed) * (1 - Math.exp(-6 * delta)). A bigger 6 is snappier, a smaller one is floatier.',
    'In the scroll handler, only store the number. Don\'t move the camera or draw there. The loop does that once per frame, however many scroll events the browser fires.',
  ],
} satisfies LessonMeta;
