import { describe, expect, it } from "bun:test";
import { thirdPersonSDrop, articleDrop, droppedThat, zeroPastConvert } from "../src/pos.ts";

// Detector-in-isolation tests. It works on lowercased word tokens + the verb's index; a hit
// returns the base to emit, a miss returns null (→ the form stays flagged elsewhere).
function detect(text: string, i: number) {
  const toks = text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
  return thirdPersonSDrop(toks, i);
}

describe("thirdPersonSDrop", () => {
  it("converts a regular 3sg verb after a he/she/it subject", () => {
    expect(detect("he works", 1)).toEqual({ base: "work" });
    expect(detect("she tries", 1)).toEqual({ base: "try" });
    expect(detect("it needs", 1)).toEqual({ base: "need" });
  });

  it("converts the irregular 3sg forms goes / does / has", () => {
    expect(detect("he goes", 1)).toEqual({ base: "go" });
    expect(detect("she does", 1)).toEqual({ base: "do" });
    expect(detect("it has", 1)).toEqual({ base: "have" });
  });

  it("does not convert a determiner-led noun (no subject pronoun)", () => {
    expect(detect("the works of art", 1)).toBeNull();
  });

  it("does not convert a bare plural with no subject pronoun", () => {
    expect(detect("plants grow", 0)).toBeNull();
    expect(detect("needs met", 0)).toBeNull();
  });

  it("does not convert a possessive / contraction", () => {
    expect(detect("it's cold", 0)).toBeNull();
    expect(thirdPersonSDrop(["he", "he's"], 1)).toBeNull();
  });

  it("does not convert a be-form's collision (is → i is not a verb)", () => {
    expect(detect("it is", 1)).toBeNull();
  });

  it("keeps object `it` from firing outside clear subject position", () => {
    // `give it names` — `it` is the object of give, not the subject of names.
    expect(detect("give it names", 2)).toBeNull();
    // but a clause-starter or sentence start makes `it` a subject again
    expect(detect("and it works", 2)).toEqual({ base: "work" });
  });
});

describe("articleDrop (G2)", () => {
  it("drops a/an heading a following word", () => {
    expect(articleDrop(["a", "dog"], 0)).toBe(true);
    expect(articleDrop(["an", "owl"], 0)).toBe(true);
  });

  it("keeps a/an in fixed quantifier idioms", () => {
    expect(articleDrop(["a", "lot"], 0)).toBe(false);
    expect(articleDrop(["a", "few"], 0)).toBe(false);
    expect(articleDrop(["a", "great", "deal"], 0)).toBe(false);
  });

  it("keeps a dangling article with nothing to head", () => {
    expect(articleDrop(["a"], 0)).toBe(false);
  });

  it("keeps the article when a preceding `for` governs it", () => {
    expect(articleDrop(["for", "a", "while"], 1)).toBe(false);
    expect(articleDrop(["hope", "for", "a", "year"], 2)).toBe(false);
  });

  it("keeps a magnitude word ('a hundred/thousand') — that's not the indefinite article (#62)", () => {
    expect(articleDrop(["a", "hundred", "dollars"], 0)).toBe(false);
    expect(articleDrop(["a", "thousand", "years"], 0)).toBe(false);
  });

  it("keeps distributive 'a' in a frequency expression (#62)", () => {
    expect(articleDrop(["once", "a", "week"], 1)).toBe(false);
    expect(articleDrop(["twice", "a", "day"], 1)).toBe(false);
  });

  it("keeps a capitalized standalone letter label mid-sentence (#62)", () => {
    expect(articleDrop(["vitamin", "a", "deficiency"], 1, { rawWord: "A", sentenceInitial: false })).toBe(false);
    // sentence-initial capitalized article still drops as usual
    expect(articleDrop(["a", "dog", "barked"], 0, { rawWord: "A", sentenceInitial: true })).toBe(true);
  });
});

describe("droppedThat (G14)", () => {
  it("fires on reporting verb + nominative pronoun + clause verb", () => {
    expect(droppedThat(["i", "think", "he", "is", "right"], 2)).toBe(true);
    expect(droppedThat(["they", "know", "we", "go", "there"], 2)).toBe(true);
  });

  it("bails on object-capable pronouns it/you", () => {
    expect(droppedThat(["i", "know", "it"], 2)).toBe(false);
    expect(droppedThat(["i", "know", "you", "well"], 2)).toBe(false);
  });

  it("bails when `that` is already present or no verb follows", () => {
    expect(droppedThat(["i", "think", "that", "he", "is"], 3)).toBe(false); // preceded by `that`
    expect(droppedThat(["i", "think", "he"], 2)).toBe(false); // nothing follows the pronoun
  });

  it("bails when the preceding word is not a reporting verb", () => {
    expect(droppedThat(["i", "saw", "he", "left"], 2)).toBe(false);
  });
});

describe("zeroPastConvert (M1)", () => {
  it("converts in the coordinated past shape (subject pronoun + past verb + conjunction)", () => {
    expect(zeroPastConvert(["she", "stopped", "and", "put"], 3)).toEqual({ past: "putted" });
    expect(zeroPastConvert(["they", "turned", "and", "cut"], 3)).toEqual({ past: "cutted" });
    expect(zeroPastConvert(["he", "went", "then", "read"], 3)).toEqual({ past: "readed" });
  });

  it("bails on the infinitive and modal shapes", () => {
    expect(zeroPastConvert(["he", "decided", "to", "put"], 3)).toBeNull();
    expect(zeroPastConvert(["i", "will", "put"], 2)).toBeNull();
  });

  it("bails when the conjunct verb is not clearly past", () => {
    expect(zeroPastConvert(["they", "stop", "and", "put"], 3)).toBeNull();
    expect(zeroPastConvert(["i", "put", "it", "there"], 1)).toBeNull();
  });

  it("bails on an -ed ADJECTIVE conjunct — no subject pronoun opens the shape", () => {
    // "he was tired and hurt": `tired` is a predicate adjective, not a past verb; `was` (not a
    // subject pronoun) sits before it, so the shape does not fire.
    expect(zeroPastConvert(["he", "was", "tired", "and", "hurt"], 4)).toBeNull();
    // "the red and cut flowers": attributive adjectives, `the` before the conjunct → no fire.
    expect(zeroPastConvert(["the", "red", "and", "cut", "flowers"], 3)).toBeNull();
  });
});
