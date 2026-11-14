// Lesson 11: a period toggle that remembers your choice.

const history = {
  '1Y': { start: 7420000, end: 8110000 },
  '5Y': { start: 5260000, end: 8110000 },
  '10Y': { start: 3180000, end: 8110000 },
};

const money = (n) => '$' + n.toLocaleString('en-AU');
const buttons = document.querySelectorAll('[data-period]');
const figure = document.querySelector('.db-figure');
const change = document.querySelector('.db-change');
const KEY = 'nm-period';

let period = '1Y';

function render() {
  const { start, end } = history[period];
  const gain = end - start;
  const percent = Math.round((gain / start) * 100);
  figure.textContent = money(end);
  change.textContent = `Up ${money(gain)} (${percent}%) over ${period}`;
  for (const button of buttons) {
    button.setAttribute('aria-pressed', String(button.dataset.period === period));
  }
}

for (const button of buttons) {
  button.addEventListener('click', () => {
    period = button.dataset.period;
    try {
      localStorage.setItem(KEY, period);
    } catch {
      // private windows can refuse storage; the toggle still works
    }
    render();
  });
}

try {
  const saved = localStorage.getItem(KEY);
  if (saved && saved in history) period = saved;
} catch {
  // no storage: start on 1Y
}
render();
