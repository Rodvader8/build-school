Lesson 3 worked. Look closely at it, though: scroll with a mouse wheel and the sunrise *steps*. A wheel scrolls in chunks, and the frames follow in chunks. On a production hero, the usual fix is: smooth it with a **spring**, and blend between frames.

Two small ideas, both just maths.

## 1. A spring that chases the scroll

The scroll bar tells you where the sequence *should* be (`target`). Don't draw that directly. Keep a second number, `spring.x`, that **chases** the target. It starts fast, slows as it arrives, and lands softly, however jumpy the scroll was.

```js
const STIFFNESS = 90;
const DAMPING = 2 * Math.sqrt(STIFFNESS);
const spring = { x: 0, v: 0 };

function springStep(s, to, dt) {
  const force = STIFFNESS * (to - s.x) - DAMPING * s.v;
  s.v += force * dt;   // force changes the speed
  s.x += s.v * dt;     // speed changes the position
  return s;
}
```

It's how a weight on a rubber band behaves:

- **Stiffness** is how hard the band pulls. Higher means a snappier chase.
- **Damping** is friction, slowing it down. The magic value `2 * Math.sqrt(STIFFNESS)` is called **critical damping**: exactly enough friction to settle as fast as possible, without bouncing past the target. Make it smaller and the spring wobbles. Make it larger and it crawls.
- `dt` is the time since the last step, in seconds. Physics scaled by `dt` behaves the same on a 60Hz screen and a 120Hz one.

The spring runs on `gsap.ticker`, which fires every frame:

```js
gsap.ticker.add((time, deltaTime) => {
  springStep(spring, target, Math.min(deltaTime / 1000, 0.05));
  drawBlend(spring.x);
});
```

Capping `dt` at `0.05` stops a stalled tab from flinging the spring when it wakes up.

## 2. Draw between two frames

The spring's value is a *decimal*, like 12.4. Rounding it (lesson 3) shows frame 12, then suddenly frame 13. A **crossfade** draws both: frame 12, then frame 13 on top at 40% opacity.

```js
function drawBlend(position) {
  const a = Math.floor(position);
  const b = Math.min(a + 1, TOTAL - 1);
  ctx.globalAlpha = 1;
  drawFrame(a);
  ctx.globalAlpha = position - a;   // 0.4
  drawFrame(b);
  ctx.globalAlpha = 1;              // put it back, always
}
```

`globalAlpha` is the see-through level for everything drawn next. These JPEG frames are solid, so a normal draw-over is correct.

> Some heroes' frames are **transparent** WebPs, and normal blending would darken the overlap, because two half-see-through layers don't add up to one solid one. For those, set `ctx.globalCompositeOperation = 'lighter'` for the second draw, which adds the light instead. If your frames have an alpha channel, you'll need it too.

## Reduced motion

A spring is exactly the kind of continuous motion some people want less of. The starter shows the last frame and never starts the ticker.

## Your turn

1. Add `STIFFNESS`, `DAMPING` and `spring`.
2. Write `springStep(s, to, dt)`.
3. Write `drawBlend(position)`.
4. Add the `gsap.ticker` loop: step the spring toward `target`, then draw it.

Flick the scroll wheel hard. Does the sunrise glide to its place, with no stepping?
