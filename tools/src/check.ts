// Validates the authored lexicon against the deterministic engine: for every entry, derive the
// careful IPA from its respelling and compare to the authored IPA. A difference is expected only
// where the spec's IPA reduces an unstressed full vowel to schwa (computer: kom-PYOO-ter but
// /kəmˈpjutɚ/) — that is lexical, not rule-derivable, so it is *advisory*. Any other difference is
// a genuine authoring bug (a typo in the respelling or the IPA) and is a hard error under --strict.

import { respellingToIpa } from "./respell.ts";
import { defaultLexicon, type Lexicon } from "./lexicon.ts";

export interface Divergence {
  word: string;
  respelling: string;
  /** The shipped IPA from the lexicon. */
  authored: string;
  /** The careful IPA the engine derives from the respelling. */
  derived: string;
  /** "reduction" = advisory (authored reduced a full vowel to schwa); "mismatch" = authoring bug. */
  kind: "reduction" | "mismatch";
}

/** Drop stress and length marks — they never change a segment's identity, only its prominence. */
function stripMarks(ipa: string): string {
  return ipa.replace(/[ˈˌː]/g, "");
}

// Phonemic segments respell.ts can emit that are more than one codepoint (diphthongs, r-colored
// vowels, affricates) — #103: comparing by raw codepoint count would treat a legitimate
// diphthong→schwa reduction (2 codepoints → 1) as a length mismatch instead of a reduction.
// Longest-match, checked as 2-codepoint sequences (none of respell.ts's output is longer).
const MULTI_CODEPOINT_SEGMENTS = new Set([
  "tʃ", "dʒ", // affricates
  "eɪ", "oʊ", "aʊ", "ɔɪ", "aɪ", // diphthongs
  "ɑr", "ɔr", "ɪr", "ɛr", "ʊr", // r-colored vowels
]);

/** Split IPA into phonemic segments (a multi-codepoint unit counts as one segment, not several). */
function segment(ipa: string): string[] {
  const s = Array.from(stripMarks(ipa));
  const out: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const two = s[i]! + (s[i + 1] ?? "");
    if (MULTI_CODEPOINT_SEGMENTS.has(two)) {
      out.push(two);
      i++;
    } else {
      out.push(s[i]!);
    }
  }
  return out;
}

/**
 * True iff `authored` differs from `derived` only by reducing full vowels to schwa (ə) or r-schwa
 * (ɚ). Same segment count with every mismatch landing on an authored schwa is the signature of
 * lexical reduction; anything else (different length, a non-schwa swap) is a real mismatch.
 * Compares by phonemic *segment*, not raw codepoint (#103): a diphthong reducing to a single
 * schwa is a same-segment-count reduction even though the codepoint counts differ.
 */
function isReductionOnly(derived: string, authored: string): boolean {
  const d = segment(derived);
  const a = segment(authored);
  if (d.length !== a.length) return false;
  for (let i = 0; i < d.length; i++) {
    if (d[i] !== a[i] && a[i] !== "ə" && a[i] !== "ɚ") return false;
  }
  return true;
}

export function validateLexicon(lexicon: Lexicon = defaultLexicon): Divergence[] {
  const divergences: Divergence[] = [];
  for (const list of lexicon.entries.values()) {
    for (const entry of list) {
      const derived = respellingToIpa(entry.respelling);
      if (derived === entry.ipa) continue;
      divergences.push({
        word: entry.word,
        respelling: entry.respelling,
        authored: entry.ipa,
        derived,
        kind: isReductionOnly(derived, entry.ipa) ? "reduction" : "mismatch",
      });
    }
  }
  return divergences;
}
