import type { LessonMeta } from '../../types';
import { errors, respectsReducedMotion, threeApp } from '../../helpers';

const lights = (win: Window) => { const out: any[] = []; threeApp(win)?.scene?.traverse((o: any) => o.isLight && out.push(o)); return out; };
const key = (win: Window) => lights(win).find((l) => l.isDirectionalLight && l.castShadow);

export default {
  title: 'Lights and shadows',
  minutes: 30,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'Shadows are switched on in the renderer', test: ({ win }) => threeApp(win)?.renderer?.shadowMap?.enabled === true },
    { label: 'The shadow map uses PCFShadowMap (PCFSoftShadowMap was removed)', test: ({ win }) => threeApp(win)?.renderer?.shadowMap?.type === 1 },
    { label: 'A DirectionalLight casts shadows', test: ({ win }) => !!key(win) },
    { label: 'The key light\'s shadow map is 1024 to 4096 pixels', test: ({ win }) => { const w = key(win)?.shadow?.mapSize?.width ?? 0; return w >= 1024 && w <= 4096; } },
    { label: 'The shadow camera box is tight (6 units each way, under 20 wide)', test: ({ win }) => { const c = key(win)?.shadow?.camera; return !!c && c.right - c.left >= 8 && c.right - c.left <= 20 && c.top - c.bottom <= 20; } },
    { label: 'The ball and the block cast shadows', test: ({ win }) => { const a = threeApp(win); return !!a?.ball?.castShadow && !!a?.block?.castShadow; } },
    { label: 'The floor receives shadows but doesn\'t cast them', test: ({ win }) => { const f = threeApp(win)?.floor; return f?.receiveShadow === true && f?.castShadow !== true; } },
    { label: 'A dimmer fill light (hemisphere or ambient) softens the dark side', test: ({ win }) => { const k = key(win); return !!k && lights(win).some((l) => (l.isHemisphereLight || l.isAmbientLight) && l.intensity > 0 && l.intensity < k.intensity); } },
    { label: 'It checks prefers-reduced-motion before looping', test: ({ files }) => respectsReducedMotion(files, 'main.js') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Four switches have to line up: renderer.shadowMap.enabled = true, light.castShadow = true, and then each mesh needs castShadow and/or receiveShadow. Miss one and there\'s no error, just no shadow.',
    'DirectionalLight shadows are drawn by a hidden orthographic camera: light.shadow.camera. The default box is small, so set left, right, top and bottom yourself, then you can leave the map at 2048.',
    'Object.assign(light.shadow.camera, { left: -6, right: 6 }) sets several at once. If you change the box after the first frame, call light.shadow.camera.updateProjectionMatrix().',
  ],
} satisfies LessonMeta;
