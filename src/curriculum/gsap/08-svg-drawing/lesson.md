Ellis Ward is an architecture practice, and its floor plan draws itself as you scroll, line by line, like a pen on tracing paper. Willow Cove's journey dial and Brightwater's sun arc use the same trick. It looks like magic, and underneath it's one small bit of SVG behaviour.

## How a line can "draw"

An SVG stroke can be dashed. `stroke-dasharray` sets the length of a dash, and `stroke-dashoffset` slides the dash pattern along the line.

Make the dash exactly as long as the line, then slide it entirely off the end, and the line vanishes. Slide it back and the line draws itself in. All you animate is one number.

The catch is knowing each line's length. The easy fix is the `pathLength` attribute, which lets you *declare* that every line is 1 unit long, whatever it really is:

```js
lines.forEach((line) => line.setAttribute('pathLength', '1'));
gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });   // hidden
```

Now `strokeDashoffset: 1` means "hidden" and `0` means "fully drawn", for every line, however long. This is exactly what the Ellis Ward script does.

## Draw them as you scroll

```js
gsap.timeline({
  defaults: { ease: 'power1.inOut' },
  scrollTrigger: { trigger: '.gs-plan', start: 'top 70%', end: 'bottom 40%', scrub: 1 },
}).to(lines, { strokeDashoffset: 0, duration: 1, stagger: 0.5 });
```

It's the scrub from lesson 6 again, this time without a pin. The drawing starts when the figure is 70% down the screen and finishes as its bottom reaches 40%. Combine the stagger from lesson 4 and each wall follows the last.

## One gotcha: autoRound

GSAP rounds pixel values to whole numbers while it animates, which is usually what you want, because it keeps text and edges crisp. But `strokeDashoffset` is a length, and ours only runs from `1` to `0`. Rounded, it would jump straight from one to the other halfway through, and every line would pop in instead of drawing. Switch the rounding off on the tween:

```js
.to(lines, { strokeDashoffset: 0, autoRound: false })
```

## Order and polish

- Draw structure first (outer walls, then inner walls), details last. Real drawings are made in that order, and it reads as craft.
- On polished sites, fills and labels fade in *after* their lines finish. Add them to the same timeline with a position like `'<0.3'`.
- GSAP also has a **DrawSVGPlugin**, now free. It does the length maths for you (`drawSVG: '0%'` to `'100%'`) and can draw partial lines. It's worth knowing about, but the `pathLength` method needs no extra file, and you'll see it in a lot of real code.

## Reduced motion

The trick here is to touch nothing. The lines are fully drawn in the CSS, and only the motion-allowed branch hides them. Visitors who prefer less motion simply see the finished plan.

## Your turn

1. Give every line `pathLength="1"`.
2. Hide them with `gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 })`.
3. Build a scrubbed timeline on `.gs-plan` (`start: 'top 70%'`, `end: 'bottom 40%'`, `scrub: 1`) that animates `strokeDashoffset` to `0` over `1` second with `stagger: 0.5` and `autoRound: false`.

Keep it all inside `if (!calm)`. Scroll the preview, then scroll back up and watch it undraw.
