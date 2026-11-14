import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 1.5, 8);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.shadowMap.enabled = true;

scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 1.2));
const key = new THREE.DirectionalLight(0xffffff, 3);
key.position.set(3, 6, 4);
key.castShadow = true;
scene.add(key);

let gem = null; // the spinning crystal, once the model has loaded

function update(delta) {
  if (gem) gem.rotation.y += 0.8 * delta;
}

const timer = new THREE.Timer();

new GLTFLoader().load(
  'gem.glb',
  (gltf) => {
    const model = gltf.scene;

    // The file is huge, so fit it: scale the biggest side to 3 units, then centre it.
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    model.scale.setScalar(3 / Math.max(size.x, size.y, size.z));
    box.setFromObject(model);
    model.position.sub(box.getCenter(new THREE.Vector3()));

    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    gem = model.getObjectByName('Gem');
    scene.add(model);
    window.__app.model = model;
    window.__app.gem = gem;
    renderer.render(scene, camera); // calm mode has no loop, so draw once it has arrived
  },
  undefined,
  (error) => console.warn('Could not load gem.glb:', error),
);

window.__app = { scene, camera, renderer, update };

renderer.render(scene, camera);
if (!calm) {
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    update(Math.min(timer.getDelta(), 0.1));
    renderer.render(scene, camera);
  });
}
