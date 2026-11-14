gsap.registerPlugin(ScrollTrigger);

const band = document.querySelector('.gs-band');
const bandText = document.querySelector('.gs-band__text');

const mm = gsap.matchMedia();

// The function runs when AT LEAST ONE condition matches, so the phone case needs a condition of its own.
mm.add({ wide: '(min-width: 900px)', narrow: '(max-width: 899px)', calm: '(prefers-reduced-motion: reduce)' }, (context) => {
  const { wide, calm } = context.conditions;

  // Reduced motion: nothing animates, the page stays as it is in the CSS.
  if (calm) return;

  if (wide) {
    band.classList.add('is-pinned');
    gsap.to(bandText, {
      xPercent: -55,
      ease: 'none',
      scrollTrigger: { trigger: band, start: 'top top', end: '+=100%', pin: true, scrub: true },
    });
  } else {
    gsap.from('.gs-fade', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      scrollTrigger: { trigger: '.gs-fades', start: 'top 85%' },
    });
  }

  // GSAP undoes its own tweens and triggers. The class is ours to undo.
  return () => band.classList.remove('is-pinned');
});
