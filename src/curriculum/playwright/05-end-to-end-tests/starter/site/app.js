const MUT = window.__MUT || ''; // test hook: Check my work sets this to break the page on purpose
const button = document.querySelector('#menu-button');
const menu = document.querySelector('#menu');
button.addEventListener('click', () => {
  if (MUT === 'menu') return;
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
});

const form = document.querySelector('#enquiry');
const error = document.querySelector('#error');
const thanks = document.querySelector('#thanks');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const ok = form.elements.name.value.trim() && form.elements.email.value.includes('@');
  error.hidden = !!ok || MUT === 'noerror';
  thanks.hidden = !ok || MUT === 'nosuccess';
});
