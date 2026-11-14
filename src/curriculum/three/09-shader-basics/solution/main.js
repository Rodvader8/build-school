import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

const draw = () => renderer.render(scene, camera);

const uniforms = {
  uTime: { value: 1.5 }, // a nice-looking moment, which is also what calm mode holds on
  uColorA: { value: new THREE.Color(0x8b5cf6) },
  uColorB: { value: new THREE.Color(0x22d3ee) },
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += sin(p.x * 3.0 + uTime) * 0.15;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  void main() {
    float band = 0.5 + 0.5 * sin(vUv.x * 12.566 + uTime);
    gl_FragColor = vec4(mix(uColorA, uColorB, vUv.y * 0.6 + band * 0.4), 1.0);
    #include <colorspace_fragment>
  }
`;

const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4, 64, 64), material);
scene.add(plane);

function update(delta) {
  if (!calm) uniforms.uTime.value += delta;
}

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
