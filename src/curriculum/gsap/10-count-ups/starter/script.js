gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const format = (n) => Math.round(n).toLocaleString('en-AU');   // 1284 becomes "1,284"
const stats = gsap.utils.toArray('.gs-stat');

// 1. Reduced motion: show the final numbers straight away and stop.

// 2. Otherwise, for each stat:
//    - make a plain object to hold the running number: { value: 0 }
//    - tween its value to the stat's data-target (read it with Number(el.dataset.target))
//      over 1.8 seconds with ease 'power2.out'
//    - onUpdate writes format(counter.value) into the element's textContent
//    - scrollTrigger: the stat is the trigger, start 'top 85%', and once: true
