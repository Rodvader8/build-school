// Project: the motion of "Your first visit" on Willow Cove.

gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector('.cb-visit');
const arc = document.querySelector('.cb-arc');
const steps = gsap.utils.toArray('.cb-step');

const mm = gsap.matchMedia();

mm.add({ wide: '(min-width: 900px)', narrow: '(max-width: 899px)', calm: '(prefers-reduced-motion: reduce)' }, (context) => {
  const { wide, calm } = context.conditions;

  // Reduced motion: the plain list and a full dial.
  if (calm) return;

  // Both motion versions: the fee cards arrive in a wave.
  gsap.from('.cb-fee', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.cb-fees', start: 'top 85%' },
  });

  // Narrow: no pin. Each step's content fades up as it arrives.
  if (!wide) {
    steps.forEach((step) => {
      gsap.from(step.children, {
        opacity: 0,
        y: 26,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: step, start: 'top 84%' },
      });
    });
    return;
  }

  // Wide: stack the steps, hide the arc and every step but the first.
  section.classList.add('is-live');
  const C = 2 * Math.PI * arc.r.baseVal.value;
  gsap.set(arc, { attr: { 'stroke-dasharray': C, 'stroke-dashoffset': C } });
  gsap.set(steps.slice(1), { autoAlpha: 0 });

  // One pinned, scrubbed timeline, 3 seconds long.
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: section, start: 'top top', end: '+=300%', pin: true, scrub: 1 },
  });
  tl.to(arc, { attr: { 'stroke-dashoffset': 0 }, duration: 3, ease: 'none' }, 0);
  for (let k = 1; k < steps.length; k++) {
    // Short, overlapping crossfades so there's never a blank moment between steps.
    tl.to(steps[k - 1], { autoAlpha: 0, y: -24, duration: 0.2 }, k - 0.15)
      .fromTo(steps[k], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.25 }, k - 0.1);
  }

  // GSAP undoes its own work. The class is ours.
  return () => section.classList.remove('is-live');
});
