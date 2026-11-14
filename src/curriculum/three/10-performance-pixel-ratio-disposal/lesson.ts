import type { LessonMeta } from '../../types';
import { errors, meshesIn, respectsReducedMotion, threeApp, wait } from '../../helpers';

const pretendRatio = (win: Window, value: number) => Object.defineProperty(win, 'devicePixelRatio', { value, configurable: true });

export default {
  title: 'Performance: pixel ratio and disposal',
  minutes: 40,
  kind: 'web',
  entry: 'main.js',
  checks: [
    {
      label: 'On a 3x screen the pixel ratio is capped at 2, and on a 1.5x screen it stays at 1.5',
      test: ({ win }) => {
        const a = threeApp(win);
        if (typeof a?.resize !== 'function') return false;
        const original = Object.getOwnPropertyDescriptor(win, 'devicePixelRatio');
        try {
          pretendRatio(win, 3);
          a.resize();
          const high = a.renderer.getPixelRatio();
          pretendRatio(win, 1.5);
          a.resize();
          const mid = a.renderer.getPixelRatio();
          return high === 2 && mid === 1.5;
        } finally {
          if (original) Object.defineProperty(win, 'devicePixelRatio', original);
          a.resize();
        }
      },
    },
    { label: 'The 300 cubes are one InstancedMesh with 300 instances', test: ({ win }) => { const ms = meshesIn(threeApp(win)?.scene); return ms.length === 1 && ms[0].isInstancedMesh === true && ms[0].count === 300; } },
    { label: 'The whole scene is drawn in 2 or fewer draw calls', test: ({ win }) => { const a = threeApp(win); if (!a) return false; a.renderer.render(a.scene, a.camera); return a.renderer.info.render.calls <= 2; } },
    {
      label: 'Rebuilding five times doesn\'t pile up geometries or textures on the graphics card',
      test: ({ win }) => {
        const a = threeApp(win);
        if (typeof a?.rebuild !== 'function') return false;
        a.renderer.render(a.scene, a.camera);
        const g = a.renderer.info.memory.geometries;
        const t = a.renderer.info.memory.textures;
        for (let i = 0; i < 5; i++) {
          a.rebuild();
          a.renderer.render(a.scene, a.camera);
        }
        return g >= 1 && a.renderer.info.memory.geometries === g && a.renderer.info.memory.textures === t && meshesIn(a.scene).length === 1;
      },
    },
    { label: 'The loop is gated on the canvas being on screen and the tab being visible', test: ({ files }) => /new IntersectionObserver\(/.test(files['main.js'] ?? '') && /visibilitychange/.test(files['main.js'] ?? '') && /setAnimationLoop\(\s*\w+\s*\?\s*\w+\s*:\s*null\s*\)|setAnimationLoop\(\s*null\s*\)/.test(files['main.js'] ?? '') },
    { label: 'It checks prefers-reduced-motion', test: ({ files }) => respectsReducedMotion(files, 'main.js') },
    {
      label: 'destroy() stops the loop and frees everything',
      test: async ({ win }) => {
        const a = threeApp(win);
        if (typeof a?.destroy !== 'function') return false;
        a.destroy();
        const frames = a.renderer.info.render.frame;
        await wait(250);
        return a.renderer.info.render.frame === frames && a.renderer.info.memory.geometries === 0 && a.renderer.info.memory.textures === 0;
      },
    },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'An InstancedMesh draws the same geometry many times in one call. You still give every copy its own position through setMatrixAt(i, matrix). Build the matrix by setting position and rotation on a dummy Object3D, then dummy.updateMatrix().',
    'scene.remove(thing) only detaches it. The graphics card keeps its copy until you call .dispose() on the geometry, the material, and every texture the material uses. Object.values(material) is a quick way to find the textures.',
    'Watch renderer.info in the console: info.render.calls is draw calls per frame, and info.memory.geometries and .textures are what\'s currently on the card. If those numbers climb when you rebuild, something isn\'t being disposed.',
  ],
} satisfies LessonMeta;
