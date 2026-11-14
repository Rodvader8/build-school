gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lines = gsap.utils.toArray('.gs-ln');

// Reduced motion keeps the drawing complete, because nothing below touches it.
if (!calm) {
  // 1. Tell every line its length is 1, whatever its real length.
  lines.forEach((line) => line.setAttribute('pathLength', '1'));

  // 2. Hide each line.
  gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });

  // 3. Draw them as you scroll, one after another.
  gsap
    .timeline({
      defaults: { ease: 'power1.inOut' },
      scrollTrigger: { trigger: '.gs-plan', start: 'top 70%', end: 'bottom 40%', scrub: 1 },
    })
    .to(lines, { strokeDashoffset: 0, duration: 1, stagger: 0.5, autoRound: false });
}
