// Unit tests for the espeak phoneme engine (src/espeak.ts). Deterministic — no espeak-ng binary
// needed. The audio path itself (spawning espeak-ng) is exercised in pronounce.cli.test.ts, gated
// on the binary being installed.

import { describe, expect, it } from "bun:test";
import { respellingToEspeak, textToEspeak, GRAPHEME_TO_ESPEAK } from "../src/espeak.ts";
import { GRAPHEME_TO_IPA } from "../src/respell.ts";

describe("respellingToEspeak", () => {
  // The pronunciation.md gold sentence, word by word. Each espeak body was verified against
  // `espeak-ng -v en-us --ipa "[[body]]"` reproducing that word's gold IPA.
  // A monosyllable carries no stress mark (espeak auto-stresses it), mirroring respellingToIpa;
  // a polysyllable marks the stressed syllable with `'` before its body.
  const GOLD: [string, string][] = [
    ["dhuh", "D@"],
    ["DOK-ter", "'d0kt3"],
    ["GIVD", "gIvd"],
    ["YUNG", "jVN"],
    ["CHYLD", "tSaIld"],
    ["BUUK", "bUk"],
    ["uh-BOWT", "@'baUt"],
    ["BERDZ", "b3dz"],
  ];

  for (const [respelling, espeak] of GOLD) {
    it(`renders ${respelling} → ${espeak}`, () => {
      expect(respellingToEspeak(respelling)).toBe(espeak);
    });
  }

  it("marks stress before the stressed syllable of a polysyllable, none on a monosyllable", () => {
    expect(respellingToEspeak("kom-PYOO-ter")).toBe("k0m'pju:t3"); // o → LOT vowel `0`
    expect(respellingToEspeak("KAT")).toBe("kat"); // lone syllable: no mark, espeak stresses it
  });

  it("resolves y as a glide before a vowel and as PRICE before a consonant", () => {
    expect(respellingToEspeak("YES")).toBe("jEs"); // y + e (vowel) → glide j
    expect(respellingToEspeak("MY")).toBe("maI"); // y with no follower → PRICE aI
  });
});

describe("textToEspeak", () => {
  it("wraps known words in [[...]] and flags nothing for a clean sentence", () => {
    const { text, flags } = textToEspeak("The doctor gived the young child book about birds.");
    expect(text).toBe("[[D@]] [['d0kt3]] [[gIvd]] [[D@]] [[jVN]] [[tSaIld]] [[bUk]] [[@'baUt]] [[b3dz]].");
    expect(flags).toEqual([]);
  });

  it("passes an unknown word through verbatim and flags it not-found", () => {
    const { text, flags } = textToEspeak("hello doctor");
    expect(text).toBe("hello [['d0kt3]]");
    expect(flags).toMatchObject([{ word: "hello", kind: "not-found" }]);
  });

  it("emits a homograph's first reading and flags the alternatives", () => {
    const { text, flags } = textToEspeak("lead");
    expect(text).toBe("[[lEd]]"); // LED, the first entry
    expect(flags).toMatchObject([{ word: "lead", kind: "homograph" }]);
  });
});

describe("phoneme map coverage", () => {
  it("has an espeak phoneme for every IPA grapheme (except the in-engine `er`)", () => {
    for (const grapheme of GRAPHEME_TO_IPA.keys()) {
      if (grapheme === "er") continue;
      expect(GRAPHEME_TO_ESPEAK.has(grapheme)).toBe(true);
    }
  });
});
