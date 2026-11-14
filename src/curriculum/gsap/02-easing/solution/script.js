const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calm) {
  // 1. Set a default duration of 1.2 seconds, so you only have to write it once.
  gsap.defaults({ duration: 1.2 });

  // 2. Move each ball 600px to the right with gsap.to, using the ease named beside its lane.
  gsap.to('.gs-ball-1', { x: 600, ease: 'none' });
  gsap.to('.gs-ball-2', { x: 600, ease: 'power3.out' });
  gsap.to('.gs-ball-3', { x: 600, ease: 'back.out(1.7)' });
  gsap.to('.gs-ball-4', { x: 600, ease: 'elastic.out(1, 0.4)' });
}
