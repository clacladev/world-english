// Renders World English text to its learner respelling (default) or IPA (--ipa), by looking each
// word up in the authored lexicon (src/lexicon.ts). Mirrors translate.ts's substitute() structure —
// tokenize on word matches, copy the gaps between them verbatim — so punctuation and whitespace
// (including a question's trailing `?`) pass through untouched. Unlike translate.ts it does NOT re-case the output:
// respelling casing is *semantic* (CAPITALS = stress, P1/P4), so the lexicon's stored casing is
// emitted as-is (The → dhuh). Nothing is guessed: an unknown word is emitted verbatim and flagged;
// a homograph emits its first entry and flags the alternatives (the reverse-translator's
// canonical-guess-plus-flag pattern).

import { defaultLexicon, type Lexicon } from "./lexicon.ts";

export interface PronounceOptions {
  /** Emit IPA instead of the learner respelling. */
  ipa?: boolean;
  /** File label used in flag positions. Default "<stdin>". */
  file?: string;
  /** Override the lexicon (mainly for tests). */
  lexicon?: Lexicon;
}

export type PronFlagKind = "not-found" | "homograph";

export interface PronFlag {
  file: string;
  line: number;
  /** The source word (original casing). */
  word: string;
  kind: PronFlagKind;
  /** For not-found: why. For homograph: the alternative readings, e.g. "LED (metal) | LEED (guide)". */
  detail: string;
}

export interface PronounceResult {
  /** The rendered respelling / IPA text. */
  text: string;
  /** Words that were not found, or homographs whose reading is a first-entry guess. */
  flags: PronFlag[];
}

export const WORD = /[A-Za-z]+(?:['’][A-Za-z]+)?/g;

export function lineOf(text: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index; i++) if (text[i] === "\n") line++;
  return line;
}

export function pronounce(text: string, opts: PronounceOptions = {}): PronounceResult {
  const lexicon = opts.lexicon ?? defaultLexicon;
  const file = opts.file ?? "<stdin>";
  const flags: PronFlag[] = [];

  let out = "";
  let last = 0;
  for (const m of text.matchAll(WORD)) {
    const word = m[0];
    const start = m.index;
    out += text.slice(last, start);

    const entries = lexicon.entries.get(word.toLowerCase());
    if (!entries || entries.length === 0) {
      out += word; // never guessed — emit verbatim and flag
      flags.push({ file, line: lineOf(text, start), word, kind: "not-found", detail: "no respelling entry" });
    } else {
      const chosen = entries[0]!;
      out += opts.ipa ? chosen.ipa : chosen.respelling;
      if (entries.length > 1) {
        const detail = entries
          .map((e) => `${opts.ipa ? e.ipa : e.respelling}${e.note ? ` (${e.note})` : ""}`)
          .join(" | ");
        flags.push({ file, line: lineOf(text, start), word, kind: "homograph", detail });
      }
    }
    last = start + word.length;
  }
  return { text: out + text.slice(last), flags };
}
