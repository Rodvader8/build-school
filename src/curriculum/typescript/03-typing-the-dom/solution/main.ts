// Typing the DOM: the order form for Saltmarsh Bakehouse, an invented bakery.
// In a browser these functions get real elements. Here, Check my work hands them
// stand-ins, so you can see the types doing their job without opening a page.

export function formatDollars(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}

// 1. querySelector can return null (nothing matched), so handle it first.
export function readQty(input: HTMLInputElement | null): number {
  if (!input) return 0;
  const n = parseInt(input.value, 10);
  return Number.isNaN(n) || n < 0 ? 0 : n;
}

// 2. innerText lives on HTMLElement, not on the broader Element.
export function setTotal(el: HTMLElement | null, cents: number): boolean {
  if (!el) return false;
  el.innerText = formatDollars(cents);
  return true;
}

// 3. Only an HTMLElement has a dataset, so narrow the target first.
export function stepFromClick(e: MouseEvent): number {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return 0;
  return Number(target.dataset.step ?? 0);
}

// 4. The type argument says what querySelector will find.
export function totalFor(root: ParentNode, unitCents: number): string {
  const input = root.querySelector<HTMLInputElement>('#qty');
  return formatDollars(unitCents * readQty(input));
}

// The page wiring only runs in a browser.
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const step = stepFromClick(e);
    if (step !== 0) setTotal(document.querySelector<HTMLElement>('#total'), 450 * step);
  });
}
