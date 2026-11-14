import type { CheckContext, LessonMeta } from '../../types';
import { all, coloursUsed, computed, fontFamilies, hueFamilies, isLargeText, onScale, parseColour, px, rulesFor, spacingValues, textContrast, textElements, withoutRoot } from '../../helpers';

const COLOURS = ['bg', 'surface', 'text', 'muted', 'brand', 'signal'];
const root = (c: CheckContext, name: string) => c.win.getComputedStyle(c.doc.documentElement).getPropertyValue(name).trim();
const samples = (c: CheckContext) => [0, 1, 2, 3, 4, 5].map((n) => px(computed(c, `.sample--${n}`, 'font-size')));
const ratio = (c: CheckContext) => (samples(c)[5] / samples(c)[0]) ** (1 / 5);
const filled = (c: CheckContext, el: Element) => (parseColour(c.win.getComputedStyle(el).backgroundColor)?.[3] ?? 0) > 0;

export default {
  title: 'Project: a design system for an invented brand',
  minutes: 60,
  kind: 'web',
  entry: 'tokens.css',
  checks: [
    { label: 'Tokens: six colours, two font stacks, six type steps, six spacing steps and a radius', test: (c) => COLOURS.every((n) => root(c, `--color-${n}`) !== '') && ['--font-heading', '--font-body', '--radius'].every((n) => root(c, n) !== '') && [0, 1, 2, 3, 4, 5].every((n) => root(c, `--step-${n}`) !== '' && root(c, `--space-${n + 1}`) !== '') },
    { label: 'The six colour swatches each show a different colour', test: (c) => new Set(all(c.doc, '.swatch-chip').map((el) => c.win.getComputedStyle(el).backgroundColor)).size === 6 && all(c.doc, '.swatch-chip').every((el) => (parseColour(c.win.getComputedStyle(el).backgroundColor)?.[3] ?? 0) > 0) },
    { label: 'Palette: ten distinct colours or fewer, and at most three hues beyond the neutrals', test: (c) => coloursUsed(c).size >= 6 && coloursUsed(c).size <= 10 && hueFamilies(coloursUsed(c)) <= 3 },
    { label: 'Every text and background pair on the page passes WCAG AA', test: (c) => textElements(c).every((el) => textContrast(c, el) >= (isLargeText(c, el) ? 3 : 4.5)) },
    { label: 'The type scale has a constant ratio between 1.125 and 1.618, starting at 16 to 18px', test: (c) => { const s = samples(c); const r = ratio(c); return s[0] >= 16 && s[0] <= 18 && r >= 1.125 && r <= 1.618 && s.slice(1).every((v, i) => Math.abs(v / s[i] / r - 1) <= 0.03); } },
    { label: 'Every font size on the page sits on your scale', test: (c) => fontSizesOnScale(c) },
    { label: 'No more than two font families', test: (c) => fontFamilies(c).size <= 2 && fontFamilies(c).size >= 1 },
    { label: 'Spacing: six increasing steps, all on a 4px or 8px grid', test: (c) => { const w = [1, 2, 3, 4, 5, 6].map((n) => px(computed(c, `.bar--${n}`, 'width'))); return w.every((v, i) => (v % 8 === 0 || v === 4) && (i === 0 || v > w[i - 1])); } },
    { label: 'Every padding, gap and vertical margin on the page is on the same grid', test: (c) => spacingValues(c).every((s) => Math.abs(s.value - Math.round(s.value)) < 0.01 && (Math.round(s.value) % 8 === 0 || Math.round(s.value) === 4)) },
    { label: 'One primary action: .btn--primary is filled, .btn--ghost is not', test: (c) => all(c.doc, '.btn').filter((b) => filled(c, b)).length === 1 && filled(c, c.doc.querySelector('.btn--primary')!) },
    { label: 'The card uses your radius token', test: (c) => px(computed(c, '.card', 'border-radius')) > 0 && computed(c, '.card', 'border-radius') === root(c, '--radius') },
    { label: 'Buttons and inputs have a :focus-visible outline', test: ({ doc }) => ['.btn', '.input'].every((s) => rulesFor(doc, `${s}:focus-visible`).some((r) => r.style.getPropertyValue('outline') !== '' || r.style.getPropertyValue('outline-width') !== '')) },
    { label: 'No hard-coded colours or spacing outside :root, and no inline styles', test: ({ doc, files }) => { const css = withoutRoot(files['style.css'] ?? ''); return !/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(css) && !/(?:padding|margin|gap)[\w-]*\s*:[^;{}]*\d(?:px|rem|em)\b/.test(css) && !doc.querySelector('[style]'); } },
  ],
  hints: [
    'Start with the type scale. Choose 16px and a ratio, then write out six sizes: the checks measure the six .sample elements, and everything else (headings, lede) should land on the same steps.',
    'Contrast first, beauty second. Choose bg and surface, then pick a text and muted colour that pass 4.5:1 on BOTH. The primary button uses --color-bg as its text, so brand against bg must pass too.',
    'The focus style is the one piece of CSS you must write yourself: put .btn:focus-visible and .input:focus-visible in style.css with a visible outline and an outline-offset.',
  ],
  realWorld: { label: 'Design tokens: the same tokens in, a site out. Open any modern site and read its :root', href: 'https://www.w3.org/community/design-tokens/' },
} satisfies LessonMeta;

function fontSizesOnScale(c: CheckContext) {
  const s = samples(c);
  const r = ratio(c);
  return textElements(c).every((el) => onScale(parseFloat(c.win.getComputedStyle(el).fontSize), s[0], r, 0.03));
}
