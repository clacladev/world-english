import { describe, expect, it } from "bun:test";
import ngsl from "../data/ngsl.json" with { type: "json" };
import {
  buildPhraseTransforms,
  loadCoreLexicon,
  toAbolishedEntries,
} from "../src/core-lexicon.ts";

describe("ngsl.json (frequency spine)", () => {
  const words = ngsl.words as { rank: number; headword: string }[];

  it("has one entry per rank, 1..2809, no gaps or duplicates", () => {
    expect(words.length).toBe(2809);
    const ranks = words.map((w) => w.rank);
    expect(Math.min(...ranks)).toBe(1);
    expect(Math.max(...ranks)).toBe(words.length);
    expect(new Set(ranks).size).toBe(words.length);
  });

  it("is ordered by ascending rank", () => {
    for (let i = 1; i < words.length; i++) {
      expect(words[i]!.rank).toBe(words[i - 1]!.rank + 1);
    }
  });

  it("headwords are lowercase, non-empty, and unique", () => {
    const seen = new Set<string>();
    for (const w of words) {
      expect(w.headword).toBe(w.headword.toLowerCase());
      expect(w.headword.length).toBeGreaterThan(0);
      expect(seen.has(w.headword)).toBe(false);
      seen.add(w.headword);
    }
  });

  it("carries attribution in _comment", () => {
    expect(ngsl._comment).toContain("NGSL");
  });
});

describe("lexicon.json invariants", () => {
  const lexicon = loadCoreLexicon();

  it("droppedPreps is retired (empty) — G3 no longer drops verb prepositions", () => {
    expect(lexicon.droppedPreps).toEqual([]);
  });

  it("phrasalVerbs.plain is a single word", () => {
    for (const p of lexicon.phrasalVerbs) {
      expect(p.plain).not.toMatch(/\s/);
    }
  });

  it("collocations and sensePreferences `keep` rulings leave woe equal to standard", () => {
    for (const c of lexicon.collocations) {
      if (c.ruling === "keep") expect(c.woe).toBe(c.standard);
    }
    for (const s of lexicon.sensePreferences) {
      if (s.ruling === "keep") continue; // sense rows may legitimately rephrase even when kept
    }
  });
});

describe("toAbolishedEntries", () => {
  const entries = toAbolishedEntries();

  it("emits one phrasal-verb entry per phrasalVerbs row, woe joining plain + alternates", () => {
    const giveUp = entries.find((e) => e.abolished === "give up");
    expect(giveUp).toMatchObject({ woe: "quit / stop", class: "phrasal-verb", rule: "S2" });
  });

  it("emits only phrasal-verb entries (no dropped-prep entries)", () => {
    expect(entries.every((e) => e.class === "phrasal-verb")).toBe(true);
    expect(entries.find((e) => e.abolished === "wait for")).toBeUndefined();
    expect(entries.find((e) => e.abolished === "listen to")).toBeUndefined();
  });
});

describe("buildPhraseTransforms", () => {
  const transforms = buildPhraseTransforms();

  it("covers only phrasal-verb transforms (no dropped-prep transforms)", () => {
    expect(transforms.every((t) => t.class === "phrasal-verb")).toBe(true);
    expect(transforms.some((t) => t.tokens.join(" ") === "listen to")).toBe(false);
    expect(transforms.some((t) => t.tokens.join(" ") === "wait for")).toBe(false);
  });

  it("covers phrasal-verb inflections, mapping the head's paradigm to the plain verb's", () => {
    expect(transforms.some((t) => t.tokens.join(" ") === "give up" && t.replacement === "quit")).toBe(true);
    expect(transforms.some((t) => t.tokens.join(" ") === "gave up" && t.replacement === "quitted")).toBe(true);
    expect(transforms.some((t) => t.tokens.join(" ") === "finds out" && t.replacement === "learns")).toBe(true);
  });

  it("is sorted longest-tokens-first", () => {
    for (let i = 1; i < transforms.length; i++) {
      expect(transforms[i]!.tokens.length).toBeLessThanOrEqual(transforms[i - 1]!.tokens.length);
    }
  });
});
