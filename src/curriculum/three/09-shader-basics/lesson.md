So far every look has come from Three's ready-made materials. A **shader** is how you write your own: a tiny program that runs on the graphics card, once for every vertex and once for every pixel. It's the tool behind glowing gradients, water, grain, and most of the effects you'd call "that doesn't look like a template".

## Two programs

A `ShaderMaterial` takes two strings of GLSL, a C-like language:

- The **vertex shader** runs once per corner of every triangle. Its job is to decide where on the screen that corner lands (`gl_Position`). You can nudge the position first, which is how you make a plane ripple.
- The **fragment shader** runs once per pixel the triangle covers. Its job is to output a colour (`gl_FragColor`).

Three.js hands you some things for free in a ShaderMaterial: `position`, `uv` and the matrices `projectionMatrix` and `modelViewMatrix`. That's why the vertex shader always ends with the same line.

```glsl
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
```

## Varyings: passing data across

The vertex shader can pass a value to the fragment shader with a `varying`. The graphics card smoothly blends it between the corners. `vUv` is the classic: a pair of numbers from 0 to 1 that says where on the surface this pixel sits. Gradients, stripes and rings are all just maths on `vUv`.

```glsl
varying vec2 vUv;     // declared in BOTH shaders
```

## Uniforms: values from JavaScript

A `uniform` is the same value for every vertex and pixel in a draw. It's your steering wheel from JavaScript:

```js
const uniforms = { uTime: { value: 0 }, uColorA: { value: new THREE.Color(0x8b5cf6) } };
// every frame:
uniforms.uTime.value += delta;
```

Time plus `sin()` is the basis of nearly all shader animation.

## Useful maths

`mix(a, b, t)` blends two values. `sin(x)` wobbles between -1 and 1, so `0.5 + 0.5 * sin(x)` wobbles between 0 and 1, which is easier to use as a blend amount. `smoothstep(lo, hi, x)` makes a soft edge. And one gotcha: GLSL won't turn an int into a float for you, so write `2.0`.

## Colour management

Custom shaders skip Three's built-in colour handling. Put `#include <colorspace_fragment>` after you set `gl_FragColor`, or your colours come out darker than the hex codes you typed.

## Calm mode

A shader that moves is motion, so `update` leaves `uTime` alone when `calm` is true and the page shows one still, well-chosen moment. That's why the starting time is 1.5 rather than 0.

## Debugging

You can't `console.log` inside a shader. When it won't compile, Three prints the GLSL error with a line number to the console, and the mesh stays blank or black. Make small changes and keep the earlier working version around.

## Your turn

1. Add the two colour uniforms.
2. Ripple the vertices in the vertex shader.
3. Replace the red fragment shader with the moving gradient.
4. Subdivide the plane so there are vertices to ripple.
5. Write `update(delta)`.

> The graphics card does the maths, so a shader this size costs next to nothing on a real GPU.
