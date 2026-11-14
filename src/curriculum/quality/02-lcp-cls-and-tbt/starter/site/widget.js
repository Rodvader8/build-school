// A pretend chat widget. It "builds a search index" by working for 400ms (here it just waits).
// Real code does real work instead of waiting, but it blocks the page in exactly the same way.
const TOTAL_MS = 400;

function busy(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    /* working... */
  }
}

busy(TOTAL_MS);
window.__widgetReady = true;
