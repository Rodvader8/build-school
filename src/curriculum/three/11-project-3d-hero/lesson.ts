import type { LessonMeta } from '../../types';
import { errors, fire, threeApp, wait, waitFor } from '../../helpers';

const hero = (doc: Document) => doc.querySelector('.hero')!;
const src = (files: Record<string, string>) => files['main.js'] ?? '';
const near = (v: number, goal: number, tol = 0.05) => Math.abs(v - goal) < tol;
const pretendRatio = (win: Window, value: number) => Object.defineProperty(win, 'devicePixelRatio', { value, configurable: true });

export default {
  title: 'Project: a 3D hero',
  minutes: 60,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'The poster image is the fallback: it loads, has size attributes and meaningful alt text', test: ({ doc }) => { const i = doc.querySelector<HTMLImageElement>('.hero__poster'); return !!i && i.naturalWidth > 0 && !!i.getAttribute('width') && !!i.getAttribute('height') && (i.getAttribute('alt') ?? '').length > 10; } },
    { label: 'The mode is decided: window.__heroMode is "three" here, and the hero has is-3d', test: ({ win, doc }) => (win as any).__heroMode === 'three' && hero(doc).classList.contains('is-3d') },
    { label: 'Three.js loads late and builds the scene (window.__app with a crystal)', test: ({ win }) => waitFor(() => !!threeApp(win)?.crystal?.isMesh && !!threeApp(win)?.renderer?.isWebGLRenderer, 7000) },
    { label: 'The first frame fades the poster out: the hero is live and the canvas visible', test: ({ doc, win }) => waitFor(() => hero(doc).classList.contains('is-live') && !doc.querySelector('canvas')!.hidden && (threeApp(win)?.renderer?.info.render.frame ?? 0) >= 1, 300) },
    {
      label: 'The pixel ratio is capped (a 3x screen draws at 2 or less)',
      test: ({ win }) => {
        const a = threeApp(win);
        if (typeof a?.resize !== 'function') return false;
        const original = Object.getOwnPropertyDescriptor(win, 'devicePixelRatio');
        try {
          pretendRatio(win, 3);
          a.resize();
          return a.renderer.getPixelRatio() <= 2 && a.renderer.getPixelRatio() >= 1;
        } finally {
          if (original) Object.defineProperty(win, 'devicePixelRatio', original);
          a.resize();
        }
      },
    },
    {
      label: 'Scrolling through the hero dollies the camera in, from z 7 to z 4.2',
      test: async (c) => {
        const a = threeApp(c.win);
        if (typeof a?.update !== 'function') return false;
        const el = c.doc.scrollingElement!;
        el.scrollTop = 0;
        c.win.dispatchEvent(new Event('scroll'));
        a.update(10);
        const top = a.camera.position.z;
        el.scrollTop = hero(c.doc).getBoundingClientRect().height + 50;
        c.win.dispatchEvent(new Event('scroll'));
        await wait(30);
        a.update(10);
        const end = a.camera.position.z;
        el.scrollTop = 0;
        c.win.dispatchEvent(new Event('scroll'));
        return near(top, 7) && near(end, 4.2);
      },
    },
    {
      label: 'The camera drifts towards the pointer (parallax)',
      test: async (c) => {
        const a = threeApp(c.win);
        if (typeof a?.update !== 'function') return false;
        const w = c.win.innerWidth, h = c.win.innerHeight;
        fire(c, c.doc.body, 'pointermove', { clientX: w, clientY: h / 2 });
        a.update(10);
        const right = a.camera.position.x;
        fire(c, c.doc.body, 'pointermove', { clientX: 0, clientY: h / 2 });
        a.update(10);
        const left = a.camera.position.x;
        fire(c, c.doc.body, 'pointermove', { clientX: w / 2, clientY: h / 2 });
        a.update(10);
        return right > 0.3 && left < -0.3;
      },
    },
    { label: 'The fallback logic: reduced motion or no WebGL2 means static, and Three.js is only imported dynamically', test: ({ files }) => /getContext\(\s*['"]webgl2?['"]/.test(src(files)) && /calm/.test(src(files).replace(/const calm[^\n]*/, '')) && /is-static/.test(src(files)) && /await import\(\s*['"]three['"]\s*\)/.test(src(files)) && !/^import[^\n]*from\s*['"]three['"]/m.test(src(files)) },
    { label: 'The loop runs only while the hero is on screen and the tab is visible', test: ({ files }) => /new IntersectionObserver\(/.test(src(files)) && /visibilitychange/.test(src(files)) && /setAnimationLoop\(\s*\w+\s*\?\s*\w+\s*:\s*null\s*\)/.test(src(files)) },
    { label: 'It starts on idle with a timer fallback, and tidies up on pagehide', test: ({ files }) => /requestIdleCallback/.test(src(files)) && /setTimeout\(/.test(src(files)) && /pagehide/.test(src(files)) },
    {
      label: 'destroy() stops the loop and frees the geometry',
      test: async ({ win }) => {
        const a = threeApp(win);
        if (typeof a?.destroy !== 'function') return false;
        a.destroy();
        const frames = a.renderer.info.render.frame;
        await wait(250);
        return a.renderer.info.render.frame === frames && a.renderer.info.memory.geometries === 0;
      },
    },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Check the cheap, certain things first: const mode = !calm && hasWebGL() ? \'three\' : \'static\'. In static mode the poster image already covers the whole hero, so there is nothing more to do, and nothing more to download.',
    'The same pattern you wrote in lessons 8 and 10 applies here, just inside one async function: state that eases towards targets in update(delta), a sync() that starts or stops the loop, and a destroy() that disposes.',
    'You can\'t use a normal import at the top of the file if the static path should skip downloading Three.js. A dynamic import() returns a promise: const THREE = await import(\'three\') inside an async function.',
  ],
} satisfies LessonMeta;
