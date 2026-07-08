// SE→WoE forward translator (docs/to-do.md item 11, second half).
//
// Turns standard English into World English by applying only the transforms it can do
// *deterministically* — a closed set of unambiguous surface-form substitutions — and FLAGGING
// (never guessing) everything that needs part-of-speech, syntax, or the core lexicon (item 8).
//
// The dataset the linter already loads is exactly the single-word forward map: loadDataset().words
// is keyed by the standard (`abolished`) surface form, and each entry's `.woe` is its World-English
// replacement. Multi-word transforms (dropped prepositions, phrasal verbs — the core lexicon,
// item 8) are built separately by core-lexicon.ts's buildPhraseTransforms(), since they need
// per-inflection generation buildForwardMap() doesn't do, and `test/translate.test.ts`'s gold
// harness derives its expectations from buildForwardMap()'s values, so it must stay single-word.
//
// Still flag-only / untouched (documented, not a bug): G2 article drop (needs syntax),
// `forward:"flag"` dropped preps (the duration-`for` vs. object-`for` test, item 16, unresolved —
// concretely `wait for`), separated phrasals (*give it up* — needs a parser), S3/S6/false-friends/
// register (doc-only, not even flagged).

import { loadDataset, type Dataset } from "./dataset.ts";
import { buildPhraseTransforms, type PhraseTransform } from "./core-lexicon.ts";
import { scanSpan, type Finding } from "./scan.ts";
import type { Span } from "./extract.ts";

const defaultDataset = loadDataset();
const defaultPhraseTransforms = buildPhraseTransforms();
const defaultPhraseByFirst = groupByFirstToken(defaultPhraseTransforms);

export interface TranslateOptions {
  /** Also flag low-confidence / POS-dependent classes (articles, modals, homographs, …). */
  strict?: boolean;
  /** File label used in flag positions. Default "<stdin>". */
  file?: string;
  /** Override the dataset (mainly for tests). */
  dataset?: Dataset;
}

export interface TranslateResult {
  /** The World-English text. */
  text: string;
  /** Standard forms the translator declined to convert (needs POS/syntax/lexicon). */
  flags: Finding[];
}

const WORD = /[A-Za-z]+(?:'[A-Za-z]+)?/g;

/**
 * The handled single-word substitutions: every high-confidence entry whose replacement is a
 * clean single form. This spans spelling (O1/O2/O5), `be` (M2), pronouns (G4/G12), comparatives
 * (M5) and the *non-homograph* irregular verbs/plurals (M1/M4) — all unambiguous surface forms.
 * Low-confidence entries (articles, modals, homographs, open-decision comparatives) and
 * multi-word / descriptive-`woe` classes (phrasal verbs, dropped prepositions) are excluded on
 * purpose; the latter are handled by buildPhraseTransforms() instead, and low-confidence entries
 * are reported as flags.
 */
export function buildForwardMap(dataset: Dataset = defaultDataset): Map<string, string> {
  const map = new Map<string, string>();
  for (const [form, entry] of dataset.words) {
    if (entry.confidence !== "high") continue;
    if (/[ ()/]/.test(entry.woe)) continue; // descriptive replacement, not a clean form
    map.set(form, entry.woe);
  }
  return map;
}

/** Re-apply the source token's casing to its replacement (my→mes, My→Mes, THROUGH→THRU). */
function matchCase(source: string, woe: string): string {
  if (source === source.toLowerCase()) return woe;
  if (source.length > 1 && source === source.toUpperCase()) return woe.toUpperCase();
  if (source[0] === source[0]!.toUpperCase()) return woe[0]!.toUpperCase() + woe.slice(1);
  return woe;
}

interface LineToken {
  word: string;
  start: number;
  end: number;
}

function tokenizeLine(line: string): LineToken[] {
  return [...line.matchAll(WORD)].map((m) => ({
    word: m[0],
    start: m.index,
    end: m.index + m[0].length,
  }));
}

/** Phrase transforms grouped by their first token (lowercased), longest-first within a group. */
function groupByFirstToken(transforms: PhraseTransform[]): Map<string, PhraseTransform[]> {
  const map = new Map<string, PhraseTransform[]>();
  for (const t of transforms) {
    const key = t.tokens[0]!;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  for (const group of map.values()) group.sort((a, b) => b.tokens.length - a.tokens.length);
  return map;
}

/**
 * Longest-first greedy phrase pass over whitespace-adjacent tokens (punctuation breaks a phrase,
 * so "wait, for" or a line break never matches), then the single-word forwardMap pass on
 * whatever the phrase pass left unconsumed. Returns the substituted line plus the set of
 * base-form phrases ("give up", "listen to", …) that fired, so collectFlags can exclude them.
 */
function substituteLine(
  line: string,
  phraseByFirst: Map<string, PhraseTransform[]>,
  forwardMap: Map<string, string>,
  handledPhrases: Set<string>,
): string {
  const tokens = tokenizeLine(line);
  let out = "";
  let last = 0;
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i]!;
    out += line.slice(last, tok.start);

    const candidates = phraseByFirst.get(tok.word.toLowerCase()) ?? [];
    const match = candidates.find((t) => {
      const n = t.tokens.length;
      if (i + n > tokens.length) return false;
      for (let j = 1; j < n; j++) {
        if (tokens[i + j]!.word.toLowerCase() !== t.tokens[j]) return false;
        const gap = line.slice(tokens[i + j - 1]!.end, tokens[i + j]!.start);
        if (!/^\s*$/.test(gap)) return false; // punctuation breaks a phrase
      }
      return true;
    });

    if (match) {
      const span = match.tokens.length;
      const spanEnd = tokens[i + span - 1]!.end;
      handledPhrases.add(match.tokens.join(" "));
      out += matchCase(tok.word, match.replacement);
      last = spanEnd;
      i += span;
      continue;
    }

    const woe = forwardMap.get(tok.word.toLowerCase());
    out += woe ? matchCase(tok.word, woe) : tok.word;
    last = tok.end;
    i += 1;
  }
  return out + line.slice(last);
}

/**
 * Everything the scanner finds in the *input* that we did NOT translate. The scanner already
 * matches standard forms (and, under strict, the low-confidence and multi-word classes), so the
 * flags are exactly its findings minus the handled single-word and phrase substitutions.
 */
function collectFlags(
  text: string,
  dataset: Dataset,
  forwardMap: Map<string, string>,
  handledPhrases: Set<string>,
  opts: TranslateOptions,
): Finding[] {
  const file = opts.file ?? "<stdin>";
  const flags: Finding[] = [];
  text.split("\n").forEach((line, i) => {
    const span: Span = { file, line: i + 1, text: line, source: "table" };
    for (const f of scanSpan(span, dataset, { strict: opts.strict })) {
      if (forwardMap.has(f.found)) continue;
      if (handledPhrases.has(f.found)) continue;
      flags.push(f);
    }
  });
  return flags;
}

export function translate(text: string, opts: TranslateOptions = {}): TranslateResult {
  const dataset = opts.dataset ?? defaultDataset;
  const forwardMap = buildForwardMap(dataset);
  const handledPhrases = new Set<string>();

  const translatedText = text
    .split("\n")
    .map((line) => substituteLine(line, defaultPhraseByFirst, forwardMap, handledPhrases))
    .join("\n");

  return {
    text: translatedText,
    flags: collectFlags(text, dataset, forwardMap, handledPhrases, opts),
  };
}
