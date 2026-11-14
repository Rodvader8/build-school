// A stand-in for Google Analytics or Hotjar. Real ones do exactly this: tell a server "someone just looked at this page".
fetch('/analytics/collect', { method: 'POST', keepalive: true }).catch(() => {});
