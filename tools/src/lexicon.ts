// Loads the authored pronunciation lexicon (data/pronunciation.json) into the in-memory index
// the renderer looks words up in. Word → respelling can't be derived from base spelling, so it is
// authored; this file just indexes it and enforces the one invariant every entry must satisfy.

import { findStress, splitSyllables } from "./respell.ts";
import pronunciation from "../data/pronunciation.json" with { type: "json" };

export interface PronEntry {
  /** The word, lowercased — the lookup key. */
  word: string;
  /** Learner respelling: CAPITALS = stressed syllable, `-` = syllable break (P1/P4). */
  respelling: string;
  /** Authored IPA (bare, no slashes), matching the spec's gold reading. */
  ipa: string;
  /** Homograph sense selector, e.g. "metal" / "guide" for `lead` (shown in the ambiguity flag). */
  note?: string;
  /** A function word carrying no stress mark (no CAPITALS syllable), e.g. `the` → dhuh (P5). */
  unstressed?: boolean;
}

export interface Lexicon {
  /** Lowercased word → its entries. More than one entry = a retained homograph (P-spec residue). */
  entries: Map<string, PronEntry[]>;
}

interface RawEntry {
  word: string;
  respelling: string;
  ipa: string;
  note?: string;
  unstressed?: boolean;
}

/**
 * Every entry must mark stress exactly once — a CAPITALS syllable — unless it is explicitly an
 * `unstressed` function word (then it must have none). This is the authoring guard that keeps the
 * respelling→IPA engine deterministic; findStress already throws on >1 stress.
 */
function assertStressInvariant(entry: RawEntry): void {
  const stress = findStress(splitSyllables(entry.respelling));
  if (entry.unstressed && stress !== -1) {
    throw new Error(`"${entry.word}" is marked unstressed but "${entry.respelling}" carries stress`);
  }
  if (!entry.unstressed && stress === -1) {
    throw new Error(`"${entry.word}" (${entry.respelling}) marks no stress; add CAPITALS or unstressed:true`);
  }
}

export function loadLexicon(): Lexicon {
  const entries = new Map<string, PronEntry[]>();
  for (const raw of pronunciation.entries as RawEntry[]) {
    assertStressInvariant(raw);
    const word = raw.word.toLowerCase();
    const entry: PronEntry = {
      word,
      respelling: raw.respelling,
      ipa: raw.ipa,
      ...(raw.note !== undefined ? { note: raw.note } : {}),
      ...(raw.unstressed ? { unstressed: true } : {}),
    };
    const existing = entries.get(word);
    if (existing) existing.push(entry);
    else entries.set(word, [entry]);
  }
  return { entries };
}

export const defaultLexicon = loadLexicon();
