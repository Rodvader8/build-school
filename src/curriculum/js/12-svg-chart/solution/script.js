// Lesson 12: draw a bar chart by hand.

const revenue = [
  { month: 'Dec', amount: 61000 }, { month: 'Jan', amount: 48000 }, { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 57000 }, { month: 'Apr', amount: 44000 }, { month: 'May', amount: 39000 },
  { month: 'Jun', amount: 36000 }, { month: 'Jul', amount: 41000 }, { month: 'Aug', amount: 46000 },
  { month: 'Sep', amount: 53000 }, { month: 'Oct', amount: 58000 }, { month: 'Nov', amount: 72000 },
];

const SVG = 'http://www.w3.org/2000/svg';
const chart = document.querySelector('.db-chart');
const WIDTH = 600;
const HEIGHT = 240;
const TOP = 20; // keep a little room above the tallest bar

// Your code below: one rect per month, scaled to the biggest month.
const max = Math.max(...revenue.map((r) => r.amount));
const slot = WIDTH / revenue.length;
const gap = 8;

revenue.forEach((r, i) => {
  const height = (r.amount / max) * (HEIGHT - TOP);
  const bar = document.createElementNS(SVG, 'rect');
  bar.setAttribute('x', String(i * slot + gap / 2));
  bar.setAttribute('y', String(HEIGHT - height));
  bar.setAttribute('width', String(slot - gap));
  bar.setAttribute('height', String(height));
  bar.setAttribute('rx', '4');

  const title = document.createElementNS(SVG, 'title');
  title.textContent = `${r.month}: $${r.amount.toLocaleString('en-AU')}`;
  bar.append(title);
  chart.append(bar);
});
