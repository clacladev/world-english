#!/usr/bin/env bun
// The World English translators (docs/to-do.md items 11–12).
//
// Default is the SE→WoE forward translator: reads standard English and writes World English,
// applying only the deterministic closed-class transforms. Anything that needs part-of-speech,
// syntax, or the core lexicon (item 8) — article drops, preposition restoration, phrasal verbs,
// zero-past verbs — is left untouched and reported to stderr as a flag, never guessed.
//
// With --reverse it runs the WoE→SE reverse translator: restores standard English from the
// coined World-English forms, flagging the lossy classes (be, collapsed possessives, verb
// past/participle) whose restoration is a canonical guess.
//
//   echo "she was here" | bun translate.ts       (SE→WoE, stdin → stdout)
//   echo "she beed here" | bun translate.ts --reverse   (WoE→SE)
//   bun translate.ts notes.txt                    (file args / globs)
//   bun translate.ts --strict                     also flag low-confidence forms (forward only)
//   bun translate.ts --json                        machine-readable { text, flags }

import { resolve } from "node:path";
import { translate, type TranslateResult } from "./src/translate.ts";
import { reverseTranslate, type ReverseResult } from "./src/reverse.ts";
import type { Finding } from "./src/scan.ts";

interface Args {
  globs: string[];
  strict: boolean;
  json: boolean;
  reverse: boolean;
}

function parseArgs(argv: string[]): Args {
  const globs: string[] = [];
  let strict = false;
  let json = false;
  let reverse = false;
  for (const arg of argv) {
    if (arg === "--strict") strict = true;
    else if (arg === "--json") json = true;
    else if (arg === "--reverse") reverse = true;
    else if (arg.startsWith("--")) throw new Error(`unknown flag: ${arg}`);
    else globs.push(arg);
  }
  return { globs, strict, json, reverse };
}

async function resolveFiles(globs: string[]): Promise<string[]> {
  const files: string[] = [];
  for (const pattern of globs) {
    if (await Bun.file(pattern).exists()) {
      files.push(resolve(pattern));
      continue;
    }
    const g = new Bun.Glob(pattern);
    for await (const f of g.scan({ absolute: true })) files.push(f);
  }
  if (files.length === 0) throw new Error(`no files matched: ${globs.join(", ")}`);
  return [...new Set(files)].sort();
}

/** Print the forward flags the translator declined to apply, mirroring the linter's report. */
function reportForwardFlags(flags: Finding[]): void {
  if (flags.length === 0) return;
  console.error(`\n⚑ ${flags.length} form(s) not translated (needs POS / syntax / lexicon):`);
  for (const f of flags) {
    const tag = f.confidence === "low" ? " (low)" : "";
    console.error(
      `  ${f.file}:${f.line}  "${f.found}" → "${f.expected}"  [${f.class}/${f.rule}]${tag}`,
    );
  }
}

/** Print the reverse flags: lossy restorations where `restored` is a canonical guess. */
function reportReverseFlags(flags: ReverseResult["flags"]): void {
  if (flags.length === 0) return;
  console.error(`\n⚑ ${flags.length} ambiguous restoration(s) (canonical guess — see note):`);
  for (const f of flags) {
    console.error(
      `  ${f.file}:${f.line}  "${f.found}" → "${f.restored}"  [${f.class}/${f.rule}] — ${f.note}`,
    );
  }
}

async function main(): Promise<void> {
  const args = parseArgs(Bun.argv.slice(2));

  const inputs: { file: string; text: string }[] = [];
  if (args.globs.length === 0) {
    inputs.push({ file: "<stdin>", text: await Bun.stdin.text() });
  } else {
    for (const file of await resolveFiles(args.globs)) {
      inputs.push({ file, text: await Bun.file(file).text() });
    }
  }

  const results: (TranslateResult | ReverseResult)[] = inputs.map((i) =>
    args.reverse
      ? reverseTranslate(i.text, { file: i.file })
      : translate(i.text, { strict: args.strict, file: i.file }),
  );

  if (args.json) {
    const payload = results.map((r, i) => ({ file: inputs[i]!.file, ...r }));
    console.log(JSON.stringify(inputs.length === 1 ? payload[0] : payload, null, 2));
    return;
  }

  for (const r of results) process.stdout.write(r.text);
  if (args.reverse) {
    reportReverseFlags(results.flatMap((r) => (r as ReverseResult).flags));
  } else {
    reportForwardFlags(results.flatMap((r) => (r as TranslateResult).flags));
  }
}

try {
  await main();
} catch (err) {
  console.error(`translate: ${err instanceof Error ? err.message : err}`);
  process.exit(2);
}
