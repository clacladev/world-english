// SE→WoE third-person -s dropper (docs/morphology.md M3), the auto-applicable slice of the
// present-tense -s drop: a subject pronoun (he/she/it) immediately followed by its verb. Everything
// outside this exact shape stays flagged — honoring the "flag, never guess" ethos. Low recall is
// fine here; near-zero false conversions is the bar, so every branch bails toward "leave it alone".

import ngsl from "../data/ngsl.json" with { type: "json" };
import irregularVerbs from "../data/irregular-verbs.json" with { type: "json" };
import { loadCoreLexicon } from "./core-lexicon.ts";
import { standardThirdPerson, regularizeVerbPast } from "./morphology.ts";

/**
 * The base-word whitelist the inverted 3sg base must hit before we convert. Union of the irregular
 * verbs, the core-lexicon verbs, and the NGSL frequency spine (a general known-word list, not
 * POS-tagged — but the he/she/it trigger already forces a finite-verb reading, so a base that is
 * also a noun is still the verb here). It only ever *narrows* what fires.
 */
export function buildVerbSet(): Set<string> {
  const set = new Set<string>();
  for (const v of irregularVerbs.verbs as { base: string }[]) set.add(v.base.toLowerCase());
  for (const w of ngsl.words as { headword: string }[]) set.add(w.headword.toLowerCase());
  const lex = loadCoreLexicon();
  for (const d of lex.droppedPreps) set.add(d.verb.toLowerCase());
  for (const p of lex.phrasalVerbs) {
    set.add(p.plain.toLowerCase());
    set.add(p.phrasal.split(/\s+/)[0]!.toLowerCase());
  }
  return set;
}

const defaultVerbSet = buildVerbSet();

const SUBJECT_PRONOUNS = new Set(["he", "she", "it"]);

// `it` is also an *object* pronoun (unlike nominative-only he/she), so it only licenses a verb
// when it is clearly the clause subject: at the start of the utterance, or right after a word
// that opens a clause. This conservatively under-fires rather than convert an object `it`.
const CLAUSE_STARTERS = new Set([
  "and", "but", "or", "so", "that", "which", "if", "when", "while", "because", "then", "yet",
  "nor", "as", "though", "although", "since", "before", "after", "until", "unless", "where",
  "whether",
]);

/** Candidate bases for a 3sg surface form, each verified by round-tripping standardThirdPerson. */
function invertThirdPerson(token: string): string[] {
  if (token === "has") return ["have"];
  const bases: string[] = [];
  const push = (b: string) => {
    if (b.length >= 2 && standardThirdPerson(b) === token) bases.push(b);
  };
  push(token.slice(0, -1)); // works → work
  push(token.slice(0, -2)); // goes → go, watches → watch
  if (token.endsWith("ies")) push(token.slice(0, -3) + "y"); // tries → try
  return [...new Set(bases)];
}

/**
 * The auto-applicable 3sg -s drop: token[i] is a present-tense verb agreeing with an immediately
 * preceding subject pronoun (he/she/it). Returns the base form to emit, or null to leave the token
 * untouched (→ flagged elsewhere). `tokens` are lowercased word forms. Bails on any uncertainty.
 */
export function thirdPersonSDrop(
  tokens: string[],
  i: number,
  verbs: Set<string> = defaultVerbSet,
): { base: string } | null {
  if (i < 1) return null;
  const word = tokens[i]!;
  if (word.includes("'")) return null; // contraction / possessive (it's, he's) — never touch
  if (!word.endsWith("s")) return null;

  const subject = tokens[i - 1]!;
  if (!SUBJECT_PRONOUNS.has(subject)) return null;
  if (subject === "it" && i - 1 !== 0 && !CLAUSE_STARTERS.has(tokens[i - 2] ?? "")) return null;

  const bases = invertThirdPerson(word).filter((b) => verbs.has(b));
  if (bases.length !== 1) return null; // unknown (0) or ambiguous (>1) → flag, don't guess
  return { base: bases[0]! };
}

// ── Indefinite article drop (docs/grammar.md G2) ──────────────────────────────────────────────
// World English has ONE article, `the`; the indefinite `a`/`an` are dropped. This decides only
// *whether* an article may be dropped — it fires whenever the article heads a following word (its
// noun phrase), except a fixed quantifier idiom or a `for`-governed span where a bare noun reads
// wrong. translate.ts owns the whitespace-gap check and any sentence-initial recapitalization.

// Quantifier idioms where dropping the article reads wrong, matched on the token(s) after it.
const QUANTIFIER_IDIOMS = new Set([
  "lot", "few", "little", "bit", "couple", "half", "dozen", "number", "bunch",
]);

// "a hundred/thousand/million" = "one hundred" (a magnitude word, not the indefinite article).
const MAGNITUDE_WORDS = new Set(["hundred", "thousand", "million", "billion"]);

// Distributive "a" in a frequency expression ("once a week", "twice a day", "$5 a pound") reads a
// time/rate unit as "per", not as the indefinite article — only when a frequency/rate cue
// immediately precedes the article.
const FREQUENCY_TRIGGERS = new Set(["once", "twice", "per"]);
const FREQUENCY_UNITS = new Set([
  "second", "minute", "hour", "day", "week", "month", "year", "night", "morning", "pound",
  "dozen", "person", "head", "time",
]);

export interface ArticleDropOptions {
  /** The token's original-case surface form (translate.ts owns casing; tokens here are lowercased). */
  rawWord?: string;
  /** Whether the article begins a sentence (a genuinely capitalized "A dog barked" is fine). */
  sentenceInitial?: boolean;
}

export function articleDrop(tokens: string[], i: number, opts: ArticleDropOptions = {}): boolean {
  const word = tokens[i]!;
  if (word !== "a" && word !== "an") return false;
  // A standalone capitalized letter label ("Vitamin A deficiency") is not the indefinite article
  // — a genuine mid-sentence article is essentially never capitalized, so a capital "A" that
  // isn't sentence-initial reads as a label, not a determiner.
  if (opts.rawWord === "A" && !opts.sentenceInitial) return false;
  const next = tokens[i + 1];
  if (next === undefined) return false; // dangling article, nothing to head — leave it
  if (QUANTIFIER_IDIOMS.has(next)) return false; // "a lot", "a few", …
  if (next === "great" && tokens[i + 2] === "deal") return false; // "a great deal"
  if (MAGNITUDE_WORDS.has(next)) return false; // "a hundred dollars" (= "one hundred")
  if (FREQUENCY_TRIGGERS.has(tokens[i - 1] ?? "") && FREQUENCY_UNITS.has(next)) return false; // "once a week"
  // Leave the article intact anywhere a preceding `for` governs it: a kept duration span keeps its
  // article ("for a while", S5), and the object-`for` drop zone (G3) stays untouched — so the
  // delicate for-handling in the phrase pass is never disturbed.
  if (tokens[i - 1] === "for") return false;
  return true;
}

// ── Dropped-`that` restoration (docs/grammar.md G14) ──────────────────────────────────────────
// Content / reported clauses ALWAYS keep the complementizer `that`; standard English optionally
// drops it. Restore it in the one unambiguous shape: a reporting/mental verb, an immediately
// following NOMINATIVE-only subject pronoun, then a clause verb. `it`/`you` are excluded on
// purpose (also object pronouns → too risky). Fires at the pronoun; bails on any uncertainty.

// Reporting / mental-state verbs, base + inflected surface forms. Closed set.
const REPORTING_VERBS = new Set([
  "say", "says", "said",
  "think", "thinks", "thought",
  "know", "knows", "knew",
  "hope", "hopes", "hoped",
  "believe", "believes", "believed",
  "feel", "feels", "felt",
  "guess", "guesses", "guessed",
  "suppose", "supposes", "supposed",
  "mean", "means", "meant",
  "agree", "agrees", "agreed",
  "hear", "hears", "heard",
  "notice", "notices", "noticed",
  "realize", "realizes", "realized", "realise", "realises", "realised",
  "understand", "understands", "understood",
  "wish", "wishes", "wished",
  "decide", "decides", "decided",
  "remember", "remembers", "remembered",
  "forget", "forgets", "forgot",
  "expect", "expects", "expected",
  "assume", "assumes", "assumed",
  "doubt", "doubts", "doubted",
  "admit", "admits", "admitted",
  "claim", "claims", "claimed",
  "reckon", "reckons", "reckoned",
]);

// Nominative-only subject pronouns (exclude it/you: also object pronouns → ambiguous).
const THAT_SUBJECT_PRONOUNS = new Set(["he", "she", "they", "i", "we"]);

// Be-forms, auxiliaries and modals that count as the clause verb but aren't in the verb whitelist.
const CLAUSE_VERB_AUX = new Set([
  "am", "is", "are", "was", "were", "be", "been", "being",
  "do", "does", "did", "have", "has", "had",
  "will", "would", "can", "could", "shall", "should", "may", "might", "must",
]);

/** Whether `token` reads as a clause verb — the precision guard that a real clause follows. */
function isClauseVerb(token: string, verbs: Set<string>): boolean {
  if (CLAUSE_VERB_AUX.has(token)) return true;
  if (verbs.has(token)) return true;
  if (invertThirdPerson(token).some((b) => verbs.has(b))) return true; // goes → go
  if (token.endsWith("ed") && (verbs.has(token.slice(0, -2)) || verbs.has(token.slice(0, -1)))) {
    return true; // walked → walk, liked → like
  }
  return false;
}

export function droppedThat(
  tokens: string[],
  i: number,
  verbs: Set<string> = defaultVerbSet,
): boolean {
  if (i < 1) return false;
  if (!THAT_SUBJECT_PRONOUNS.has(tokens[i]!)) return false;
  if (!REPORTING_VERBS.has(tokens[i - 1]!)) return false; // reporting verb right before the pronoun
  const clauseVerb = tokens[i + 1];
  if (clauseVerb === undefined) return false; // nothing follows the pronoun
  return isClauseVerb(clauseVerb, verbs); // confirm a verb follows; bail if unsure
}

// ── Coordinated zero-past auto-convert (docs/morphology.md M1) ─────────────────────────────────
// Zero-past verbs (SE past spelled like the base) are omitted from the dataset — blanket-flagging
// floods false positives. Convert one to its regular WoE past ONLY in the unambiguous coordinated
// shape `[past verb] [and|then|but] [zero-past verb]`, where the conjunct verb is clearly past
// (ends in -ed, or a common irregular past). Bails everywhere else; near-zero false positives.

const ZERO_PAST = new Set([
  "cost", "put", "hit", "cut", "set", "let", "read", "shut", "cast",
  "spread", "burst", "hurt", "bet", "quit", "split", "bid",
]);
const PAST_COORDINATORS = new Set(["and", "then", "but"]);
// A few common irregular pasts, so the conjunct verb needn't be a regular -ed past.
const COMMON_IRREGULAR_PASTS = new Set([
  "went", "came", "took", "saw", "got", "made", "gave", "told", "found", "ran",
]);
// The whole shape must open with a subject pronoun (see the guard below).
const ZERO_PAST_SUBJECTS = new Set(["i", "you", "he", "she", "it", "we", "they"]);

export function zeroPastConvert(tokens: string[], i: number): { past: string } | null {
  if (i < 3) return null;
  if (!ZERO_PAST.has(tokens[i]!)) return null;
  if (!PAST_COORDINATORS.has(tokens[i - 1]!)) return null; // only the coordinated shape
  const conjunct = tokens[i - 2]!;
  if (!conjunct.endsWith("ed") && !COMMON_IRREGULAR_PASTS.has(conjunct)) return null; // conjunct past?
  // The conjunct must sit DIRECTLY after a subject pronoun (`she stopped and put …`). That forces
  // a finite past reading of both verbs and structurally rules out the killer false positive: an
  // `-ed` deverbal ADJECTIVE in predicate or attributive position (`he was tired and hurt`, `the
  // red and cut flowers`), which no surface test can tell from a real past. Low recall, but the
  // conversions it does make are unambiguous — the bar this module sets for itself.
  if (!ZERO_PAST_SUBJECTS.has(tokens[i - 3]!)) return null;
  return { past: regularizeVerbPast(tokens[i]!) };
}
