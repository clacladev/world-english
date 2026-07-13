# Vocabulary — The Core Lexicon

> The word list several rules quietly depend on. [G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs)
> (drop a verb's preposition), [S2](style.md#rule-s2--prefer-plain-verbs-over-phrasal-verbs)
> (phrasal → plain), [S3](style.md#rule-s3--one-word-one-meaning-avoid-heavy-polysemy)
> (preferred sense), and [S6](style.md#rule-s6--prefer-regular-replacements-for-collocations)
> (regular collocations) each quote a per-word list to do their job. Without it those rules are
> promissory notes — statable in prose, but not verifiable or reversible.

## Source of truth

**The data lives in [`../tools/data/lexicon.json`](../tools/data/lexicon.json), not here.** This
file is its schema documentation, a set of representative highlights, and a coverage statement —
kept honest by `tools/test/vocabulary.test.ts`, which parses the highlight tables below and the
coverage counts and asserts both against `lexicon.json` itself. If this file and the data
disagree, the data wins and the test fails.

[`../tools/src/core-lexicon.ts`](../tools/src/core-lexicon.ts) loads `lexicon.json` and builds
everything the tooling consumes from it:

- `toAbolishedEntries()` feeds the linter/translator dataset (`dataset.ts`) — dropped-prep and
  phrasal-verb forms the same way every other abolished form is tracked.
- `buildPhraseTransforms()` feeds the [forward translator](../tools/README.md) (`translate.ts`):
  every inflected surface form of a `drop`-ruling verb or phrasal verb, matched longest-first.
- `buildPrepRestorations()` feeds the [reverse translator](../tools/README.md) (`reverse.ts`): the
  canonical preposition each drop verb restores, inserted and always flagged as a guess.

## Schema

Six arrays. `droppedPreps` and `phrasalVerbs` are **machine-actionable** (the translators read
them); `sensePreferences`, `collocations`, `falseFriends`, and `registerDefaults` are
**doc-only** — recorded for the human record, never applied or even flagged by tooling, because
applying them needs word-sense disambiguation or judgment the tools don't have.

| Array | Rule | Actionable? | Fields |
| ----- | ---- | ----------- | ------ |
| `droppedPreps` | [G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs) | yes | `verb, prep, ruling, forward?, replacedBy?, rank?, note?, confidence?` |
| `phrasalVerbs` | [S2](style.md#rule-s2--prefer-plain-verbs-over-phrasal-verbs) | yes | `phrasal, plain, alternates?, separable?, rank?, note?, confidence?` |
| `sensePreferences` | [S3](style.md#rule-s3--one-word-one-meaning-avoid-heavy-polysemy) | no | `standard, sense, ruling, woe, rank?, note?` |
| `collocations` | [S6](style.md#rule-s6--prefer-regular-replacements-for-collocations) | no | `standard, woe, ruling, alternates?, rank?, note?` |
| `falseFriends` | — (advanced hazard) | no | `l1, looksLike, actualMeaning, note?` |
| `registerDefaults` | — (advanced hazard) | no | `concept, variants, default, rank?, note?` |

**`droppedPreps.ruling`** is one of three buckets (the [G3 keep/drop/replace test](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs)):
`drop` (verb-selected, meaning-neutral — dropped, and reverse-restored by lookup), `keep` (marks a
real relation — left alone), or `replace` (changes the verb's meaning — routed to
`phrasalVerbs` via `replacedBy`, naming that entry's `phrasal`). **At most one `drop` ruling
exists per verb** — the invariant that makes the drop reversible — enforced by
`tools/test/core-lexicon.test.ts`.

**`droppedPreps.forward`** defaults to `"apply"` (the forward translator drops the preposition).
`"flag"` withholds the forward transform for a verb whose canonical preposition has a
high-frequency competing reading the tools can't disambiguate without syntax. No entry
currently uses this field: the one candidate, **`wait for`** (duration *"wait for three
minutes"* vs. object *"wait for the bus"*), is handled instead by the **not-duration guard** in
`core-lexicon.ts` — the forward
translator drops *for* only when the following span is not a length of time, so `wait for the
bus` auto-translates and `wait for three minutes` is kept. The *reverse* translator restores
`wait for` regardless — a stoplist (prepositions, conjunctions, common adverbs, `-ly` words)
is what keeps a duration phrase like *"wait for three minutes"* from getting a second `for`
inserted; see [`tools/README.md`](../tools/README.md).

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
| `droppedPreps` | 37 |
| `phrasalVerbs` | 56 |
| `sensePreferences` | 44 |
| `collocations` | 52 |
| `falseFriends` | 2 |
| `registerDefaults` | 27 |

This is a first full pass, not an exhaustive one: only words with a clear, low-collision-risk
case earned a row (see `tools/README.md`'s "Sweep methodology" for the criteria and the cases
deliberately left out). Growth continues opportunistically as new collisions or gaps surface.

## Table A — G3 canonical prepositions (`droppedPreps`)

Verbs whose selected preposition is **meaning-neutral**: G3 drops it and the verb goes transitive.
The canonical preposition is what the reverse translator restores by lookup, so each `drop`-ruling
verb has exactly one.

| Verb | Prep | Ruling | World English |
| ---- | ---- | ------ | -------------- |
| listen | to | drop | **listen** music |
| wait | for | drop | **wait** the bus |
| depend | on | drop | **depend** the weather |
| look | at | drop | **look** the picture |
| believe | in | replace → *trust* | not dropped — routed to Table B |
| pay | for | keep | not dropped — real relation (*pay the waiter*, *pay for the meal*) |

*wait* is still a `drop` verb — its canonical World English is **wait the bus**, same as the
others. The `for`-vs-duration test is handled by the **not-duration guard** in `core-lexicon.ts`: the forward translator
drops *for* only when the following span is not a length of time, so *"wait for the bus"* →
**wait the bus** and *"wait for three minutes"* is kept (the *for* marks a duration, per
[S5](style.md#rule-s5--state-relevance-explicitly-cover-for-the-dropped-perfect)). The *reverse*
translator restores *wait*'s *for* regardless, using a stoplist to skip duration phrases
instead (see the schema section above).

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

*look for* and *believe in* are routed here from G3's drop/replace test (they change the verb's
meaning, so they are phrasal, not droppable).

## Table C — S3 preferred sense (`sensePreferences`, doc-only)

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

## Table D — S6 collocation → regular pairing (`collocations`, doc-only)

Where standard English forces an arbitrary word-partnership, a regular literal pairing is
allowed. Includes the **adjective- and noun-selected prepositions** that
[G3 explicitly hands to S6](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs)
(a predicate adjective can't take a direct object, so these are not dropped).

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
2. It satisfies the **structural invariants** `tools/test/core-lexicon.test.ts` checks: at most
   one `drop` ruling per verb, every `replace` ruling's `replacedBy` names a real `phrasalVerbs`
   entry, `phrasalVerbs.plain` is a single word and isn't itself a dropped form, and G3-drop /
   S2-phrasal bigrams don't collide.
3. It stays **consistent with [`samples.md`](samples.md)** — e.g. *listen music* / *wait the bus*
   agree with [Passage 9](samples.md#passage-9--short-exchange-closes-dogfooding-blind-spots).
4. The forward/reverse **round-trip property** holds: every `drop` + `forward: "apply"` verb
   translates SE→WoE by dropping its preposition, and WoE→SE restores it, flagged
   (`tools/test/reverse.test.ts`).

These tables are highlights; `lexicon.json` is authoritative for anything not shown here.
