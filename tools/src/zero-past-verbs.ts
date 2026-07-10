// The verbs whose standard-English past tense is spelled exactly like the base (M1's "zero-past"
// class: cost, put, hit, ...) — undetectable by surface form alone, so both the translator side
// (pos.ts's coordinated-shape auto-convert, core-lexicon.ts's phrasal-head past/present guard) and
// the reverse translator need the same closed list. A single shared source avoids the two call
// sites drifting out of sync when a verb is added or removed (previously duplicated by hand).
export const ZERO_PAST_VERBS = new Set([
  "cost", "put", "hit", "cut", "set", "let", "read", "shut", "cast",
  "spread", "burst", "hurt", "bet", "quit", "split", "bid",
]);
