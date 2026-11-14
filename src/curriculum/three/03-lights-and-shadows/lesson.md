A flat, evenly lit shape looks fake. The same shape with one strong light, a soft fill and a shadow on the floor looks like a product photo. That gap is the difference between a scene that looks like a demo and one that belongs on a client's site.

## Light types

- **AmbientLight**: the same light from everywhere. No direction, no shadows. A little goes a long way, because too much flattens everything.
- **HemisphereLight**: a sky colour above and a ground colour below. A nicer fill than ambient, because the tops of things get brighter than the bottoms.
- **DirectionalLight**: parallel rays, like the sun. Its `position` only sets the *direction* (from there towards the origin). This is the usual key light.
- **PointLight** and **SpotLight**: a bulb and a torch beam. They have a position and fall off with distance.

A good default is one directional key light plus a hemisphere fill at maybe a fifth of the key's strength. Intensities are in physical-ish units now, so a directional light around 2 to 3 is normal.

## Shadows: four switches and a camera

Shadows cost a whole extra render from the light's point of view, so they're off by default. You have to say yes in four places:

```js
renderer.shadowMap.enabled = true;     // 1. the renderer
key.castShadow = true;                 // 2. the light
ball.castShadow = true;                // 3. who throws a shadow
floor.receiveShadow = true;            // 4. who catches it
```

Forget any one and nothing appears, with no error to tell you why. Treat it as a checklist.

## The shadow camera

A directional light draws its shadow with a hidden orthographic camera, available as `key.shadow.camera`. Its default box is small, so shadows get cut off at the edges. Size it to just fit your scene: `left`, `right`, `top`, `bottom`, `near` and `far`.

The box matters because the shadow map has a fixed number of pixels (`key.shadow.mapSize`, 2048 by 2048 is plenty). A tight box spends them on your scene. A huge box makes blurry, blocky shadows. `key.shadow.radius` softens the edge a little.

Use `THREE.PCFShadowMap`. Older tutorials mention `PCFSoftShadowMap`, which was removed in Three.js r186, so you'll see a console warning if you copy them.

## Reduced motion

A static scene doesn't need shadows redrawn every frame. For visitors who've asked for calm, you render once and skip the loop, so the whole shadow cost is paid a single time.

## Your turn

Open `main.js`. The scene, floor, ball and block are built already.

1. Enable shadows and use `PCFShadowMap`.
2. Add the hemisphere fill light.
3. Add the directional key light, make it cast shadows, and set its map size and tight shadow camera.
4. Set `castShadow` on the ball and the block, and `receiveShadow` on the floor.

> If the shadow looks striped ("acne"), nudge `key.shadow.normalBias` to about 0.02.
