A 3D canvas is one flat picture to the browser. It doesn't know there's a box in it, so a click on the canvas is just "something happened at pixel (412, 230)". To make a model respond, like a product part that highlights on hover, you have to work out what's under the pointer yourself. The trick is **raycasting**.

## Shoot a ray

Imagine a laser from the camera, through the spot on the screen the pointer's over, out into the scene. The first object it hits is the one under the pointer. Three.js has a tool for it:

```js
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(pointer, camera);
const hits = raycaster.intersectObjects(boxes, false);
const first = hits[0];            // nearest, or undefined
first.object                      // the mesh
first.point                       // where it was hit, in world space
```

`intersectObjects` takes the list of things worth testing. Keep that list short: only the objects you want to be interactive. The second argument says whether to look inside children too.

## Pixels to normalised coordinates

`setFromCamera` doesn't want pixels. It wants **normalised device coordinates**: x and y each from -1 to 1 across the canvas, with y pointing *up*, which is the opposite of the page.

```js
const rect = canvas.getBoundingClientRect();
pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
```

Measure against the canvas's own rectangle, not `window.innerWidth`. The day the canvas sits beside some text, window-based maths is quietly wrong.

## Pointer events, not mouse events

`pointermove`, `pointerdown` and `click` cover mouse, touch and pen with one set of handlers. Remember that phones have no hover at all, so any important interaction has to work on `click` too. Hover is the bonus.

## When to cast

Raycasting is cheap, but not free, and a scene with thousands of triangles in the test list can get slow. Cast inside the event handler, only when the pointer actually moves, never every frame in the loop. Keeping the state in a variable (`app.hovered`) means the loop has nothing extra to do.

## Visual feedback without motion

A glow is instant feedback, so it's fine for everyone. The *easing* of the selected box growing is motion, and the starter's `update` skips it when `calm` is true. Nobody's penalised for asking for less movement, they just see the change land immediately. And since calm mode has no loop, `sync()` draws a new frame whenever state changes.

> Setting a CSS class for the cursor, rather than writing `canvas.style.cursor`, keeps all the styling in the stylesheet where you'd expect it.

## Your turn

The scene, boxes, easing and loop are written for you.

1. Make a `Raycaster` and a `Vector2`, then write `pick(event)` to return the nearest box under the pointer, or `null`.
2. On `pointermove`, set `app.hovered`, set the emissive glow on the hovered box only, toggle the `is-hover` class, and call `sync()`.
3. On `click`, set `app.selected` and call `sync()`.
