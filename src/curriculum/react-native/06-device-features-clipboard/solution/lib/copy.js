import * as Clipboard from 'expo-clipboard';

// Device features are asynchronous and can say no: a browser blocks the clipboard on an insecure page, a phone can refuse
// for privacy. So this never throws. It answers { ok: true } or { ok: false, reason } and lets the screen decide what to say.
// Keeping the Expo call in one file means the rest of the app doesn't care what the device can do.
export async function copyText(text) {
  try {
    const copied = await Clipboard.setStringAsync(text);
    return copied === false ? { ok: false, reason: 'blocked' } : { ok: true };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}
