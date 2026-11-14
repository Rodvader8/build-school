In lesson 1 a cube got its colour from `MeshNormalMaterial`, which is a debugging material. Real projects, like a product shot on a shop page, pick a geometry and a material on purpose. This lesson is the vocabulary.

## Geometry is the shape

A geometry is a list of points and the triangles joining them. Three.js ships a lot of ready-made ones, and the arguments are usually sizes and "how smooth":

```js
new THREE.BoxGeometry(1.6, 1.6, 1.6)            // width, height, depth
new THREE.SphereGeometry(1, 48, 24)             // radius, segments around, segments up
new THREE.TorusKnotGeometry(0.8, 0.25, 128, 16)
```

More segments means a rounder shape and more triangles for the graphics card to chew through. A sphere with 48 by 24 segments looks smooth on a laptop and costs almost nothing. 500 by 500 would look the same and cost a lot.

## Material is the surface

The material decides how light behaves on the shape. Three you'll use constantly:

- **MeshBasicMaterial**: ignores lights. Flat colour. Perfect for wireframes (`wireframe: true`), debugging and UI-like shapes.
- **MeshStandardMaterial**: the physically based one. Two dials do most of the work: `roughness` (0 is a mirror, 1 is chalk) and `metalness` (0 is plastic or wood, 1 is raw metal).
- **MeshNormalMaterial**: colours by direction. No lights needed.

`MeshStandardMaterial` needs light to be seen at all. The starter adds two lights for you; lesson 3 is all about them. Colours are hex numbers written `0x8b5cf6`, the same digits as a CSS `#8b5cf6`.

## Position, and sharing

Every object has `.position`, `.rotation` and `.scale`. `mesh.position.x = -3` slides it left. `mesh.scale.setScalar(0.5)` halves it in every direction.

Geometries and materials are objects too, and a mesh only *points* at them. So two meshes can share one:

```js
const ball = new THREE.SphereGeometry(1, 48, 24);
const steel = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.2 });
const a = new THREE.Mesh(ball, steel);
const b = new THREE.Mesh(ball, steel);   // no second copy in memory
```

That habit matters in lesson 10, where memory and draw calls become the whole story. If you change `steel.color`, both balls change.

## Your turn

Open `main.js` and build a row of shapes:

1. A matte violet box on the left.
2. A shiny cyan metal sphere in the middle. Keep its geometry and material in their own `const`s.
3. A white wireframe torus knot on the right, using `MeshBasicMaterial`.
4. A small second sphere above the middle one that reuses the same geometry and material.
5. Add every mesh to the scene.

> The starter sways the whole scene gently, unless `calm` is true. Turn on "reduce motion" in your system settings and reload to see it hold still.
