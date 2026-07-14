// Matches extracted World-English spans against the abolished-forms dataset.

import type { AbolishedEntry, Dataset } from "./dataset.ts";
import type { Span } from "./extract.ts";
import allowlistData from "../data/allowlist.json" with { type: "json" };

export interface Finding {
  file: string;
  line: number;
  /** The abolished surface form that was found. */
  found: string;
  class: string;
  rule: string;
  /** Suggested World-English replacement. */
  expected: string;
  confidence: "high" | "low";
}

export interface AllowEntry {
  file: string;
  form: string;
  reason: string;
}

export interface ScanOptions {
  /** Include low-confidence (POS-dependent / open-decision) classes. Default false. */
  strict?: boolean;
  /** Override the allowlist (defaults to data/allowlist.json). Mainly for tests. */
  allow?: AllowEntry[];
}

const defaultAllow = (allowlistData.allow as AllowEntry[]) ?? [];

function isAllowed(file: string, form: string, allow: AllowEntry[]): boolean {
  const f = form.toLowerCase();
  return allow.some(
    (a) => a.form.toLowerCase() === f && (a.file === "*" || file.endsWith(a.file)),
  );
}

/**
 * Lowercased word tokens, keeping their position so we can match multi-word phrases, plus each
 * token's sentence index (#73): a phrase match must never cross a sentence-ending `.`/`!`/`?` —
 * "They give. Up the hill be the house." must not read as the phrasal "give up" just because the
 * two words are adjacent in the token stream.
 */
function tokenizeWithSentences(text: string): { words: string[]; sentenceId: number[] } {
  const words: string[] = [];
  const sentenceId: number[] = [];
  let sentence = 0;
  for (const m of text.toLowerCase().matchAll(/[a-z]+(?:['’][a-z]+)?|[.!?]+/g)) {
    if (/[.!?]/.test(m[0]!)) {
      sentence++;
      continue;
    }
    words.push(m[0]!);
    sentenceId.push(sentence);
  }
  return { words, sentenceId };
}

function emit(
  span: Span,
  entry: AbolishedEntry,
  found: string,
  opts: ScanOptions,
  out: Finding[],
): void {
  if (entry.confidence === "low" && !opts.strict) return;
  if (isAllowed(span.file, found, opts.allow ?? defaultAllow)) return;
  out.push({
    file: span.file,
    line: span.line,
    found,
    class: entry.class,
    rule: entry.rule,
    expected: entry.woe,
    confidence: entry.confidence,
  });
}

/** The tokens from `from` onward that stay within the same sentence as `from` (#73). */
function sameSentenceAfter(tokens: string[], sentenceId: number[], from: number): string[] {
  const sid = sentenceId[from - 1];
  const out: string[] = [];
  for (let k = from; k < tokens.length && sentenceId[k] === sid; k++) out.push(tokens[k]!);
  return out;
}

export function scanSpan(span: Span, data: Dataset, opts: ScanOptions = {}): Finding[] {
  const { words: tokens, sentenceId } = tokenizeWithSentences(span.text);
  const out: Finding[] = [];
  const consumed = new Array<boolean>(tokens.length).fill(false);

  // Multi-word phrases first (longest already sorted first), so their tokens are consumed
  // before single-word matching runs.
  for (const { tokens: phrase, entry } of data.phrases) {
    for (let i = 0; i + phrase.length <= tokens.length; i++) {
      // A phrase can't cross a sentence boundary (#73).
      if (sentenceId[i] !== sentenceId[i + phrase.length - 1]) continue;
      let hit = true;
      for (let j = 0; j < phrase.length; j++) {
        if (tokens[i + j] !== phrase[j] || consumed[i + j]) {
          hit = false;
          break;
        }
      }
      if (!hit) continue;
      // A phrase blocked before a specific next word (e.g. "run out" before "of", #58) is a
      // deliberately valid standard-English shape, not an abolished form — mirrors the
      // translator's own blockedNext guard so the linter doesn't contradict it.
      if (entry.blockedNext) {
        const next = sameSentenceAfter(tokens, sentenceId, i + phrase.length)[0];
        if (next && entry.blockedNext.includes(next)) continue;
      }
      emit(span, entry, phrase.join(" "), opts, out);
      for (let j = 0; j < phrase.length; j++) consumed[i + j] = true;
    }
  }

  // Single-word forms.
  for (let i = 0; i < tokens.length; i++) {
    if (consumed[i]) continue;
    const entry = data.words.get(tokens[i]!);
    if (entry) emit(span, entry, tokens[i]!, opts, out);
  }

  // Possessive of an irregular plural (#71): "women's" tokenizes as one word (the WORD-matching
  // regex keeps a trailing 's attached), so it never matches the bare irregular-plural key
  // ("women") above — invisible without this pass, though G10 mandates a regularized-plural
  // possessive ("womans'").
  for (let i = 0; i < tokens.length; i++) {
    if (consumed[i]) continue;
    const m = /^([a-z]+)['’]s$/.exec(tokens[i]!);
    if (!m) continue;
    const base = data.words.get(m[1]!);
    if (!base || base.class !== "irregular-plural") continue;
    if (base.confidence === "low" && !opts.strict) continue;
    if (isAllowed(span.file, tokens[i]!, opts.allow ?? defaultAllow)) continue;
    out.push({
      file: span.file,
      line: span.line,
      found: tokens[i]!,
      class: "irregular-plural-possessive",
      rule: "G10",
      expected: `${base.woe}'`,
      confidence: base.confidence,
    });
  }

  return out;
}

export function scanSpans(spans: Span[], data: Dataset, opts: ScanOptions = {}): Finding[] {
  return spans.flatMap((span) => scanSpan(span, data, opts));
}
