import type { LessonMeta } from '../../types';
import { all, coloursUsed, computed, hueFamilies, isLargeText, mediaRules, parseColour, textContrast, textElements, withoutRoot } from '../../helpers';

const TOKENS = ['bg', 'surface', 'text', 'muted', 'brand', 'signal'];

export default {
  title: 'Colour: palettes, contrast and dark themes',
  minutes: 35,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'Six tokens on :root: --bg, --surface, --text, --muted, --brand, --signal', test: ({ doc, win }) => TOKENS.every((t) => win.getComputedStyle(doc.documentElement).getPropertyValue(`--${t}`).trim() !== '') },
    { label: 'No colour values outside :root (everything uses var())', test: ({ files }) => { const rest = withoutRoot(files['style.css'] ?? ''); return !/#[0-9a-f]{3,8}\b/i.test(rest) && !/rgba?\(|hsla?\(/i.test(rest); } },
    { label: 'Every text and background pair passes WCAG AA (4.5:1, or 3:1 for large text)', test: (c) => textElements(c).every((el) => textContrast(c, el) >= (isLargeText(c, el) ? 3 : 4.5)) },
    { label: 'Muted text passes 4.5:1 too, on both surfaces it appears on', test: (c) => all(c.doc, '.lede, .muted').every((el) => textContrast(c, el) >= 4.5) },
    { label: 'The dark theme avoids pure black and pure white', test: (c) => { const bg = parseColour(computed(c, 'body', 'background-color')); const fg = parseColour(computed(c, 'body', 'color')); return !!bg && !!fg && bg.slice(0, 3).join() !== '0,0,0' && fg.slice(0, 3).join() !== '255,255,255'; } },
    { label: 'The palette is limited: eight distinct colours or fewer', test: (c) => coloursUsed(c).size <= 8 },
    { label: 'No more than two hues beyond the neutrals (brand and signal)', test: (c) => hueFamilies(coloursUsed(c)) <= 2 },
    { label: 'A prefers-color-scheme: light media query redefines the tokens', test: ({ doc }) => mediaRules(doc).some((m) => /prefers-color-scheme:\s*light/.test(m.conditionText) && Array.from(m.cssRules).some((r) => 'selectorText' in r && (r as CSSStyleRule).selectorText === ':root' && (r as CSSStyleRule).style.getPropertyValue('--bg') !== '')) },
  ],
  hints: [
    'Fix pairs one at a time. In DevTools, click the colour swatch beside a colour: it shows the contrast ratio and a line marking where AA starts.',
    'Pure #000 behind pure #fff is harsh and smears on OLED screens. Use a very dark, slightly tinted canvas and an off-white text colour. Kestrel Cycles\' canvas is near-black with a green tint.',
    'The button needs two colours that contrast with each other: white on a mid violet works, white on gold does not. If a colour fails against both a dark and a light text, darken or lighten the background, not the text.',
  ],
  realWorld: { label: 'WebAIM contrast checker: test any pair of colours against WCAG AA', href: 'https://webaim.org/resources/contrastchecker/' },
} satisfies LessonMeta;
