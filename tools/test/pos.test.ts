import { describe, expect, it } from "bun:test";
import { thirdPersonSDrop } from "../src/pos.ts";

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
