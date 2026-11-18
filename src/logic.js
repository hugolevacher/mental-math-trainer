const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

export const makeQ = (lo, hi) => ({ a: rand(lo, hi), b: rand(lo, hi), id: Math.random() });

// 7×8 and 8×7 are the same fact: store it once, newest first
export const addMissed = (list, a, b) => {
  const [x, y] = a <= b ? [a, b] : [b, a];
  return list.some((m) => m.a === x && m.b === y) ? list : [{ a: x, b: y }, ...list];
};
