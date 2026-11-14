import type { LessonMeta } from '../../types';
import { errors, respectsReducedMotion, threeApp, waitFor } from '../../helpers';

const mat = (win: Window) => threeApp(win)?.plane?.material;

export default {
  title: 'Shader basics',
  minutes: 40,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'The plane uses a ShaderMaterial', test: ({ win }) => mat(win)?.isShaderMaterial === true },
    { label: 'Uniforms uTime (a number) and uColorA and uColorB (Colors) are passed in', test: ({ win }) => { const u = mat(win)?.uniforms; return typeof u?.uTime?.value === 'number' && !!u?.uColorA?.value?.isColor && !!u?.uColorB?.value?.isColor; } },
    { label: 'The vertex shader ripples the position with sin() and uTime', test: ({ win }) => { const v: string = mat(win)?.vertexShader ?? ''; return /uniform\s+float\s+uTime/.test(v) && /sin\(/.test(v) && /gl_Position/.test(v); } },
    { label: 'The fragment shader mixes the two colours using vUv', test: ({ win }) => { const f: string = mat(win)?.fragmentShader ?? ''; return /uniform\s+vec3\s+uColorA/.test(f) && /uniform\s+vec3\s+uColorB/.test(f) && /mix\(/.test(f) && /vUv/.test(f); } },
    { label: 'The plane has enough vertices (at least 32 x 32 segments) for the ripple', test: ({ win }) => { const p = threeApp(win)?.plane?.geometry?.parameters; return (p?.widthSegments ?? 0) >= 32 && (p?.heightSegments ?? 0) >= 32; } },
    { label: 'The shaders compile: the card has a program for them and nothing is logged as an error', test: async ({ win }) => (await waitFor(() => (threeApp(win)?.renderer?.info?.programs?.length ?? 0) >= 1, 3000)) && errors(win).length === 0 },
    {
      label: 'update(0.5) moves uTime on by 0.5 seconds',
      test: ({ win }) => {
        const a = threeApp(win);
        if (typeof a?.update !== 'function') return false;
        const t = a.plane.material.uniforms.uTime.value;
        a.update(0.5);
        return Math.abs(a.plane.material.uniforms.uTime.value - t - 0.5) < 0.001;
      },
    },
    { label: 'Calm mode leaves uTime alone (no loop, and update does nothing)', test: ({ files }) => respectsReducedMotion(files, 'main.js') && /if\s*\(\s*!calm\s*\)|calm\s*\)?\s*return/.test(files['main.js'] ?? '') },
  ],
  hints: [
    'A uniform is a value you set from JavaScript and read in the shader. Declare it in GLSL (uniform float uTime;), put it in the uniforms object ({ uTime: { value: 0 } }), and change it by setting uniforms.uTime.value.',
    'GLSL is picky: every float needs a decimal point (2.0, not 2), and statements end in a semicolon. The console error names the line number inside your shader string.',
    'mix(a, b, t) blends from a to b as t goes 0 to 1. fract(), sin() and smoothstep() are the other three functions that make most shader effects.',
  ],
} satisfies LessonMeta;
