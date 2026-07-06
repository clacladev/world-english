# World English tools

Tooling for the World English project. Built with [Bun](https://bun.sh) (TypeScript, no build
step). This is the project's first code; the translators live here too as they are built.

## The linter (`to-do.md` item 11)

`lint.ts` sweeps the **World-English example columns** of the specs in [`../docs`](../docs) —
plus the `**World English**` blockquote passages in [`samples.md`](../docs/samples.md) — and
flags any **abolished** standard-English form that leaked into World-English text: an
irregular verb (*saw*, *gave*), a `be` form (*was*, *are*), an irregular plural (*children*),
a British spelling (*colour*), a suppletive comparative (*better*), a phrasal verb (*give
up*), and so on.

This is the class of mistake the point-4 critique found by hand — a standard form sitting in
a World-English column — and the reason the linter was pulled forward to Priority 1: per the
[README methodology](../README.md#methodology), a rule is only "done" when *its example
columns pass this sweep*. It is meant to run in CI so a spec edit that reintroduces an
abolished form fails the build.

### Run

```sh
bun install          # once
bun run lint         # sweep ../docs — exits non-zero if anything is found
bun run lint --strict  # also report low-confidence / POS-dependent classes (advisory)
bun run lint --json    # machine-readable
bun run lint '../docs/grammar.md'   # specific files/globs

bun test             # unit + acceptance tests
bun run typecheck    # tsc --noEmit
```

## How it works

1. **`src/extract.ts`** pulls World-English text out of each markdown file. It reads only the
   column whose header contains **"World English"** (skipping `World English rule` summary
   columns and pronunciation respelling/IPA tables, which deliberately hold standard words),
   and the `**World English**` sample blockquotes. Parenthetical editorial annotations in
   table cells — `(definite, singular)`, `(kept — …)`, markdown link anchors — are stripped,
   since they are ordinary English commentary, not the World-English form.
2. **`src/dataset.ts`** builds the abolished-forms index from `data/`.
3. **`src/scan.ts`** tokenizes each span and matches unigrams + multi-word phrases against the
   index, honouring `data/allowlist.json` and the confidence gate.

## The data (`data/`)

The specs give representative examples but no machine-readable list of abolished forms, so the
dataset is authored here. It is also the seed for the deferred **reverse translator** (item
12), which restores standard forms from the same pairs.

- **`irregular-verbs.json`** — `{ base, past, pp }` triples (M1). The flagged forms are `past`
  and `pp`; the suggested World-English form is computed from `base` by
  `regularizeVerbPast()`. Zero-past verbs (*cost*, *put*, *read*) are omitted — their past is
  spelled like the valid base, so they can't be detected without part-of-speech context.
- **`irregular-plurals.json`** — `{ singular, plural }` pairs (M4); WoE form computed by
  `regularizePlural()`. Zero-plurals (*sheep*) omitted for the same reason.
- **`abolished-forms.json`** — directly-authored `abolished → woe` pairs for every other class
  (`be`, comparatives, British spellings, silent letters, `ough`, pronouns, articles, phrasal
  verbs, dropped prepositions, and the POS-dependent classes).
- **`allowlist.json`** — suppresses legitimate matches (homographs like *saw* the tool; an
  intentional mention of a standard form). Keep it small; always give a `reason`.

### Confidence

Every entry is `high` or `low`. **Low** covers forms that are POS-dependent (`third-person-s`,
`do-support`, `modal`, `relativizer`, `article`), ride on an open design decision
(`more`/`most`/`less`/`least`, per [`to-do.md` item 17](../docs/to-do.md)), or are homographs
of a valid everyday word (the noun *ground*, the adverb *well*). Low entries are **off by
default** and only reported under `--strict`, so the default gate stays high-precision.

### Adding an entry when a spec changes

Add the standard form to the matching `data/` file (a triple/pair for verbs/plurals, an entry
elsewhere), tagging `"homograph": true` or `"confidence": "low"` if it collides with a valid
word. Re-run `bun test`.

## Limitations (by design)

- **Detection needs a closed spelling.** Zero-past verbs and zero-plurals whose form equals a
  valid World-English word are not detectable without parsing, and are omitted.
- **Only World-English *columns* and sample blockquotes are scanned**, not arbitrary prose
  (which legitimately names abolished forms when explaining them). `--strict` additionally
  reads bolded forms in `**Examples.**` prose.
- **This is the linter half of item 11.** The SE→WoE and WoE→SE translators are deferred (item
  11 remainder, item 12); the dataset here is their foundation.
