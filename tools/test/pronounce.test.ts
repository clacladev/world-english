import { describe, expect, it } from "bun:test";
import { defaultLexicon } from "../src/lexicon.ts";
import { pronounce } from "../src/pronounce.ts";

const WORKED_SENTENCE = "The doctor gived the young child book about birds.";

describe("lexicon coverage", () => {
  it("carries every word of the worked sentence", () => {
    for (const w of ["the", "doctor", "gived", "young", "child", "book", "about", "birds"]) {
      expect(defaultLexicon.entries.has(w)).toBe(true);
    }
  });
});

describe("pronounce — respelling (default)", () => {
  it("renders the worked sentence to its gold respelling (P1–P4)", () => {
    // Gold from docs/pronunciation.md "A full sentence"; the input period passes through (P-spec
    // scope note: punctuation is not a word).
    expect(pronounce(WORKED_SENTENCE).text).toBe(
      "dhuh DOK-ter GIVD dhuh YUNG CHYLD BUUK uh-BOWT BERDZ.",
    );
  });

  it("emits the lexicon's semantic casing regardless of input casing (The → dhuh)", () => {
    expect(pronounce("The").text).toBe("dhuh");
    expect(pronounce("THE").text).toBe("dhuh");
  });

  it("preserves punctuation and a question's trailing `?`", () => {
    // You/like/it are not in the seed lexicon → emitted verbatim, and the trailing `?` survives.
    expect(pronounce("You like it?").text).toBe("You like it?");
  });
});

describe("pronounce — IPA (--ipa)", () => {
  it("renders the worked sentence to its gold IPA", () => {
    expect(pronounce(WORKED_SENTENCE, { ipa: true }).text).toBe(
      "ðə ˈdɑktɚ ɡɪvd ðə jʌŋ tʃaɪld bʊk əˈbaʊt bɝdz.",
    );
  });
});

describe("flag, never guess", () => {
  it("emits an unknown word verbatim and flags it not-found", () => {
    const { text, flags } = pronounce("xylophone");
    expect(text).toBe("xylophone");
    expect(flags).toEqual([
      { file: "<stdin>", line: 1, word: "xylophone", kind: "not-found", detail: "no respelling entry" },
    ]);
  });

  it("emits a homograph's first reading and flags the alternatives (P-spec residue)", () => {
    const { text, flags } = pronounce("lead");
    expect(text).toBe("LED");
    expect(flags).toEqual([
      { file: "<stdin>", line: 1, word: "lead", kind: "homograph", detail: "LED (metal) | LEED (guide)" },
    ]);
  });

  it("lists IPA alternatives when rendering a homograph in --ipa mode", () => {
    const { text, flags } = pronounce("read", { ipa: true });
    expect(text).toBe("rid");
    expect(flags[0]?.detail).toBe("rid (present) | rɛd (past)");
  });

  it("reports flag line numbers across a multi-line input", () => {
    const { flags } = pronounce("cat\nxylophone");
    expect(flags).toEqual([
      { file: "<stdin>", line: 2, word: "xylophone", kind: "not-found", detail: "no respelling entry" },
    ]);
  });
});
