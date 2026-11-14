Building shapes from boxes and spheres only gets you so far. A product, a character or a piece of architecture is made in a 3D tool like Blender and arrives as a file. The web format for that is **glTF**, sometimes called "the JPEG of 3D".

## .glb and .gltf

A glTF model comes in two flavours. `.gltf` is readable JSON that points to separate files for the geometry and textures. `.glb` is the same thing packed into a single binary file. For the web you'll almost always ship a `.glb`: one request, nothing to lose.

The file keeps the model's structure: a **node tree** with names, positions, meshes and materials, plus any textures and animations. That's the big win over loading a bare shape.

## Loading

Loaders aren't part of the core library. They live in the *addons*, which this app maps for you:

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

new GLTFLoader().load('gem.glb', (gltf) => {
  scene.add(gltf.scene);       // a Group holding everything in the file
}, undefined, (error) => console.warn('No model', error));
```

Loading is asynchronous, so the model appears a moment after the page does. The four arguments are the url, a success callback, a progress callback (we skip it with `undefined`) and an error callback. Always write the error one. Without it, a typo in the filename fails silently and you're left with an empty scene.

## Finding things by name

Because the node tree has names, you can reach inside: `model.getObjectByName('Gem')` hands you that one node. Artists name things in the 3D tool, and you animate or restyle them by name in code. That's how a client's product can have a part that spins or changes colour on hover.

Materials survive the trip too. The crystal in this file arrives as a `MeshStandardMaterial` named "Crystal", with its metalness and roughness already set.

## The model's size is a surprise

3D files have no universal unit. This one is deliberately huge, because that's what you get from real files more often than not. So fit it: measure with a `Box3`, scale so the biggest side is the size you want, then measure again and move it so its centre is the origin.

```js
const box = new THREE.Box3().setFromObject(model);
const size = box.getSize(new THREE.Vector3());
```

## Shadows aren't in the file

glTF doesn't know about your renderer's shadow switches, so `model.traverse` over every mesh setting `castShadow` and `receiveShadow` is standard practice.

## Calm mode

The crystal spins through `update(delta)`, exactly like lesson 4, and the loop only runs when `calm` is false. Because a calm page has no loop, the load callback draws a frame itself so the model shows up.

## Your turn

1. Load `gem.glb` with `GLTFLoader`, including an error callback.
2. Scale it to 3 units on its longest side and centre it.
3. Make every mesh cast and receive shadows.
4. Store the `Gem` node in `gem`, add the model to the scene, set `window.__app.model` and `.gem`, and render a frame.

> Big real-world files are often compressed with Draco or Meshopt, and Three.js has loaders for both. Same idea, one extra line.
