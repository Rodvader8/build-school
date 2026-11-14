// Project: the Brightwater room availability grid.

const NIGHTS = 14;

const rooms = [
  { name: 'Garden Room', rate: 380, booked: [2, 3, 4, 9] },
  { name: 'Ocean Room', rate: 520, booked: [0, 1, 7, 8, 12] },
  { name: 'Cliff Suite', rate: 760, booked: [5, 6, 10, 11, 13] },
];

const money = (n) => '$' + n.toLocaleString('en-AU');
const grid = document.querySelector('.tw-grid');

// Build it your way. The brief is in the lesson panel.
