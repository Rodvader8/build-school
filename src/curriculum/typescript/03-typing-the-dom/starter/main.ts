// Typing the DOM: the order form for Saltmarsh Bakehouse, an invented bakery.
// In a browser these functions get real elements. Here, Check my work hands them
// stand-ins, so you can see the types doing their job without opening a page.

export function formatDollars(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}

// 1. querySelector can return null (nothing matched), and `input` is allowed to be null here.
export function readQty(input: HTMLInputElement | null): number {
  // @ts-expect-error TODO: delete this line, read the error, then handle null
  const n = parseInt(input.value, 10);
  return Number.isNaN(n) || n < 0 ? 0 : n;
}

// 2. Element is the broad type. Only HTMLElement has innerText.
export function setTotal(el: Element | null, cents: number): boolean {
  // @ts-expect-error TODO: two problems on this line. Fix the type, then handle null
  el.innerText = formatDollars(cents);
  return true;
}

// 3. Event targets are broad too: e.target is EventTarget | null.
export function stepFromClick(e: MouseEvent): number {
  // @ts-expect-error TODO: narrow the target with instanceof before reading dataset
  return Number(e.target.dataset.step ?? 0);
}

// 4. querySelector('#qty') is typed as Element | null. Tell it what you expect.
export function totalFor(root: ParentNode, unitCents: number): string {
  const input = root.querySelector('#qty');
  // @ts-expect-error TODO: give querySelector a type argument
  return formatDollars(unitCents * readQty(input));
}

// The page wiring only runs in a browser.
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const step = stepFromClick(e);
    if (step !== 0) setTotal(document.querySelector('#total'), 450 * step);
  });
}
