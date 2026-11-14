// Lesson 7: events.

const button = document.querySelector('.db-menu-button');
const menu = document.querySelector('#menu');
const lens = document.querySelector('.db-lens');

// 1. Menu toggle
function setMenu(open) {
  menu.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
}

button.addEventListener('click', () => {
  setMenu(button.getAttribute('aria-expanded') !== 'true');
});

// 2. Escape closes the menu
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenu(false);
  }
});

// 3. Cursor lens
lens.addEventListener('pointermove', (event) => {
  const box = lens.getBoundingClientRect();
  lens.style.setProperty('--mx', `${Math.round(event.clientX - box.left)}px`);
  lens.style.setProperty('--my', `${Math.round(event.clientY - box.top)}px`);
});
