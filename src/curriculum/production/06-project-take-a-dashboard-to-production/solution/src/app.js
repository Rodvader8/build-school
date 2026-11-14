import { createReporter, installBrowserReporter } from '/lib/reporter.js';

// Anything this page throws, or any promise it forgets to catch, is reported to our own server (which forwards it on).
installBrowserReporter(window, createReporter({ endpoint: '/api/errors', release: 'web' }));

const el = (tag, className, text) => Object.assign(document.createElement(tag), { className, textContent: text });

const summary = await (await fetch('/api/summary')).json();
document.getElementById('title').textContent = summary.business;
document.getElementById('period').textContent = summary.period;
document.getElementById('kpis').replaceChildren(
  ...summary.kpis.map((k) => {
    const tile = el('article', 'kpi');
    tile.append(el('p', 'kpi__label', k.label), el('p', 'kpi__value', k.value));
    return tile;
  }),
);
document.getElementById('rows').replaceChildren(
  ...summary.customers.map((c) => {
    const row = document.createElement('tr');
    row.append(el('th', '', c.name), el('td', '', String(c.orders)), el('td', '', c.revenue));
    row.firstChild.scope = 'row';
    return row;
  }),
);
