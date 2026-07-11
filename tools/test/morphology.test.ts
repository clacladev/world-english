import { describe, expect, it } from "bun:test";
import {
  regularizePlural,
  regularizeVerbPast,
  standardPresentParticiple,
} from "../src/morphology.ts";

describe("regularizeVerbPast (M1)", () => {
  it.each([
    ["go", "goed"],
    ["be", "beed"],
    ["see", "seed"],
    ["give", "gived"],
    ["make", "maked"],
    ["take", "taked"],
    ["try", "tried"],
    ["carry", "carried"],
    ["stop", "stopped"],
    ["look", "looked"],
    ["build", "builded"],
  ])("%s → %s", (base, expected) => {
    expect(regularizeVerbPast(base)).toBe(expected);
  });

  it.each([
    ["begin", "beginned"],
    ["refer", "referred"],
    ["occur", "occurred"],
    ["prefer", "preferred"],
    ["admit", "admitted"],
    ["control", "controlled"],
  ])("stress-final polysyllable %s → %s (O3 doubling)", (base, expected) => {
    expect(regularizeVerbPast(base)).toBe(expected);
  });

  it("does not double a non-stress-final polysyllable", () => {
    expect(regularizeVerbPast("open")).toBe("opened");
    expect(regularizeVerbPast("travel")).toBe("traveled");
  });
});

describe("standardPresentParticiple (stress-final doubling)", () => {
  it.each([
    ["begin", "beginning"],
    ["refer", "referring"],
    ["occur", "occurring"],
  ])("%s → %s", (base, expected) => {
    expect(standardPresentParticiple(base)).toBe(expected);
  });
});

describe("regularizePlural (M4)", () => {
  it.each([
    ["child", "childs"],
    ["foot", "foots"],
    ["man", "mans"],
    ["mouse", "mouses"],
    ["analysis", "analysises"],
    ["criterion", "criterions"],
    ["box", "boxes"],
  ])("%s → %s", (singular, expected) => {
    expect(regularizePlural(singular)).toBe(expected);
  });
});
