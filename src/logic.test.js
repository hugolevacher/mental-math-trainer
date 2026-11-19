import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addFact, hasFact, makeQ, pickTable } from './logic.js';

test('addFact dedupes, including swapped factors', () => {
  let l = addFact([], 7, 8);
  l = addFact(l, 8, 7);
  l = addFact(l, 7, 8);
  assert.deepEqual(l, [{ a: 7, b: 8 }]);
  assert.equal(addFact(l, 3, 4).length, 2);
  assert.ok(hasFact(l, 8, 7));
  assert.ok(!hasFact(l, 3, 4));
});

test('makeQ stays in range', () => {
  for (let i = 0; i < 1000; i++) {
    const { a, b } = makeQ(1, 12);
    assert.ok(a >= 1 && a <= 12 && b >= 1 && b <= 12);
  }
});

test('pickTable favours practice facts, both orders, no back-to-back repeat', () => {
  const practice = [{ a: 3, b: 4 }];
  let prev = null, hits = 0, ab = 0, ba = 0;
  for (let i = 0; i < 2000; i++) {
    const q = pickTable(practice, prev);
    assert.ok(!(prev && q.a === prev.a && q.b === prev.b));
    if (q.a === 3 && q.b === 4) { hits++; ab++; }
    if (q.a === 4 && q.b === 3) { hits++; ba++; }
    prev = q;
  }
  assert.ok(hits > 600, `practice fact shown ${hits}/2000`); // uniform alone would be ~28
  assert.ok(ab > 100 && ba > 100);
});
