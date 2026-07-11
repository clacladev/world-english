// Shared samples.md parser for the gold round-trip tests (#101: previously copy-pasted verbatim
// in both translate.test.ts and reverse.test.ts). Parses the alternating **Standard English** /
// **World English** blockquote pairs out of docs/samples.md.

import { join } from "node:path";
import { readFileSync } from "node:fs";

export interface SamplePair {
  se: string;
  woe: string;
}

export function samplePairs(): SamplePair[] {
  const md = readFileSync(join(import.meta.dir, "..", "..", "..", "docs", "samples.md"), "utf8");
  const lines = md.split("\n");
  const blocks: { kind: "se" | "woe"; text: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^\s*\*\*(Standard|World) English\*\*\s*$/.exec(lines[i]!);
    if (!m) continue;
    const kind = m[1] === "Standard" ? "se" : "woe";
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
    blocks.push({ kind, text: quote.join(" ") });
  }
  const pairs: SamplePair[] = [];
  for (let i = 0; i + 1 < blocks.length; i += 2) {
    pairs.push({ se: blocks[i]!.text, woe: blocks[i + 1]!.text });
  }
  return pairs;
}
