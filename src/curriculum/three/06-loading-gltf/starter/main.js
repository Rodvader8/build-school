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

// gem.glb (in this folder) was exported from Three.js itself. It holds a marble Plinth and a crystal Gem,
// and it's deliberately far too big for the camera.

// 1. Load it with GLTFLoader: loader.load(url, onLoad, undefined, onError).
//    In onLoad, with gltf.scene as `model`:
//    - scale it so its biggest side is 3 units: use new THREE.Box3().setFromObject(model).getSize(...)
//    - then centre it on the origin: box.setFromObject(model) again, and model.position.sub(centre)
//    - make every mesh inside it castShadow and receiveShadow (model.traverse)
//    - find the crystal: gem = model.getObjectByName('Gem')
//    - add the model to the scene, expose it as window.__app.model (and .gem), and draw a frame
//    In onError, console.warn a friendly message so a broken file doesn't kill the page.

window.__app = { scene, camera, renderer, update };

renderer.render(scene, camera);
if (!calm) {
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    update(Math.min(timer.getDelta(), 0.1));
    renderer.render(scene, camera);
  });
}
