const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calm) {
  // 1. Set a default duration of 1.2 seconds, so you only have to write it once.

  // 2. Move each ball 600px to the right with gsap.to, using the ease named beside its lane.
  //    .gs-ball-1  ease 'none'
  //    .gs-ball-2  ease 'power3.out'
  //    .gs-ball-3  ease 'back.out(1.7)'
  //    .gs-ball-4  ease 'elastic.out(1, 0.4)'
}
