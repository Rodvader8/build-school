const button = document.querySelector('.pg-button');
const count = document.querySelector('.pg-count');
let clicks = 0;

button.addEventListener('click', () => {
  clicks += 1;
  count.textContent = `Clicks: ${clicks}`;
  console.log('clicked', clicks);
});
