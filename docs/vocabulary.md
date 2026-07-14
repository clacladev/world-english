# Vocabulary — The Core Lexicon

> The word list [S2](style.md#rule-s2--plain-single-sense-words) quietly depends on. S2's three
> vocabulary layers — plain verb over opaque phrasal, clearest sense over heavy polysemy, and
> regular pairing over arbitrary collocation — each quote a per-word list to do their job.
> Without it those layers are promissory notes — statable in prose, but not verifiable or
> reversible.

## Source of truth

**The data lives in [`../tools/data/lexicon.json`](../tools/data/lexicon.json), not here.** This
file is its schema documentation, a set of representative highlights, and a coverage statement —
kept honest by `tools/test/vocabulary.test.ts`, which parses the highlight tables below and the
coverage counts and asserts both against `lexicon.json` itself. If this file and the data
disagree, the data wins and the test fails.

[`../tools/src/core-lexicon.ts`](../tools/src/core-lexicon.ts) loads `lexicon.json` and builds
everything the tooling consumes from it:

- `toAbolishedEntries()` feeds the linter/translator dataset (`dataset.ts`) — phrasal-verb forms
  the same way every other abolished form is tracked.
- `buildPhraseTransforms()` feeds the [forward translator](../tools/README.md) (`translate.ts`):
  every inflected surface form of a phrasal verb, matched longest-first.

(G3 no longer drops verb prepositions — a verb keeps its standard preposition as vocabulary — so
`droppedPreps` is empty and there is no dropped-prep transform or preposition-restoration pass.)

## Schema

Six arrays. `phrasalVerbs` is **machine-actionable** (the translators read it); `droppedPreps` is
**retired** — empty, because G3 no longer drops verb prepositions (a verb keeps its standard
preposition as vocabulary); `sensePreferences`, `collocations`, `falseFriends`, and
`registerDefaults` are **doc-only** — recorded for the human record, never applied or even flagged
by tooling, because applying them needs word-sense disambiguation or judgment the tools don't have.

| Array | Rule | Actionable? | Fields |
| ----- | ---- | ----------- | ------ |
| `droppedPreps` | — (retired) | no (empty) | — |
| `phrasalVerbs` | [S2](style.md#rule-s2--plain-single-sense-words) | yes | `phrasal, plain, alternates?, separable?, rank?, note?, confidence?` |
| `sensePreferences` | [S2](style.md#rule-s2--plain-single-sense-words) | no | `standard, sense, ruling, woe, rank?, note?` |
| `collocations` | [S2](style.md#rule-s2--plain-single-sense-words) | no | `standard, woe, ruling, alternates?, rank?, note?` |
| `falseFriends` | — (advanced hazard) | no | `l1, looksLike, actualMeaning, note?` |
| `registerDefaults` | — (advanced hazard) | no | `concept, variants, default, rank?, note?` |

**`droppedPreps` is retired.** Earlier drafts dropped a verb's meaning-neutral preposition and
carried a per-verb ruling here; G3 no longer drops, so the array is empty. The two verbs that used
to route a meaning-changing particle to a plain verb (*believe in → trust*, *approve of → like*)
survive as ordinary `phrasalVerbs` entries.

**`phrasalVerbs.plain`** is the *one* single-word machine replacement; `alternates` are additional
human-readable options folded into the linter's report text (`woe` = `[plain, ...alternates].join("
/ ")`) but never produced by the translator. `separable` is recorded (*give it up*) but v1 of the
translator only matches contiguous phrasal spans — a separated phrasal is left alone and flagged
by the scanner as ordinary prose, since it isn't a bigram the linter tracks.

## Coverage

**Frequency spine:** [`../tools/data/ngsl.json`](../tools/data/ngsl.json) — NGSL 1.2 (Browne,
Culligan & Phillips, 2013; CC BY 4.0), 2,809 ranked headwords. The sweep walks it rank 1→2,809 in
six ~500-word bands; a word earns a row only when at least one array has something non-default to
say about it (a fully regular word like *table* needs none).

**Bands swept:** 6 of 6 — the full NGSL 1.2 spine (ranks 1–2,809). Row counts (test-checked against
`lexicon.json` by `vocabulary.test.ts`):

| Array | Rows |
| ----- | ---- |
| `droppedPreps` | 0 |
| `phrasalVerbs` | 56 |
| `sensePreferences` | 44 |
| `collocations` | 52 |
| `falseFriends` | 2 |
| `registerDefaults` | 27 |

This is a first full pass, not an exhaustive one: only words with a clear, low-collision-risk
case earned a row (see `tools/README.md`'s "Sweep methodology" for the criteria and the cases
deliberately left out). Growth continues opportunistically as new collisions or gaps surface.

## Table A — G3 canonical prepositions (retired)

**Retired.** G3 no longer drops a verb's preposition — a verb keeps its standard preposition as
ordinary vocabulary (*listen **to***, *wait **for***, *depend **on***) — so there is nothing to
tabulate and `droppedPreps` is empty. The two verbs that used to route a meaning-changing particle
to a plain verb, *believe in → **trust*** and *approve of → **like***, live in
[Table B](#table-b--s2-phrasal--plain-phrasalverbs) as ordinary phrasal verbs.

## Table B — S2 phrasal → plain (`phrasalVerbs`)

Non-compositional phrasal verbs and their plain replacement. Transparent phrasals (*sit down*,
*stand up*) are **not** listed — S2 leaves them alone; only the opaque ones are replaced.

| Phrasal verb | World English |
| ------------ | ------------- |
| give up | **quit** / **stop** |
| put off | **delay** |
| look after | **mind** / **tend** |
| come up with | **invent** / **devise** |
| find out | **learn** / **discover** |
| look for | **seek** |
| believe in | **trust** |

*look for* and *believe in* are ordinary `phrasalVerbs` entries, not G3 vocabulary: dropping their
preposition would collide two distinct senses (*look* vs. *look for*, *believe* vs. *believe in*),
so each is instead replaced by a single plain verb.

## Table C — S2 preferred sense (`sensePreferences`, doc-only)

Where a common word has a rare or risky sense, use the plain word instead. *run*, *get*, and
*take* are reserved for their most concrete meaning.

| Standard phrase | Risky sense | World English |
| --------------- | ----------- | -------------- |
| run a business | run = manage | **manage** a business |
| run a program | run = start | **start** a program |
| run (on foot) | concrete, physical | **run** (kept) |
| get a letter | get = receive | **receive** a letter |
| get tired | get = become | **become** tired |
| take a photo | take = make | **make** a photo |
| take a bus | take = use | **use** a bus |

## Table D — S2 collocation → regular pairing (`collocations`, doc-only)

Where standard English forces an arbitrary word-partnership, a regular literal pairing is
allowed. Includes the **adjective- and noun-selected prepositions** World English keeps standard
(*good **at** math*, *afraid **of** dogs*, *reason **for** it*) — the same "verbs keep their
preposition as vocabulary" principle as [G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs),
applied to adjectives and nouns.

| Standard collocation | World English |
| --------------------- | -------------- |
| heavy rain | **strong rain** |
| make a decision | **decide** |
| do homework | **do homework** / **study** |
| make the bed | **make the bed** (kept) |
| make friends | **make friends** (kept) |
| good at math | **good at** math (adjective-selected prep — kept) |
| afraid of dogs | **afraid of** dogs (adjective-selected prep — kept) |
| reason for it | **reason for** it (noun-selected prep — kept) |

## Table E — False friends (`falseFriends`, doc-only)

Words that resemble an L1 word but mean something else — a source of confident error
([PAIN-POINTS §4](../resources/PAIN-POINTS.md#4-vocabulary--lexis)). **L1-specific, grows per
language pair**; shown here in full (small enough not to need sampling).

| L1 | Looks like | Actually means | Note |
| -- | ---------- | --------------- | ---- |
| Spanish | *embarazada* → "embarrassed" | **pregnant** | not *embarrassed* |
| Spanish | *actually* ← "actualmente" | **in fact / really** | *actualmente* = "currently", a partial false friend |

## Table F — Near-synonym register (`registerDefaults`, doc-only, highlights)

Germanic vs. Latinate layers give English two or three words for one concept, differing only in
register. World English picks the **register-neutral default** and drops the rest for everyday
use.

| Concept | Standard variants | World English default |
| ------- | ------------------ | ----------------------- |
| request information | ask / inquire / interrogate | **ask** |
| of a monarch | kingly / royal / regal | **royal** |
| begin doing something | start / begin / commence | **start** |
| buy something | buy / purchase / acquire | **buy** |
| help someone | help / assist / aid | **help** |
| use something | use / utilize | **use** |

---

## Acceptance criteria

An entry is "done" only when:

1. It is **consistent with `lexicon.json`** — `tools/test/vocabulary.test.ts` parses every table
   above and every coverage count and asserts both against the data.
2. It satisfies the **structural invariants** `tools/test/core-lexicon.test.ts` checks:
   `droppedPreps` is empty (retired), and `phrasalVerbs.plain` is a single word.
3. It stays **consistent with [`samples.md`](samples.md)** — e.g. the S2 phrasal replacements
   agree with the dogfooded passages.
4. The forward/reverse **round-trip property** holds for the S2 phrasal verbs: the forward
   translator replaces the phrasal with its plain verb, and the plain verb — itself valid standard
   English — needs no reverse step (`tools/test/reverse.test.ts`).

These tables are highlights; `lexicon.json` is authoritative for anything not shown here.
