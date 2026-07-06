// World English morphology helpers (docs/morphology.md).
//
// These compute the *regular* World-English form from a standard base/singular. The linter
// uses them only to produce the "→ expected" hint in its report — detection matches the
// authoritative standard forms in the data files, so a hint that is slightly off on an edge
// case never affects correctness. They are written to be reused by the future translator.

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function isVowel(ch: string | undefined): boolean {
  return ch !== undefined && VOWELS.has(ch);
}

/**
 * Regular past / past participle under M1: add `-ed`, with the ordinary spelling sub-rules.
 * love → loved · give → gived · go → goed · be → beed · try → tried · stop → stopped.
 */
export function regularizeVerbPast(base: string): string {
  const b = base.toLowerCase();

  // Very short stems ending in a pronounced vowel take the full -ed (be → beed).
  if (b.length <= 2 && b.endsWith("e")) return b + "ed";

  // Silent final -e → add just -d (love → loved, give → gived, make → maked, see → seed).
  if (b.endsWith("e")) return b + "d";

  // Consonant + y → -ied (try → tried, carry → carried).
  if (b.endsWith("y") && !isVowel(b.at(-2))) return b.slice(0, -1) + "ied";

  // Stressed single-syllable CVC → double the final consonant (stop → stopped, plan → planned).
  if (isCvc(b) && isMonosyllable(b)) return b + b.at(-1) + "ed";

  return b + "ed";
}

/**
 * Regular plural under M4: add `-s`, or `-es` after a sibilant.
 * child → childs · foot → foots · analysis → analysises · criterion → criterions.
 */
export function regularizePlural(singular: string): string {
  const s = singular.toLowerCase();
  if (/(s|x|z|ch|sh)$/.test(s)) return s + "es";
  return s + "s";
}

function isCvc(word: string): boolean {
  if (word.length < 3) return false;
  const [c1, v, c2] = [word.at(-3), word.at(-2), word.at(-1)];
  // last three chars are consonant–vowel–consonant, final consonant not w/x/y
  return !isVowel(c1) && isVowel(v) && !isVowel(c2) && !["w", "x", "y"].includes(c2!);
}

function isMonosyllable(word: string): boolean {
  // Rough syllable proxy: a single run of vowels. Good enough to gate consonant doubling
  // (stop, plan → yes; travel, open → no) for the hint text.
  const groups = word.match(/[aeiouy]+/g);
  return (groups?.length ?? 0) <= 1;
}
