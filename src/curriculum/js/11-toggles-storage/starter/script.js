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

let period = '1Y';

function render() {
  // TODO: show the end value, the change line, and which button is pressed.
}

// TODO: clicking a button sets period, saves it, and renders.

// TODO: on load, restore a saved period (safely), then render.
render();
