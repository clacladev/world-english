// SE→WoE forward translator (docs/to-do.md item 11, second half).
//
// Turns standard English into World English by applying only the transforms it can do
// *deterministically* — a closed set of unambiguous surface-form substitutions — and FLAGGING
// (never guessing) everything that needs part-of-speech, syntax, or the core lexicon (item 8).
//
// The dataset the linter already loads is exactly the forward map: loadDataset().words is keyed
// by the standard (`abolished`) surface form, and each entry's `.woe` is its World-English
// replacement. This reuses that map for substitution and reuses the scanner for the flag list.

import { loadDataset, type Dataset } from "./dataset.ts";
import { scanSpan, type Finding } from "./scan.ts";
import type { Span } from "./extract.ts";

const defaultDataset = loadDataset();

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
 * The handled substitutions: every high-confidence, single-word entry whose replacement is a
 * clean single form. This spans spelling (O1/O2/O5), `be` (M2), pronouns (G4/G12), comparatives
 * (M5) and the *non-homograph* irregular verbs/plurals (M1/M4) — all unambiguous surface forms.
 * Low-confidence entries (articles, modals, homographs, open-decision comparatives) and
 * multi-word / descriptive-`woe` classes (phrasal verbs, dropped prepositions) are excluded on
 * purpose; they are reported as flags instead.
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

function substitute(text: string, forwardMap: Map<string, string>): string {
  let out = "";
  let last = 0;
  for (const m of text.matchAll(WORD)) {
    const word = m[0];
    const start = m.index;
    out += text.slice(last, start);
    const woe = forwardMap.get(word.toLowerCase());
    out += woe ? matchCase(word, woe) : word;
    last = start + word.length;
  }
  return out + text.slice(last);
}

/**
 * Everything the scanner finds in the *input* that we did NOT translate. The scanner already
 * matches standard forms (and, under strict, the low-confidence and multi-word classes), so the
 * flags are exactly its findings minus the handled substitutions.
 */
function collectFlags(
  text: string,
  dataset: Dataset,
  forwardMap: Map<string, string>,
  opts: TranslateOptions,
): Finding[] {
  const file = opts.file ?? "<stdin>";
  const flags: Finding[] = [];
  text.split("\n").forEach((line, i) => {
    const span: Span = { file, line: i + 1, text: line, source: "table" };
    for (const f of scanSpan(span, dataset, { strict: opts.strict })) {
      if (!forwardMap.has(f.found)) flags.push(f);
    }
  });
  return flags;
}

export function translate(text: string, opts: TranslateOptions = {}): TranslateResult {
  const dataset = opts.dataset ?? defaultDataset;
  const forwardMap = buildForwardMap(dataset);
  return {
    text: substitute(text, forwardMap),
    flags: collectFlags(text, dataset, forwardMap, opts),
  };
}
