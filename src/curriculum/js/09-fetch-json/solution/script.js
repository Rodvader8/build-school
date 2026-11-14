// Lesson 9: load bookings.json and show today's arrivals.

const status = document.querySelector('.db-status');
const list = document.querySelector('.db-arrivals');

async function loadArrivals() {
  try {
    const response = await fetch('bookings.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    for (const arrival of data.arrivals) {
      const item = document.createElement('li');
      const nights = arrival.nights === 1 ? 'night' : 'nights';
      item.textContent = `${arrival.guest}, ${arrival.room}, ${arrival.nights} ${nights}`;
      list.append(item);
    }
    status.textContent = `${data.arrivals.length} arrivals today`;
  } catch (error) {
    console.error(error);
    status.textContent = "Couldn't load today's arrivals.";
  }
}

loadArrivals();
