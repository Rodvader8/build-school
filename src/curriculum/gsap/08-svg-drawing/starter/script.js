gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lines = gsap.utils.toArray('.gs-ln');

// Reduced motion keeps the drawing complete, because nothing below touches it.
if (!calm) {
  // 1. Tell every line its length is 1 (the pathLength attribute), whatever its real length.

  // 2. Hide each line: strokeDasharray 1 and strokeDashoffset 1, with gsap.set.

  // 3. A timeline scrubbed by a scrollTrigger on '.gs-plan' (start 'top 70%', end 'bottom 40%', scrub: 1)
  //    draws them, one after another: strokeDashoffset to 0, duration 1, stagger 0.5, ease 'power1.inOut'.
//    Add autoRound: false to that tween (see the lesson for why).
}
