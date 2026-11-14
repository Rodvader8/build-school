// Lesson 8: this file holds the data. Export what main.js needs.

const rooms = [
  { name: 'Garden Room', rate: 380 },
  { name: 'Ocean Room', rate: 520 },
  { name: 'Cliff Suite', rate: 760 },
];

function formatRate(amount) {
  return '$' + amount.toLocaleString('en-AU');
}
