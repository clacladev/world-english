# World English

A simpler, more regular, more predictable revision of English — designed so people anywhere
can learn the world's de facto language with far less effort. See [README.md](README.md) for
the full project overview.

## Commands

All tooling lives in `tools/` (Bun/TypeScript). Run commands from that directory:

```sh
bun install          # once
bun run lint         # sweep docs/ for abolished forms in World-English columns
bun run typecheck    # tsc --noEmit
bun test             # unit + acceptance tests (all pass except one environment-conditional skip
                     #  — the espeak-ng audio test, skipped when espeak-ng isn't on PATH)
```

The pronunciation tool's `--audio` flag requires `espeak-ng` on PATH (external dependency).

## Architecture

- `docs/` — the language specifications (orthography, pronunciation, morphology, grammar,
  style, writing, vocabulary) + `samples.md` (the regression test) + `to-do.md` (backlog).
- `resources/` — research baseline: `PAIN-POINTS.md`, `IRREGULARITIES.md`, `PRIOR-ART.md`,
  and Brehe's Grammar Anatomy (standard-English reference).
- `tools/` — Bun/TypeScript tooling: the spec linter, SE↔WoE translators, and pronunciation
  renderer. See [tools/README.md](tools/README.md) for details.

## Key conventions

- A rule is "done" only when it is statable without a hidden word list, `samples.md` stays
  consistent, and its example columns pass the linter sweep (README methodology step 5).
- The linter scans only World-English example columns and `samples.md` blockquotes — not
  arbitrary prose (which legitimately names abolished forms when explaining them).
- The forward translator applies only deterministic transforms and flags everything else —
  never guesses. See tools/README.md "Limitations (by design)".
