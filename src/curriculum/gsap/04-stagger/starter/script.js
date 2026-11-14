const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calm) {
  // 1. The eight tiles: gsap.from with opacity 0, y 30, duration 0.6,
  //    and a stagger of 0.08 seconds between each one.

  // 2. The twelve dots: gsap.from with opacity 0, scale 0, duration 0.5,
  //    and a stagger OBJECT that spreads 0.9 seconds in total, starting from the 'center'.
  //    Give it a short delay of 0.8 so it follows the tiles.
}
