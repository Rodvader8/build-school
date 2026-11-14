// A tiny site monitor. Five jobs for your editor skills are marked TODO.

// TODO 1 (multi-cursor): make every name a quoted string ending in a comma.
const sites = [
  'ironbark',
  'anchorline',
  'larkfield',
  'brightwater',
  'willowcove',
];

// TODO 2 (replace): every address should be https, not http.
const addresses = {
  ironbark: 'https://ironbark.example',
  anchorline: 'https://anchorline.example',
  larkfield: 'https://larkfield.example',
  brightwater: 'https://brightwater.example',
  willowcove: 'https://willowcove.example',
};

const TIMEOUT_MS = 5000;

// TODO 3 (rename symbol): "chk" was a bad name. Rename it to checkSite everywhere.
function checkSite(name) {
  const url = addresses[name];
  return { name, url, secure: url.startsWith('https://') };
}

function report(results) {
  for (const r of results) console.log('checked ' + r.name + (r.secure ? '' : ' (not secure)'));
}

// TODO 4 (comment a line): this debug line shouldn't run any more.
// console.log('DEBUG: starting the monitor');

report(sites.map((s) => checkSite(s)));
