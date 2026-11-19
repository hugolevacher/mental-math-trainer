const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

export const makeQ = (lo, hi) => ({ a: rand(lo, hi), b: rand(lo, hi), id: Math.random() });

// 7×8 and 8×7 are the same fact: store it once, newest first
export const addFact = (list, a, b) => {
  const [x, y] = a <= b ? [a, b] : [b, a];
  return list.some((m) => m.a === x && m.b === y) ? list : [{ a: x, b: y }, ...list];
};

export const hasFact = (list, a, b) => addFact(list, a, b) === list;

// Each practice fact adds 8% of questions, capped at 50% so the rest of the tables still come up
const SHARE_PER_FACT = 0.08;
const MAX_SHARE = 0.5;
export const practiceShare = (n) => Math.min(MAX_SHARE, n * SHARE_PER_FACT);

// Practice facts come up in either order; never the same question twice in a row
export const pickTable = (practice, prev) => {
  let q;
  do {
    if (Math.random() < practiceShare(practice.length)) {
      const f = practice[rand(0, practice.length - 1)];
      q = Math.random() < 0.5 ? { a: f.a, b: f.b, id: Math.random() } : { a: f.b, b: f.a, id: Math.random() };
    } else q = makeQ(1, 12);
  } while (prev && q.a === prev.a && q.b === prev.b);
  return q;
};
