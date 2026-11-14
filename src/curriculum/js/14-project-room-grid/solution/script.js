// Project: the Brightwater room availability grid.

const NIGHTS = 14;

const rooms = [
  { name: 'Garden Room', rate: 380, booked: [2, 3, 4, 9] },
  { name: 'Ocean Room', rate: 520, booked: [0, 1, 7, 8, 12] },
  { name: 'Cliff Suite', rate: 760, booked: [5, 6, 10, 11, 13] },
];

const money = (n) => '$' + n.toLocaleString('en-AU');
const grid = document.querySelector('.tw-grid');

// State: the selected nights, stored as "room index:night" strings.
const selected = new Set();

function renderSummary() {
  let total = 0;
  for (const key of selected) {
    const [room] = key.split(':').map(Number);
    total += rooms[room].rate;
  }
  document.querySelector('.tw-nights').textContent = String(selected.size);
  document.querySelector('.tw-total').textContent = money(total);
}

rooms.forEach((room, r) => {
  const label = document.createElement('p');
  label.textContent = room.name;
  grid.append(label);

  for (let night = 0; night < NIGHTS; night++) {
    const cell = document.createElement('button');
    const isBooked = room.booked.includes(night);
    cell.type = 'button';
    cell.className = 'tw-cell';
    cell.dataset.room = String(r);
    cell.dataset.night = String(night);
    cell.setAttribute('aria-label', `${room.name}, night ${night + 1}, ${isBooked ? 'booked' : money(room.rate)}`);

    if (isBooked) {
      cell.classList.add('is-booked');
      cell.disabled = true;
    } else {
      cell.setAttribute('aria-pressed', 'false');
      cell.addEventListener('click', () => {
        const key = `${r}:${night}`;
        if (selected.has(key)) selected.delete(key);
        else selected.add(key);
        const on = selected.has(key);
        cell.classList.toggle('is-selected', on);
        cell.setAttribute('aria-pressed', String(on));
        renderSummary();
      });
    }
    grid.append(cell);
  }
});

renderSummary();
