const root = document.documentElement;
const button = document.querySelector('#theme-toggle');

function apply(dark) {
  root.classList.toggle('dark', dark);
  button.setAttribute('aria-pressed', String(dark));
}

// The inline script in <head> has already set the class, so just sync the button.
apply(root.classList.contains('dark'));

button.addEventListener('click', () => {
  const dark = !root.classList.contains('dark');
  apply(dark);
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {
    /* private windows can block storage: the toggle still works */
  }
});
