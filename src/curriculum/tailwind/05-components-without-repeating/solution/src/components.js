const money = (n) => '$' + n.toLocaleString('en-AU');

// Content that came from data must never be dropped into HTML as it is.
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function card({ name, type, value }) {
  return `
    <article class="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-5">
      <p class="text-xs font-medium uppercase tracking-widest text-accent">${escapeHtml(type)}</p>
      <h2 class="text-lg font-semibold">${escapeHtml(name)}</h2>
      <p class="text-2xl text-cream">${money(value)}</p>
    </article>`;
}
