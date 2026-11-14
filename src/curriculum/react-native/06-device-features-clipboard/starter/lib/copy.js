import * as Clipboard from 'expo-clipboard';

// Device features are asynchronous and can say no: a browser blocks the clipboard on an insecure page, a phone can refuse
// for privacy. This should never throw. Make it answer { ok: true } or { ok: false, reason } and let the screen decide what to say:
//   - wrap the call in try/catch (an error means { ok: false, reason: 'unavailable' })
//   - setStringAsync resolves to false when the copy was refused (that's { ok: false, reason: 'blocked' })
export async function copyText(text) {
  await Clipboard.setStringAsync(text);
  return { ok: true };
}
