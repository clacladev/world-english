// WoE→SE reverse translator (docs/to-do.md item 12) — the lossless-mapping proof.
//
// Reads the *same* abolished-forms data the linter loads, but inverted: it maps each coined
// World-English form back to its standard-English original. Most classes reverse losslessly
// (goed→went, childs→children, gooder→better, det→debt, thru→through). A few World-English
// forms deliberately collapsed a distinction going forward, so their reverse is *not* unique —
// `be` covered am/is/are, `beed` covered was/were/been, `mes` covered my/mine, and every
// irregular verb's `-ed` past covered both the standard past and its participle (seed = saw or
// seen). For those the tool restores a canonical default and FLAGS the ambiguity, so the lossy
// classes stay visible rather than silently guessed-wrong.
//
// It also leaves alone any World-English form that is *already* valid standard English: WoE
// mandates American spelling, so `color`/`center` are standard as-is (not reversed to British),
// and `who` (which forward-maps from `whom`) is a valid word.
//
// G3 dropped prepositions (item 8's core lexicon) restore in a second per-line pass, after
// word-level restoration: a drop-ruling verb (`listen`, `wait`, `depend`, `look`, …) gets its
// canonical preposition re-inserted and ALWAYS flagged — a guess, since the drop is lossy and
// nothing proves the writer meant the object reading. A stoplist skips insertion before a
// preposition/conjunction/adverb/`-ly` word (so "wait for three minutes" and "looked under the
// sofa" round-trip untouched) or across punctuation ("Wait, the bus…"). Phrasal verbs (S2) are
// not reversed at all — `quit`/`delay`/`seek` are themselves valid standard English.

import { regularizePlural, regularizeVerbPast } from "./morphology.ts";
import { buildPrepRestorations } from "./core-lexicon.ts";
import abolishedForms from "../data/abolished-forms.json" with { type: "json" };
import irregularVerbs from "../data/irregular-verbs.json" with { type: "json" };
import irregularPlurals from "../data/irregular-plurals.json" with { type: "json" };
import { WORD, matchCase, tokenizeLine } from "./text-utils.ts";

export interface ReverseEntry {
  /** The standard-English form to restore. */
  restore: string;
  class: string;
  rule: string;
  /** True when the WoE form collapsed >1 standard form: `restore` is a canonical guess. */
  ambiguous: boolean;
  /** Human note on the ambiguity, for the flag report. */
  note?: string;
}

export interface ReverseFinding {
  file: string;
  line: number;
  /** The World-English form that was restored. */
  found: string;
  /** The canonical standard form it was restored to. */
  restored: string;
  class: string;
  rule: string;
  note: string;
}

export interface ReverseResult {
  text: string;
  /** Ambiguous (lossy) restorations where `restored` is a canonical guess. */
  flags: ReverseFinding[];
}

export interface ReverseOptions {
  file?: string;
}

/**
 * World-English forms that collapsed several standard forms into one. The reverse is a canonical
 * default (per the project decision: is / was / my / our / your / their) and is always flagged.
 */
const CANONICAL_LOSSY: Record<string, { restore: string; class: string; rule: string; note: string }> = {
  be: { restore: "is", class: "be", rule: "M2", note: "am/is/are collapsed to `be`" },
  beed: { restore: "was", class: "be", rule: "M2", note: "was/were/been collapsed to `beed`" },
  mes: { restore: "my", class: "pronoun", rule: "G4", note: "my/mine collapsed to `mes`" },
  uss: { restore: "our", class: "pronoun", rule: "G4", note: "our/ours collapsed to `uss`" },
  yous: { restore: "your", class: "pronoun", rule: "G4", note: "your/yours collapsed to `yous`" },
  thems: { restore: "their", class: "pronoun", rule: "G4", note: "their/theirs collapsed to `thems`" },
};

function confidenceHigh(e: { confidence?: string; homograph?: boolean }): boolean {
  return (e.confidence ?? (e.homograph ? "low" : "high")) === "high";
}

/** Invert the dataset into a woe→standard map, choosing canonical + ambiguity for lossy forms. */
export function buildReverseMap(): Map<string, ReverseEntry> {
  const map = new Map<string, ReverseEntry>();

  const add = (woe: string, entry: ReverseEntry) => {
    const existing = map.get(woe);
    if (!existing) {
      map.set(woe, entry);
    } else if (existing.restore !== entry.restore) {
      // Two distinct standard forms reverse to the same WoE form → lossy collapse. Keep the
      // first as canonical and flag the ambiguity.
      existing.ambiguous = true;
      existing.note = existing.note || `also reverses from ${entry.restore}`;
    }
  };

  // Irregular verbs: canonical restore is the PAST; a distinct participle makes it ambiguous.
  // `homograph` marks a verb whose SE past/pp reads as another word (a *forward*-direction
  // concern — see M1's linter/translator confidence demotion) and does not by itself imply the
  // WoE-regularized form is unsafe to restore: `speaked`/`bited`/`shooted`/`beared` are not real
  // words, so restoring them is lossless. Only `reverseCollision` (a distinct, explicit flag)
  // marks a WoE form that collides with a real word on THIS side (`seed`, `hanged`) — those stay
  // fully unrestored, matching the project's decision that a valid-word collision must not be
  // guessed at all (#66).
  for (const v of irregularVerbs.verbs as {
    base: string;
    past: string;
    pp?: string;
    reverseCollision?: boolean;
  }[]) {
    if (v.reverseCollision) continue; // WoE form collides with a real word — never guess (#66)
    const woe = regularizeVerbPast(v.base);
    if (woe === v.base.toLowerCase()) continue; // zero-past: woe equals the base, undetectable
    const ambiguous = !!(v.pp && v.pp.toLowerCase() !== v.past.toLowerCase());
    add(woe, {
      restore: v.past.toLowerCase(),
      class: "irregular-verb",
      rule: "M1",
      ambiguous,
      note: ambiguous ? `past/participle collapsed (${v.past}/${v.pp})` : undefined,
    });
  }

  // Irregular plurals. Same reverseCollision handling as verbs above (`leafs`, `persons`).
  for (const p of irregularPlurals.plurals as {
    singular: string;
    plural: string;
    reverseCollision?: boolean;
  }[]) {
    if (p.reverseCollision) continue;
    const woe = regularizePlural(p.singular);
    if (woe === p.singular.toLowerCase()) continue;
    add(woe, { restore: p.plural.toLowerCase(), class: "irregular-plural", rule: "M4", ambiguous: false });
  }

  // Pair-based classes (comparatives, silent letters, ough, pronoun uniques, reflexives).
  for (const e of abolishedForms.entries as { abolished: string; woe: string; class: string; rule: string; confidence?: string; homograph?: boolean }[]) {
    if (!confidenceHigh(e)) continue;
    if (e.class === "british-spelling") continue; // WoE spelling is already valid standard American
    if (/[ ()/]/.test(e.woe)) continue; // descriptive replacement, not a clean form
    const woe = e.woe.toLowerCase();
    if (woe === "who") continue; // whom→who: `who` is a valid standard word, leave it
    if (CANONICAL_LOSSY[woe]) continue; // handled explicitly below
    add(woe, { restore: e.abolished.toLowerCase(), class: e.class, rule: e.rule, ambiguous: false });
  }

  // The deliberate collapses: canonical default + always flagged.
  for (const [woe, c] of Object.entries(CANONICAL_LOSSY)) {
    map.set(woe, { restore: c.restore, class: c.class, rule: c.rule, ambiguous: true, note: c.note });
  }

  return map;
}

const reverseMap = buildReverseMap();
const prepRestorations = buildPrepRestorations();

/**
 * Words after which a restored G3 drop-verb should NOT get its preposition re-inserted: the next
 * token already reads as a preposition, conjunction/subordinator, or a common place/time/degree
 * adverb — inserting would misparse "wait for three minutes" (duration) as "wait for for three
 * minutes" or "looked under the sofa" as "looked at under the sofa". `-ly` adverbs are excluded
 * by suffix rather than an exception list.
 */
const PREP_INSERTION_STOPLIST = new Set([
  // prepositions
  "to", "for", "on", "at", "in", "of", "with", "from", "by", "about", "into", "onto", "over",
  "under", "between", "among", "through", "during", "before", "after", "above", "below", "near",
  "around", "against", "without", "within", "along", "across", "behind", "beside", "besides",
  "beyond", "toward", "towards", "upon", "off", "up", "down", "out", "since", "until", "per", "via",
  // conjunctions / subordinators
  "and", "but", "or", "nor", "so", "yet", "because", "although", "though", "while", "when", "if",
  "unless", "whether", "that", "as", "than",
  // common place/time/degree adverbs
  "there", "here", "now", "then", "today", "tomorrow", "yesterday", "soon", "later", "already",
  "still", "always", "never", "often", "sometimes", "usually", "again", "ago", "away", "back",
  "forward", "forth", "outside", "inside", "everywhere", "somewhere", "anywhere", "nowhere",
  "abroad", "home", "very", "too", "quite", "rather", "almost", "enough",
  // common *underived* predicate adjectives — ones with no adjective-forming suffix to detect by
  // shape (#65: "she looks tired" is a copular reading, not "look at"). Adjectives built from a
  // recognizable suffix (tired, nervous, wonderful, comfortable, ...) are instead caught by the
  // general suffix check in stopsInsertion() below, so this list only needs the irregular core.
  "good", "bad", "fine", "well", "sick", "sure", "young", "old", "cold", "hot", "warm", "calm",
]);

// Adjective-forming suffixes: a word ending in one of these, right after a drop-ruling verb, reads
// as a predicate adjective (copular "look"/"be" complement) rather than the verb's object — a
// general shape check instead of an ever-growing hand-enumerated list (#65).
const ADJECTIVE_SUFFIXES = ["ed", "ous", "ful", "ive", "able", "ible", "ious", "less"];

// A determiner immediately before the candidate token signals a NOUN reading ("the look was
// cold"), not a finite drop-ruling verb — #65.
const PRECEDING_NOUN_SIGNAL = new Set([
  "the", "a", "an", "this", "that", "these", "those", "my", "his", "her", "its", "our", "your",
  "their", "mes", "hims", "uss", "yous", "thems", "some", "any", "no", "every", "each",
]);

// A determiner-headed quantifier idiom ("a lot", "a few", "a bit") right after the verb is an
// adverbial, not the verb's object — inserting a preposition before it misparses "talks a lot" as
// "talks to a lot" (#65).
const QUANTIFIER_IDIOM_NOUNS = new Set([
  "lot", "few", "little", "bit", "couple", "half", "dozen", "number", "bunch", "whole",
]);

function stopsInsertion(word: string): boolean {
  const w = word.toLowerCase();
  if (PREP_INSERTION_STOPLIST.has(w) || w.endsWith("ly")) return true;
  return ADJECTIVE_SUFFIXES.some((suf) => w.length > suf.length + 2 && w.endsWith(suf));
}

/** Word-level restoration pass: irregular verbs/plurals, comparatives, pronouns, be, etc. */
function restoreWords(line: string, lineNo: number, file: string, flags: ReverseFinding[]): string {
  let result = "";
  let last = 0;
  for (const m of line.matchAll(WORD)) {
    const word = m[0];
    const start = m.index;
    result += line.slice(last, start);
    const entry = reverseMap.get(word.toLowerCase());
    if (entry) {
      result += matchCase(word, entry.restore);
      if (entry.ambiguous) {
        flags.push({
          file,
          line: lineNo,
          found: word.toLowerCase(),
          restored: entry.restore,
          class: entry.class,
          rule: entry.rule,
          note: entry.note ?? "ambiguous restoration",
        });
      }
    } else {
      result += word;
    }
    last = start + word.length;
  }
  return result + line.slice(last);
}

/**
 * G3 preposition-restoration pass, run after word-level restoration: when a restored token is a
 * drop-ruling verb and a whitespace-adjacent next token isn't stoplisted, insert the verb's
 * canonical preposition and flag it — always, since (like `be`→`is`) it is a canonical guess made
 * from a lossy drop, not proof the writer meant the object reading.
 */
function restorePreps(line: string, lineNo: number, file: string, flags: ReverseFinding[]): string {
  const tokens = tokenizeLine(line);
  let out = "";
  let last = 0;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]!;
    out += line.slice(last, tok.start) + tok.word;
    last = tok.end;

    const restoration = prepRestorations.get(tok.word.toLowerCase());
    if (!restoration) continue;
    // A determiner right before the token signals a noun reading ("the look was cold"), not a
    // finite drop-ruling verb (#65) — bail before even considering the next token.
    const prev = tokens[i - 1];
    if (prev && PRECEDING_NOUN_SIGNAL.has(prev.word.toLowerCase())) continue;
    const next = tokens[i + 1];
    if (!next) continue; // no next token — e.g. end of sentence
    const gap = line.slice(tok.end, next.start);
    if (!/^\s*$/.test(gap)) continue; // punctuation intervenes — e.g. "Wait, the bus…"
    if (stopsInsertion(next.word)) continue;
    // A quantifier idiom ("a lot", "a few") right after the verb is adverbial, not an object —
    // "talks a lot" is not "talks to a lot" (#65).
    if (["a", "an"].includes(next.word.toLowerCase())) {
      const afterDet = tokens[i + 2];
      if (afterDet && QUANTIFIER_IDIOM_NOUNS.has(afterDet.word.toLowerCase())) continue;
    }

    out += ` ${restoration.prep}`;
    flags.push({
      file,
      line: lineNo,
      found: tok.word.toLowerCase(),
      restored: `${restoration.verb} ${restoration.prep}`,
      class: "dropped-prep",
      rule: "G3",
      note: `'${restoration.prep}' restored as ${restoration.verb}'s canonical dropped preposition — a guess, not proven from context`,
    });
  }
  return out + line.slice(last);
}

export function reverseTranslate(text: string, opts: ReverseOptions = {}): ReverseResult {
  const file = opts.file ?? "<stdin>";
  const flags: ReverseFinding[] = [];

  // Rebuild line-by-line so flag positions carry a line number, while substitution itself is
  // position-preserving within each line.
  const translatedLines = text.split("\n").map((line, i) => {
    const lineNo = i + 1;
    const wordRestored = restoreWords(line, lineNo, file, flags);
    return restorePreps(wordRestored, lineNo, file, flags);
  });

  return { text: translatedLines.join("\n"), flags };
}
