const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Build a timeline called intro, with defaults of { duration: 0.8, ease: 'power3.out' }.
const intro = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });

// 2. Add four steps, in this order.
intro
  .from('.gs-kicker', { y: 20, opacity: 0 })
  .from('.gs-title', { y: 40, opacity: 0 }, '-=0.5')
  .from('.gs-lede', { y: 30, opacity: 0 }, '<0.15')
  .from('.gs-cta', { scale: 0.9, opacity: 0 });

// Reduced motion: jump straight to the finished page.
if (calm) intro.progress(1);

// 3. Make the Replay button restart the timeline.
document.querySelector('.gs-replay').addEventListener('click', () => intro.restart());
