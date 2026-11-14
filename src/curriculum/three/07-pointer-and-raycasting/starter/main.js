import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 1.5, 8);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 1.2));
const key = new THREE.DirectionalLight(0xffffff, 3);
key.position.set(3, 5, 4);
scene.add(key);

// Three boxes you can point at. Each has its own material, so one can glow without the others.
const boxes = [-2.5, 0, 2.5].map((x) => {
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4 }));
  box.position.x = x;
  scene.add(box);
  return box;
});

// hovered and selected are the state the pointer handlers change. Checks read them through __app.
const app = { scene, camera, renderer, boxes, hovered: null, selected: null };
window.__app = app;

const draw = () => renderer.render(scene, camera);

// The selected box grows to 1.25 times its size. Calm mode skips the easing and jumps straight there.
function update(delta) {
  for (const box of boxes) {
    const target = box === app.selected ? 1.25 : 1;
    box.scale.setScalar(calm ? target : box.scale.x + (target - box.scale.x) * (1 - Math.exp(-12 * delta)));
  }
}
app.update = update;

// With a loop, state changes show up on the next frame. In calm mode there's no loop, so call sync().
function sync() {
  if (!calm) return;
  update(1);
  draw();
}

draw();
if (!calm) {
  const timer = new THREE.Timer();
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    update(Math.min(timer.getDelta(), 0.1));
    draw();
  });
}

// 1. Make a Raycaster and a Vector2 for the pointer.
//    Write pick(event): turn the event's clientX/clientY into normalised device coordinates (-1 to 1, y flipped),
//    using canvas.getBoundingClientRect(), then raycaster.setFromCamera(pointer, camera).
//    Return the nearest box the ray hits (raycaster.intersectObjects(boxes)), or null.

// 2. On the canvas's 'pointermove': set app.hovered to pick(event). The hovered box's material.emissive
//    becomes 0x22d3ee, all others 0x000000. Toggle the class 'is-hover' on the canvas. Call sync().

// 3. On the canvas's 'click': set app.selected to pick(event) (null when you click empty space). Call sync().
