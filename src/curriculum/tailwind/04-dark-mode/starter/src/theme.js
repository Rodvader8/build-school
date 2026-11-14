// Step 3: make the button switch the theme.
// - toggle the "dark" class on document.documentElement
// - keep aria-pressed on the button in step ("true" when dark)
// - save the choice under the key "theme" in localStorage (inside try/catch)
const root = document.documentElement;
const button = document.querySelector('#theme-toggle');
