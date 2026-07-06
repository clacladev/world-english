#!/usr/bin/env bun
// World English spec linter (docs/to-do.md item 11).
//
// Sweeps the World-English example columns of the specs (and the samples.md regression
// passages) and flags any abolished standard-English form that leaked into World-English
// text — the class of mistake the point-4 critique found by hand (saw/gave/was/are sitting
// in a World-English column). Exits non-zero if anything is found, so it can gate CI.
//
//   bun lint.ts [globs...]     (default: ../docs/**/*.md, relative to this file)
//   bun lint.ts --strict       also report low-confidence / POS-dependent classes
//   bun lint.ts --json         machine-readable output

import { join, resolve } from "node:path";
import { loadDataset } from "./src/dataset.ts";
import { extractWoeSpans } from "./src/extract.ts";
import { scanSpans, type Finding } from "./src/scan.ts";

interface Args {
  globs: string[];
  strict: boolean;
  json: boolean;
}

function parseArgs(argv: string[]): Args {
  const globs: string[] = [];
  let strict = false;
  let json = false;
  for (const arg of argv) {
    if (arg === "--strict") strict = true;
    else if (arg === "--json") json = true;
    else if (arg.startsWith("--")) throw new Error(`unknown flag: ${arg}`);
    else globs.push(arg);
  }
  return { globs, strict, json };
}

async function resolveFiles(globs: string[]): Promise<string[]> {
  const docsDir = join(import.meta.dir, "..", "docs");
  if (globs.length === 0) {
    const g = new Bun.Glob("**/*.md");
    return (await Array.fromAsync(g.scan({ cwd: docsDir, absolute: true }))).sort();
  }
  const files: string[] = [];
  for (const pattern of globs) {
    // An explicit path (relative or absolute, possibly outside cwd) is used directly;
    // Bun.Glob only scans within its cwd, so it can't resolve those on its own.
    if (await Bun.file(pattern).exists()) {
      files.push(resolve(pattern));
      continue;
    }
    const g = new Bun.Glob(pattern);
    for await (const f of g.scan({ absolute: true })) files.push(f);
  }
  if (files.length === 0) {
    throw new Error(`no files matched: ${globs.join(", ")}`);
  }
  return [...new Set(files)].sort();
}

/** Repo-relative-ish path for display (drops everything up to and including the last "/copenhagen-v3/" or "/tools/../"). */
function displayPath(abs: string): string {
  const marker = "/docs/";
  const idx = abs.lastIndexOf(marker);
  return idx === -1 ? abs : "docs/" + abs.slice(idx + marker.length);
}

function report(findings: Finding[], json: boolean): void {
  if (json) {
    console.log(JSON.stringify(findings, null, 2));
    return;
  }
  if (findings.length === 0) {
    console.log("✓ No abolished forms found in any World-English example column.");
    return;
  }
  let currentFile = "";
  for (const f of findings) {
    const path = displayPath(f.file);
    if (path !== currentFile) {
      currentFile = path;
      console.log(`\n${path}`);
    }
    const tag = f.confidence === "low" ? " (low)" : "";
    console.log(
      `  ${String(f.line).padStart(4)}:  "${f.found}" → "${f.expected}"  [${f.class}/${f.rule}]${tag}`,
    );
  }
  const high = findings.filter((f) => f.confidence === "high").length;
  const low = findings.length - high;
  console.log(
    `\n✗ ${findings.length} finding(s): ${high} high-confidence${low ? `, ${low} low-confidence` : ""}.`,
  );
}

async function main(): Promise<void> {
  const args = parseArgs(Bun.argv.slice(2));
  const data = loadDataset();
  const files = await resolveFiles(args.globs);

  const findings: Finding[] = [];
  for (const file of files) {
    const content = await Bun.file(file).text();
    const spans = extractWoeSpans(file, content);
    findings.push(...scanSpans(spans, data, { strict: args.strict }));
  }
  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

  report(findings, args.json);
  process.exit(findings.length > 0 ? 1 : 0);
}

try {
  await main();
} catch (err) {
  console.error(`lint: ${err instanceof Error ? err.message : err}`);
  process.exit(2);
}
