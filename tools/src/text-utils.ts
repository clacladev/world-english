// Small text-handling helpers shared by translate.ts and reverse.ts (#101: these were previously
// copy-pasted verbatim in both files, which risked drift — e.g. the curly-apostrophe fix, #64,
// would otherwise need to be applied twice).

/** Matches a word, optionally with an internal apostrophe contraction/possessive (ASCII ' or curly ’). */
export const WORD = /[A-Za-z]+(?:['’][A-Za-z]+)?/g;

export interface LineToken {
  word: string;
  start: number;
  end: number;
}

/** Every WORD match in a line, with its character offsets, in order. */
export function tokenizeLine(line: string): LineToken[] {
  return [...line.matchAll(WORD)].map((m) => ({
    word: m[0],
    start: m.index,
    end: m.index + m[0].length,
  }));
}

/** Re-apply the source token's casing to its replacement (my→mes, My→Mes, THROUGH→THRU). */
export function matchCase(source: string, replacement: string): string {
  if (source === source.toLowerCase()) return replacement;
  if (source.length > 1 && source === source.toUpperCase()) return replacement.toUpperCase();
  if (source[0] === source[0]!.toUpperCase()) return replacement[0]!.toUpperCase() + replacement.slice(1);
  return replacement;
}
