// People who ask their device for less motion get the finished page, no animation.
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calm) {
  // 1. gsap.from(): the headline starts 40px low and invisible, and settles into place.

  // 2. gsap.to(): the button gently pulses forever (scale up, yoyo back).

  // 3. gsap.fromTo(): the three cards, with both ends spelled out.
}
