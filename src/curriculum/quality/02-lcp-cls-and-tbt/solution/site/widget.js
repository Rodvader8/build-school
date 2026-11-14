// A pretend chat widget. It "builds a search index" by working for 400ms (here it just waits).
// Real code does real work instead of waiting, but it blocks the page in exactly the same way.
const TOTAL_MS = 400;
const SLICE_MS = 20;

function busy(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    /* working... */
  }
}

let done = 0;
function step() {
  busy(SLICE_MS);
  done += SLICE_MS;
  if (done < TOTAL_MS) setTimeout(step, 0); // hand the thread back, then carry on
  else window.__widgetReady = true;
}
step();
