import type { Check, CheckContext } from './types';

// Small helpers so lesson checks read like plain English.

export const text = (el: Element | null | undefined) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

export const all = (doc: Document | Element, selector: string) => Array.from(doc.querySelectorAll(selector));

export const hasText = (el: Element | null | undefined, min = 2) => text(el).length >= min;

/** True when the raw file contains the pattern (for things the browser hides, like a missing <head>). */
export const fileHas = (files: Record<string, string>, name: string, pattern: RegExp) => pattern.test(files[name] ?? '');

/** Every form control has a visible label, either wrapping it or linked with for/id. */
export function controlsLabelled(scope: Document | Element) {
  const controls = all(scope, 'input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea');
  if (controls.length === 0) return false;
  return controls.every((c) => {
    if (c.closest('label')) return true;
    const id = c.getAttribute('id');
    return !!id && all(scope, 'label[for]').some((l) => l.getAttribute('for') === id);
  });
}

/** Headings never jump a level going down (h2 straight to h4 is a skip). */
export function headingsInOrder(doc: Document) {
  const levels = all(doc, 'h1, h2, h3, h4, h5, h6').map((h) => Number(h.tagName[1]));
  return levels.every((lvl, i) => i === 0 || lvl <= levels[i - 1] + 1);
}

/* ---------- CSS helpers (computed styles and the stylesheet's own rules) ---------- */

/** The computed value of a property on the first element matching the selector, or '' if there's no match. */
export function computed(c: CheckContext, selector: string, prop: string, pseudo?: string) {
  const el = c.doc.querySelector(selector);
  return el ? c.win.getComputedStyle(el, pseudo ?? null).getPropertyValue(prop).trim() : '';
}

/** A computed length in px as a number (NaN when it isn't a px length). */
export const px = (value: string) => (/^-?[\d.]+px$/.test(value) ? parseFloat(value) : NaN);

// Rules from an iframe come from another window, so instanceof checks fail. Compare type names instead.
const kind = (r: CSSRule) => r.constructor.name;

/** Every rule in every stylesheet, including rules inside @media and nested rules. */
export function allRules(doc: Document): CSSRule[] {
  const out: CSSRule[] = [];
  const walk = (rules: CSSRuleList) => {
    for (const r of Array.from(rules)) {
      out.push(r);
      if ('cssRules' in r && kind(r) !== 'CSSKeyframesRule') walk((r as CSSGroupingRule).cssRules);
    }
  };
  for (const sheet of Array.from(doc.styleSheets)) {
    try {
      walk(sheet.cssRules);
    } catch {
      /* a sheet from another site can't be read */
    }
  }
  return out;
}

/** Style rules whose selector list contains exactly this selector, e.g. rulesFor(doc, '.nm-card'). */
export function rulesFor(doc: Document | CSSRule[], selector: string): CSSStyleRule[] {
  const rules = Array.isArray(doc) ? doc : allRules(doc);
  return rules.filter(
    (r): r is CSSStyleRule => kind(r) === 'CSSStyleRule' && (r as CSSStyleRule).selectorText.split(',').some((s) => s.trim() === selector),
  );
}

/** The value a stylesheet rule sets for a property (the last rule wins), as written. */
export function ruleValue(doc: Document | CSSRule[], selector: string, prop: string) {
  const values = rulesFor(doc, selector).map((r) => r.style.getPropertyValue(prop)).filter(Boolean);
  return values[values.length - 1] ?? '';
}

export const mediaRules = (doc: Document) => allRules(doc).filter((r): r is CSSMediaRule => kind(r) === 'CSSMediaRule');

export const fontFaces = (doc: Document) => allRules(doc).filter((r): r is CSSFontFaceRule => kind(r) === 'CSSFontFaceRule');

export const keyframes = (doc: Document, name: string) =>
  allRules(doc).some((r) => kind(r) === 'CSSKeyframesRule' && (r as CSSKeyframesRule).name === name);

/** Rules inside @media blocks whose condition matches the pattern. */
export const rulesInMedia = (doc: Document, condition: RegExp) =>
  mediaRules(doc)
    .filter((m) => condition.test(m.conditionText))
    .flatMap((m) => Array.from(m.cssRules));

/** The stylesheet text with the :root { ... } block removed, to look for hard-coded values. */
export const withoutRoot = (css: string) => css.replace(/:root\s*\{[^}]*\}/g, '');

/** True when a stylesheet linked from the page has loaded with at least one rule. */
export const sheetLoaded = (doc: Document, name: string) =>
  Array.from(doc.styleSheets).some((s) => (s.href ?? '').endsWith('/' + name) && s.cssRules.length > 0);

/* ---------- JavaScript helpers (run the student's code and watch what it does) ---------- */

/** Everything the page has logged with console.log/info/warn/error, one entry per line. */
export const logLines = (win: Window): string[] =>
  ((win as unknown as { __bsLog?: { text: string }[] }).__bsLog ?? []).map((l) => l.text);

/** Errors the page has thrown or logged. */
export const errors = (win: Window): string[] =>
  ((win as unknown as { __bsLog?: { level: string; text: string }[] }).__bsLog ?? []).filter((l) => l.level === 'error').map((l) => l.text);

/** Reads a top-level const, let, var or function from the page's script. undefined if it doesn't exist. */
export function globalValue(win: Window, name: string): unknown {
  if (!/^[A-Za-z_$][\w$]*$/.test(name)) return undefined;
  try {
    return (win as unknown as { eval: (code: string) => unknown }).eval(`typeof ${name} === 'undefined' ? undefined : ${name}`);
  } catch {
    return undefined;
  }
}

/** Calls a top-level function from the page's script. Returns undefined if it isn't a function or it throws. */
export function callGlobal(win: Window, name: string, ...args: unknown[]): unknown {
  const fn = globalValue(win, name);
  if (typeof fn !== 'function') return undefined;
  try {
    return fn(...args);
  } catch {
    return undefined;
  }
}

/** Dispatches a real event inside the preview, built with the preview's own event classes. */
export function fire(c: CheckContext, target: Element | null, type: string, init: Record<string, unknown> = {}) {
  if (!target) return false;
  const W = c.win as unknown as Record<string, new (t: string, i: object) => Event>;
  const Ctor = type.startsWith('pointer') ? W.PointerEvent : type.startsWith('key') ? W.KeyboardEvent : type === 'click' ? W.MouseEvent : W.Event;
  return target.dispatchEvent(new Ctor(type, { bubbles: true, cancelable: true, ...init }));
}

/** Types into an input the way a person would: sets the value, then fires an input event. */
export function typeInto(c: CheckContext, input: Element | null, value: string) {
  if (!input) return false;
  (input as HTMLInputElement).value = value;
  return fire(c, input, 'input');
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Polls until the condition is true or the time runs out. */
export async function waitFor(condition: () => boolean, timeout = 2000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    try {
      if (condition()) return true;
    } catch {
      /* not ready yet */
    }
    await wait(50);
  }
  return false;
}

/** Visible text of every element matching the selector. */
export const texts = (doc: Document | Element, selector: string) => all(doc, selector).map((el) => text(el));

/* ---------- Python and Rust helpers (read the program's output) ---------- */

/** True when the output has a line "PASS <name>", as printed by a lesson's tests.py or test harness. */
export const passed = (output: string, name: string) => new RegExp(`^PASS ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm').test(output);

/** The program's output lines, without the "$ command" line and the exit line the runner adds. */
export const outputLines = (output: string) =>
  output
    .split('\n')
    .map((l) => l.replace(/\r$/, ''))
    .filter((l) => !l.startsWith('$ ') && !/^\[Process exited/.test(l));

/**
 * True when `cargo test --quiet` ran the lesson's tests and the test with this name didn't fail.
 * (Quiet mode prints dots instead of names, so a failure shows up as a "---- name stdout ----" block.
 * A build error means no test result at all.)
 */
export const cargoPassed = (output: string, name: string) =>
  // Strict: a test only counts when cargo prints its exact name with "ok", so a mistyped name can never pass.
  new RegExp(`^test (?:[\\w:]+::)?${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\.\\.\\. ok$`, 'm').test(output);

/* ---------- Three.js helpers (lessons expose window.__app = { scene, camera, renderer, ... } for checks) ---------- */

/** The debugging handle a Three.js lesson hangs on window. undefined until the student adds it. */
export const threeApp = (win: Window) => (win as unknown as { __app?: any }).__app;

/** Every Mesh in the scene, however deeply it's nested. */
export function meshesIn(scene: any): any[] {
  const out: any[] = [];
  scene?.traverse?.((o: any) => o.isMesh && out.push(o));
  return out;
}

/** The object's centre in normalised screen space, -1 to 1 on both axes (z under 1 means in front of the far plane). */
export function ndcOf(app: any, obj: any) {
  app.scene.updateMatrixWorld(true);
  app.camera.updateMatrixWorld(true);
  const p = new app.camera.position.constructor();
  obj.getWorldPosition(p);
  return p.project(app.camera) as { x: number; y: number; z: number };
}

/** True when the object's centre lands inside the camera's view. */
export function inView(app: any, obj: any) {
  const p = ndcOf(app, obj);
  return Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 && p.z < 1;
}

/** Where on the page (clientX, clientY) the object's centre is drawn, for firing pointer events at it. */
export function clientPointOf(app: any, canvas: Element, obj: any) {
  const p = ndcOf(app, obj);
  const r = canvas.getBoundingClientRect();
  return { clientX: r.left + ((p.x + 1) / 2) * r.width, clientY: r.top + ((1 - p.y) / 2) * r.height };
}

/** True when the script reads prefers-reduced-motion into a variable and then actually uses that variable (comments don't count). */
export function respectsReducedMotion(files: Record<string, string>, name: string) {
  const code = (files[name] ?? '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const m = /(?:const|let|var)\s+(\w+)\s*=\s*(?:window\.)?matchMedia\(\s*['"`][^'"`]*prefers-reduced-motion[^'"`]*['"`]\s*\)/.exec(code);
  if (!m) return /prefers-reduced-motion/.test(code) && /\.matches/.test(code);
  return (code.match(new RegExp(`\\b${m[1]}\\b`, 'g')) ?? []).length >= 2;
}

/** The same THREE module the page imported (through its import map), so checks can build Box3, Vector3 and friends. */
export const threeModule = (win: Window): Promise<any> => (win as unknown as { eval: (code: string) => Promise<any> }).eval("import('three')");

/* ---------- Colour helpers ---------- */

/** WCAG contrast ratio between two computed colours like "rgb(27, 32, 48)". 1 means identical, 21 is black on white. NaN if either isn't plain rgb. */
export function contrastRatio(a: string, b: string) {
  const lum = (css: string) => {
    const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/.exec(css);
    if (!m) return NaN;
    const [r, g, bl] = [m[1], m[2], m[3]].map((v) => {
      const c = parseFloat(v) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/* ---------- Project lessons (check.mjs prints one PASS/FAIL line per check) ---------- */

/** One check per name: it passes when check.mjs printed "PASS <name>". Use for project lessons where every check lives in check.mjs. */
export const outputChecks = (names: string[]): Check[] => names.map((name) => ({ label: name, test: ({ output }) => passed(output, name) }));

/* ---------- Design helpers (measure a page's type, colour and spacing instead of judging it) ---------- */

const NON_TEXT = new Set(['SCRIPT', 'STYLE', 'HEAD', 'TITLE', 'META', 'LINK', 'NOSCRIPT', 'TEMPLATE']);

/** Visible elements that directly hold text (not just a child element's text). */
export const textElements = (c: CheckContext): Element[] =>
  all(c.doc.body, '*').filter(
    (el) =>
      !NON_TEXT.has(el.tagName) &&
      el.getClientRects().length > 0 &&
      Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? '').trim() !== ''),
  );

/** The rendered font size in px of every text element. */
export const fontSizes = (c: CheckContext) => textElements(c).map((el) => parseFloat(c.win.getComputedStyle(el).fontSize));

/** True when the size sits on the modular scale base * ratio^n (n any whole number), within a tolerance. */
export function onScale(size: number, base: number, ratio: number, tolerance = 0.03) {
  const n = Math.round(Math.log(size / base) / Math.log(ratio));
  return Math.abs((base * ratio ** n) / size - 1) <= tolerance;
}

/** [r, g, b, a] from a computed colour like "rgb(1, 2, 3)" or "rgba(1, 2, 3, 0.5)". null for anything else. */
export function parseColour(css: string): [number, number, number, number] | null {
  const m = /^rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\)$/.exec(css.trim());
  if (!m) return null;
  const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), a];
}

const over = (top: number[], under: number[]) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3]));

/** The colour actually behind an element: its own and its ancestors' backgrounds layered over white. */
export function effectiveBackground(c: CheckContext, el: Element): [number, number, number] {
  const layers: number[][] = [];
  for (let n: Element | null = el; n; n = n.parentElement) {
    const col = parseColour(c.win.getComputedStyle(n).backgroundColor);
    if (col && col[3] > 0) layers.push(col);
  }
  let result = [255, 255, 255, 1];
  for (const layer of layers.reverse()) result = [...over(layer, result), 1];
  return [result[0], result[1], result[2]];
}

/** WCAG contrast ratio of an element's text colour against what's behind it. NaN if a colour isn't plain rgb. */
export function textContrast(c: CheckContext, el: Element) {
  const bg = effectiveBackground(c, el);
  const fg = parseColour(c.win.getComputedStyle(el).color);
  if (!fg) return NaN;
  const mixed = over(fg, bg);
  return contrastRatio(`rgb(${mixed.join(',')})`, `rgb(${bg.join(',')})`);
}

/** WCAG's "large text": 24px or more, or 18.66px or more in bold. It needs 3:1 instead of 4.5:1. */
export function isLargeText(c: CheckContext, el: Element) {
  const s = c.win.getComputedStyle(el);
  const size = parseFloat(s.fontSize);
  return size >= 24 || (size >= 18.66 && parseInt(s.fontWeight, 10) >= 700);
}

/** How many characters ("0" widths, the CSS ch unit) fit on one line of this element's content box. */
export function lineLengthCh(c: CheckContext, el: Element) {
  const probe = c.doc.createElement('span');
  probe.setAttribute('data-probe', '');
  (probe as HTMLElement).style.cssText = 'display:inline-block;width:1ch;height:0';
  el.appendChild(probe);
  const ch = probe.getBoundingClientRect().width;
  probe.remove();
  const s = c.win.getComputedStyle(el);
  const inner = el.getBoundingClientRect().width - ['padding-left', 'padding-right', 'border-left-width', 'border-right-width'].reduce((t, p) => t + parseFloat(s.getPropertyValue(p)), 0);
  return inner / ch;
}

/** The first family named in font-family, lower-cased, for every text element. Fallbacks don't count as extra families. */
export const fontFamilies = (c: CheckContext) =>
  new Set(textElements(c).map((el) => c.win.getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim().toLowerCase()));

/** Every distinct non-transparent colour the page paints: text, backgrounds and visible borders. */
export function coloursUsed(c: CheckContext) {
  const out = new Set<string>();
  const add = (v: string) => {
    const col = parseColour(v);
    if (col && col[3] > 0) out.add(v.replace(/\s+/g, ''));
  };
  for (const el of all(c.doc.body, '*')) {
    if (el.getClientRects().length === 0) continue;
    const s = c.win.getComputedStyle(el);
    add(s.backgroundColor);
    if (parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none') add(s.borderTopColor);
  }
  for (const el of textElements(c)) add(c.win.getComputedStyle(el).color);
  return out;
}

/** How many clearly different hues a set of colours contains. Greys and near-black or near-white don't count. */
export function hueFamilies(colours: Iterable<string>, spread = 30) {
  const hues: number[] = [];
  for (const css of colours) {
    const col = parseColour(css.replace(/,/g, ', '));
    if (!col) continue;
    const [r, g, b] = col.slice(0, 3).map((v) => v / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    if (d === 0 || l < 0.08 || l > 0.95 || d / (1 - Math.abs(2 * l - 1)) < 0.25) continue;
    const h = (max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60;
    const hue = (h + 360) % 360;
    if (!hues.some((x) => Math.min(Math.abs(x - hue), 360 - Math.abs(x - hue)) < spread)) hues.push(hue);
  }
  return hues.length;
}

/** Every padding, row-gap, column-gap and vertical margin on the page in px, with the element it came from. Auto and zero-size values are skipped. */
export function spacingValues(c: CheckContext) {
  const props = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-bottom', 'row-gap', 'column-gap'];
  const out: { el: Element; prop: string; value: number }[] = [];
  for (const el of [c.doc.body, ...all(c.doc.body, '*')]) {
    if (NON_TEXT.has(el.tagName) || el.getClientRects().length === 0) continue;
    const s = c.win.getComputedStyle(el);
    for (const prop of props) {
      const value = parseFloat(s.getPropertyValue(prop));
      if (!Number.isNaN(value)) out.push({ el, prop, value });
    }
  }
  return out;
}

/* ---------- Stage 7: the quality gate (every Rebuild lesson prints these lines from gate.mjs) ---------- */

/** The rules gate.mjs runs on every site, by the exact name it prints after PASS. */
export const GATE_RULES = [
  'the site builds',
  'no inline style attributes in the source or the built HTML',
  'fonts are self-hosted woff2 files',
  'a Content-Security-Policy is defined and sensible',
  'every page has exactly one h1',
  'every page has a meta description of 120 to 160 characters',
  'every page has JSON-LD that parses and names what it is',
  'og:image is a JPG or PNG, never WebP',
  'nothing loads from Google Fonts',
  'axe-core finds no serious or critical violations',
  'no horizontal overflow at 375, 768, 1280 and 1920 wide',
  'reduced motion stops every animation and keeps the content visible',
  'the pages load under the policy with no CSP errors',
  'Lighthouse accessibility is 95 or more on every page',
  'Lighthouse SEO is 95 or more on every page',
  'Lighthouse: every image has a width and height',
  'Lighthouse: nothing blocks the first paint',
  'Lighthouse: images are big enough for their slot',
];

/** The extra rules gate.mjs adds for the dashboard brief. */
export const GATE_DASHBOARD_RULES = [
  'you wrote at least 6 tests of your own, and they pass',
  'the table sorts from the keyboard',
  'the chart has an accessible name',
  'the chart has a data table alternative',
  'the period toggle changes the numbers',
];

/** One check per gate rule, plus any lesson-specific lines the lesson's own check.mjs prints. */
export const gateChecks = (extra: string[] = [], dashboard = false): Check[] =>
  outputChecks([...GATE_RULES, ...(dashboard ? GATE_DASHBOARD_RULES : []), ...extra]);
