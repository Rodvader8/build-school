import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshNormalMaterial());
cube.rotation.set(0.5, 0.7, 0);
scene.add(cube);

// A debugging handle, like the hook Three's own devtools use. Lesson checks read it too.
window.__app = { scene, camera, renderer };

renderer.render(scene, camera);
if (!calm) {
  renderer.setAnimationLoop((time) => {
    cube.rotation.y = time / 1000;
    renderer.render(scene, camera);
  });
}
