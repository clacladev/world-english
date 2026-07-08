# World English tools

Tooling for the World English project. Built with [Bun](https://bun.sh) (TypeScript, no build
step). This is the project's first code; the translators live here too as they are built.

So far it holds the **linter** (`lint.ts`) and both **translators** (`translate.ts`, with
`--reverse` for the WoE→SE direction). All three share the abolished-forms dataset in
[`data/`](data).

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

## The forward translator (`to-do.md` item 11, second half)

`translate.ts` turns standard English into World English. Per the project's staged plan it
does only the transforms it can apply **deterministically** — a closed set of unambiguous
surface-form substitutions — and **flags** (never guesses) everything that needs
part-of-speech, syntax, or the core lexicon (item 8).

The linter's dataset *is* the forward map: `loadDataset().words` is keyed by the standard form,
and each entry's `.woe` is its World-English replacement. So the translator reuses that map for
substitution and reuses the scanner (`src/scan.ts`) to produce the flag list.

### Run

```sh
echo "she was here" | bun run translate        # stdin → stdout
bun run translate notes.txt                     # file args / globs
bun run translate --strict                       # also flag low-confidence / POS-dependent forms
bun run translate --json                         # machine-readable { text, flags }
```

Translated text goes to stdout; the forms it declined to convert go to stderr.

### What it translates vs. flags

The split is the dataset's own `confidence` line (the same one the linter trusts):

- **Translated** — every `high`-confidence, single-word entry with a clean single-form
  replacement: `be` (M2), British/silent-letter/`ough` spellings (O1/O2/O5), pronouns
  (G4/G12), suppletive comparatives (M5), and the **non-homograph** irregular verbs and plurals
  (M1/M4, e.g. `went`→`goed`, `children`→`childs` — unambiguous surface forms). Casing and
  surrounding punctuation are preserved (`My`→`Mes`, `THROUGH`→`THRU`).
- **Flagged, not translated** — article drop (G2), third-person `-s` (M3), do-support (G6),
  modals (G7), relativizers (G11), open-decision comparatives, homographs (`ground`, `mine`,
  `well`), and the multi-word / lexicon-dependent classes: phrasal verbs (S2) and dropped
  prepositions (G3). High-confidence flags (phrasal / dropped-prep) show by default; the
  low-confidence classes are advisory and only shown under `--strict`.

The four `../docs/samples.md` passages are the translator's gold regression corpus:
`test/translate.test.ts` translates each Standard-English passage and asserts it produces every
handled World-English form the human gold contains.

## The reverse translator (`to-do.md` item 12) — the lossless-mapping proof

`translate.ts --reverse` (logic in `src/reverse.ts`) goes the other way: World English back to
standard English, by inverting the same dataset. It exists to *prove* the mapping is
reversible — and to make visible exactly where it is not.

```sh
echo "she beed here" | bun run translate --reverse
bun run translate --reverse notes.txt
bun run translate --reverse --json
```

- **Lossless classes restore uniquely, no flag** — non-homograph irregular verbs (`goed`→`went`
  as the past), plurals (`childs`→`children`), comparatives (`gooder`→`better`), silent letters
  (`det`→`debt`), `ough` (`thru`→`through`), and the unique pronouns/reflexives (`hims`→`his`,
  `themselfs`→`themselves`).
- **Lossy classes restore a canonical default and flag it** — the forms that collapsed a
  distinction going forward can't be uniquely restored, so the tool picks a canonical form and
  reports the guess: `be`→`is`, `beed`→`was`, `mes`→`my`, `uss`→`our`, `yous`→`your`,
  `thems`→`their`, and every irregular verb whose `-ed` past covers both the standard past and
  its participle (`seed` → `saw`, flagged "past/participle collapsed").
- **Valid standard English is left untouched** — WoE mandates American spelling, so `color` /
  `center` are standard as-is (not reversed to British), and `who` (which forward-maps from
  `whom`) is a valid word. Phrasal verbs and dropped prepositions are not restored either: the
  preposition needs the core lexicon (item 8), and the WoE form (`wait`, `listen`) is a valid
  word.

The proof lives in `test/reverse.test.ts`: it reverse-translates the `samples.md` World-English
passages and asserts every losslessly-reversible form comes back to its standard original —
Passage 4 round-trips to its exact Standard-English source.

## The pronunciation tool (`to-do.md` item 13)

`pronounce.ts` renders World English text to its learner **respelling** (default) or **IPA**
(`--ipa`), following rules P1–P7 in [`pronunciation.md`](../docs/pronunciation.md).

```sh
echo "The doctor gived the young child book about birds." | bun run pronounce
#   → dhuh DOK-ter GIVD dhuh YUNG CHYLD BUUK uh-BOWT BERDZ.
echo "The doctor gived the young child book about birds." | bun run pronounce --ipa
#   → ðə ˈdɑktɚ ɡɪvd ðə jʌŋ tʃaɪld bʊk əˈbaʊt bɝdz.
bun run pronounce notes.txt        # file args / globs
bun run pronounce --json           # machine-readable { text, flags }
bun run pronounce --strict         # also validate the lexicon (see below); non-zero on mismatch
```

Rendered text goes to stdout; the words it couldn't resolve go to stderr.

### Lookup + a deterministic engine

WoE base spelling does **not** encode pronunciation (`knight → NYT` can't be computed from the
letters), so **word → respelling is a lookup** in an authored lexicon (`data/pronunciation.json`,
built by `src/lexicon.ts`). But **respelling → IPA *is* a fixed rule** — the P2/P3 tables are a
strict one-sound-per-spelling map — so it is a deterministic engine (`src/respell.ts`). This is the
same *deterministic-where-the-rule-allows, authored-where-it-doesn't* split the translators use.

The engine derives the **careful / syllable-timed** IPA (every syllable at full written value),
which is itself spec-legal under P6. The lexicon ships the **authored** IPA (matching the spec's
gold reading verbatim), because some words carry lexical vowel reduction the respelling can't
express — `computer` is `kom-PYOO-ter` but `/kəmˈpjutɚ/` (unstressed `o` → `/ə/`). `--strict` runs
`src/check.ts`, which compares the two: a schwa-only reduction is **advisory**, anything else is a
real authoring bug and exits non-zero.

### Flags, never guesses

- **Unknown word** — emitted verbatim and flagged (`no respelling entry`); never guessed.
- **Homograph** (the P-spec residue — `lead` = LED (metal) / LEED (guide), `read` = REED / RED) —
  emits the first reading and flags the alternatives, so context can select, exactly as the
  reverse translator flags its canonical guesses.

The worked examples in `pronunciation.md` are the gold corpus: `test/pronounce.test.ts` renders the
spec's full sentence to its exact gold respelling and IPA, and `test/respell.test.ts` asserts the
engine reproduces the authored IPA of every non-reducing lexicon entry.

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
- **The forward translator is deterministic-only.** It does not tag part-of-speech or read the
  core lexicon (item 8), so it leaves — and flags — article drops, preposition restoration,
  phrasal verbs, and zero-past verbs (`cost`→`costed`, undetectable without POS). It also can
  only convert forms the dataset actually carries: a standard irregular the dataset is missing
  (e.g. `said`, not yet in `irregular-verbs.json`) passes through untouched.
- **The reverse translator restores what the dataset carries, and only that.** Lexicon-dependent
  restorations (dropped prepositions, phrasal verbs) and forms outside the dataset (e.g. `said`)
  are left untouched; the deliberate collapses (`be`, possessives, verb past/participle) are
  restored to a canonical default and flagged, never silently guessed.
- **The pronunciation lexicon is a seed.** It carries only the ~40 gold words in
  `pronunciation.md`; any other word is emitted verbatim and flagged, not guessed. It grows
  frequency-first, mirroring `vocabulary.md`'s seed convention.
- **Audio is deferred.** `pronounce.ts` ships respelling + IPA only. Spoken audio needs an
  external TTS (`espeak-ng`, which takes IPA); `--audio` prints an install hint and exits
  non-zero until it is wired up.
