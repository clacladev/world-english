import { describe, expect, it } from "bun:test";
import { findStress, respellingToIpa, splitSyllables, tokenizeSyllable } from "../src/respell.ts";
import { defaultLexicon } from "../src/lexicon.ts";
import { validateLexicon } from "../src/check.ts";

describe("tokenizeSyllable — greedy longest-match, ordering is load-bearing", () => {
  it("takes r-colored trigraphs before vowel+r (the POOR collision)", () => {
    expect(tokenizeSyllable("POOR")).toEqual(["p", "oor"]); // oor, not oo + r
    expect(tokenizeSyllable("HEER")).toEqual(["h", "eer"]);
    expect(tokenizeSyllable("AIR")).toEqual(["air"]);
  });

  it("keeps GOOSE `oo` + `r`-less consonants apart from the trigraph", () => {
    expect(tokenizeSyllable("MOON")).toEqual(["m", "oo", "n"]);
    expect(tokenizeSyllable("PYOO")).toEqual(["p", "y", "oo"]);
  });

  it("splits single `y` from a following consonant, and `ng`/`th` digraphs", () => {
    expect(tokenizeSyllable("NYT")).toEqual(["n", "y", "t"]);
    expect(tokenizeSyllable("ING")).toEqual(["i", "ng"]);
    expect(tokenizeSyllable("DHIS")).toEqual(["dh", "i", "s"]);
  });
});

describe("respellingToIpa — deterministic P2/P3/P4 engine", () => {
  it("reproduces clean (non-reducing) gold rows", () => {
    expect(respellingToIpa("KAT")).toBe("kæt");
    expect(respellingToIpa("SEE")).toBe("si");
    expect(respellingToIpa("BUUK")).toBe("bʊk");
    expect(respellingToIpa("MOON")).toBe("mun");
    expect(respellingToIpa("NYT")).toBe("naɪt");
    expect(respellingToIpa("JUJ")).toBe("dʒʌdʒ");
    expect(respellingToIpa("THIN")).toBe("θɪn");
    expect(respellingToIpa("DHIS")).toBe("ðɪs");
  });

  it("splits `y` into glide /j/ before a vowel, vowel /aɪ/ otherwise (P2)", () => {
    expect(respellingToIpa("YUNG")).toBe("jʌŋ");
    expect(respellingToIpa("MY")).toBe("maɪ");
    expect(respellingToIpa("CHYLD")).toBe("tʃaɪld");
  });

  it("colors `er` as /ɝ/ when stressed, /ɚ/ when not (P2 allophone)", () => {
    expect(respellingToIpa("HER")).toBe("hɝ");
    expect(respellingToIpa("BERD")).toBe("bɝd");
    expect(respellingToIpa("LET-er")).toBe("ˈlɛtɚ");
  });

  it("marks stress with ˈ only for polysyllables", () => {
    expect(respellingToIpa("KAT")).toBe("kæt"); // monosyllable: no mark
    expect(respellingToIpa("DOK-ter")).toBe("ˈdɑktɚ");
    expect(respellingToIpa("un-der-STAND")).toBe("ʌndɚˈstænd");
    expect(respellingToIpa("awl-DHOH")).toBe("ɔlˈðoʊ");
  });

  it("renders the careful (unreduced) reading of a reducing word", () => {
    // Careful/syllable-timed IPA is spec-legal under P6; the lexicon ships the reduced authored form.
    expect(respellingToIpa("kom-PYOO-ter")).toBe("kɑmˈpjutɚ");
  });
});

describe("findStress — the determinism guard", () => {
  it("returns the single stressed index, or -1 for an unstressed function word", () => {
    expect(findStress(splitSyllables("uh-BOWT"))).toBe(1);
    expect(findStress(splitSyllables("KAT"))).toBe(0);
    expect(findStress(splitSyllables("dhuh"))).toBe(-1);
  });

  it("throws on more than one stress mark (an authoring bug)", () => {
    expect(() => findStress(["FOO", "BAR"])).toThrow(/stressed syllables/);
  });
});

describe("lexicon validation — authored IPA agrees with the engine", () => {
  const divergences = validateLexicon(defaultLexicon);

  it("has no genuine respelling/IPA mismatches (authoring bugs)", () => {
    const mismatches = divergences.filter((d) => d.kind === "mismatch");
    expect(mismatches).toEqual([]);
  });

  it("flags only catalogued unstressed-vowel reduction as advisory (e.g. computer)", () => {
    const reductions = divergences.filter((d) => d.kind === "reduction");
    expect(reductions.map((d) => d.word)).toContain("computer");
    // Every advisory divergence is reduction-only — no surprises.
    expect(reductions.length).toBe(divergences.length);
  });

  it("compares by phonemic segment, not codepoint count (#103)", () => {
    // A synthetic entry whose unstressed syllable's diphthong (2 codepoints, "oʊ") reduces to a
    // single-codepoint schwa in the authored IPA — same segment count, so this is a reduction,
    // not a length-mismatch false positive.
    const synthetic = {
      entries: new Map([
        ["fauxword", [{ word: "fauxword", respelling: "FOK-soh", ipa: "ˈfɑksə" }]],
      ]),
    };
    const result = validateLexicon(synthetic);
    expect(result).toHaveLength(1);
    expect(result[0]?.kind).toBe("reduction");
  });
});
