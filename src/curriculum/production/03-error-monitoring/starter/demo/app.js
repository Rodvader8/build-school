// A page that installs your browser reporter and can throw on demand. Provided for you.
import { createReporter, installBrowserReporter } from '../src/reporter.js';

const endpoint = new URLSearchParams(location.search).get('endpoint');
installBrowserReporter(window, createReporter({ endpoint, release: 'demo-1.0.0' }));

window.__fire = () => {
  setTimeout(() => {
    throw new Error('Checkout failed for sam@example.com, order 4411');
  }, 0);
  Promise.reject(new Error('Payment failed: token=abc123secretvalue'));
};
window.__ready = true;
