import type { LessonMeta } from '../../types';
import { errors, respectsReducedMotion, threeApp, waitFor } from '../../helpers';

const mat = (win: Window) => threeApp(win)?.floor?.material;
const loaded = (t: any) => !!t?.isTexture && !!t.image && t.image.width > 0;

export default {
  title: 'Textures',
  minutes: 30,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'The floor material has a colour map (map) that has finished loading', test: ({ win }) => waitFor(() => loaded(mat(win)?.map), 4000) },
    { label: 'The colour map is marked sRGB', test: ({ win }) => mat(win)?.map?.colorSpace === 'srgb' },
    { label: 'There\'s a separate roughnessMap, loaded, and left as plain data (not sRGB)', test: async ({ win }) => (await waitFor(() => loaded(mat(win)?.roughnessMap), 300)) && mat(win).roughnessMap !== mat(win).map && mat(win).roughnessMap.colorSpace !== 'srgb' },
    { label: 'Both textures tile (RepeatWrapping) and repeat more than once', test: ({ win }) => [mat(win)?.map, mat(win)?.roughnessMap].every((t) => t && t.wrapS === 1000 && t.wrapT === 1000 && t.repeat.x > 1 && t.repeat.y > 1) },
    { label: 'Anisotropy is raised to the most this graphics card allows', test: ({ win }) => { const a = threeApp(win); const max = a?.renderer?.capabilities?.getMaxAnisotropy?.(); return !!max && mat(win)?.map?.anisotropy === max && mat(win)?.roughnessMap?.anisotropy === max; } },
    { label: 'The roughness is 1, so the map decides how shiny each bit is', test: ({ win }) => mat(win)?.roughness === 1 },
    { label: 'In calm mode the scene redraws when a texture arrives', test: ({ files }) => /\.load\([^;]*renderer\.render/s.test(files['main.js'] ?? '') && respectsReducedMotion(files, 'main.js') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'loader.load(url) returns a Texture straight away and fills in its image later. You can set wrapS, repeat and the rest immediately, without waiting.',
    'Colour maps (what you see) are sRGB: texture.colorSpace = THREE.SRGBColorSpace. Data maps (roughness, normal, bump) are numbers, not colours, so they stay linear. Mixing them up makes things look washed out or too dark.',
    'wrapS and wrapT are the horizontal and vertical wrapping, and repeat.set(3, 3) tiles three times each way. Both need RepeatWrapping first.',
  ],
} satisfies LessonMeta;
