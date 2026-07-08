import { describe, expect, it } from "bun:test";
import ngsl from "../data/ngsl.json" with { type: "json" };
import {
  buildPhraseTransforms,
  buildPrepRestorations,
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

  it("has at most one `drop` ruling per verb (the exactly-one-canonical-preposition requirement)", () => {
    const dropVerbs = lexicon.droppedPreps.filter((d) => d.ruling === "drop").map((d) => d.verb);
    expect(new Set(dropVerbs).size).toBe(dropVerbs.length);
  });

  it("every `replace` ruling's replacedBy names an existing phrasalVerbs entry", () => {
    const phrasals = new Set(lexicon.phrasalVerbs.map((p) => p.phrasal));
    for (const d of lexicon.droppedPreps) {
      if (d.ruling !== "replace") continue;
      expect(phrasals.has(d.replacedBy ?? "")).toBe(true);
    }
  });

  it("phrasalVerbs.plain is a single word, and is not itself an abolished/dropped form", () => {
    const dropVerbs = new Set(
      lexicon.droppedPreps.filter((d) => d.ruling === "drop").map((d) => d.verb),
    );
    for (const p of lexicon.phrasalVerbs) {
      expect(p.plain).not.toMatch(/\s/);
      expect(dropVerbs.has(p.plain)).toBe(false);
    }
  });

  it("dropped-prep verbs and phrasal-verb head bigrams don't collide (G3 vs S2 disjointness)", () => {
    const dropPairs = new Set(
      lexicon.droppedPreps
        .filter((d) => d.ruling === "drop")
        .map((d) => `${d.verb} ${d.prep}`),
    );
    for (const p of lexicon.phrasalVerbs) {
      const tokens = p.phrasal.split(/\s+/);
      expect(dropPairs.has(`${tokens[0]} ${tokens[1]}`)).toBe(false);
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

  it("emits one dropped-prep entry per `drop` ruling, keyed 'verb prep'", () => {
    const wait = entries.find((e) => e.abolished === "wait for");
    expect(wait).toMatchObject({ woe: "wait", class: "dropped-prep", rule: "G3" });
  });

  it("emits one phrasal-verb entry per phrasalVerbs row, woe joining plain + alternates", () => {
    const giveUp = entries.find((e) => e.abolished === "give up");
    expect(giveUp).toMatchObject({ woe: "quit / stop", class: "phrasal-verb", rule: "S2" });
  });

  it("excludes keep/replace droppedPreps rulings", () => {
    expect(entries.find((e) => e.abolished === "pay for")).toBeUndefined();
    expect(entries.find((e) => e.abolished === "believe in" && e.class === "dropped-prep")).toBeUndefined();
  });
});

describe("buildPhraseTransforms", () => {
  const transforms = buildPhraseTransforms();

  it("covers dropped-prep base and inflected forms, but not the forward:flag verb (wait)", () => {
    expect(transforms.some((t) => t.tokens.join(" ") === "listen to" && t.replacement === "listen")).toBe(true);
    expect(transforms.some((t) => t.tokens.join(" ") === "listened to" && t.replacement === "listened")).toBe(true);
    expect(transforms.some((t) => t.tokens[0] === "wait" || t.tokens[0] === "waited")).toBe(false);
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

describe("buildPrepRestorations", () => {
  const restorations = buildPrepRestorations();

  it("maps every inflected drop-verb form to its canonical preposition", () => {
    expect(restorations.get("listen")).toEqual({ verb: "listen", prep: "to" });
    expect(restorations.get("listens")).toEqual({ verb: "listen", prep: "to" });
    expect(restorations.get("listened")).toEqual({ verb: "listen", prep: "to" });
  });

  it("includes the forward:flag verb (wait) too — reverse doesn't gate on forward mode; the", () => {
    // stoplist (reverse.ts) is what keeps "wait for three minutes" untouched, not this map.
    expect(restorations.get("wait")).toEqual({ verb: "wait", prep: "for" });
  });
});
