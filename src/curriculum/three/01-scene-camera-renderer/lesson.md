Every 3D thing on the web, from a scrolling 3D corridor to a product spinner on a shop page, is built from the same three parts. Learn them once and the rest of this track is just adding to the pile.

## The three parts

A **scene** is the world: an empty container you add things to. A **camera** is where you're standing and which way you're looking. A **renderer** takes the scene as seen through the camera and paints it onto a `<canvas>`.

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.render(scene, camera);   // one picture
```

The four numbers in the camera are the **field of view** in degrees (smaller is more zoomed in, like a longer lens), the **aspect ratio** (canvas width divided by height, or the picture stretches), and the **near** and **far** planes. Anything closer than 0.1 or further than 100 units isn't drawn.

## Units and the origin

Three.js has no pixels or metres. A unit is whatever you decide it is, and everything starts at `(0, 0, 0)`, including the camera. x goes right, y goes up, and z comes towards you. So if you add a cube and render, you're standing inside it and see nothing. Pull the camera back with `camera.position.z = 5`.

## Mesh = geometry + material

A **mesh** is a shape (the geometry) wearing a surface (the material). `MeshNormalMaterial` colours each face by the direction it points, which is handy because it needs no lights. We'll get to proper lights in lesson 3.

```js
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
scene.add(cube);
```

## The debugging handle

Add one line to every scene you write from now on:

```js
window.__app = { scene, camera, renderer };
```

It's a handle for the browser console, so you can type `__app.camera.position` and poke the live scene. Three's own browser devtools use a similar hook. It's also how this app's checks look inside your scene, because they can't judge a picture.

## Calm mode

Some visitors turn on "reduce motion" in their system settings. Spinning 3D is exactly what that setting is about. So draw one still frame first, and only start an animation loop when nobody's asked for calm:

```js
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
```

> Headless test browsers have no graphics card, so they draw 3D in software. That's why checks here look at the scene's objects, never at pixels or speed.

## Your turn

Open `main.js` and follow the numbered comments:

1. Make the scene, a camera pulled back to `z = 5`, and a renderer for the existing canvas.
2. Add a turned cube with `MeshNormalMaterial`.
3. Set `window.__app`.
4. Draw one frame, then spin the cube in `setAnimationLoop` unless `calm` is true.
