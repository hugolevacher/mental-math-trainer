import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addFact, hasFact, makeQ, pickTable, practiceShare } from './logic.js';

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

// fraction of questions that are practice facts, plus how often each order appeared
const run = (practice, n = 5000) => {
  let prev = null, hits = 0, ab = 0, ba = 0;
  for (let i = 0; i < n; i++) {
    const q = pickTable(practice, prev);
    assert.ok(!(prev && q.a === prev.a && q.b === prev.b), 'back-to-back repeat');
    const f = practice.find((f) => (f.a === q.a && f.b === q.b) || (f.a === q.b && f.b === q.a));
    if (f) { hits++; q.a === f.a ? ab++ : ba++; }
    prev = q;
  }
  return { share: hits / n, ab, ba };
};

test('practiceShare scales with list size and caps', () => {
  assert.equal(practiceShare(0), 0);
  assert.equal(practiceShare(1), 0.08);
  assert.equal(practiceShare(2), 0.16);
  assert.equal(practiceShare(20), 0.5);
});

test('pickTable: practice facts in both orders, frequency grows with list size', () => {
  const one = run([{ a: 3, b: 4 }]);
  assert.ok(one.share > 0.06 && one.share < 0.13, `1 fact share ${one.share}`); // 8% + uniform chance
  assert.ok(one.ab > 100 && one.ba > 100);
  const ten = run(Array.from({ length: 10 }, (_, i) => ({ a: i + 1, b: 12 })));
  assert.ok(ten.share > 0.45 && ten.share < 0.65, `10 facts share ${ten.share}`);
});
