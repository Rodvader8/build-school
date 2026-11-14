gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = matchMedia('(min-width: 900px) and (min-height: 620px)').matches;
const section = document.querySelector('.gs-chapters');
const chapters = gsap.utils.toArray('.gs-chapter');

// Only the wide, motion-allowed version is pinned. Everyone else keeps the plain stacked chapters.
if (wide && !calm) {
  // 1. Add the class is-pinned to the section, and hide chapters 2 and 3 to start (autoAlpha: 0).

  // 2. Build a timeline with a scrollTrigger on the section:
  //    start 'top top', end '+=300%', pin: true, scrub: 1. Use ease 'none' for every step.

  // 3. Fill the timeline (it's 5 seconds long, it's only a ruler for the scroll):
  //    at 1s: chapter 1 fades out (autoAlpha 0) while chapter 2 fades in (autoAlpha 1)
  //    at 3s: chapter 2 fades out while chapter 3 fades in
  //    then add 1s of nothing at the end, so chapter 3 holds: .to({}, { duration: 1 })
}
