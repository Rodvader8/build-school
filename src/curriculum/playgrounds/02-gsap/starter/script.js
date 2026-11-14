gsap.registerPlugin(ScrollTrigger);

// Always give people who prefer less motion a calm version.
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.g-intro h1', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' });

  gsap.timeline({
    scrollTrigger: { trigger: '.g-pin', start: 'top top', end: '+=1200', scrub: true, pin: true },
  })
    .to('.g-box-1', { rotation: 360, y: -120 })
    .to('.g-box-2', { scale: 1.8, borderRadius: '50%' }, '<')
    .to('.g-box-3', { x: 200, rotation: -180 }, '<');
});
