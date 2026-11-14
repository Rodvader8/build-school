gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calm) {
  // 1. For every .gs-panel, make a gsap.from (opacity 0, y 60, duration 0.9, ease 'power3.out')
  //    that waits for a scrollTrigger: the trigger is the panel itself,
  //    and it starts when the top of the panel reaches 85% down the screen ('top 85%').
  //    Tip: gsap.utils.toArray('.gs-panel') gives you a plain array to loop over.

  // 2. The LAST panel should hide again when you scroll back up past it.
  //    Give it toggleActions: 'play none none reverse'.
}
