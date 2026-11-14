// The page's own script: it sets up the Google tag and sends one page-view beacon.
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-TEST000000');

fetch('https://www.google-analytics.com/g/collect?v=2&tid=G-TEST000000&en=page_view', { method: 'POST', mode: 'no-cors', keepalive: true }).catch(() => {});

document.documentElement.dataset.ready = 'yes';
