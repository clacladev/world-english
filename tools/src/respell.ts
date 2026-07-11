// The deterministic respelling → IPA engine (docs/pronunciation.md P1–P4).
//
// Word → respelling is a *lookup* (base spelling doesn't encode sound: knight → NYT can't be
// computed), so it lives in the authored lexicon (src/lexicon.ts). But respelling → IPA *is* a
// fixed rule — the P2/P3 tables are a strict one-sound-per-spelling map — so it is computed here.
// This is the "deterministic where the rule allows" half of the project's standing philosophy.
//
// The IPA produced is the CAREFUL / syllable-timed reading (every syllable at full written value),
// which is itself spec-legal under P6. It is what the lexicon validator checks its authored IPA
// against; the shipped IPA is the authored one, which may additionally carry lexical vowel
// reduction the respelling can't express (computer: kom-PYOO-ter but /kəmˈpjutɚ/).

/** The P2/P3 grapheme → IPA map. `er` and `y` are context-sensitive and handled in the engine. */
export const GRAPHEME_TO_IPA: ReadonlyMap<string, string> = new Map([
  // Consonants (P2). Note the script-g ɡ (U+0261) to match the spec's gold IPA.
  ["b", "b"], ["d", "d"], ["f", "f"], ["g", "ɡ"], ["h", "h"], ["j", "dʒ"], ["k", "k"],
  ["l", "l"], ["m", "m"], ["n", "n"], ["p", "p"], ["r", "r"], ["s", "s"], ["t", "t"],
  ["v", "v"], ["w", "w"], ["z", "z"],
  // Consonant digraphs (P2/P3): th = /θ/, dh = /ð/.
  ["ch", "tʃ"], ["sh", "ʃ"], ["zh", "ʒ"], ["th", "θ"], ["dh", "ð"], ["ng", "ŋ"],
  // Simple vowels (P2).
  ["a", "æ"], ["e", "ɛ"], ["i", "ɪ"], ["o", "ɑ"], ["u", "ʌ"], ["uu", "ʊ"],
  ["ee", "i"], ["ay", "eɪ"], ["oh", "oʊ"], ["oo", "u"], ["aw", "ɔ"], ["ow", "aʊ"],
  ["oy", "ɔɪ"], ["uh", "ə"],
  // R-colored vowels (P2). `er` → /ɝ/ stressed, /ɚ/ unstressed — decided in respellingToIpa.
  ["ar", "ɑr"], ["or", "ɔr"], ["eer", "ɪr"], ["air", "ɛr"], ["oor", "ʊr"],
]);

/** Vowel graphemes — used to decide the `y` glide/vowel split (P2's `y` note). `y` excluded. */
export const VOWEL_GRAPHEMES = new Set([
  "a", "e", "i", "o", "u", "uu", "ee", "ay", "oh", "oo", "aw", "ow", "oy", "uh",
  "er", "ar", "or", "eer", "air", "oor",
]);

// Multi-letter graphemes, longest first: the ordering is load-bearing. R-colored TRIGRAPHS must be
// tried before the vowel digraphs so `oor` wins over `oo`+`r` (POOR → /pʊr/) and `eer`/`air` parse
// as one r-colored vowel, not vowel + r.
const TRIGRAPHS = ["eer", "air", "oor"];
const DIGRAPHS = [
  "er", "ar", "or", // r-colored
  "uu", "ee", "ay", "oh", "oo", "aw", "ow", "oy", "uh", // vowel
  "ch", "sh", "zh", "th", "dh", "ng", // consonant
];

/** Split a respelling into its syllables on the hyphen (P1: `-` marks syllable breaks). */
export function splitSyllables(respelling: string): string[] {
  return respelling.split("-");
}

/** A syllable is stressed iff it is written in CAPITALS (P1/P4). */
function isStressed(syllable: string): boolean {
  return syllable === syllable.toUpperCase() && syllable !== syllable.toLowerCase();
}

/**
 * Index of the single stressed (all-caps) syllable, or -1 for an unstressed function word
 * (P5, e.g. `the` → dhuh). Throws on more than one stress mark — an authoring bug the lexicon
 * invariant should never let through (mirrors the determinism guards in dataset.ts).
 */
export function findStress(syllables: string[]): number {
  const stressed = syllables
    .map((s, i) => (isStressed(s) ? i : -1))
    .filter((i) => i !== -1);
  if (stressed.length > 1) {
    throw new Error(`respelling has ${stressed.length} stressed syllables: ${syllables.join("-")}`);
  }
  return stressed[0] ?? -1;
}

/**
 * Greedy longest-match tokenizer for one syllable, returning its grapheme sequence (lowercased).
 * Because we tokenize *per syllable*, the hyphen already separates digraph boundaries (MIS-hap,
 * ING-glish) — so no cross-syllable logic is needed (P3's stated disambiguation mechanism).
 */
export function tokenizeSyllable(syllable: string): string[] {
  const s = syllable.toLowerCase();
  const out: string[] = [];
  let i = 0;
  while (i < s.length) {
    const three = s.slice(i, i + 3);
    const two = s.slice(i, i + 2);
    if (TRIGRAPHS.includes(three)) {
      out.push(three);
      i += 3;
    } else if (DIGRAPHS.includes(two)) {
      out.push(two);
      i += 2;
    } else {
      out.push(s[i]!);
      i += 1;
    }
  }
  return out;
}

/** Map one grapheme to IPA, given whether its syllable is stressed and its follower (for `y`). */
function graphemeToIpa(grapheme: string, stressed: boolean, next: string | undefined): string {
  if (grapheme === "er") return stressed ? "ɝ" : "ɚ"; // r-colored NURSE vowel allophone (P2)
  if (grapheme === "y") return next !== undefined && VOWEL_GRAPHEMES.has(next) ? "j" : "aɪ";
  const ipa = GRAPHEME_TO_IPA.get(grapheme);
  if (ipa === undefined) throw new Error(`no IPA for grapheme "${grapheme}"`);
  return ipa;
}

/**
 * Render a respelling to careful/syllable-timed IPA. Stress mark ˈ prefixes the stressed
 * syllable — but only for polysyllables (a lone syllable carries no mark: KAT → /kæt/).
 */
export function respellingToIpa(respelling: string): string {
  const syllables = splitSyllables(respelling);
  const stressIndex = findStress(syllables);
  const marked = syllables.length >= 2;

  return syllables
    .map((syllable, s) => {
      const graphemes = tokenizeSyllable(syllable);
      const stressed = s === stressIndex;
      const body = graphemes
        .map((g, gi) => graphemeToIpa(g, stressed, graphemes[gi + 1]))
        .join("");
      return marked && stressed ? "ˈ" + body : body;
    })
    .join("");
}
