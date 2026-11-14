import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tally, top } from '../src/tally.js';

test('counts words, ignoring case and punctuation', () => {
  assert.deepEqual(tally('Go, go GO!'), [{ word: 'go', count: 3 }]);
});

test('puts the most common word first', () => {
  assert.equal(tally('a b b c c c')[0].word, 'c');
});

test('breaks ties alphabetically', () => {
  assert.deepEqual(tally('pear apple').map((e) => e.word), ['apple', 'pear']);
});

test('top returns only n entries', () => {
  assert.equal(top('a a b b c d e', 2).length, 2);
});

test('an empty string gives an empty list', () => {
  assert.deepEqual(tally(''), []);
});
