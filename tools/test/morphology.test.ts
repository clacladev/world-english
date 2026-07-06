import { describe, expect, it } from "bun:test";
import { regularizePlural, regularizeVerbPast } from "../src/morphology.ts";

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
