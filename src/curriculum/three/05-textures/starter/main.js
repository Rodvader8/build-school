import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 3.2, 6);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444455, 1));
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(-3, 5, 4);
scene.add(sun);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x806040 }));
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// planks.png is a colour map and planks-rough.png is a greyscale roughness map (both in this folder).

// 1. Make a TextureLoader. Write a helper load(url, isColour) that loads a texture, then:
//    - tiles it: wrapS and wrapT = THREE.RepeatWrapping, and repeat.set(3, 3)
//    - sharpens it at a slant: anisotropy = renderer.capabilities.getMaxAnisotropy()
//    - if isColour is true, sets colorSpace = THREE.SRGBColorSpace (data maps stay as they are)
//    Pass loader.load a second argument, a function that redraws once the image arrives
//    (only needed when calm is true, because then there's no loop to do it).

// 2. Give the floor's material both maps: map (the colour one) and roughnessMap.
//    Set the material's roughness to 1 so the roughness map has full say.

window.__app = { scene, camera, renderer, floor };

renderer.render(scene, camera);
if (!calm) {
  renderer.setAnimationLoop((time) => {
    sun.position.x = Math.sin(time / 3000) * 4; // a slow sun, so the roughness map's shine travels
    renderer.render(scene, camera);
  });
}
