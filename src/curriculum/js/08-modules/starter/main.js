// Lesson 8: import what you need from data.js at the top of this file.

const list = document.querySelector('.db-rooms');

for (const room of rooms) {
  const item = document.createElement('li');
  item.textContent = `${room.name}, ${formatRate(room.rate)} a night`;
  list.append(item);
}
