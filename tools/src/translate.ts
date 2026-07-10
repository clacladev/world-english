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
// Now handled conservatively by the pos.ts detectors: G2 indefinite-article drop (a/an → ∅, with
// sentence-initial recapitalization), G14 dropped-`that` restoration in reported speech, and the
// coordinated-shape zero-past auto-convert (M1). Still flag-only / untouched (documented, not a
// bug): generic-`the` → bare plural (needs semantics), separated phrasals (*give it up* — needs a
// parser), non-coordinated zero-past, S3/S6/false-friends/register (doc-only, not even flagged).
// The duration-`for` vs. object-`for` test (item 16) is resolved: dropped `for` auto-translates
// via the not-duration guard (isDurationFor) — object-`for` drops (`wait for the bus` → `wait the
// bus`), duration-`for` is kept (`wait for three minutes`).

import { loadDataset, type Dataset } from "./dataset.ts";
import {
  buildPhraseTransforms,
  isDurationFor,
  type CoreLexicon,
  type PhraseTransform,
} from "./core-lexicon.ts";
import { thirdPersonSDrop, articleDrop, droppedThat, zeroPastConvert } from "./pos.ts";
import { scanSpan, type Finding } from "./scan.ts";
import type { Span } from "./extract.ts";
import { matchCase, tokenizeLine } from "./text-utils.ts";

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
  /**
   * Override the core lexicon that phrase transforms (dropped prepositions, phrasal verbs) are
   * built from (mainly for tests). Without this, phrase transforms always come from the
   * module-level default lexicon even when `dataset` is overridden (#63) — pass both together for
   * full isolation.
   */
  lexicon?: CoreLexicon;
}

export interface TranslateResult {
  /** The World-English text. */
  text: string;
  /** Standard forms the translator declined to convert (needs POS/syntax/lexicon). */
  flags: Finding[];
}

// Unambiguous past-time signal words (#59): when one of these appears anywhere on the line, a
// zero-past phrasal head (set/put/cut/shut/quit/split up, …) is read as past tense rather than
// the default present-tense guess — a closed, deterministic set, not general tense inference.
const PAST_SIGNAL_WORDS = new Set([
  "yesterday", "ago", "already", "earlier", "previously",
]);
const PAST_SIGNAL_LAST_WORDS = new Set([
  "night", "week", "month", "year", "morning", "evening", "spring", "summer", "fall", "winter",
]);

function lineHasPastSignal(lowerWords: string[]): boolean {
  for (let i = 0; i < lowerWords.length; i++) {
    const w = lowerWords[i]!;
    if (PAST_SIGNAL_WORDS.has(w)) return true;
    if (w === "last" && PAST_SIGNAL_LAST_WORDS.has(lowerWords[i + 1] ?? "")) return true;
  }
  return false;
}

/**
 * Each token's sentence index within the line, so a per-sentence guard (past-tense signal,
 * duration-`for`) never reads across a `.`/`!`/`?` boundary — mirrors scan.ts's
 * tokenizeWithSentences (#73): "I called you yesterday. Now I set up a meeting." must not read
 * "yesterday" as a signal for the second sentence's "set up" just because they share a line.
 */
function sentenceIdsFor(tokens: { start: number; end: number }[], line: string): number[] {
  const ids = new Array<number>(tokens.length).fill(0);
  let sentence = 0;
  for (let k = 1; k < tokens.length; k++) {
    if (/[.!?]/.test(line.slice(tokens[k - 1]!.end, tokens[k]!.start))) sentence++;
    ids[k] = sentence;
  }
  return ids;
}

/** The tokens from `from` onward that stay within the same sentence as `from`. */
function sameSentenceFrom<T>(items: T[], sentenceIds: number[], from: number): T[] {
  const sid = sentenceIds[from];
  const out: T[] = [];
  for (let k = from; k < items.length && sentenceIds[k] === sid; k++) out.push(items[k]!);
  return out;
}

/** Every token that shares its sentence with position `at` (both before and after it). */
function sameSentenceAll<T>(items: T[], sentenceIds: number[], at: number): T[] {
  const sid = sentenceIds[at];
  return items.filter((_, k) => sentenceIds[k] === sid);
}

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

/** Uppercase the first alphabetic character — used when a dropped sentence-initial article's noun
 * becomes the new leading word (G2). */
function capitalizeFirst(s: string): string {
  const m = /[A-Za-z]/.exec(s);
  if (!m) return s;
  return s.slice(0, m.index) + s[m.index]!.toUpperCase() + s.slice(m.index + 1);
}

/** True when `pos` begins a sentence (or an independent clause introduced by `:`/`;`/an em dash):
 * only whitespace precedes it on the line, or the previous non-space character is a clause/
 * sentence boundary or an opening quote. */
function isSentenceInitial(line: string, pos: number): boolean {
  let j = pos - 1;
  while (j >= 0 && /\s/.test(line[j]!)) j--;
  if (j < 0) return true;
  return ".!?:;—\"'“‘(".includes(line[j]!);
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
  const lowerWords = tokens.map((t) => t.word.toLowerCase());
  const sentenceIds = sentenceIdsFor(tokens, line);
  let out = "";
  let last = 0;
  let i = 0;
  let capitalizeNext = false; // a sentence-initial article was dropped → recapitalize the next word
  const applyCap = (s: string): string => {
    if (!capitalizeNext) return s;
    capitalizeNext = false;
    return capitalizeFirst(s);
  };
  while (i < tokens.length) {
    const tok = tokens[i]!;
    out += line.slice(last, tok.start);

    // Dropped-`that` restoration (G14): insert the complementizer before a reported-clause pronoun,
    // then let the pronoun itself be processed normally below. Bail if punctuation (a comma, a
    // quotation mark) intervenes between the reporting verb and the pronoun — a direct quotation
    // ('He said "I am here."') or a comma-set-off aside ('As I said, he will come') is not the
    // reported-clause shape this restorer targets (#57).
    const gapBeforePronoun = i > 0 ? line.slice(tokens[i - 1]!.end, tok.start) : "";
    if (/^\s*$/.test(gapBeforePronoun) && droppedThat(lowerWords, i)) out += "that ";

    const candidates = phraseByFirst.get(tok.word.toLowerCase()) ?? [];
    const match = candidates.find((t) => {
      const n = t.tokens.length;
      if (i + n > tokens.length) return false;
      for (let j = 1; j < n; j++) {
        if (tokens[i + j]!.word.toLowerCase() !== t.tokens[j]) return false;
        const gap = line.slice(tokens[i + j - 1]!.end, tokens[i + j]!.start);
        if (!/^\s*$/.test(gap)) return false; // punctuation breaks a phrase
      }
      // A blocked-next word (e.g. "run out **of** milk", #58) signals the other reading the
      // machine replacement doesn't cover — leave it untranslated instead of firing.
      if (t.blockedNext) {
        const next = tokens[i + n];
        if (next && t.blockedNext.includes(next.word.toLowerCase())) return false;
      }
      return true;
    });

    if (match) {
      const span = match.tokens.length;
      const spanEnd = tokens[i + span - 1]!.end;
      handledPhrases.add(match.tokens.join(" ")); // deliberate decision → excluded from flags
      // G3 "for" test: a dropped `for` is KEPT before a duration span (S5), dropped otherwise —
      // scoped to the current sentence so a duration phrase in a later sentence can't leak back.
      const keepDurationFor =
        match.guard === "not-duration" &&
        isDurationFor(sameSentenceFrom(tokens, sentenceIds, i + span).map((tk) => tk.word.toLowerCase()));
      // Zero-past phrasal head (#59): default to the present-tense replacement, but defer to the
      // past-tense one when the *same sentence* carries an unambiguous past-time signal.
      const usePastReplacement =
        match.guard === "zero-past" &&
        match.pastReplacement !== undefined &&
        lineHasPastSignal(sameSentenceAll(lowerWords, sentenceIds, i));
      const replacement = usePastReplacement ? match.pastReplacement! : match.replacement;
      out += applyCap(
        keepDurationFor ? line.slice(tok.start, spanEnd) : matchCase(tok.word, replacement),
      );
      last = spanEnd;
      i += span;
      continue;
    }

    // Indefinite article drop (G2): drop `a`/`an` heading a whitespace-adjacent noun phrase; a
    // capitalized sentence-initial article recapitalizes the now-leading word. The dropped form is
    // added to handledPhrases so collectFlags no longer emits its low-confidence G2 flag.
    if (articleDrop(lowerWords, i, { rawWord: tok.word, sentenceInitial: isSentenceInitial(line, tok.start) })) {
      const nextTok = tokens[i + 1]!;
      if (/^\s*$/.test(line.slice(tok.end, nextTok.start))) {
        handledPhrases.add(lowerWords[i]!);
        if (/^[A-Z]/.test(tok.word) && isSentenceInitial(line, tok.start)) capitalizeNext = true;
        last = nextTok.start; // drop the article and the whitespace before the noun
        i += 1;
        continue;
      }
    }

    // Coordinated zero-past auto-convert (M1): `[past] and/then/but [zero-past]` → regular WoE past.
    if (!forwardMap.has(lowerWords[i]!)) {
      const zeroPast = zeroPastConvert(lowerWords, i);
      if (zeroPast) {
        out += applyCap(matchCase(tok.word, zeroPast.past));
        last = tok.end;
        i += 1;
        continue;
      }
    }

    // Third-person -s drop (M3): only after a he/she/it subject, and never over a form the
    // forwardMap already owns (be-forms etc. take priority). The converted surface form is added
    // to handledPhrases so collectFlags does not also flag it (e.g. goes/does/has under --strict).
    if (!forwardMap.has(lowerWords[i]!)) {
      const sDrop = thirdPersonSDrop(lowerWords, i);
      if (sDrop) {
        handledPhrases.add(lowerWords[i]!);
        out += applyCap(matchCase(tok.word, sDrop.base));
        last = tok.end;
        i += 1;
        continue;
      }
    }

    const woe = forwardMap.get(tok.word.toLowerCase());
    out += applyCap(woe ? matchCase(tok.word, woe) : tok.word);
    last = tok.end;
    i += 1;
  }
  return out + line.slice(last);
}

/**
 * Everything the scanner finds in the *input* that we did NOT translate. The scanner already
 * matches standard forms (and, under strict, the low-confidence and multi-word classes), so the
 * flags are exactly its findings minus the handled single-word and phrase substitutions.
 *
 * `handledPhrases` is one Set *per line* (#61) — a form handled on one line must not suppress the
 * flag for an unhandled occurrence of the same surface form on another line (e.g. a
 * punctuation-blocked `give up` on line 2 must still be flagged even though line 1's `give up`
 * was substituted).
 */
function collectFlags(
  text: string,
  dataset: Dataset,
  forwardMap: Map<string, string>,
  handledPhrases: Set<string>[],
  opts: TranslateOptions,
): Finding[] {
  const file = opts.file ?? "<stdin>";
  const flags: Finding[] = [];
  text.split("\n").forEach((line, i) => {
    const span: Span = { file, line: i + 1, text: line, source: "table" };
    const lineHandled = handledPhrases[i] ?? new Set<string>();
    for (const f of scanSpan(span, dataset, { strict: opts.strict })) {
      if (forwardMap.has(f.found)) continue;
      if (lineHandled.has(f.found)) continue;
      flags.push(f);
    }
  });
  return flags;
}

export function translate(text: string, opts: TranslateOptions = {}): TranslateResult {
  const dataset = opts.dataset ?? defaultDataset;
  const forwardMap = buildForwardMap(dataset);
  const phraseByFirst = opts.lexicon
    ? groupByFirstToken(buildPhraseTransforms(opts.lexicon))
    : defaultPhraseByFirst;
  const handledPhrases: Set<string>[] = [];

  const translatedText = text
    .split("\n")
    .map((line) => {
      const lineHandled = new Set<string>();
      handledPhrases.push(lineHandled);
      return substituteLine(line, phraseByFirst, forwardMap, lineHandled);
    })
    .join("\n");

  return {
    text: translatedText,
    flags: collectFlags(text, dataset, forwardMap, handledPhrases, opts),
  };
}
