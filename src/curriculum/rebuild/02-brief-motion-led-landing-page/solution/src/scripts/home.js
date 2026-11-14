import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Everything is visible in the HTML and CSS. Motion is added only when the visitor hasn't asked for less of it,
// and gsap.matchMedia() undoes it all if they change their mind while the page is open.
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // 1. The headline arrives one word at a time, each word rising out of its own mask.
  const h1 = document.querySelector('.hero h1');
  const original = h1.innerHTML;
  h1.innerHTML = h1.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="word"><span class="word__in">${w}</span></span>`)
    .join(' ');
  gsap.from('.word__in', { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.07 });
  gsap.from('.hero__in', { opacity: 0, y: 24, duration: 0.9, ease: 'power2.out', delay: 0.5, stagger: 0.12 });

  // 2. Everything marked data-reveal eases in once, as it enters the screen.
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 48, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // 3. The speaker photographs drift slower than the page, which gives the sections depth.
  gsap.utils.toArray('.speaker__img, .craft__img').forEach((img) => {
    gsap.fromTo(img, { scale: 1.18, yPercent: -7 }, { scale: 1.18, yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // 4. The line beside the craft steps fills as you scroll down them.
  gsap.fromTo('.craft__fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.craft__steps', start: 'top 70%', end: 'bottom 70%', scrub: true } });

  return () => {
    h1.innerHTML = original;
  };
});
