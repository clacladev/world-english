// WoE→SE reverse translator — the lossless-mapping proof.
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
// Verb prepositions are no longer dropped by G3 (a verb keeps its standard preposition as
// vocabulary), so there is no preposition-restoration pass. Phrasal verbs (S2) are not reversed
// at all — `quit`/`delay`/`seek` are themselves valid standard English.

import { regularizePlural, regularizeVerbPast } from "./morphology.ts";
import abolishedForms from "../data/abolished-forms.json" with { type: "json" };
import irregularVerbs from "../data/irregular-verbs.json" with { type: "json" };
import irregularPlurals from "../data/irregular-plurals.json" with { type: "json" };
import { WORD, matchCase } from "./text-utils.ts";

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

export function reverseTranslate(text: string, opts: ReverseOptions = {}): ReverseResult {
  const file = opts.file ?? "<stdin>";
  const flags: ReverseFinding[] = [];

  // Rebuild line-by-line so flag positions carry a line number, while substitution itself is
  // position-preserving within each line.
  const translatedLines = text.split("\n").map((line, i) => {
    const lineNo = i + 1;
    return restoreWords(line, lineNo, file, flags);
  });

  return { text: translatedLines.join("\n"), flags };
}
