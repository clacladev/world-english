import { describe, expect, it } from "bun:test";
import { buildReverseMap, reverseTranslate } from "../src/reverse.ts";
import { samplePairs } from "./helpers/samples.ts";

function se(text: string) {
  return reverseTranslate(text, { file: "x.md" }).text;
}
function flags(text: string) {
  return reverseTranslate(text, { file: "x.md" }).flags;
}
function flagKeys(text: string) {
  return flags(text).map((f) => `${f.found}→${f.restored}`);
}
function tokens(text: string): string[] {
  return text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
}

describe("lossless reverse restoration (the classes M1/M4/M5/O2/O5 promise to reverse)", () => {
  it("restores non-homograph irregular verbs and plurals (M1/M4)", () => {
    expect(se("I goed and taked it")).toBe("I went and took it");
    expect(se("the childs builded houses")).toBe("the children built houses");
  });

  it("restores comparatives, silent letters, ough (M5/O2/O5)", () => {
    expect(se("it is gooder, the goodest")).toBe("it is better, the best");
    expect(se("no dout about the det")).toBe("no doubt about the debt");
    expect(se("straight thru, tho")).toBe("straight through, though");
  });

  it("preserves casing", () => {
    expect(se("Goed home")).toBe("Went home");
    expect(se("The CHILDS ran")).toBe("The CHILDREN ran");
  });

  it("does the truly-lossless classes without a flag", () => {
    // Plurals, comparatives, ough, silent letters have exactly one standard form, so no guess is
    // involved. (Irregular *verbs* are flagged separately — their `-ed` past collapses the
    // standard past and its participle; see the lossy suite.)
    expect(flags("the childs is gooder thru here, no det")).toEqual([]);
  });
});

describe("lossy reverse: canonical default + flag", () => {
  it("restores collapsed `be` forms to a canonical default, flagged (M2)", () => {
    expect(se("they be here and it beed late")).toBe("they is here and it was late");
    expect(flagKeys("they be here")).toContain("be→is");
    expect(flagKeys("it beed late")).toContain("beed→was");
  });

  it("restores an irregular past canonically but flags the past/participle collapse", () => {
    // `singed` (past of `sing`) collapses `sang` (past) and `sung` (participle); canonical
    // restore is the past.
    expect(se("I singed it")).toBe("I sang it");
    const f = flags("I singed it").find((x) => x.found === "singed");
    expect(f?.restored).toBe("sang");
    expect(f?.note).toContain("sang/sung");
  });

  it("does not reverse `seed` — `see`'s past is a homograph with the valid WoE noun `seed`", () => {
    // `seed` collides with a common, legitimate World-English noun (the plant part), so the
    // reverse map leaves it untouched rather than guessing it always means `saw` (past of see).
    expect(se("the seed grows in spring")).toBe("the seed grows in spring");
    expect(flags("I seed it")).toEqual([]);
  });
});

describe("leaves valid standard English untouched (per project decision)", () => {
  it("does not un-Americanize spelling or over-correct `who`", () => {
    expect(se("the color of the center")).toBe("the color of the center");
    expect(se("who is there")).toBe("who is there");
    expect(flags("the color who")).toEqual([]);
  });

  it("does not reverse homograph verbs the linter treats as low-confidence", () => {
    // `ground` (past of grind) is a homograph → excluded, so it stays put.
    expect(se("on the ground")).toBe("on the ground");
  });

  it("does not reverse verb prepositions — verbs keep their standard preposition (G3, no drop)", () => {
    // WoE keeps *listen to* / *wait for* verbatim, so a WoE sentence reads the same as standard
    // English here and nothing is inserted or flagged.
    expect(se("listen to music")).toBe("listen to music");
    expect(se("wait for the bus")).toBe("wait for the bus");
    expect(flags("listen to music and wait for the bus")).toEqual([]);
  });

  it("does not reverse phrasal verbs — the plain WoE verb is itself valid standard English", () => {
    expect(se("he seeks it")).toBe("he seeks it");
  });

  it("round-trips zero-past coinages produced by the forward pipeline (#67)", () => {
    // `quitted`/`putted` never occur in standard English, but the forward translator's zero-past
    // auto-convert and zero-past-phrasal-head guard both produce them — the reverse translator
    // must map them back to the standard zero-past form.
    expect(se("she quitted yesterday")).toBe("she quit yesterday");
    expect(se("he putted it down")).toBe("he put it down");
    expect(se("they setted up a fund")).toBe("they set up a fund");
  });
});

describe("lossless-mapping proof against docs/samples.md", () => {
  const pairs = samplePairs();
  const reverseMap = buildReverseMap();

  it("finds the nine gold passages", () => {
    expect(pairs.length).toBe(9);
  });

  it("restores every losslessly-reversible WoE form back to its standard original", () => {
    // For each WoE token that has a NON-ambiguous reverse entry, its standard `restore` must
    // appear in the reversed output — the concrete "lossless-mapping proof" for those classes.
    for (const { woe: gold } of pairs) {
      const got = new Set(tokens(reverseTranslate(gold).text));
      for (const t of tokens(gold)) {
        const entry = reverseMap.get(t);
        if (entry && !entry.ambiguous) {
          expect({ form: t, restore: entry.restore, present: got.has(entry.restore) }).toMatchObject({
            present: true,
          });
        }
      }
    }
  });

  it("flags the lossy classes the passages exercise (be/beed)", () => {
    const allWoe = pairs.map((p) => p.woe).join("\n");
    const keys = flagKeys(allWoe);
    expect(keys).toContain("beed→was");
  });
});
