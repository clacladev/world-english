import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { loadDataset } from "../src/dataset.ts";
import { extractWoeSpans } from "../src/extract.ts";
import { scanSpans } from "../src/scan.ts";

const docsDir = join(import.meta.dir, "..", "..", "docs");
const data = loadDataset();

async function findingsForDocs(strict = false) {
  const g = new Bun.Glob("**/*.md");
  const findings = [];
  for await (const file of g.scan({ cwd: docsDir, absolute: true })) {
    const content = await Bun.file(file).text();
    findings.push(...scanSpans(extractWoeSpans(file, content), data, { strict }));
  }
  return findings;
}

describe("acceptance: real specs", () => {
  it("has no abolished forms in any World-English example column (default sweep)", async () => {
    const findings = await findingsForDocs(false);
    // A helpful message if this ever regresses.
    const summary = findings.map((f) => `${f.file.split("/docs/")[1]}:${f.line} ${f.found}`);
    expect(summary).toEqual([]);
  });

  it("regression proof: a reintroduced bug is caught", async () => {
    // Simulate a point-4 bug landing back in a World-English column.
    const bug = [
      "| Standard English | World English |",
      "| --- | --- |",
      "| was / were | **was** |", // should be **beed**
    ].join("\n");
    const findings = scanSpans(extractWoeSpans("docs/morphology.md", bug), data);
    expect(findings.map((f) => `${f.found}/${f.class}/${f.rule}`)).toContain("was/be/M2");
  });
});
