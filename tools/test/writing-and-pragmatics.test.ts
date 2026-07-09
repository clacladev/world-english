// Dedicated regression tests for the document-level writing spec (writing.md, item 9) and the
// pragmatics guidance (style.md S8–S9, item 10). The data-driven gold-passage tests in
// translate/reverse.test.ts already exercise the *forms* in samples.md Passage 6/7; these tests
// pin the *rules and examples themselves* so a future edit can't silently regress them.

import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { loadDataset } from "../src/dataset.ts";
import { extractWoeSpans } from "../src/extract.ts";
import { scanSpans } from "../src/scan.ts";

const docsDir = join(import.meta.dir, "..", "..", "docs");
const data = loadDataset();

function read(name: string): string {
  return readFileSync(join(docsDir, name), "utf8");
}

/** Pull the World-English blockquote out of a named passage in samples.md. */
function passageWoe(md: string, heading: string): string {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => l.startsWith(heading));
  expect(start).toBeGreaterThanOrEqual(0);
  let i = start + 1;
  for (; i < lines.length; i++) {
    if (/^\s*\*\*World English\*\*\s*$/.test(lines[i]!)) break;
    if (lines[i]!.startsWith("## ")) break; // ran into the next passage — not found
  }
  expect(/^\s*\*\*World English\*\*\s*$/.test(lines[i] ?? "")).toBe(true);
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
  return quote.join(" ").replace(/\s+/g, " ").trim();
}

describe("item 9/10 specs: World-English example columns stay clean", () => {
  // A scoped version of the full docs sweep, named per file so a regression points at the culprit.
  for (const file of ["writing.md", "style.md", "samples.md"]) {
    it(`${file} has no abolished forms in any World-English column`, () => {
      const findings = scanSpans(extractWoeSpans(join(docsDir, file), read(file)), data);
      expect(findings.map((f) => `${f.line}:${f.found}/${f.rule}`)).toEqual([]);
    });
  }
});

describe("writing.md (item 9)", () => {
  const writing = read("writing.md");

  it("defines W1–W6", () => {
    for (const key of ["W1", "W2", "W3", "W4", "W5", "W6"]) {
      expect(writing).toContain(`## Rule ${key} —`);
    }
  });

  // Regression guard for the bug caught in review: a question is bracketed by a `?` at BOTH
  // ends, not a leading `?` only. Keep writing.md consistent with grammar.md G6.
  it("W1 states questions take a ? at both ends, never leading-only", () => {
    expect(writing).toMatch(/both ends/i);
    expect(writing).not.toMatch(/not the end/i);
    expect(writing).toContain("?You like it?");
  });

  it("W1 abolishes the semicolon and keeps the colon only for a list", () => {
    expect(writing.toLowerCase()).toContain("one job only: introduce a list");
    expect(writing).toMatch(/semicolon.*abolished|abolished.*semicolon/i);
  });

  it("W2 routes politeness/indirectness to the S8/S9 pragmatics rules, not 'out of scope'", () => {
    expect(writing).toContain("style.md#rule-s8");
    expect(writing).not.toMatch(/out of scope here/i);
  });
});

describe("style.md pragmatics (item 10, S8–S9)", () => {
  const style = read("style.md");

  it("defines S8 and S9, including the summary rows", () => {
    expect(style).toContain("## Rule S8 —");
    expect(style).toContain("## Rule S9 —");
    expect(style).toMatch(/\|\s*S8 /);
    expect(style).toMatch(/\|\s*S9 /);
  });

  it("S8 fixes exactly the three politeness markers", () => {
    for (const marker of ["please", "sorry", "thank you"]) {
      expect(style.toLowerCase()).toContain(marker);
    }
    // The whole point of Option A: courtesy is a fixed marker, not graded indirectness.
    expect(style).toMatch(/not.*graded indirectness|graded indirectness/i);
  });

  it("S9 gives a template for each hard speech act", () => {
    for (const act of ["request", "refusal", "apology", "thanks", "email"]) {
      expect(style.toLowerCase()).toContain(act);
    }
    // Refusal keeps the optional Sorry softener the design settled on.
    expect(style).toMatch(/refusal[\s\S]{0,80}optional softener/i);
  });
});

describe("samples.md Passage 7 dogfoods the pragmatics rules", () => {
  const woe = passageWoe(read("samples.md"), "## Passage 7");

  it("contains every S8/S9 marker inside a running email", () => {
    for (const marker of ["Hello", "Thank you", "Sorry", "Please", "Goodbye"]) {
      expect(woe).toContain(marker);
    }
  });

  it("also exercises the deterministic morphology (see→seed, your→yous)", () => {
    expect(woe).toContain("seed");
    expect(woe).toContain("yous");
  });
});
