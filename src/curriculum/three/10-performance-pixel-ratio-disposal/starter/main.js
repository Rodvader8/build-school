import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 4, 14);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 1.4));
const key = new THREE.DirectionalLight(0xffffff, 2.5);
key.position.set(3, 6, 4);
scene.add(key);

const COUNT = 300;
// A tiny repeatable "random", so every rebuild makes the same arrangement.
const rand = (i, k) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

function makeTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 16;
  const g = c.getContext('2d');
  const gradient = g.createLinearGradient(0, 0, 16, 16);
  gradient.addColorStop(0, '#8b5cf6');
  gradient.addColorStop(1, '#22d3ee');
  g.fillStyle = gradient;
  g.fillRect(0, 0, 16, 16);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const draw = () => renderer.render(scene, camera);

// This works, but it wastes a lot. Fix it a step at a time.

// 4. (Do this one last.) Gate the loop: it should only run when the canvas is on screen AND the tab is visible AND
//    calm is false. Write sync() to start or stop renderer.setAnimationLoop (null stops it), driven by an
//    IntersectionObserver on the canvas and a 'visibilitychange' listener. Guard so it never stacks loops.

// Step 1: build() makes 300 separate meshes, each with its own geometry, material AND texture.
//         Rewrite it as ONE InstancedMesh(geometry, material, COUNT) with one of each. Use a dummy THREE.Object3D:
//         set its position and rotation, dummy.updateMatrix(), mesh.setMatrixAt(i, dummy.matrix),
//         then mesh.instanceMatrix.needsUpdate = true. Still return a Group holding it.
function build() {
  const group = new THREE.Group();
  for (let i = 0; i < COUNT; i++) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({ map: makeTexture() }));
    mesh.position.set((rand(i, 1) - 0.5) * 16, (rand(i, 2) - 0.5) * 8, (rand(i, 3) - 0.5) * 16);
    mesh.rotation.set(rand(i, 4) * 3, rand(i, 5) * 3, 0);
    group.add(mesh);
  }
  return group;
}
let group = build();
scene.add(group);

// Step 2: resize() should cap the pixel ratio: renderer.setPixelRatio(Math.min(devicePixelRatio, 2)),
//         then do the usual size and aspect update, and draw.
function resize() {
  const { clientWidth: w, clientHeight: h } = canvas;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  draw();
}
addEventListener('resize', resize);

// Step 3: disposeTree(root) frees GPU memory for everything under root: each geometry, each material, and every
//         texture a material holds. rebuild() removes the old group, disposes it, builds a fresh one and draws.
//         destroy() stops the loop, disposes the whole scene, then renderer.dispose().
function disposeTree(root) {}
function rebuild() {
  scene.remove(group);
  group = build();
  scene.add(group);
  draw();
}
function destroy() {}

function update(delta) {
  group.rotation.y += 0.1 * delta;
}

window.__app = { scene, camera, renderer, resize, rebuild, destroy, update };

draw();
if (!calm) {
  const timer = new THREE.Timer();
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    update(Math.min(timer.getDelta(), 0.1));
    draw();
  });
}
