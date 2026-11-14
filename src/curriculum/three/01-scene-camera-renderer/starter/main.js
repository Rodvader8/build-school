import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Make a Scene.

// 2. Make a PerspectiveCamera: 50 degrees of view, the canvas's aspect ratio (width / height), near 0.1, far 100.
//    Then pull it back from the middle: camera.position.z = 5.

// 3. Make a WebGLRenderer that draws into the existing canvas, and size it to the canvas
//    (renderer.setSize(width, height, false) leaves the CSS alone).

// 4. Make a Mesh: a BoxGeometry (1.5 on every side) with a MeshNormalMaterial. Turn it a little
//    so you can see three faces, and add it to the scene.

// 5. Hang the pieces on window so lesson checks (and your own console) can see them:
//    window.__app = { scene, camera, renderer };

// 6. Draw one frame. Then, unless the visitor asked for calm, spin the cube with an animation loop.
