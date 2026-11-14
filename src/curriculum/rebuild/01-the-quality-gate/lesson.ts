import type { LessonMeta } from '../../types';
import { gateChecks } from '../../helpers';

export default {
  title: 'The quality gate: what "done" means',
  minutes: 60,
  kind: 'project',
  entry: 'src/pages/index.astro',
  checkEntry: 'check.mjs',
  devPort: 4881,
  devCommand: 'npm run dev -- --port 4881 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: gateChecks(),
  hints: [
    'Fix one failure at a time and run the gate again. Several lines often clear together: the Google Fonts request, the fonts rule and the render-blocking line are all the same mistake.',
    'For fonts, add the Font component from astro:assets to the layout head and declare both files in astro.config.mjs with fontProviders.local(). The font files are already in src/assets/fonts.',
    'Reduced motion: leave content visible in the CSS, and only hide and animate it inside gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", ...). A decorative loop needs the same media query around its animation.',
  ],
} satisfies LessonMeta;
