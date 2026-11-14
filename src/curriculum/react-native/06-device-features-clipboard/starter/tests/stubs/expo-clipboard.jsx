// A stand-in for expo-clipboard. Tests choose what happens with: clipboard.mode = 'ok' | 'fail' | 'throw'.
export const clipboard = { mode: 'ok', copied: [] };

export async function setStringAsync(text) {
  if (clipboard.mode === 'throw') throw new Error('clipboard unavailable');
  if (clipboard.mode === 'fail') return false;
  clipboard.copied.push(text);
  return true;
}
