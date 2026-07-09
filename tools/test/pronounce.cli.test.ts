import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { espeakAvailable } from "../src/espeak.ts";

const pronounceTs = join(import.meta.dir, "..", "pronounce.ts");
const hasEspeak = await espeakAvailable();

async function runPronounce(args: string[], input = "") {
  const proc = Bun.spawn(["bun", pronounceTs, ...args], {
    stdin: new Blob([input]),
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { stdout, stderr, exitCode };
}

const SENTENCE = "The doctor gived the young child book about birds.";

describe("pronounce cli", () => {
  it("renders stdin to respelling", async () => {
    const { stdout, exitCode } = await runPronounce([], SENTENCE);
    expect(exitCode).toBe(0);
    expect(stdout).toBe("dhuh DOK-ter GIVD dhuh YUNG CHYLD BUUK uh-BOWT BERDZ.");
  });

  it("renders IPA under --ipa", async () => {
    const { stdout } = await runPronounce(["--ipa"], SENTENCE);
    expect(stdout).toBe("ðə ˈdɑktɚ ɡɪvd ðə jʌŋ tʃaɪld bʊk əˈbaʊt bɝdz.");
  });

  it("emits { file, text, flags } with --json", async () => {
    const { stdout } = await runPronounce(["--json"], "lead");
    const result = JSON.parse(stdout);
    expect(result.text).toBe("LED");
    expect(result.flags[0]).toMatchObject({ word: "lead", kind: "homograph" });
  });

  // --audio drives espeak-ng, which may not be installed (e.g. in CI). Test the path that matches
  // this machine: synthesis when the binary is present, the install hint when it is not.
  it.skipIf(!hasEspeak)("--audio writes a valid WAV when espeak-ng is present", async () => {
    const out = join(import.meta.dir, "cli-audio.wav");
    try {
      const { stderr, exitCode } = await runPronounce(["--audio", "-o", out], SENTENCE);
      expect(exitCode).toBe(0);
      expect(stderr).toContain("wrote");
      const bytes = new Uint8Array(await Bun.file(out).arrayBuffer());
      expect(bytes.length).toBeGreaterThan(44); // more than a bare WAV header
      expect(String.fromCharCode(...bytes.slice(0, 4))).toBe("RIFF");
    } finally {
      await Bun.file(out).unlink().catch(() => {});
    }
  });

  it.skipIf(hasEspeak)("--audio exits non-zero with an install hint when espeak-ng is absent", async () => {
    const { stderr, exitCode } = await runPronounce(["--audio"], SENTENCE);
    expect(exitCode).toBe(2);
    expect(stderr).toContain("espeak-ng");
  });

  it("--strict validates the lexicon and stays green when only reductions diverge", async () => {
    const { exitCode } = await runPronounce(["--strict"], SENTENCE);
    expect(exitCode).toBe(0);
  });
});
