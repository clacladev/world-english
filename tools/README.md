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
surface-form substitutions, now including the core lexicon's (item 8) drop verbs and phrasal
verbs — and **flags** (never guesses) everything that still needs part-of-speech or syntax.

The linter's dataset is the single-word forward map: `loadDataset().words` is keyed by the
standard form, and each entry's `.woe` is its World-English replacement. Multi-word transforms
(dropped prepositions, phrasal verbs) come from a separate builder,
`buildPhraseTransforms()` in [`src/core-lexicon.ts`](src/core-lexicon.ts), because they need
per-inflection generation (`gave up` → `quitted`) the single-word map doesn't do. The translator
runs a greedy, longest-first phrase pass per line before the single-word substitution pass; the
scanner (`src/scan.ts`) still produces the flag list.

### Run

```sh
echo "she was here" | bun run translate        # stdin → stdout
bun run translate notes.txt                     # file args / globs
bun run translate --strict                       # also flag low-confidence / POS-dependent forms
bun run translate --json                         # machine-readable { text, flags }
```

Translated text goes to stdout; the forms it declined to convert go to stderr.

### What it translates vs. flags

The split is the dataset's own `confidence` line (the same one the linter trusts), plus the
lexicon's per-entry `forward` mode:

- **Translated** — every `high`-confidence, single-word entry with a clean single-form
  replacement: `be` (M2), British/silent-letter/`ough` spellings (O1/O2/O5), pronouns
  (G4/G12), suppletive comparatives (M5), and the **non-homograph** irregular verbs and plurals
  (M1/M4, e.g. `went`→`goed`, `children`→`childs` — unambiguous surface forms). Casing and
  surrounding punctuation are preserved (`My`→`Mes`, `THROUGH`→`THRU`). Also translated:
  **dropped prepositions (G3)** and **phrasal verbs (S2)** from the core lexicon, inflected forms
  included — `listens to`→`listens`, `gave up`→`quitted`, `finds out`→`learns`.
- **Flagged, not translated** — article drop (G2), third-person `-s` (M3), do-support (G6),
  modals (G7), relativizers (G11), open-decision comparatives, and homographs (`ground`, `mine`,
  `well`) — all need part-of-speech or syntax the tool doesn't have. One lexicon entry is
  deliberately withheld too: `wait for`, tagged `forward: "flag"` in `lexicon.json` because its
  `for` competes with the duration `for` of S5 (the unresolved item-16 test) — auto-dropping it
  risks mistranslating *"wait for three minutes."* High-confidence flags (dropped-prep, and any
  low-confidence lexicon entry) show by default; the low-confidence classes are advisory and only
  shown under `--strict`.

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
- **G3 dropped prepositions restore the same way** — a second per-line pass (after word-level
  restoration) checks whether a restored token is a core-lexicon drop verb (`listen`, `wait`,
  `depend`, `look`, and the rest of the sweep's 35); if the next word isn't stoplisted, it
  inserts the verb's canonical preposition and **always flags it**, since the drop is lossy and
  nothing proves the object reading was meant. The stoplist (prepositions, conjunctions, common
  place/time/degree adverbs, `-ly` words) is what keeps a duration phrase like *"wait for three
  minutes"* or *"looked under the sofa"* from getting a second preposition inserted.
- **Valid standard English is left untouched** — WoE mandates American spelling, so `color` /
  `center` are standard as-is (not reversed to British), and `who` (which forward-maps from
  `whom`) is a valid word. **Phrasal verbs are not restored** — `quit`, `delay`, `seek`, and the
  rest of the core lexicon's plain replacements are themselves valid standard English, so there
  is nothing to reverse.

The proof lives in `test/reverse.test.ts`: it reverse-translates the `samples.md` World-English
passages and asserts every losslessly-reversible form comes back to its standard original —
Passage 4 round-trips to its exact Standard-English source.

## The core lexicon (item 8)

G3 (dropped prepositions), S2 (phrasal verbs), S3 (preferred sense), and S6 (regular
collocations) each quote a per-word list to do their job. That list is
[`data/lexicon.json`](data/lexicon.json), loaded and built into the shapes the rest of the
tooling consumes by [`src/core-lexicon.ts`](src/core-lexicon.ts). Six arrays: `droppedPreps` and
`phrasalVerbs` are **machine-actionable** (the translators read them); `sensePreferences`,
`collocations`, `falseFriends`, and `registerDefaults` are **doc-only** — applying them needs
word-sense disambiguation the tools don't have, so they're recorded for the human record only.
The full schema is documented in the file's own `_comment` and in
[`../docs/vocabulary.md`](../docs/vocabulary.md), which is the schema doc, representative
highlights, and a test-checked coverage statement (`test/vocabulary.test.ts` asserts the doc
against the data).

`core-lexicon.ts` exports:

- `loadCoreLexicon()` — the raw data.
- `toAbolishedEntries()` — merges `droppedPreps` (`ruling: "drop"`) and `phrasalVerbs` into the
  abolished-forms shape `dataset.ts` consumes, so the linter and both translators see them the
  same way as every other abolished form.
- `buildPhraseTransforms()` — the forward translator's multi-word transforms: every inflected
  surface form (base, 3sg, `-ing`, past, participle) of a `drop`-ruling verb or phrasal verb,
  sorted longest-first for greedy matching.
- `buildPrepRestorations()` — the reverse translator's verb→canonical-preposition map.

### Sweep methodology

[`data/ngsl.json`](data/ngsl.json) vendors the [New General Service List](https://www.newgeneralservicelist.com/)
1.2 (Browne, Culligan & Phillips, 2013; CC BY 4.0) — rank + headword only, 2,809 entries, fetched
from the project's own `NGSL_12_stats.csv` download. `lexicon.json`'s sweep walks it rank
1→2,809 in six ~500-word bands, adding a row only when a word has something non-default to say
(a fully regular word like *table* needs none). Per band: `bun run lint && bun test && bun run
typecheck` before moving on, since a new drop verb or phrasal can collide with existing spec or
`samples.md` text (fixed by re-ruling, a `confidence: "low"` demotion, or — sparingly — an
`allowlist.json` entry for a genuine coincidental match).

The sweep is deliberately conservative, not exhaustive — a verb+preposition or phrasal-verb
candidate only earns a `drop`/`phrasalVerbs` row when it passes a real collision check against
the verb's *other* senses, not just "this pairing exists." Concretely excluded on these grounds:

- **Structural role reversal** — `worry about` isn't a drop verb because `worry` already has a
  transitive sense with the roles swapped (*the news worries me* — subject and object trade
  places relative to *worry about X*), which the drop would collide with.
  `recover`/`accuse`/`distinguish`/`derive` have a similar shape (already-transitive senses with
  a different object role) and are left unlisted for the same reason.
- **Multi-preposition, meaning-correlated verbs** — `agree` (with a person, to a proposal, on a
  plan), `compare` (to = liken, with = contrast), and `correspond` (to = match, with =
  correspond by letter) get a `keep` ruling instead of `drop`: the choice of preposition tracks a
  real semantic distinction, so it isn't arbitrary.
- **Dangerously polysemous phrasals** — `pick up` (answer a phone / learn a skill / retrieve an
  object / accelerate) has too many unrelated senses for one machine replacement to be safe, so
  it isn't in `phrasalVerbs` at all; its senses are documented instead, doc-only, in
  `sensePreferences`.
- **Already-regular verbs** — a verb already commonly transitive without its preposition in
  standard usage (`escape prison`, `protest the decision`) gets a `drop` row for
  reversibility/documentation, but needed no forward-behavior change to begin with.

This is a first full pass over the spine, not a final one: only the clear cases earned a row.
Coverage grows opportunistically from here — a new collision found in review, a gap surfaced by
dogfooding, or simply revisiting a skipped verb with more care.

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
2. **`src/dataset.ts`** builds the abolished-forms index from `data/`, merging in the core
   lexicon's dropped-prep and phrasal-verb rows via `src/core-lexicon.ts`.
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
- **`abolished-forms.json`** — directly-authored `abolished → woe` pairs for every other
  directly-authored class (`be`, comparatives, British spellings, silent letters, `ough`,
  pronouns, articles, and the POS-dependent classes). Phrasal verbs and dropped prepositions live
  in `lexicon.json` instead (see [above](#the-core-lexicon-item-8)).
- **`lexicon.json`** — the core lexicon (item 8): dropped prepositions (G3), phrasal verbs (S2),
  and the doc-only sense/collocation/false-friend/register arrays (S3/S6 and the advanced
  hazards). Source of truth for `../docs/vocabulary.md`.
- **`ngsl.json`** — the NGSL 1.2 frequency spine `lexicon.json`'s sweep walks; rank + headword
  only, no linguistic judgment of its own.
- **`allowlist.json`** — suppresses legitimate matches (homographs like *saw* the tool; a
  coincidental bigram like *"health care for years"* colliding with the phrasal verb *care for*;
  an intentional mention of a standard form). Keep it small; always give a `reason`.

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
- **The forward translator is deterministic-only.** It does not tag part-of-speech or parse
  syntax, so it leaves — and flags — article drops, third-person `-s`, and zero-past verbs
  (`cost`→`costed`, undetectable without POS). It also can only convert forms the dataset or
  lexicon actually carry: a standard irregular the dataset is missing (e.g. `said`, not yet in
  `irregular-verbs.json`), or a phrasal/dropped-prep pair the sweep hasn't reached, passes through
  untouched. `wait for` is a deliberate exception even though it's in the lexicon — see
  [above](#the-core-lexicon-item-8).
- **The reverse translator restores what the dataset and lexicon carry, and only that.** A
  dropped preposition not in the lexicon's `droppedPreps`, or a form outside the dataset (e.g.
  `said`), is left untouched. Phrasal verbs are never restored (their plain replacements are
  themselves valid standard English). The deliberate collapses (`be`, possessives, verb
  past/participle, and G3's re-inserted prepositions) are restored to a canonical default and
  flagged, never silently guessed.
- **The core lexicon is a first sweep, not exhaustive.** Only verb+preposition and phrasal
  pairings that passed a real collision check earned a row (see
  [the sweep methodology](#the-core-lexicon-item-8)); many plausible candidates were deliberately
  left out because they were too risky to auto-transform, not because they don't exist.
- **The pronunciation lexicon is a seed.** It carries only the ~40 gold words in
  `pronunciation.md`; any other word is emitted verbatim and flagged, not guessed. It grows
  frequency-first, mirroring `vocabulary.md`'s seed convention.
- **Audio is deferred.** `pronounce.ts` ships respelling + IPA only. Spoken audio needs an
  external TTS (`espeak-ng`, which takes IPA); `--audio` prints an install hint and exits
  non-zero until it is wired up.
