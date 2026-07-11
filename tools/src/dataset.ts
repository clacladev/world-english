// Loads the data files and builds the in-memory index the scanner matches against.
// Computed classes (irregular-verb, irregular-plural) are expanded from their base/singular
// via the M1/M4 regularizers; the pair-based classes come from abolished-forms.json, plus the
// dropped-prep (G3) and phrasal-verb (S2) classes merged in from the core lexicon (data/lexicon.json).

import { regularizePlural, regularizeVerbPast } from "./morphology.ts";
import { loadCoreLexicon, toAbolishedEntries } from "./core-lexicon.ts";
import abolishedForms from "../data/abolished-forms.json" with { type: "json" };
import irregularVerbs from "../data/irregular-verbs.json" with { type: "json" };
import irregularPlurals from "../data/irregular-plurals.json" with { type: "json" };

export type Confidence = "high" | "low";

export interface AbolishedEntry {
  /** Standard form to flag, lowercased. A space means a multi-word (phrase) match. */
  abolished: string;
  /** Suggested World-English replacement, for the report. */
  woe: string;
  /** e.g. "irregular-verb", "be", "british-spelling", "phrasal-verb". */
  class: string;
  /** Source spec rule, e.g. "M1", "O1", "G3". */
  rule: string;
  confidence: Confidence;
  /** Do not fire when the very next token is one of these (mirrors PhrasalVerb.blockedNext, #58). */
  blockedNext?: string[];
}

interface RawEntry {
  abolished: string;
  woe: string;
  class: string;
  rule: string;
  confidence?: Confidence;
  homograph?: boolean;
}

interface VerbTriple {
  base: string;
  past: string;
  pp?: string;
  homograph?: boolean;
}

interface PluralPair {
  singular: string;
  plural: string;
  homograph?: boolean;
}

/** A homograph form collides with a valid everyday word, so it is demoted to low confidence. */
function confidenceOf(raw: { confidence?: Confidence; homograph?: boolean }): Confidence {
  if (raw.confidence) return raw.confidence;
  return raw.homograph ? "low" : "high";
}

export interface Dataset {
  /** Single-word forms → entry, keyed by lowercased surface form. */
  words: Map<string, AbolishedEntry>;
  /** Multi-word forms as token arrays, longest first, for n-gram matching. */
  phrases: { tokens: string[]; entry: AbolishedEntry }[];
}

export function loadDataset(): Dataset {
  const words = new Map<string, AbolishedEntry>();
  const phrases: Dataset["phrases"] = [];

  const add = (entry: AbolishedEntry) => {
    const form = entry.abolished.toLowerCase();
    if (form.includes(" ")) {
      phrases.push({ tokens: form.split(/\s+/), entry: { ...entry, abolished: form } });
      return;
    }
    const existing = words.get(form);
    if (!existing) {
      words.set(form, { ...entry, abolished: form });
    } else if (existing.confidence === "low" && entry.confidence === "high") {
      // A duplicate source row for the same surface form: never let a low-confidence definition
      // silently shadow a high-confidence one (#72) — the higher-confidence row always wins,
      // regardless of which was authored first. Two same-confidence duplicates keep the first,
      // for a deterministic result.
      words.set(form, { ...entry, abolished: form });
    }
  };

  // Pair-based classes.
  for (const raw of (abolishedForms.entries as RawEntry[])) {
    add({
      abolished: raw.abolished,
      woe: raw.woe,
      class: raw.class,
      rule: raw.rule,
      confidence: confidenceOf(raw),
    });
  }

  // Core lexicon: dropped prepositions (G3) and phrasal verbs (S2), from data/lexicon.json.
  for (const raw of toAbolishedEntries(loadCoreLexicon())) {
    add({
      abolished: raw.abolished,
      woe: raw.woe,
      class: raw.class,
      rule: raw.rule,
      confidence: confidenceOf(raw),
      blockedNext: raw.blockedNext,
    });
  }

  // Irregular verbs: flag the standard past and (distinct) participle spellings.
  for (const v of (irregularVerbs.verbs as VerbTriple[])) {
    const woe = regularizeVerbPast(v.base);
    const confidence = confidenceOf(v);
    const forms = new Set<string>();
    // A past spelled like the base (read, let, beat, cost-likes) is undetectable — skip it.
    if (v.past.toLowerCase() !== v.base.toLowerCase()) forms.add(v.past.toLowerCase());
    if (v.pp && v.pp.toLowerCase() !== v.base.toLowerCase()) forms.add(v.pp.toLowerCase());
    for (const form of forms) {
      add({ abolished: form, woe, class: "irregular-verb", rule: "M1", confidence });
    }
  }

  // Irregular plurals: flag the standard plural spelling.
  for (const p of (irregularPlurals.plurals as PluralPair[])) {
    if (p.plural.toLowerCase() === p.singular.toLowerCase()) continue; // zero plural, undetectable
    add({
      abolished: p.plural.toLowerCase(),
      woe: regularizePlural(p.singular),
      class: "irregular-plural",
      rule: "M4",
      confidence: confidenceOf(p),
    });
  }

  // Longest phrases first so a trigram wins over a contained bigram.
  phrases.sort((a, b) => b.tokens.length - a.tokens.length);
  return { words, phrases };
}
