import { describe, expect, it } from "bun:test";
import { join } from "node:path";

const lintTs = join(import.meta.dir, "..", "lint.ts");
const fixture = join(import.meta.dir, "fixtures", "planted-bug.md");

async function runLint(args: string[]) {
  const proc = Bun.spawn(["bun", lintTs, ...args], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { stdout, stderr, exitCode };
}

describe("cli", () => {
  it("lints an explicit file path and exits 1 on findings", async () => {
    const { stdout, exitCode } = await runLint([fixture]);
    expect(exitCode).toBe(1);
    expect(stdout).toContain('"saw" → "seed"');
    expect(stdout).toContain('"was" → "beed"');
    expect(stdout).toContain('"colour" → "color"');
  });

  it("emits JSON with --json", async () => {
    const { stdout } = await runLint([fixture, "--json"]);
    const findings = JSON.parse(stdout);
    expect(findings.map((f: { found: string }) => f.found)).toContain("children");
  });

  it("errors (exit 2) on a path that matches nothing", async () => {
    const { stderr, exitCode } = await runLint([join(import.meta.dir, "nope.md")]);
    expect(exitCode).toBe(2);
    expect(stderr).toContain("no files matched");
  });
});
