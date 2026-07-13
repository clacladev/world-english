#!/usr/bin/env bun
// The World English pronunciation tool (rules P1–P7 in
// docs/pronunciation.md).
//
// Renders World English text to its learner respelling (default) or IPA (--ipa) by looking each
// word up in the authored seed lexicon. Nothing is guessed: an unknown word is emitted verbatim
// and flagged; a homograph (lead = LED/LEED) emits its first entry and flags the alternatives.
// --strict additionally validates the lexicon (derived-vs-authored IPA) and exits non-zero on a
// real mismatch. --audio speaks the text to a WAV file via espeak-ng (see src/espeak.ts): it feeds
// espeak *our* phonemes, so the audio matches the respelling, and falls back to a helpful install
// hint (exit 2) when espeak-ng is not on PATH.
//
//   echo "The doctor gived the young child book about birds." | bun pronounce.ts
//   echo "..." | bun pronounce.ts --ipa            respelling → IPA
//   bun pronounce.ts notes.txt                      file args / globs
//   bun pronounce.ts --json                         machine-readable [{ word, respelling, ipa, found }]
//   bun pronounce.ts --strict                       also validate the lexicon; non-zero on mismatch
//   bun pronounce.ts --audio -o hello.wav           speak to a WAV (needs espeak-ng); default pronounce.wav

import { resolve } from "node:path";
import { pronounce, type PronFlag } from "./src/pronounce.ts";
import { defaultLexicon } from "./src/lexicon.ts";
import { validateLexicon } from "./src/check.ts";
import { espeakAvailable, synthesizeToWav, ESPEAK_VOICE } from "./src/espeak.ts";

interface Args {
  globs: string[];
  ipa: boolean;
  json: boolean;
  strict: boolean;
  audio: boolean;
  /** WAV output path for --audio. */
  out: string;
  /** espeak-ng voice for --audio. */
  voice: string;
}

function parseArgs(argv: string[]): Args {
  const globs: string[] = [];
  let ipa = false;
  let json = false;
  let strict = false;
  let audio = false;
  let out = "pronounce.wav";
  let voice = ESPEAK_VOICE;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--ipa") ipa = true;
    else if (arg === "--json") json = true;
    else if (arg === "--strict") strict = true;
    else if (arg === "--audio") audio = true;
    else if (arg === "-o" || arg === "--out") {
      const value = argv[++i];
      if (value === undefined) throw new Error(`${arg} needs a file path`);
      out = value;
    } else if (arg === "--voice") {
      const value = argv[++i];
      if (value === undefined) throw new Error(`${arg} needs a voice name`);
      voice = value;
    } else if (arg.startsWith("-")) throw new Error(`unknown flag: ${arg}`);
    else globs.push(arg);
  }
  return { globs, ipa, json, strict, audio, out, voice };
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

function reportFlags(flags: PronFlag[]): void {
  if (flags.length === 0) return;
  const notFound = flags.filter((f) => f.kind === "not-found");
  const homographs = flags.filter((f) => f.kind === "homograph");
  if (notFound.length > 0) {
    console.error(`\n⚑ ${notFound.length} word(s) with no respelling entry (emitted verbatim):`);
    for (const f of notFound) console.error(`  ${f.file}:${f.line}  "${f.word}"`);
  }
  if (homographs.length > 0) {
    console.error(`\n⚑ ${homographs.length} homograph(s) (first reading emitted; context selects):`);
    for (const f of homographs) console.error(`  ${f.file}:${f.line}  "${f.word}" → ${f.detail}`);
  }
}

/** Validate the lexicon; print any divergence. Returns true if a real mismatch was found. */
function reportValidation(): boolean {
  const divergences = validateLexicon(defaultLexicon);
  if (divergences.length === 0) return false;
  const mismatches = divergences.filter((d) => d.kind === "mismatch");
  const reductions = divergences.filter((d) => d.kind === "reduction");
  if (reductions.length > 0) {
    console.error(`\nℹ ${reductions.length} lexicon entr(y/ies) with advisory vowel reduction:`);
    for (const d of reductions) {
      console.error(`  "${d.word}" ${d.respelling}: authored /${d.authored}/ vs careful /${d.derived}/`);
    }
  }
  if (mismatches.length > 0) {
    console.error(`\n✗ ${mismatches.length} lexicon entr(y/ies) whose IPA does not match its respelling:`);
    for (const d of mismatches) {
      console.error(`  "${d.word}" ${d.respelling}: authored /${d.authored}/ vs derived /${d.derived}/`);
    }
  }
  return mismatches.length > 0;
}

async function main(): Promise<void> {
  const args = parseArgs(Bun.argv.slice(2));

  // --ipa/--json render text-mode output; --audio takes over the whole run and writes a WAV
  // instead, so combining them silently did nothing useful (#102) — warn instead, regardless of
  // whether espeak-ng ends up being available.
  if (args.audio && (args.ipa || args.json)) {
    const ignored = [args.ipa && "--ipa", args.json && "--json"].filter(Boolean).join(" and ");
    console.error(`pronounce: --audio ignores ${ignored} (writing audio only, not text output).`);
  }

  // Fail fast before blocking on stdin: --audio is useless without the synthesizer.
  if (args.audio && !(await espeakAvailable())) {
    console.error(
      "pronounce: --audio needs the espeak-ng synthesizer, which is not on PATH.\n" +
        "  install it, then re-run:  apt-get install espeak-ng  ·  brew install espeak-ng",
    );
    process.exit(2);
  }

  const inputs: { file: string; text: string }[] = [];
  if (args.globs.length === 0) {
    inputs.push({ file: "<stdin>", text: await Bun.stdin.text() });
  } else {
    for (const file of await resolveFiles(args.globs)) {
      inputs.push({ file, text: await Bun.file(file).text() });
    }
  }

  if (args.audio) {
    // Speak all inputs into one WAV, feeding espeak our own phonemes (see src/espeak.ts).
    const text = inputs.map((i) => i.text).join("\n");
    const { flags } = await synthesizeToWav(text, { file: inputs[0]!.file, out: args.out, voice: args.voice });
    console.error(`pronounce: wrote ${resolve(args.out)}`);
    reportFlags(flags);
    return;
  }

  const results = inputs.map((i) => ({ file: i.file, ...pronounce(i.text, { ipa: args.ipa, file: i.file }) }));

  if (args.json) {
    console.log(JSON.stringify(inputs.length === 1 ? results[0] : results, null, 2));
  } else {
    for (const r of results) process.stdout.write(r.text);
    reportFlags(results.flatMap((r) => r.flags));
  }

  // --strict validates the lexicon and gates the exit code on a genuine mismatch.
  if (args.strict && reportValidation()) process.exit(1);
}

try {
  await main();
} catch (err) {
  console.error(`pronounce: ${err instanceof Error ? err.message : err}`);
  process.exit(2);
}
