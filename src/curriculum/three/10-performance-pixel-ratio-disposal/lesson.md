A 3D scene that runs beautifully on a developer's laptop can crawl on a three-year-old phone, drain its battery, and quietly eat memory until the tab crashes. Performance work is mostly three habits, and they all show up in any production 3D hero.

## 1. Cap the pixel ratio

A phone with `devicePixelRatio` 3 has nine device pixels for every CSS pixel. Draw at full resolution and the graphics card shades nine times the pixels, for a sharpness almost nobody can see. Cap it:

```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
```

A production hero might go further and cap it at 1.75 on desktop and 1.3 on mobile. Set it again in `resize()`, because moving a window between screens changes the ratio.

## 2. Fewer draw calls

Each mesh with its own material is one **draw call**, a round trip from JavaScript to the graphics card. A few hundred is fine on a desktop, and painful on a phone. When you have many copies of the same shape, an **`InstancedMesh`** draws all of them in one call:

```js
const mesh = new THREE.InstancedMesh(geometry, material, 300);
mesh.setMatrixAt(i, dummy.matrix);     // position of copy i
mesh.instanceMatrix.needsUpdate = true;
```

A scrolling corridor of about 40 screens can be drawn in 3 calls, thanks to this.

## 3. Dispose what you stop using

Here's the one that bites. When you `scene.remove(mesh)`, the mesh disappears, but the geometry and textures are still sitting in graphics memory, because Three.js can't know you won't use them again. A scene that rebuilds itself, such as switching products or reacting to a route change, leaks until the page dies.

Call `.dispose()` on each geometry, each material, and each texture a material holds. The pattern is to walk the tree:

```js
root.traverse((o) => { o.geometry?.dispose(); /* materials and textures too */ });
```

And when the whole canvas goes away (a single-page app navigating on), also stop the loop and call `renderer.dispose()`.

## Measure with renderer.info

You can see all of this in numbers. `renderer.info.render.calls` is draw calls for the last frame. `renderer.info.memory.geometries` and `.textures` count what's currently on the card. They're the right thing to watch, because a headless test browser has no graphics card, so frame rates there tell you nothing. Numbers that climb on every rebuild tell you there's a leak.

## 4. Don't draw what nobody sees

A loop that keeps drawing after the visitor scrolls past the hero is wasted battery. Run the loop only while the canvas is on screen (`IntersectionObserver`) *and* the tab is visible (`visibilitychange`). Combine them in one `sync()` function with a guard, so two inputs can't each start their own loop.

Calm mode fits the same function: `calm` is just a third reason not to run.

## Your turn

Work in this order:

1. Rewrite `build()` as a single `InstancedMesh`.
2. Cap the pixel ratio in `resize()`.
3. Write `disposeTree`, fix `rebuild()` to use it, and write `destroy()`.
4. Write `sync()` with the observer and the visibility listener.

> Click-test `__app.rebuild()` in the console a few times and watch `renderer.info.memory`.
