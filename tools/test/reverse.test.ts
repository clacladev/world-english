import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { buildReverseMap, reverseTranslate } from "../src/reverse.ts";
import { translate } from "../src/translate.ts";
import { loadCoreLexicon } from "../src/core-lexicon.ts";

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

  it("restores uniquely-reversible pronouns and reflexives (G4/G12)", () => {
    expect(se("hims car")).toBe("his car");
    expect(se("whos keys")).toBe("whose keys");
    expect(se("they hurt themselfs")).toBe("they hurt themselves");
  });

  it("preserves casing", () => {
    expect(se("Goed home")).toBe("Went home");
    expect(se("HIMS car")).toBe("HIS car");
  });

  it("does the truly-lossless classes without a flag", () => {
    // Plurals, comparatives, ough, silent letters, and unique pronouns have exactly one standard
    // form, so no guess is involved. (Irregular *verbs* are flagged separately — their `-ed`
    // past collapses the standard past and its participle; see the lossy suite.)
    expect(flags("the childs is gooder thru here, no det, hims car")).toEqual([]);
  });
});

describe("lossy reverse: canonical default + flag", () => {
  it("restores collapsed `be` forms to a canonical default, flagged (M2)", () => {
    expect(se("they be here and it beed late")).toBe("they is here and it was late");
    expect(flagKeys("they be here")).toContain("be→is");
    expect(flagKeys("it beed late")).toContain("beed→was");
  });

  it("restores collapsed possessives to the determiner form, flagged (G4)", () => {
    expect(se("mes son and uss tickets")).toBe("my son and our tickets");
    expect(se("yous coat, thems keys")).toBe("your coat, their keys");
    expect(flagKeys("mes son")).toContain("mes→my");
    expect(flagKeys("yous coat")).toContain("yous→your");
  });

  it("restores an irregular past canonically but flags the past/participle collapse", () => {
    // `seed` collapsed `saw` (past) and `seen` (participle); canonical restore is the past.
    expect(se("I seed it")).toBe("I saw it");
    const f = flags("I seed it").find((x) => x.found === "seed");
    expect(f?.restored).toBe("saw");
    expect(f?.note).toContain("saw/seen");
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
});

describe("G3 preposition restoration (core lexicon, item 8 wiring)", () => {
  it("restores a drop verb's canonical preposition and always flags it", () => {
    expect(se("listen music")).toBe("listen to music");
    expect(se("wait the bus")).toBe("wait for the bus");
    expect(se("depend the weather")).toBe("depend on the weather");
    expect(se("look the picture")).toBe("look at the picture");
    expect(flagKeys("listen music")).toContain("listen→listen to");
  });

  it("restores inflected forms too (3sg, -ing, past)", () => {
    expect(se("he listens music")).toBe("he listens to music");
    expect(se("they listened the radio")).toBe("they listened to the radio");
  });

  it("skips insertion before a stoplisted next word (preposition, adverb, -ly)", () => {
    expect(se("wait for three minutes")).toBe("wait for three minutes");
    expect(se("looked under the sofa")).toBe("looked under the sofa");
    expect(se("looked there")).toBe("looked there");
    expect(se("looked quickly")).toBe("looked quickly");
    expect(flags("wait for three minutes")).toEqual([]);
  });

  it("skips insertion when punctuation intervenes or there is no next token", () => {
    expect(se("Wait, the bus is coming.")).toBe("Wait, the bus is coming.");
    expect(se("Please wait.")).toBe("Please wait.");
  });

  it("does not reverse phrasal verbs — the plain WoE verb is itself valid standard English", () => {
    expect(se("she quitted yesterday")).toBe("she quitted yesterday");
    expect(se("he seeks it")).toBe("he seeks it");
  });
});

describe("lossless-mapping proof against docs/samples.md", () => {
  function samplePairs(): { se: string; woe: string }[] {
    const md = require("node:fs").readFileSync(
      join(import.meta.dir, "..", "..", "docs", "samples.md"),
      "utf8",
    ) as string;
    const lines = md.split("\n");
    const blocks: { kind: "se" | "woe"; text: string }[] = [];
    for (let i = 0; i < lines.length; i++) {
      const m = /^\s*\*\*(Standard|World) English\*\*\s*$/.exec(lines[i]!);
      if (!m) continue;
      const kind = m[1] === "Standard" ? "se" : "woe";
      const quote: string[] = [];
      let started = false;
      for (let r = i + 1; r < lines.length; r++) {
        const isQuote = lines[r]!.trimStart().startsWith(">");
        if (lines[r]!.trim() === "") {
          if (started) break;
          continue;
        }
        if (!isQuote) break;
        started = true;
        quote.push(lines[r]!.replace(/^\s*>\s?/, ""));
      }
      blocks.push({ kind, text: quote.join(" ") });
    }
    const pairs: { se: string; woe: string }[] = [];
    for (let i = 0; i + 1 < blocks.length; i += 2) pairs.push({ se: blocks[i]!.text, woe: blocks[i + 1]!.text });
    return pairs;
  }

  const pairs = samplePairs();
  const reverseMap = buildReverseMap();

  it("finds the seven gold passages", () => {
    expect(pairs.length).toBe(7);
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

  it("flags the lossy classes the passages exercise (be/beed, collapsed possessives)", () => {
    const allWoe = pairs.map((p) => p.woe).join("\n");
    const keys = flagKeys(allWoe);
    expect(keys).toContain("beed→was");
    expect(keys).toContain("mes→my");
  });
});

describe("G3 round-trip property (forward→reverse)", () => {
  const lexicon = loadCoreLexicon();
  const dropVerbs = lexicon.droppedPreps.filter((d) => d.ruling === "drop");

  it("every forward-applying drop verb round-trips through forward then reverse, flagged", () => {
    for (const d of dropVerbs) {
      if ((d.forward ?? "apply") === "flag") continue;
      const originalSe = `${d.verb} ${d.prep} the thing`;
      const woe = translate(originalSe, { file: "x.md" }).text;
      expect(woe).toBe(`${d.verb} the thing`); // forward drops the prep
      const back = reverseTranslate(woe, { file: "x.md" });
      expect(back.text).toBe(originalSe); // reverse restores it
      expect(back.flags.some((f) => f.found === d.verb)).toBe(true); // and always flags the guess
    }
  });

  it("forward:\"flag\" entries (wait) pass forward unchanged and stay flagged", () => {
    for (const d of dropVerbs) {
      if ((d.forward ?? "apply") !== "flag") continue;
      const se = `${d.verb} ${d.prep} the thing`;
      const result = translate(se, { file: "x.md" });
      expect(result.text).toBe(se);
      expect(result.flags.some((f) => f.found === `${d.verb} ${d.prep}`)).toBe(true);
    }
  });
});
