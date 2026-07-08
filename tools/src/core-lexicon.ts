// Loader + builders for the core lexicon (docs/to-do.md item 8; data/lexicon.json).
//
// data/lexicon.json's schema is documented in its own `_comment` and in docs/vocabulary.md.
// This module turns it into the shapes the rest of the tooling consumes: the abolished-forms
// dataset merge (dataset.ts), the forward phrase transforms (translate.ts), and the reverse
// preposition restorations (reverse.ts). Named `core-lexicon.ts` because `lexicon.ts` is taken
// by the pronunciation tool's word→respelling lexicon.

import lexiconData from "../data/lexicon.json" with { type: "json" };
import irregularVerbs from "../data/irregular-verbs.json" with { type: "json" };
import {
  regularizeVerbPast,
  standardPresentParticiple,
  standardThirdPerson,
} from "./morphology.ts";

export type Confidence = "high" | "low";
export type Ruling = "drop" | "keep" | "replace";
export type ForwardMode = "apply" | "flag";

export interface DroppedPrep {
  verb: string;
  prep: string;
  ruling: Ruling;
  forward?: ForwardMode;
  replacedBy?: string;
  rank?: number;
  note?: string;
  confidence?: Confidence;
}

export interface PhrasalVerb {
  phrasal: string;
  plain: string;
  alternates?: string[];
  separable?: boolean;
  rank?: number;
  note?: string;
  confidence?: Confidence;
}

export interface SensePreference {
  standard: string;
  sense: string;
  ruling: "replace" | "keep";
  woe: string;
  rank?: number;
  note?: string;
}

export interface Collocation {
  standard: string;
  woe: string;
  ruling: "replace" | "keep";
  alternates?: string[];
  rank?: number;
  note?: string;
}

export interface FalseFriend {
  l1: string;
  looksLike: string;
  actualMeaning: string;
  note?: string;
}

export interface RegisterDefault {
  concept: string;
  variants: string[];
  default: string;
  rank?: number;
  note?: string;
}

export interface CoreLexicon {
  droppedPreps: DroppedPrep[];
  phrasalVerbs: PhrasalVerb[];
  sensePreferences: SensePreference[];
  collocations: Collocation[];
  falseFriends: FalseFriend[];
  registerDefaults: RegisterDefault[];
}

const defaultLexicon = lexiconData as unknown as CoreLexicon;

export function loadCoreLexicon(): CoreLexicon {
  return defaultLexicon;
}

function confidenceOf(entry: { confidence?: Confidence }): Confidence {
  return entry.confidence ?? "high";
}

/** The standard (irregular-verb-lookup-aware) past / past-participle of a verb base. */
function standardPast(base: string): string {
  const v = (irregularVerbs.verbs as { base: string; past: string }[]).find(
    (x) => x.base.toLowerCase() === base.toLowerCase(),
  );
  return v ? v.past.toLowerCase() : regularizeVerbPast(base);
}

function standardPastParticiple(base: string): string {
  const v = (irregularVerbs.verbs as { base: string; past: string; pp?: string }[]).find(
    (x) => x.base.toLowerCase() === base.toLowerCase(),
  );
  if (!v) return regularizeVerbPast(base);
  return (v.pp ?? v.past).toLowerCase();
}

/** Every standard-English inflected surface form of a verb base: base, 3sg, -ing, past, pp. */
function standardInflections(base: string): Set<string> {
  const forms = new Set<string>();
  forms.add(base.toLowerCase());
  forms.add(standardThirdPerson(base));
  forms.add(standardPresentParticiple(base));
  forms.add(standardPast(base));
  forms.add(standardPastParticiple(base));
  return forms;
}

export interface AbolishedLexiconEntry {
  abolished: string;
  woe: string;
  class: "dropped-prep" | "phrasal-verb";
  rule: "G3" | "S2";
  confidence: Confidence;
}

/**
 * Merge droppedPreps (ruling: "drop") and phrasalVerbs into the abolished-forms shape
 * dataset.ts's loadDataset() consumes, replacing the rows that used to be directly authored in
 * abolished-forms.json.
 */
export function toAbolishedEntries(lexicon: CoreLexicon = defaultLexicon): AbolishedLexiconEntry[] {
  const out: AbolishedLexiconEntry[] = [];
  for (const d of lexicon.droppedPreps) {
    if (d.ruling !== "drop") continue;
    out.push({
      abolished: `${d.verb} ${d.prep}`,
      woe: d.verb,
      class: "dropped-prep",
      rule: "G3",
      confidence: confidenceOf(d),
    });
  }
  for (const p of lexicon.phrasalVerbs) {
    const woe = [p.plain, ...(p.alternates ?? [])].join(" / ");
    out.push({
      abolished: p.phrasal,
      woe,
      class: "phrasal-verb",
      rule: "S2",
      confidence: confidenceOf(p),
    });
  }
  return out;
}

export interface PhraseTransform {
  /** Whitespace-separated tokens of the standard-English surface form to match. */
  tokens: string[];
  /** The World-English replacement, base-form (before case-matching). */
  replacement: string;
  class: "dropped-prep" | "phrasal-verb";
  rule: "G3" | "S2";
}

/**
 * Forward (SE→WoE) phrase transforms: every inflected surface form of every high-confidence,
 * forward-applying dropped-prep and phrasal-verb entry, longest-first for greedy matching.
 */
export function buildPhraseTransforms(lexicon: CoreLexicon = defaultLexicon): PhraseTransform[] {
  const out: PhraseTransform[] = [];

  for (const d of lexicon.droppedPreps) {
    if (d.ruling !== "drop") continue;
    if (confidenceOf(d) !== "high") continue;
    if ((d.forward ?? "apply") === "flag") continue;
    for (const form of standardInflections(d.verb)) {
      out.push({ tokens: [form, d.prep], replacement: form, class: "dropped-prep", rule: "G3" });
    }
  }

  for (const p of lexicon.phrasalVerbs) {
    if (confidenceOf(p) !== "high") continue;
    const particleTokens = p.phrasal.split(/\s+/).slice(1);
    const head = p.phrasal.split(/\s+/)[0]!;
    const pairs: [string, string][] = [
      [head.toLowerCase(), p.plain],
      [standardThirdPerson(head), standardThirdPerson(p.plain)],
      [standardPresentParticiple(head), standardPresentParticiple(p.plain)],
      [standardPast(head), regularizeVerbPast(p.plain)],
      [standardPastParticiple(head), regularizeVerbPast(p.plain)],
    ];
    const seen = new Set<string>();
    for (const [headForm, plainForm] of pairs) {
      if (seen.has(headForm)) continue;
      seen.add(headForm);
      out.push({
        tokens: [headForm, ...particleTokens],
        replacement: plainForm,
        class: "phrasal-verb",
        rule: "S2",
      });
    }
  }

  return out.sort((a, b) => b.tokens.length - a.tokens.length);
}

export interface PrepRestoration {
  verb: string;
  prep: string;
}

/**
 * Reverse (WoE→SE) preposition restorations: every standard-inflected form of every drop-ruling
 * verb, mapped to the canonical preposition it drops.
 */
export function buildPrepRestorations(lexicon: CoreLexicon = defaultLexicon): Map<string, PrepRestoration> {
  const map = new Map<string, PrepRestoration>();
  for (const d of lexicon.droppedPreps) {
    if (d.ruling !== "drop") continue;
    if (confidenceOf(d) !== "high") continue;
    for (const form of standardInflections(d.verb)) {
      map.set(form, { verb: d.verb, prep: d.prep });
    }
  }
  return map;
}
