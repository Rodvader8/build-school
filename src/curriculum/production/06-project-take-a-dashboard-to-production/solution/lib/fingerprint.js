// Gives every "kind" of error one short id, so a thousand copies of the same bug count as one. Provided for you.
// Numbers and long ids in the message are flattened, so "Order 4411 failed" and "Order 9023 failed" share a fingerprint.
export function fingerprint({ name = 'Error', message = '', stack = '' }) {
  const flat = String(message).replace(/\b[0-9a-f]{8,}\b/gi, '#').replace(/\d+/g, '#');
  const frame = (String(stack).split('\n').find((l) => /^\s*at /.test(l)) ?? '').replace(/:\d+:\d+\)?$/, '').trim();
  const text = `${name}|${flat}|${frame}`;
  let hash = 2166136261; // FNV-1a
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16).padStart(8, '0');
}
