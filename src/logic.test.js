import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addMissed, makeQ } from './logic.js';

test('addMissed dedupes, including swapped factors', () => {
  let l = addMissed([], 7, 8);
  l = addMissed(l, 8, 7);
  l = addMissed(l, 7, 8);
  assert.deepEqual(l, [{ a: 7, b: 8 }]);
  assert.equal(addMissed(l, 3, 4).length, 2);
});

test('makeQ stays in range', () => {
  for (let i = 0; i < 1000; i++) {
    const { a, b } = makeQ(1, 12);
    assert.ok(a >= 1 && a <= 12 && b >= 1 && b <= 12);
  }
});
