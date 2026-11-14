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

// This works, but it's wrong in two ways: it spins faster on a 144 Hz screen than a 60 Hz one,
// and the picture stretches when the window changes size. Fix both.

// 1. update(delta): move everything by "how long since the last frame" in seconds.
//    Spin the cube 0.6 radians per SECOND: cube.rotation.y += 0.6 * delta. Return nothing.

// 2. resize(): read the canvas's size, then renderer.setSize(w, h, false), camera.aspect = w / h,
//    camera.updateProjectionMatrix(), and draw again. Call it once now, and on the window's 'resize' event.

// 3. Time the loop with THREE.Timer: timer.update(time) then timer.getDelta(). Clamp the delta to
//    0.1 seconds so a hidden tab doesn't cause a huge jump when you come back.

window.__app = { scene, camera, renderer, cube };

renderer.render(scene, camera);
if (!calm) {
  renderer.setAnimationLoop(() => {
    cube.rotation.y += 0.01; // per FRAME, not per second
    renderer.render(scene, camera);
  });
}
