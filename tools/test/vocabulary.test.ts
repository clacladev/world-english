import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { loadCoreLexicon } from "../src/core-lexicon.ts";

const md = require("node:fs").readFileSync(
  join(import.meta.dir, "..", "..", "docs", "vocabulary.md"),
  "utf8",
) as string;
const lines = md.split("\n");

function stripMd(cell: string): string {
  // Strip bold/italic/backticks and parenthetical editorial notes, mirroring src/extract.ts.
  let s = cell.replace(/[*`_]/g, "");
  let prev: string;
  do {
    prev = s;
    s = s.replace(/\([^()]*\)/g, "");
  } while (s !== prev);
  return s.replace(/\s+/g, " ").trim();
}

function splitRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

/** Rows of the first markdown table found after a heading containing `headingText`. */
function tableAfterHeading(headingText: string): string[][] {
  const start = lines.findIndex((l) => l.startsWith("##") && l.includes(headingText));
  if (start === -1) throw new Error(`heading not found: ${headingText}`);
  let i = start + 1;
  while (i < lines.length - 1 && !(lines[i]!.includes("|") && /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(lines[i + 1]!))) {
    i++;
  }
  const rows: string[][] = [];
  for (let r = i + 2; r < lines.length; r++) {
    const row = lines[r]!;
    if (!row.includes("|") || row.trim() === "") break;
    rows.push(splitRow(row));
  }
  return rows;
}

const lexicon = loadCoreLexicon();

describe("vocabulary.md coverage table matches lexicon.json row counts", () => {
  const rows = tableAfterHeading("## Coverage");
  const counts = Object.fromEntries(rows.map(([array, n]) => [array!.replace(/`/g, ""), Number(n)]));

  it("every array's row count is stated and correct", () => {
    expect(counts["droppedPreps"]).toBe(lexicon.droppedPreps.length);
    expect(counts["phrasalVerbs"]).toBe(lexicon.phrasalVerbs.length);
    expect(counts["sensePreferences"]).toBe(lexicon.sensePreferences.length);
    expect(counts["collocations"]).toBe(lexicon.collocations.length);
    expect(counts["falseFriends"]).toBe(lexicon.falseFriends.length);
    expect(counts["registerDefaults"]).toBe(lexicon.registerDefaults.length);
  });
});

describe("Table A highlights match droppedPreps", () => {
  const rows = tableAfterHeading("Table A").slice(0); // [verb, prep, ruling, woe]

  it("every highlighted verb+prep pair exists in lexicon.json with the same ruling", () => {
    for (const [verb, prep, ruling] of rows) {
      const entry = lexicon.droppedPreps.find((d) => d.verb === verb && d.prep === prep);
      expect(entry, `${verb} ${prep} missing from droppedPreps`).toBeDefined();
      expect(ruling!.startsWith(entry!.ruling)).toBe(true);
    }
  });
});

describe("Table B highlights match phrasalVerbs", () => {
  const rows = tableAfterHeading("Table B"); // [phrasal, woe]

  it("every highlighted phrasal exists, and its WoE cell matches plain + alternates", () => {
    for (const [phrasal, woe] of rows) {
      const entry = lexicon.phrasalVerbs.find((p) => p.phrasal === phrasal);
      expect(entry, `${phrasal} missing from phrasalVerbs`).toBeDefined();
      const expected = [entry!.plain, ...(entry!.alternates ?? [])].join(" / ");
      expect(stripMd(woe!)).toBe(expected);
    }
  });
});

describe("Table C highlights match sensePreferences", () => {
  const rows = tableAfterHeading("Table C"); // [standard, sense, woe]

  it("every highlighted standard phrase exists with a matching woe (modulo editorial notes)", () => {
    for (const [standard, , woe] of rows) {
      const entry = lexicon.sensePreferences.find((s) => s.standard === standard);
      expect(entry, `${standard} missing from sensePreferences`).toBeDefined();
      expect(stripMd(woe!)).toBe(stripMd(entry!.woe));
    }
  });
});

describe("Table D highlights match collocations", () => {
  const rows = tableAfterHeading("Table D"); // [standard, woe]

  it("every highlighted standard collocation exists with a matching woe (modulo editorial notes)", () => {
    for (const [standard, woe] of rows) {
      const entry = lexicon.collocations.find((c) => c.standard === standard);
      expect(entry, `${standard} missing from collocations`).toBeDefined();
      const expected = [entry!.woe, ...(entry!.alternates ?? [])].join(" / ");
      expect(stripMd(woe!)).toBe(stripMd(expected));
    }
  });
});

describe("Table E mirrors falseFriends in full", () => {
  const rows = tableAfterHeading("Table E"); // [l1, looksLike, actualMeaning, note]

  it("has the same row count and content as the data", () => {
    expect(rows.length).toBe(lexicon.falseFriends.length);
    for (const [l1, looksLike, actualMeaning] of rows) {
      const entry = lexicon.falseFriends.find((f) => f.l1 === l1 && stripMd(looksLike!) === stripMd(f.looksLike));
      expect(entry, `${l1}/${looksLike} missing from falseFriends`).toBeDefined();
      expect(stripMd(actualMeaning!)).toBe(stripMd(entry!.actualMeaning));
    }
  });
});

describe("Table F highlights match registerDefaults", () => {
  const rows = tableAfterHeading("Table F"); // [concept, variants, default]

  it("every highlighted concept exists in lexicon.json with the same default", () => {
    for (const [concept, , woeDefault] of rows) {
      const entry = lexicon.registerDefaults.find((r) => r.concept === concept);
      expect(entry, `${concept} missing from registerDefaults`).toBeDefined();
      expect(stripMd(woeDefault!)).toBe(entry!.default);
    }
  });
});
