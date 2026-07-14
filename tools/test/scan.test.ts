import { describe, expect, it } from "bun:test";
import { loadDataset } from "../src/dataset.ts";
import type { Span } from "../src/extract.ts";
import { scanSpan, type ScanOptions } from "../src/scan.ts";

const data = loadDataset();

function scan(text: string, opts: ScanOptions = {}, file = "x.md") {
  const span: Span = { file, line: 1, text, source: "table" };
  return scanSpan(span, data, opts);
}

function classesFor(text: string, opts: ScanOptions = {}) {
  return scan(text, opts).map((f) => `${f.found}:${f.class}/${f.rule}`);
}

describe("planted-bug detection (the point-4 class of mistake)", () => {
  it("flags a leaked `be` form", () => {
    expect(classesFor("she was here")).toContain("was:be/M2");
    expect(classesFor("they are ready")).toContain("are:be/M2");
  });

  it("flags an irregular verb past/participle", () => {
    expect(classesFor("he gave me a book")).toContain("gave:irregular-verb/M1");
    expect(classesFor("it was written")).toContain("written:irregular-verb/M1");
  });

  it("treats `saw` (also 'the tool') as a homograph, flagged only under --strict", () => {
    expect(classesFor("I saw it")).toEqual([]);
    expect(classesFor("I saw it", { strict: true })).toContain("saw:irregular-verb/M1");
  });

  it("flags an irregular plural", () => {
    expect(classesFor("the children ran")).toContain("children:irregular-plural/M4");
    expect(classesFor("two feet")).toContain("feet:irregular-plural/M4");
    expect(classesFor("many criteria")).toContain("criteria:irregular-plural/M4");
  });

  it("flags a British spelling", () => {
    expect(classesFor("the colour")).toContain("colour:british-spelling/O1");
    expect(classesFor("at the centre")).toContain("centre:british-spelling/O1");
  });

  it("flags a suppletive comparative", () => {
    expect(classesFor("it is better")).toContain("better:suppletive-comparative/M5");
  });

  it("flags multi-word phrasal verbs (S2)", () => {
    expect(classesFor("please give up now")).toContain("give up:phrasal-verb/S2");
  });

  it("flags inflected phrasal forms too, not just the base (#70)", () => {
    expect(classesFor("she gave up yesterday")).toContain("gave up:phrasal-verb/S2");
    expect(classesFor("he finds out the truth")).toContain("finds out:phrasal-verb/S2");
  });

  it("never flags a verb's kept preposition (G3 no longer drops)", () => {
    expect(classesFor("listen to music").some((c) => c.includes("dropped-prep"))).toBe(false);
    expect(classesFor("wait for the bus").some((c) => c.includes("dropped-prep"))).toBe(false);
    expect(classesFor("he depends on it").some((c) => c.includes("dropped-prep"))).toBe(false);
  });

  it("suggests the regularized World-English replacement", () => {
    const f = scan("I saw it", { strict: true }).find((x) => x.found === "saw");
    expect(f?.expected).toBe("seed");
    const p = scan("the children").find((x) => x.found === "children");
    expect(p?.expected).toBe("childs");
  });
});

describe("possessive of an irregular plural (#71)", () => {
  it("flags 'women's'/'children's' style possessives, suggesting the regularized-plural form", () => {
    expect(classesFor("the women's shoes")).toContain("women's:irregular-plural-possessive/G10");
    const f = scan("the children's toys").find((x) => x.found === "children's");
    expect(f?.expected).toBe("childs'");
  });
});

describe("sentence-boundary precision (#73)", () => {
  it("does not match a phrase across a sentence-ending period", () => {
    expect(classesFor("They give. Up the hill be the house.")).not.toContain("give up:phrasal-verb/S2");
  });

  it("still matches the phrase within a single sentence", () => {
    expect(classesFor("They give up the house.")).toContain("give up:phrasal-verb/S2");
  });
});

describe("precision", () => {
  it("does not flag valid World-English forms", () => {
    expect(scan("she be here and they beed late")).toEqual([]);
    expect(scan("I seed it and taked the childs")).toEqual([]);
    expect(scan("it be gooder and the mans goed")).toEqual([]);
  });

  it("does not flag a base verb spelled like its own zero-past (read, cost, put)", () => {
    // These are omitted from the dataset precisely because base == past spelling.
    expect(scan("please read the cost and put it")).toEqual([]);
  });
});

describe("confidence gating", () => {
  it("omits low-confidence classes by default, includes them under strict", () => {
    // "well" is a homograph → low confidence.
    expect(classesFor("she sings well")).toEqual([]);
    expect(classesFor("she sings well", { strict: true })).toContain("well:suppletive-adverb/M6");
    // "more" is a valid M5 escape-hatch/quantifier form (item 17 resolved) → never flagged.
    expect(classesFor("I want more")).toEqual([]);
    expect(classesFor("I want more", { strict: true })).toEqual([]);
  });

  it("treats homograph verb pasts as low confidence (the noun 'ground')", () => {
    expect(classesFor("on the ground")).toEqual([]);
    expect(classesFor("on the ground", { strict: true })).toContain("ground:irregular-verb/M1");
  });
});

describe("contractions are flagged (#69)", () => {
  it("flags be-form, do-support, and modal contractions", () => {
    expect(classesFor("she wasn't here")).toContain("wasn't:contraction/M2");
    expect(classesFor("they didn't go")).toContain("didn't:contraction/G6");
    expect(classesFor("he couldn't see")).toContain("couldn't:contraction/G7");
    expect(classesFor("I don't know")).toContain("don't:contraction/G6");
  });
});

describe("closed-class words with no valid WoE reading (#72)", () => {
  it("flags did/does/goes/has by default — no context can make these valid WoE", () => {
    expect(classesFor("she did it")).toContain("did:do-support/G6");
    expect(classesFor("the plan does work")).toContain("does:third-person-s/M3");
    expect(classesFor("she goes home")).toContain("goes:third-person-s/M3");
    expect(classesFor("it has value")).toContain("has:third-person-s/M3");
  });
});

describe("allowlist", () => {
  it("suppresses a matched file+form and leaves others", () => {
    const allow = [{ file: "x.md", form: "saw", reason: "the tool, not past-of-see" }];
    const found = scan("I saw it was here", { allow, strict: true }).map((f) => f.found);
    expect(found).not.toContain("saw");
    expect(found).toContain("was");
  });
});
