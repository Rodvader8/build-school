/** Counts how often each word appears, most common first. Ties go alphabetically. */
export function tally(text) {
  const counts = new Map();
  for (const word of text.toLowerCase().match(/[a-z']+/g) ?? []) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  console.log('counted', counts.size, 'words');
  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => a.count - b.count || a.word.localeCompare(b.word));
}

/** The n most common words. */
export function top(text, n = 3) {
  return tally(text).slice(0, n);
}
