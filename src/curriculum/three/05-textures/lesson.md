A plain-coloured material looks like plastic. Real surfaces have detail: wood grain, scratches, patches that are shinier than others. In 3D, **textures** are images wrapped onto a surface to supply that detail, and they're usually the heaviest part of a scene. A scroll-driven corridor can get by on 88KB of textures in total if they're chosen carefully.

## Loading one

```js
const loader = new THREE.TextureLoader();
const grain = loader.load('planks.png');
material.map = grain;
```

`load` hands you a Texture immediately and fills the image in once the file arrives. Until then the material just shows black or its plain colour. You can pass a second argument, a callback that runs when it lands, and that's where a still, no-loop scene redraws itself.

## Maps: what each one controls

A material has several slots, each reading a different image:

- `map`: the colour.
- `roughnessMap`: how shiny each pixel is. Greyscale, white is rough.
- `metalnessMap`: which bits are metal.
- `normalMap`: fake bumps, by bending the light. Cheaper than real geometry.
- `aoMap`: baked-in contact shadows.

With a `roughnessMap` on, set `material.roughness = 1`, because the two values are multiplied. Likewise `material.color` multiplies `map`, so set it to white if you want the image untouched.

## Colour space

This one catches everybody. Images you look at (colour maps) are stored in **sRGB**. Three.js does its lighting in linear light, so it has to know which textures to convert:

```js
colourTexture.colorSpace = THREE.SRGBColorSpace;
```

Roughness, normal and other **data** maps aren't colours, so you leave them alone. Mark a colour map as data and it looks dull. Mark a data map as colour and the shininess goes wrong in a way that's hard to spot.

## Tiling and sharpness

`RepeatWrapping` plus `repeat.set(3, 3)` tiles the image three times each way, so a small file covers a big floor. It's also why small repeating textures are the cheapest way to add detail.

When you look at a floor at a slant, the texture smears into the distance. **Anisotropic filtering** fixes that. Set `texture.anisotropy` to `renderer.capabilities.getMaxAnisotropy()` and it stays sharp for almost no cost.

## File size

Textures cost memory on the graphics card by pixel dimensions, not by file size. A 4096 by 4096 texture uses 64MB there, even if the PNG is small. Keep them as small as the picture allows, and use powers of two where you can (256, 512, 1024).

## Your turn

1. Write a `load(url, isColour)` helper that tiles, sharpens and (for colour) marks sRGB. Give it a callback that redraws when `calm` is true.
2. Put the plank colour map and the roughness map on the floor's material.
3. Set the material's `roughness` to 1 and its colour to white.

> The roughness map is why the planks shine in streaks as the sun slides.
