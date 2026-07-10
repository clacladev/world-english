import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { loadDataset } from "../src/dataset.ts";
import { buildForwardMap, translate } from "../src/translate.ts";

const data = loadDataset();

function woe(text: string, strict = false) {
  return translate(text, { dataset: data, strict, file: "x.md" }).text;
}
function flags(text: string, strict = false) {
  return translate(text, { dataset: data, strict, file: "x.md" }).flags;
}
function flagKeys(text: string, strict = false) {
  return flags(text, strict).map((f) => `${f.found}:${f.class}/${f.rule}`);
}
function tokens(text: string): string[] {
  return text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
}

describe("deterministic closed-class substitution", () => {
  it("converts `be` forms (M2)", () => {
    expect(woe("she was here")).toBe("she beed here");
    expect(woe("they are ready and it is done")).toBe("they be ready and it be doed");
  });

  it("converts pronouns (G4/G12)", () => {
    expect(woe("my son and his car")).toBe("mes son and hims car");
    expect(woe("our tickets are yours")).toBe("uss tickets be yous");
    expect(woe("they hurt themselves")).toBe("they hurt themselfs");
  });

  it("converts British spellings, silent letters, and ough (O1/O2/O5)", () => {
    expect(woe("the colour of the centre")).toBe("the color of the center");
    expect(woe("no doubt about the debt")).toBe("no dout about the det");
    expect(woe("straight through, though")).toBe("straight thru, tho");
  });

  it("converts suppletive comparatives (M5)", () => {
    expect(woe("it is better, the best")).toBe("it be gooder, the goodest");
  });

  it("converts non-homograph irregular verbs and plurals (M1/M4)", () => {
    expect(woe("I went and took it")).toBe("I goed and taked it");
    expect(woe("the children built houses")).toBe("the childs builded houses");
  });

  it("preserves the source token's casing", () => {
    expect(woe("My keys")).toBe("Mes keys");
    expect(woe("THROUGH the door")).toBe("THRU the door");
    expect(woe("Was it better?")).toBe("Beed it gooder?");
  });

  it("preserves surrounding punctuation and whitespace", () => {
    expect(woe("My keys, was they?")).toBe("Mes keys, beed they?");
    expect(woe("go\n  was\ndone")).toBe("go\n  beed\ndoed");
  });
});

describe("flagged, not translated (needs POS / syntax / lexicon)", () => {
  it("leaves genuine homographs untouched, flagging them only under --strict", () => {
    // `ground` (past of grind) is marked homograph → low confidence, so it is neither
    // translated nor flagged by default. `saw` (past of see, also "the tool") is marked
    // homograph the same way — it is risky to guess-translate, so it stays untouched too.
    expect(woe("on the ground")).toBe("on the ground");
    expect(flagKeys("on the ground")).toEqual([]); // low-confidence: quiet by default
    expect(flagKeys("on the ground", true)).toContain("ground:irregular-verb/M1");
    expect(woe("he used the saw to cut wood")).toBe("he used the saw to cut wood");
    expect(flagKeys("he used the saw to cut wood")).toEqual([]);
    expect(flagKeys("he used the saw to cut wood", true)).toContain("saw:irregular-verb/M1");
  });

  it("drops the indefinite article a/an and no longer flags it (G2)", () => {
    expect(woe("a dog and an owl")).toBe("dog and owl");
    expect(flagKeys("a dog", true)).not.toContain("a:article/G2");
  });

  it("recapitalizes the noun when a capitalized sentence-initial article is dropped (G2)", () => {
    expect(woe("A dog barked.")).toBe("Dog barked.");
    expect(woe("An owl hooted.")).toBe("Owl hooted.");
    expect(woe("It was cold. An owl hooted.")).toBe("It beed cold. Owl hooted.");
    expect(woe("I have a dog")).toBe("I have dog"); // mid-sentence: no recapitalization
  });

  it("keeps a/an in quantifier idioms and for-governed spans (G2)", () => {
    expect(woe("a lot of rain fell")).toBe("a lot of rain fell");
    expect(woe("a few good ideas")).toBe("a few good ideas");
    expect(woe("a great deal of noise")).toBe("a great deal of noise");
    expect(woe("wait for a while")).toBe("wait for a while");
  });

  it("restores a dropped complementizer `that` in reported speech (G14)", () => {
    expect(woe("I think he is right")).toBe("I think that he be right");
    expect(woe("They know we go there")).toBe("They know that we go there");
  });

  it("does not insert `that` outside the reported-clause shape (G14)", () => {
    expect(woe("I know it")).toBe("I know it"); // object-capable pronoun → bail
    expect(woe("I know that he goes")).toBe("I know that he go"); // already present → no dup (3sg still fires)
  });

  it("auto-converts a zero-past verb in the coordinated-past shape (M1)", () => {
    expect(woe("He stopped and put it down")).toBe("He stopped and putted it down");
    expect(woe("She turned and cut the rope")).toBe("She turned and cutted the rope");
  });

  it("leaves zero-past verbs alone outside the coordinated-past shape (M1)", () => {
    expect(woe("I put it there")).toBe("I put it there"); // plain present
    expect(woe("they decided to put it back")).toBe("they decided to put it back"); // infinitive
    expect(woe("she will put it back")).toBe("she will put it back"); // modal
  });

  it("resolves phrasal verbs (S2) and dropped prepositions (G3), inflected forms too", () => {
    expect(woe("please give up now")).toBe("please quit now");
    expect(woe("she gave up yesterday")).toBe("she quitted yesterday");
    expect(woe("he listens to music")).toBe("he listens music");
    expect(woe("they listened to the radio")).toBe("they listened the radio");
    expect(woe("it depends on the weather")).toBe("it depends the weather");
  });

  it("resolves the `for` test (G3, item 16): drops object-for, keeps duration-for", () => {
    expect(woe("please wait for the bus")).toBe("please wait the bus");
    expect(woe("wait for three minutes")).toBe("wait for three minutes");
    expect(woe("wait for the bus for ten minutes")).toBe("wait the bus for ten minutes");
    expect(woe("I hope for rain")).toBe("I hope rain");
    // fixed and determiner-led spans are kept…
    expect(woe("wait for a while")).toBe("wait for a while");
    expect(woe("wait for a long time")).toBe("wait for a long time");
    expect(woe("wait for now")).toBe("wait for now");
    // …but a time-unit noun buried behind an adjective is an object, not a span → dropped
    // (better → gooder is the unrelated M5 comparative)
    expect(woe("hope for a better year")).toBe("hope a gooder year");
    // "for good" (= permanently) is a bare span, kept; but "good" before a noun is an
    // adjective, so the object-for drops
    expect(woe("I hope for good")).toBe("I hope for good");
    expect(woe("I hope for good news")).toBe("I hope good news");
    // neither the dropped nor the deliberately-kept `for` is flagged
    expect(flagKeys("wait for the bus")).not.toContain("wait for:dropped-prep/G3");
    expect(flagKeys("wait for three minutes")).not.toContain("wait for:dropped-prep/G3");
  });

  it("does not cross punctuation to form a phrase", () => {
    expect(woe("Wait, for the record, I disagree.")).toBe("Wait, for the record, I disagree.");
  });

  it("leaves zero-past verbs alone (undetectable without POS — documented limit)", () => {
    // `cost` is omitted from the dataset because its past is spelled like the base.
    expect(woe("it cost fifty dollars")).toBe("it cost fifty dollars");
    expect(flagKeys("it cost fifty dollars", true)).toEqual([]);
  });

  it("never both translates and flags the same form", () => {
    const { text, flags } = translate("she was better", { dataset: data, strict: true });
    expect(text).toBe("she beed gooder");
    expect(flags).toEqual([]);
  });

  it("drops the third-person -s after a he/she/it subject (M3, item 11)", () => {
    expect(woe("he works hard")).toBe("he work hard");
    expect(woe("she goes home")).toBe("she go home");
    expect(woe("it has value")).toBe("it have value");
    expect(woe("she tries again")).toBe("she try again");
  });

  it("leaves a determiner-led noun untouched (no subject pronoun)", () => {
    expect(woe("the works of art")).toBe("the works of art");
    expect(flagKeys("the works of art", true)).toEqual([]);
  });

  it("keeps an untriggered 3sg verb flagged under --strict, absent from default output", () => {
    // No preceding subject pronoun → not converted; `does` (M3) is low-confidence, so it is
    // quiet by default and surfaces only under --strict.
    expect(woe("the plan does work")).toBe("the plan does work");
    expect(flagKeys("the plan does work")).toEqual([]);
    expect(flagKeys("the plan does work", true)).toContain("does:third-person-s/M3");
  });

  it("never both translates and flags the converted 3sg verb", () => {
    const { text, flags } = translate("he does work", { dataset: data, strict: true });
    expect(text).toBe("he do work");
    expect(flags.map((f) => f.found)).not.toContain("does");
  });
});

describe("gold round-trip against docs/samples.md", () => {
  // Parse the alternating **Standard English** / **World English** blockquotes out of samples.md.
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
    for (let i = 0; i + 1 < blocks.length; i += 2) {
      expect(blocks[i]!.kind).toBe("se");
      expect(blocks[i + 1]!.kind).toBe("woe");
      pairs.push({ se: blocks[i]!.text, woe: blocks[i + 1]!.text });
    }
    return pairs;
  }

  const pairs = samplePairs();
  const forwardValues = new Set(buildForwardMap(data).values());

  it("finds the eight gold passages", () => {
    expect(pairs.length).toBe(8);
  });

  it("produces every handled World-English form the gold passage contains", () => {
    // For each pair, take the WoE forms that come from a handled class and appear in the gold
    // translation, and require the translator to produce each of them. This proves the engine
    // matches the human gold on its scope, and is robust to the out-of-scope syntactic changes
    // (reordering, tense, article drop) the tool deliberately does not do.
    for (const { se, woe: gold } of pairs) {
      const got = new Set(tokens(translate(se, { dataset: data }).text));
      const expected = tokens(gold).filter((t) => forwardValues.has(t));
      for (const form of expected) {
        expect({ passage: se.slice(0, 40), missing: form, got: [...got] }).toMatchObject({
          missing: form,
        });
        expect(got.has(form)).toBe(true);
      }
    }
  });

  it("flags the out-of-scope constructions the gold passages needed (article 'a')", () => {
    const allSe = pairs.map((p) => p.se).join("\n");
    // Passage 3's only dropped-prep is the duration 'wait for three minutes' — now RESOLVED by
    // the G3 for-test (kept, not flagged), so no 'wait for' flag survives.
    expect(flagKeys(allSe)).not.toContain("wait for:dropped-prep/G3");
    // articles are now handled by the G2 auto-drop, so 'a' is no longer flagged under strict.
    expect(flagKeys(allSe, true)).not.toContain("a:article/G2");
  });
});
