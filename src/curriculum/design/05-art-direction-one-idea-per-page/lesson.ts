import type { LessonMeta } from '../../types';
import { all, allRules, coloursUsed, computed, fontSizes, hueFamilies, mediaRules, parseColour, px, text } from '../../helpers';

/** The longest transition duration in seconds on an element, or 0. */
const longestTransition = (c: Parameters<typeof computed>[0], el: Element) =>
  Math.max(0, ...c.win.getComputedStyle(el).transitionDuration.split(',').map((d) => parseFloat(d) * (d.trim().endsWith('ms') ? 0.001 : 1)));

const filled = (c: Parameters<typeof computed>[0], el: Element) => (parseColour(c.win.getComputedStyle(el).backgroundColor)?.[3] ?? 0) > 0;

export default {
  title: 'Art direction: one idea per page',
  minutes: 35,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'Exactly one button in the hero is filled (the primary action); the rest are outlines', test: (c) => { const btns = all(c.doc, '.hero .btn'); return btns.length >= 2 && btns.filter((b) => filled(c, b)).length === 1; } },
    { label: 'The other buttons have a visible border, so they still read as buttons', test: (c) => all(c.doc, '.hero .btn').filter((b) => !filled(c, b)).every((b) => px(c.win.getComputedStyle(b).borderTopWidth) >= 1) },
    { label: 'The primary action is above the fold of a 1200x800 view', test: (c) => all(c.doc, '.hero .btn').find((b) => filled(c, b))!.getBoundingClientRect().bottom <= 800 },
    { label: 'One dominant element: the h1 is 1.5 times larger than every other text size, and 2.5 times the body', test: (c) => { const h1 = px(computed(c, 'h1', 'font-size')); const others = fontSizes(c).filter((s) => s !== h1); return all(c.doc, 'h1').length === 1 && h1 >= 2.5 * px(computed(c, 'body', 'font-size')) && others.every((s) => h1 >= 1.5 * s); } },
    { label: 'The headline is 10 words or fewer and the lede 30 or fewer', test: ({ doc }) => text(doc.querySelector('h1')).split(' ').length <= 10 && text(doc.querySelector('.lede')).split(' ').length <= 30 },
    { label: 'Hollow-outline emphasis: the h1 emphasis is transparent with a text stroke of 1px or more', test: (c) => all(c.doc, 'h1 .emph').length === 1 && parseColour(computed(c, 'h1 .emph', 'color'))?.[3] === 0 && px(computed(c, 'h1 .emph', '-webkit-text-stroke-width')) >= 1 },
    { label: 'Restraint: two hues beyond the neutrals, at most', test: (c) => hueFamilies(coloursUsed(c)) <= 2 },
    { label: 'Restrained motion: no infinite animations, and transitions of 300ms or less', test: (c) => !allRules(c.doc).some((r) => 'style' in r && /infinite/.test((r as CSSStyleRule).style?.cssText ?? '')) && all(c.doc, '.hero *').every((el) => longestTransition(c, el) <= 0.3) },
    { label: 'A prefers-reduced-motion media query exists', test: ({ doc }) => mediaRules(doc).some((m) => /prefers-reduced-motion/.test(m.conditionText)) },
  ],
  hints: [
    'Work out which button is THE action (Book a call) and style only that one as filled. The other two become outlines: transparent background, a 1px border, normal text colour.',
    'Dominance is a ratio, not a feeling. Bring the h1 up and the stat numbers down until the h1 is at least 1.5 times anything else. The page should have one loudest thing.',
    'Count your hues, not your colours. A tint of violet and a shade of violet are one hue. Pick brand and signal, turn everything else into neutrals, and remove the pulsing animation.',
  ],
  realWorld: { label: 'MDN: prefers-reduced-motion. One headline, one signal colour, one action per view, and motion only for people who want it', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' },
} satisfies LessonMeta;
