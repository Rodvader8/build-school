import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

const draw = () => renderer.render(scene, camera);

// A flat red plane, drawn by the tiniest possible shader pair. Make it a moving gradient.
// (Shaders are GLSL, written in strings. A typo shows up as a red error in the console, not on the page.)
const uniforms = {
  uTime: { value: 0 },
  // 1. Add uColorA (violet 0x8b5cf6) and uColorB (cyan 0x22d3ee) as new THREE.Color values.
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
// 2. In the vertex shader, declare uniform float uTime, copy position into a vec3 p, and ripple it:
//    p.z += sin(p.x * 3.0 + uTime) * 0.15; then use p in gl_Position.

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
  }
`;
// 3. In the fragment shader, declare uniforms uColorA, uColorB and uTime. Make a moving band:
//    float band = 0.5 + 0.5 * sin(vUv.x * 12.566 + uTime);
//    then gl_FragColor = vec4(mix(uColorA, uColorB, vUv.y * 0.6 + band * 0.4), 1.0);
//    and finish with #include <colorspace_fragment> so the colours look right on screen.

// 4. Give the plane 64 x 64 segments (the ripple needs vertices to move).
const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), material);
scene.add(plane);

// 5. update(delta): move time on by delta seconds, unless calm (then leave uTime alone so the picture stays still).
function update(delta) {}

window.__app = { scene, camera, renderer, plane, update };

draw();
if (!calm) {
  const timer = new THREE.Timer();
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    update(Math.min(timer.getDelta(), 0.1));
    draw();
  });
}
