import { describe, expect, it } from "bun:test";
import { extractWoeSpans } from "../src/extract.ts";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const texts = (md: string) => extractWoeSpans("x.md", md).map((s) => norm(s.text));

describe("table extraction", () => {
  it("pulls the World-English column and ignores the Standard column", () => {
    const md = [
      "| Standard | World English |",
      "| -------- | ------------- |",
      "| she was here | she **be** here |",
      "| I saw it | I **seed** it |",
    ].join("\n");
    const spans = extractWoeSpans("x.md", md);
    expect(spans.map((s) => norm(s.text))).toEqual(["she be here", "I seed it"]);
    // Line numbers point at the data rows (1-based).
    expect(spans.map((s) => s.line)).toEqual([3, 4]);
    expect(spans.every((s) => s.source === "table")).toBe(true);
  });

  it("finds the World-English column regardless of position or compound header", () => {
    const md = [
      "| World English (transitive) | Dropped prep | Standard |",
      "| --- | --- | --- |",
      "| **listen** music | to | listen to music |",
    ].join("\n");
    expect(texts(md)).toEqual(["listen music"]);
  });

  it("ignores pronunciation respelling tables (no World-English column)", () => {
    const md = [
      "| Word | Learner respelling | IPA |",
      "| --- | --- | --- |",
      "| through | THROO | /θru/ |",
      "| knight | NYT | /naɪt/ |",
    ].join("\n");
    expect(extractWoeSpans("x.md", md)).toEqual([]);
  });

  it("ignores summary tables whose column is 'World English rule'", () => {
    const md = [
      "| Feature | Standard English | World English rule |",
      "| --- | --- | --- |",
      "| Verb past | ~200 irregular | always -ed (M1) |",
    ].join("\n");
    expect(extractWoeSpans("x.md", md)).toEqual([]);
  });

  it("strips parenthetical annotations (link anchors, editorial notes)", () => {
    const md = [
      "| Standard | World English |",
      "| --- | --- |",
      "| I need information | I need **informations**. (indefinite, per [G5](#rule-g5--all-nouns-are-countable)) |",
      "| run | **run** (kept — physical running only) |",
    ].join("\n");
    // "are" (from the anchor slug) and "kept" (editorial) must not survive.
    const joined = texts(md).join(" ").toLowerCase();
    expect(joined).not.toContain("are");
    expect(joined).not.toContain("kept");
    expect(joined).toContain("informations");
    expect(joined).toContain("run");
  });

  it("keeps real content that sits outside the parentheses", () => {
    const md = [
      "| Standard | World English |",
      "| --- | --- |",
      "| My car is red | **Mes car, that be red.** (no comma contrast) |",
    ].join("\n");
    expect(texts(md).join(" ")).toContain("Mes car, that be red.");
  });
});

describe("samples.md passage extraction", () => {
  it("extracts the World-English blockquote, not the Standard one", () => {
    const md = [
      "**Standard English**",
      "",
      "> The city has built a hospital.",
      "",
      "**World English**",
      "",
      "> The city builded new hospital.",
      "> It beed designed by them.",
      "",
      "**Annotations**",
      "",
      "1. some prose that mentions was and children",
    ].join("\n");
    const spans = extractWoeSpans("samples.md", md);
    expect(spans.map((s) => s.source)).toEqual(["sample", "sample"]);
    expect(spans.map((s) => s.text)).toEqual([
      "The city builded new hospital.",
      "It beed designed by them.",
    ]);
    // The annotation prose after the blank line is not captured.
    expect(spans.some((s) => s.text.includes("children"))).toBe(false);
  });
});
