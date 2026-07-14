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

The documentation site lives in `site/` (Astro + Pagefind search) with its own commands —
run from that directory: `bun install`, `bun run dev`, `bun run build`. CI builds it separately.

## Architecture

- `docs/` — the language specifications (orthography, pronunciation, morphology, grammar,
  style, writing, vocabulary) + `samples.md` (the regression test).
- `resources/` — research baseline: `PAIN-POINTS.md`, `IRREGULARITIES.md`, `PRIOR-ART.md`,
  and Brehe's Grammar Anatomy (standard-English reference).
- `tools/` — Bun/TypeScript tooling: the spec linter, SE↔WoE translators, and pronunciation
  renderer. See [tools/README.md](tools/README.md) for details.
- `site/` — the public documentation site (Astro), rendering `docs/` for the web. The UI is
  multilingual (English default at bare URLs, translations under `/es/` etc.); see
  [site/README.md](site/README.md) → "Translations" before touching UI copy or adding a language.
- `skills/world-english-translator/` — a self-contained World English Agent Skill. Its
  `reference/data/*.json` is a generated copy of `tools/data/` — regenerate with
  `bun run build:skill` after a data change; never hand-edit it (edits get overwritten).

## Key conventions

- A rule is "done" only when it is statable without a hidden word list, `samples.md` stays
  consistent, and its example columns pass the linter sweep (README methodology step 5).
- The linter scans only World-English example columns and `samples.md` blockquotes — not
  arbitrary prose (which legitimately names abolished forms when explaining them).
- The forward translator applies only deterministic transforms and flags everything else —
  never guesses. See tools/README.md "Limitations (by design)".

## Changing a language rule

Whenever a rule is added, changed, or removed, walk this checklist so the whole project stays
consistent. Don't stop at the doc that owns the rule — a rule change ripples across specs,
site, tooling, and the packaged skill.

1. **Docs and their cross-references.** Update the owning spec in `docs/`, then grep the other
   `docs/` files for anything that referenced the old rule (examples, cross-links, exception
   lists). Update `docs/samples.md` — the regression test — so it reflects the new behavior.
2. **Website content.** Review `site/` for any content that restates or depends on the rule
   (the site renders `docs/`, but check hand-written pages and examples too). If a translated
   page (`src/components/pages/*Body.astro`, `src/i18n/ui.ts`) restates the rule, update every
   locale's copy — WoE example forms stay verbatim across languages. Rebuild with `bun run build`
   from `site/` to confirm it still builds.
3. **Translators, linter, and data.** Update `tools/` — the SE↔WoE translators, the linter's
   abolished-form list, and the closed-list tables in `tools/data/` (`abolished-forms.json`,
   `irregular-verbs.json`, `irregular-plurals.json`, `lexicon.json`) as the rule requires.
4. **Tests and code checks.** From `tools/`, run `bun run lint`, `bun run typecheck`, and
   `bun test`. Add or update tests for the new behavior; the linter sweep and `samples.md`
   acceptance tests must pass.
5. **Repackage the skill.** Run `bun run build:skill` from `tools/` to re-sync the generated
   data snapshot into `skills/world-english-translator/reference/data/`. If the rule's prose
   changed, also update the skill's hand-maintained files (`SKILL.md`, `reference/rules.md`,
   `reference/examples.md`) — `build:skill` only copies data, not prose.
6. **Final consistency pass.** Confirm docs, site, tools, tests, and the packaged skill all
   describe the same rule. A rule is "done" only when it is statable without a hidden word list
   and every surface above agrees (see Key conventions).
