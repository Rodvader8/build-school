The first three lessons drew a still picture. Now we make it move, and make it behave when someone resizes the window or opens the page on a phone. These two jobs are where most beginner scenes go wrong.

## The loop

Browsers repaint about 60 times a second, sometimes 120 or 144. `renderer.setAnimationLoop(fn)` calls your function once per repaint, passing the time in milliseconds. You update things, then draw:

```js
renderer.setAnimationLoop((time) => {
  // move things
  renderer.render(scene, camera);
});
```

Under the hood it uses `requestAnimationFrame`, and it pauses by itself when the tab is hidden. It also has a clean off switch: `renderer.setAnimationLoop(null)`.

## Delta time

The starter does `cube.rotation.y += 0.01` per frame. On a 60 Hz screen that's 0.6 radians a second. On a 144 Hz screen it's 1.44, so the same page looks more than twice as fast on a gaming monitor.

The fix is **delta time**: how many seconds passed since the last frame. Move things by `speed * delta` and the speed is a real-world speed, whatever the screen does.

```js
const timer = new THREE.Timer();          // Clock's replacement since r183
timer.update(time);                       // feed it the loop's time
const delta = Math.min(timer.getDelta(), 0.1);
```

Why the clamp? When you switch back to a tab that's been hidden for a minute, the first delta is huge, and everything leaps. Capping at 0.1 seconds hides that.

A habit worth building: put the movement in its own `update(delta)` function, separate from drawing. It reads better, and you can call `__app.update(1)` from the console to jump the scene forward one second. This app's checks do exactly that.

## Resizing

A canvas has two sizes: how big it's *displayed* (CSS) and how many pixels it *draws* (`canvas.width`). The renderer owns the second one. On resize you need to update three things together:

```js
renderer.setSize(w, h, false);   // false: leave the CSS alone
camera.aspect = w / h;
camera.updateProjectionMatrix(); // the camera caches its maths until you say so
```

Skip the aspect and the world looks squashed. Skip `updateProjectionMatrix()` and nothing changes at all, which is a very confusing afternoon.

## Calm mode needs a redraw

When there's no loop (reduced motion), nothing redraws after a resize unless you ask. So `resize()` ends with its own `renderer.render(scene, camera)`. Running it in the loop as well is harmless.

## Your turn

1. Write `update(delta)` so the cube turns 0.6 radians per second.
2. Write `resize()`, call it once, and attach it to the window's `resize` event.
3. Replace the starter's loop with one that uses `THREE.Timer`, clamps the delta, calls `update`, then renders. Keep it off when `calm` is true.
4. Add `update` and `resize` to `window.__app`.

Then drag the preview narrower and the cube should keep its shape.
