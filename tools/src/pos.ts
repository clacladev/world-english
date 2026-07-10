// SE→WoE third-person -s dropper (docs/morphology.md M3), the auto-applicable slice of the
// present-tense -s drop: a subject pronoun (he/she/it) immediately followed by its verb. Everything
// outside this exact shape stays flagged — honoring the "flag, never guess" ethos. Low recall is
// fine here; near-zero false conversions is the bar, so every branch bails toward "leave it alone".

import ngsl from "../data/ngsl.json" with { type: "json" };
import irregularVerbs from "../data/irregular-verbs.json" with { type: "json" };
import { loadCoreLexicon } from "./core-lexicon.ts";
import { standardThirdPerson } from "./morphology.ts";

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
