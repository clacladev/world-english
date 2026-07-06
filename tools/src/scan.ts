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

/** Lowercased word tokens, keeping their position so we can match multi-word phrases. */
function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g);
  return matches ?? [];
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

export function scanSpan(span: Span, data: Dataset, opts: ScanOptions = {}): Finding[] {
  const tokens = tokenize(span.text);
  const out: Finding[] = [];
  const consumed = new Array<boolean>(tokens.length).fill(false);

  // Multi-word phrases first (longest already sorted first), so their tokens are consumed
  // before single-word matching runs.
  for (const { tokens: phrase, entry } of data.phrases) {
    for (let i = 0; i + phrase.length <= tokens.length; i++) {
      let hit = true;
      for (let j = 0; j < phrase.length; j++) {
        if (tokens[i + j] !== phrase[j] || consumed[i + j]) {
          hit = false;
          break;
        }
      }
      if (!hit) continue;
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

  return out;
}

export function scanSpans(spans: Span[], data: Dataset, opts: ScanOptions = {}): Finding[] {
  return spans.flatMap((span) => scanSpan(span, data, opts));
}
