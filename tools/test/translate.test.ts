import { describe, expect, it } from "bun:test";
import { loadDataset } from "../src/dataset.ts";
import { buildForwardMap, translate } from "../src/translate.ts";
import { loadCoreLexicon, type CoreLexicon } from "../src/core-lexicon.ts";
import { samplePairs } from "./helpers/samples.ts";

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

  it("converts whom→who, leaving standard possessives and reflexives unchanged (G4)", () => {
    expect(woe("the man whom I called")).toBe("the man who I called");
    expect(woe("my son and his car")).toBe("my son and his car");
    expect(woe("our tickets are yours")).toBe("our tickets be yours");
    expect(woe("they hurt themselves")).toBe("they hurt themselves");
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
    expect(woe("Children play")).toBe("Childs play");
    expect(woe("THROUGH the door")).toBe("THRU the door");
    expect(woe("Was it better?")).toBe("Beed it gooder?");
  });

  it("preserves surrounding punctuation and whitespace", () => {
    expect(woe("Went there, was they?")).toBe("Goed there, beed they?");
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

  it("does not drop a/an where it isn't the indefinite article (#62)", () => {
    // A capitalized standalone letter label, mid-sentence, is not the article.
    expect(woe("Vitamin A deficiency is common.")).toBe("Vitamin A deficiency be common.");
    // A genuine sentence-initial capitalized article still drops as usual.
    expect(woe("A dog barked.")).toBe("Dog barked.");
    // Distributive "a" in a frequency expression.
    expect(woe("I go there once a week.")).toBe("I go there once a week.");
    // "a hundred/thousand/million" = "one hundred", not the indefinite article.
    expect(woe("It costs a hundred dollars.")).toBe("It cost a hundred dollars.");
  });

  it("restores a dropped complementizer `that` in reported speech (G11)", () => {
    expect(woe("I think he is right")).toBe("I think that he be right");
    expect(woe("They know we go there")).toBe("They know that we go there");
  });

  it("does not insert `that` outside the reported-clause shape (G11)", () => {
    expect(woe("I know it")).toBe("I know it"); // object-capable pronoun → bail
    expect(woe("I know that he goes")).toBe("I know that he go"); // already present → no dup (3sg still fires)
  });

  it("does not insert `that` into a direct quotation or across a comma (#57)", () => {
    expect(woe('He said "I am here."')).toBe('He sayed "I be here."');
    expect(woe("As I said, he will come")).toBe("As I sayed, he will come");
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

  it("resolves phrasal verbs (S2), inflected forms too", () => {
    expect(woe("please give up now")).toBe("please quit now");
    expect(woe("she gave up yesterday")).toBe("she quitted yesterday");
  });

  it("keeps verb-selected prepositions unchanged (G3 no longer drops)", () => {
    // The verb keeps its standard preposition as vocabulary; only the 3sg -s (M3) and be (M2)
    // change here, never the preposition.
    expect(woe("he listens to music")).toBe("he listen to music");
    expect(woe("they listened to the radio")).toBe("they listened to the radio");
    expect(woe("it depends on the weather")).toBe("it depend on the weather");
  });

  it("keeps a verb's `for` in every context (G3 no longer drops, so no duration test)", () => {
    expect(woe("please wait for the bus")).toBe("please wait for the bus");
    expect(woe("wait for three minutes")).toBe("wait for three minutes");
    expect(woe("wait for the bus for ten minutes")).toBe("wait for the bus for ten minutes");
    expect(woe("I hope for rain")).toBe("I hope for rain");
    // no dropped-prep flags exist anymore
    expect(flagKeys("wait for the bus").some((k) => k.includes("dropped-prep"))).toBe(false);
  });

  it("recognizes a zero-past phrasal head's SE past tense given a past-time signal (#59)", () => {
    expect(woe("they set up a fund yesterday")).toBe("they established fund yesterday");
    expect(woe("they set up a fund every year")).toBe("they establish fund every year");
    expect(woe("she put off the meeting last week")).toBe("she delayed the meeting last week");
    expect(woe("they cut down the tree already")).toBe("they reduced the tree already");
  });

  it("does not auto-replace the dangerously polysemous 'came across'/'worked out' (#94)", () => {
    expect(woe("he came across the room")).toBe("he comed across the room");
    expect(woe("she worked out at the gym")).toBe("she worked out at the gym");
    expect(flagKeys("he came across the room", true)).toContain("came across:phrasal-verb/S2");
  });

  it("does not mistranslate the intransitive 'run out of' as the transitive phrasal (#58)", () => {
    expect(woe("we ran out of milk")).toBe("we runned out of milk");
    expect(woe("they ran out the supplies")).toBe("they exhausted the supplies");
  });

  it("does not cross punctuation to form a phrase", () => {
    expect(woe("Wait, for the record, I disagree.")).toBe("Wait, for the record, I disagree.");
  });

  it("flags an unhandled occurrence even when the same phrase was handled elsewhere (#61)", () => {
    // Line 1's "give up" is substituted (handled). Line 2's "give-up" is punctuation-blocked from
    // substitution (translate's phrase pass requires a whitespace gap) but the scanner still
    // matches it as a token sequence, so it must still surface its own flag rather than being
    // silently suppressed because the same surface string was handled on line 1.
    const text = "please give up now\nThey give-up the hill.";
    const { text: out, flags } = translate(text, { dataset: data, strict: true, file: "x.md" });
    expect(out).toBe("please quit now\nThey give-up the hill.");
    expect(flags.some((f) => f.found === "give up" && f.line === 2)).toBe(true);
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

  it("translates an untriggered 'does' unconditionally — it has no valid WoE reading (#72)", () => {
    // `does` (M3) is now high-confidence: unlike the general POS-dependent 3sg-s class it has NO
    // valid WoE reading in any position, so it is translated (and never flagged) even without a
    // preceding subject pronoun.
    expect(woe("the plan does work")).toBe("the plan do work");
    expect(flagKeys("the plan does work")).toEqual([]);
    expect(flagKeys("the plan does work", true)).toEqual([]);
  });

  it("never both translates and flags the converted 3sg verb", () => {
    const { text, flags } = translate("he does work", { dataset: data, strict: true });
    expect(text).toBe("he do work");
    expect(flags.map((f) => f.found)).not.toContain("does");
  });
});

describe("opts.lexicon overrides phrase transforms consistently with opts.dataset (#63)", () => {
  it("uses an injected lexicon instead of the module-level default", () => {
    const custom: CoreLexicon = {
      ...loadCoreLexicon(),
      phrasalVerbs: [{ phrasal: "give up", plain: "surrender", rank: 1 }],
    };
    const { text } = translate("please give up now", { lexicon: custom, file: "x.md" });
    expect(text).toBe("please surrender now");
  });

  it("without an injected lexicon, phrase transforms still come from the production default", () => {
    expect(translate("please give up now", { file: "x.md" }).text).toBe("please quit now");
  });
});

describe("gold round-trip against docs/samples.md", () => {
  const pairs = samplePairs();
  const forwardValues = new Set(buildForwardMap(data).values());

  it("finds the nine gold passages", () => {
    expect(pairs.length).toBe(9);
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
    // G3 no longer drops verb prepositions, so no dropped-prep flag can ever survive.
    expect(flagKeys(allSe).some((k) => k.includes("dropped-prep"))).toBe(false);
    // articles are now handled by the G2 auto-drop, so 'a' is no longer flagged under strict.
    expect(flagKeys(allSe, true)).not.toContain("a:article/G2");
  });
});
