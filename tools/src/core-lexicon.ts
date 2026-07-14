// Loader + builders for the core lexicon (data/lexicon.json).
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
import { ZERO_PAST_VERBS } from "./zero-past-verbs.ts";

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
  /**
   * Standard-English words that, immediately following the phrasal, signal the OTHER (usually
   * intransitive) reading the machine replacement doesn't cover — e.g. "run out" (exhaust) is
   * transitive, but "run out **of** milk" is the dominant intransitive idiom (#58). When the next
   * token is one of these, the transform does not fire, leaving the sentence untranslated rather
   * than mistranslating it.
   */
  blockedNext?: string[];
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

export interface AbolishedLexiconEntry {
  abolished: string;
  woe: string;
  class: "phrasal-verb";
  rule: "S2";
  confidence: Confidence;
  blockedNext?: string[];
}

/**
 * Expand phrasalVerbs (S2) into the abolished-forms shape dataset.ts's loadDataset() consumes.
 * (G3 no longer drops verb prepositions, so `droppedPreps` is retired and contributes nothing
 * here.) Emits every inflected surface form of the phrasal head (base, 3sg, -ing, past, pp).
 */
export function toAbolishedEntries(lexicon: CoreLexicon = defaultLexicon): AbolishedLexiconEntry[] {
  const out: AbolishedLexiconEntry[] = [];
  for (const p of lexicon.phrasalVerbs) {
    const woe = [p.plain, ...(p.alternates ?? [])].join(" / ");
    const confidence = confidenceOf(p);
    const particleTokens = p.phrasal.split(/\s+/).slice(1);
    const head = p.phrasal.split(/\s+/)[0]!;
    const headForms = new Set([
      head.toLowerCase(),
      standardThirdPerson(head),
      standardPresentParticiple(head),
      standardPast(head),
      standardPastParticiple(head),
    ]);
    for (const hf of headForms) {
      out.push({
        abolished: [hf, ...particleTokens].join(" "),
        woe,
        class: "phrasal-verb",
        rule: "S2",
        confidence,
        blockedNext: p.blockedNext,
      });
    }
  }
  return out;
}

// Number / quantity words, used by pos.ts's article-drop frequency heuristic (G2). (Formerly
// also fed the G3 "for" duration test, now retired along with preposition-dropping.)
export const NUMBER_WORDS = new Set([
  "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
  "hundred", "thousand", "million",
  "few", "several", "couple", "many",
]);

// Zero-past verbs (SE past spelled like the base — see irregular-verbs.json's _comment) that
// also head a high-confidence phrasal verb (set up, put off, cut down, shut down, split up).
// Shares its source list with pos.ts's coordinated-shape auto-convert via zero-past-verbs.ts.

export interface PhraseTransform {
  /** Whitespace-separated tokens of the standard-English surface form to match. */
  tokens: string[];
  /** The World-English replacement, base-form (before case-matching). */
  replacement: string;
  class: "phrasal-verb";
  rule: "S2";
  /**
   * "zero-past": the matched surface form is a zero-past phrasal head (set/put/cut/shut/quit/
   * split up — SE past spelled like the base, #59), so `replacement` is the present-tense WoE
   * form and `pastReplacement` is the past-tense WoE form. translate.ts picks `pastReplacement`
   * when the line carries an unambiguous past-time signal (yesterday, ago, already, last
   * night/week/…), otherwise defaults to the present-tense reading.
   */
  guard?: "zero-past";
  /** Past-tense WoE replacement for a "zero-past" guarded transform. */
  pastReplacement?: string;
  /** Do not fire when the very next token is one of these (see PhrasalVerb.blockedNext, #58). */
  blockedNext?: string[];
}

/**
 * Forward (SE→WoE) phrase transforms: every inflected surface form of every high-confidence
 * phrasal-verb entry (S2), longest-first for greedy matching. (G3 no longer drops verb
 * prepositions, so there is no dropped-prep phrase transform.)
 */
export function buildPhraseTransforms(lexicon: CoreLexicon = defaultLexicon): PhraseTransform[] {
  const out: PhraseTransform[] = [];

  for (const p of lexicon.phrasalVerbs) {
    if (confidenceOf(p) !== "high") continue;
    const particleTokens = p.phrasal.split(/\s+/).slice(1);
    const head = p.phrasal.split(/\s+/)[0]!;
    // A zero-past head (set/put/cut/shut/quit/split up, …) has an SE past spelled exactly like
    // its base, so the base-form pair below is reached by BOTH present- and past-tense uses
    // (#59). These verbs are deliberately absent from irregular-verbs.json (their past is
    // undetectable in isolation), so `standardPast` can't be used to detect them here — it would
    // fall through to `regularizeVerbPast` and compute a form ("setted") that never occurs in SE.
    const isZeroPastHead = ZERO_PAST_VERBS.has(head.toLowerCase());
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
      const zeroPastBase = isZeroPastHead && headForm === head.toLowerCase();
      out.push({
        tokens: [headForm, ...particleTokens],
        replacement: plainForm,
        class: "phrasal-verb",
        rule: "S2",
        guard: zeroPastBase ? "zero-past" : undefined,
        pastReplacement: zeroPastBase ? regularizeVerbPast(p.plain) : undefined,
        blockedNext: p.blockedNext,
      });
    }
  }

  return out.sort((a, b) => b.tokens.length - a.tokens.length);
}
