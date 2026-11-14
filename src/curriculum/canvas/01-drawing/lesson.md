A scroll-driven hero like the ones on many premium sites isn't a video and it isn't a stack of images. It's one `<canvas>` element, and a few lines of JavaScript that paint the right picture into it for wherever you are on the page. This track builds that, from the first pixel up.

A **canvas** is a blank rectangle you can paint on with code. Unlike SVG, it doesn't remember shapes. It remembers only the pixels. You draw, and you redraw. That's why it's so fast for things that change every frame.

## Getting a pen

```js
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
```

`ctx` (the **context**) is the pen. Every drawing command is a method on it.

## The basics

```js
ctx.fillStyle = '#16182a';
ctx.fillRect(0, 0, 200, 100);        // x, y, width, height

ctx.beginPath();
ctx.arc(100, 50, 30, 0, Math.PI * 2); // a circle: x, y, radius, start angle, end angle
ctx.fill();

ctx.beginPath();                      // a free-form shape
ctx.moveTo(0, 100);
ctx.lineTo(50, 40);
ctx.lineTo(120, 100);
ctx.closePath();
ctx.fill();
```

Coordinates start at the **top-left**, and `y` grows downward. Shapes paint over whatever came before, so draw **back to front**: sky, then sun, then sea, then land.

A gradient is made first, then used as a colour:

```js
const sky = ctx.createLinearGradient(0, 0, 0, horizon);
sky.addColorStop(0, '#0c1030');
sky.addColorStop(1, '#fadcaa');
ctx.fillStyle = sky;
```

## Sharp on every screen

A canvas has two sizes: how big it looks (CSS) and how many pixels it really has (`width` and `height`). On a retina screen, one CSS pixel is two or three device pixels. If your canvas has fewer pixels than the screen, the browser stretches it, and everything looks soft.

```js
const dpr = window.devicePixelRatio || 1;
canvas.width = Math.round(canvas.clientWidth * dpr);
canvas.height = Math.round(canvas.clientHeight * dpr);
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
```

Setting `width` or `height` also *clears* the canvas, so you redraw straight after. The `setTransform` line means your drawing code can carry on in CSS pixels. Do this on load, and again on every `resize`. Production heroes do exactly that.

## Draw as a function of progress

Notice the shape of the finished code: one function, `draw()`, that paints everything from scratch using a single number, `progress`. Same input, same picture. That's the trick for the next three lessons, where `progress` will come from the scroll bar instead of a slider.

## Your turn

1. Fill in `resize()` so the canvas is sharp.
2. Fill in `draw()`, back to front: sky gradient, sun, sea, headland. The starter's comments give you the numbers.
3. Make the slider set `progress` (0 to 1) and redraw.
4. Redraw after the window resizes.

> Run it, drag the slider, then change the numbers: a bigger sun, a pinker sky. A canvas is a good place to play.
