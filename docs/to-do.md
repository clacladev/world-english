# To-Do — Prioritized Problem Backlog

> What to work on next. Every item below traces back to a difficulty documented in
> [`../resources/PAIN-POINTS.md`](../resources/PAIN-POINTS.md) (why it's hard) and/or
> [`../resources/IRREGULARITIES.md`](../resources/IRREGULARITIES.md) (what must be
> memorized), and is ranked by **learner impact** — how much difficulty the source
> research attributes to it — tempered by **what the rules depend on to stay stable**.

## How to read this list

- **Status** — `drafted` (a spec exists in `docs/`, may still need refinement or have an
  open decision), `gap` (a documented problem with no spec yet), or `tooling` (not a
  spec problem — something to build).
- Priority tiers are ordered highest-priority-first. **Item numbers are stable identifiers,
  not priority order** — read the tier, not the number (numbers are kept fixed so links from
  other files don't break as items move between tiers).

**What changed, and why.** Points 4–6 of the project critique were implemented (the spec-bug
sweep, the missing rules, [`samples.md`](samples.md), and [`../resources/PRIOR-ART.md`](../resources/PRIOR-ART.md)).
That work exposed a sequencing error in the old backlog: two things filed under "later
tooling" are actually **prerequisites for the rules stabilizing at all**, so they move up
into Priority 1 (items 8, 11, 12 below).

---

## Priority 1 — Foundations first, then the highest-impact drafted rules

Two realizations from the point 4–6 work reorder this tier:

- **Several rules secretly quote a word list.** G3 ("drop the verb's preposition; a translator
  restores it by lookup"), S2 (phrasal→plain map), S3 (sense choice), and S6 (collocation
  replacements) are only as real as the **core lexicon** behind them. Without it they are
  promissory notes.
- **Every point-4 bug was a mechanical inconsistency** (*saw*/*gave*/*was*/*are* sitting in
  a World English example column) that an automated **linter** would have caught instantly.
  The rules cannot be trusted to stay consistent by prose review alone.

So the core lexicon and the linter lead Priority 1, ahead of the drafted-rule refinements.

8. **Core lexicon (2–3k word families) — the hidden dependency.** The 1k/2k/3k word-family
   coverage curve (75%/87%/95%) from PAIN-POINTS §4 is the natural scope. It must carry, per
   word: the **canonical preposition** each verb restores under
   [G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs) reverse-mapping,
   the **phrasal→plain** swap ([S2](style.md#rule-s2--prefer-plain-verbs-over-phrasal-verbs)),
   the **preferred sense** ([S3](style.md#rule-s3--one-word-one-meaning-avoid-heavy-polysemy)),
   and the **regular collocation** ([S6](style.md#rule-s6--prefer-regular-replacements-for-collocations)) —
   plus false friends and near-synonym registers. Until this exists, G3/S2/S3/S6 cannot be
   verified or reversed.
   Source: [PAIN-POINTS §4](../resources/PAIN-POINTS.md#4-vocabulary--lexis).
   Status: **built**. The lexicon lives in [`../tools/data/lexicon.json`](../tools/data/lexicon.json)
   (source of truth); [`vocabulary.md`](vocabulary.md) is its schema doc, representative
   highlights, and a test-checked coverage statement. A full pass over the
   [NGSL 1.2](https://www.newgeneralservicelist.com/) frequency spine (2,809 word families, six
   ~500-word bands) is done — 35 dropped-preposition rulings, 53 phrasal verbs, 44 risky senses,
   49 collocations, and 27 register defaults, plus the 2-row false-friends seed. It is a first
   pass, not exhaustive: only clear, low-collision-risk cases earned a row (see
   [`tools/README.md`](../tools/README.md#the-core-lexicon-item-8) for the criteria); growth continues
   opportunistically. G3 and S2 are wired into both translators (items 11/12); S3/S6 stay
   doc-only by design (applying them needs word-sense disambiguation the tools don't have).

11. **SE→WoE translator + linter — the consistency checker.** A tool that applies the
    finalized `morphology.md`/`grammar.md`/`orthography.md` rules to text, and — critically —
    **flags rule violations in the specs' own example columns**. It would have caught every
    point-4 bug mechanically. The rules cannot stabilize without it, which is why it moves out
    of "tooling someday" into Priority 1.
    Source: [README "Planned tooling"](../README.md#planned-tooling),
    [samples.md](samples.md).
    Status: **linter + forward translator built**. The linter lives in
    [`../tools`](../tools) (Bun/TypeScript): it sweeps every World-English example column and
    the `samples.md` passages for abolished forms, gates CI (`bun run lint`), and ships the
    **abolished-forms dataset** the specs never had (irregular verbs/plurals, `be`, British
    spellings, suppletives, phrasal/dropped-prep pairs). It already caught one real
    inconsistency prose review had missed — a possessive left unconverted in the [G11](grammar.md#rule-g11--relative-clauses)
    relative-clause example (*My car* → **Mes car**). Low-confidence/POS-dependent classes
    (articles, third-person `-s`, modals, homographs) are gated behind `--strict`.
    **The SE→WoE forward translator is now built too** (`../tools/translate.ts`, `bun run
    translate`): it applies the *deterministic* closed-class transforms (spelling, `be`,
    pronouns, comparatives, and the non-homograph irregular verbs/plurals) and **flags** — never
    guesses — the POS/syntax-dependent cases (article drop, third-person `-s`, zero-past verbs).
    It reuses the linter's dataset as the forward map and is regression-tested against the four
    `samples.md` gold passages. **Now that the core lexicon (item 8) exists, the
    lexicon-dependent half is wired too**: G3 dropped prepositions and S2 phrasal verbs are
    applied — inflected forms included (*gave up* → *quitted*, *listens to* → *listens*) — via
    `src/core-lexicon.ts`'s `buildPhraseTransforms()`. Dropped `for` (`wait for`, `hope for`)
    is now handled by the **G3 for-test** (item 16, resolved): the not-duration guard
    (`isDurationFor`) drops the object-*for* (*wait the bus*) but keeps the duration-*for*
    (*wait for three minutes*), competing cleanly with the duration `for` of
    [S5](style.md#rule-s5--state-relevance-explicitly-cover-for-the-dropped-perfect). Article
    drop by syntax is still out of scope (needs a parser, not a lexicon).
    Acceptance criteria per [README methodology step 5](../README.md#methodology): a rule is
    "done" only when it is
    statable without a hidden word list, `samples.md` stays consistent, and the example
    columns pass the linter sweep — now mechanically enforced.

12. **WoE→SE reverse translator — the lossless-mapping proof.** The morphology rules
    (M1 *goed*, M4 *childs*, G3's dropped prepositions) are explicitly designed to map back
    losslessly; this tool proves the claim and depends on the same core lexicon (item 8) for
    the preposition/phrasal restorations.
    Source: [README "Planned tooling"](../README.md#planned-tooling).
    Status: **built** (`../tools/translate.ts --reverse`, logic in `src/reverse.ts`). It inverts
    the linter's **abolished-forms dataset** ([`../tools/data`](../tools/data)) to restore
    standard English. The truly-lossless classes (non-homograph irregular verbs, plurals,
    comparatives, silent letters, `ough`, unique pronouns) round-trip cleanly; the deliberate
    collapses restore a **canonical default and flag the guess** (`be`→*is*, `beed`→*was*,
    `mes`→*my*, and every verb whose `-ed` past covers both past and participle, e.g. `seed`→
    *saw*). Valid standard forms are left alone (American spelling stays; `who` untouched).
    **G3 preposition restoration is now wired too**, now that the core lexicon (item 8) exists: a
    drop verb (`listen`, `wait`, `depend`, `look`, and the rest of the sweep's 35) gets its
    canonical preposition re-inserted and **always flagged** as a guess — a stoplist
    (prepositions, conjunctions, common adverbs, `-ly` words) skips insertion before a word that
    reads as something other than the dropped object, so *"wait for three minutes"* and *"looked
    under the sofa"* round-trip untouched. Phrasal verbs (S2) are **not** reversed — `quit`,
    `delay`, `seek`, and the rest are themselves valid standard English, so nothing needs
    restoring. Proven by `test/reverse.test.ts`, which round-trips the `samples.md` passages
    (Passage 4 returns to its exact Standard-English source) and property-tests every
    forward-applying drop verb through forward-then-reverse.

1. **Articles (a/an/the/zero).** Called "a universally acknowledged difficulty" and the
   single hardest grammatical feature for many learners (article-less L1s especially);
   corpus accuracy never exceeds ~60–80% even in advanced learners.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [grammar.md G2](grammar.md#rule-g2--one-article-rule).
   Point-4 fix applied: the generics and definiteness example rows no longer showed *are*/*is*/
   *a dog* in the World English column.

2. **Pronunciation system (stress, vowels, `th`).** The area learners can least
   self-correct, and the leading cause of being misunderstood (unpredictable word
   stress, the 20-phoneme vowel inventory, /θ/ vs /ð/).
   Source: [PAIN-POINTS §1](../resources/PAIN-POINTS.md#1-pronunciation--phonology),
   [IRREGULARITIES §2](../resources/IRREGULARITIES.md#2-pronunciation).
   Status: drafted → [pronunciation.md P1–P7](pronunciation.md). Point-4 fixes applied
   (deterministic noun-stress merger, homograph residue, valid worked sentence); **P7
   redesigned** — intonation now load-bears the yes/no question (rising pitch in speech,
   leading `?` in writing), replacing the coined `Q` particle.
   **Decision resolved (item 18):** [`PRIOR-ART.md`](../resources/PRIOR-ART.md) surfaced
   that Jenkins' Lingua Franca Core rates /θ/–/ð/, lexical stress, *and* grammatical intonation
   *non-core* for intelligibility — a research contradiction with P3/P4/P7. Settled: P3/P4 are
   kept as reading aids (the LFC concerns *spoken* intelligibility, which WoE makes optional),
   and P7's question-intonation divergence is accepted deliberately.

3. **Spelling opacity.** One of the least phonetically transparent alphabetic systems;
   ~25% of common words have unpredictable spelling.
   Source: [PAIN-POINTS §2](../resources/PAIN-POINTS.md#2-spelling--orthography),
   [IRREGULARITIES §1](../resources/IRREGULARITIES.md#1-spelling--orthography).
   Status: drafted → [orthography.md O1–O5](orthography.md).
   **Decision resolved:** O5 has an explicit stopping criterion — respell an `ough` word only
   where a conventional informal spelling already exists (*thru/tho/altho*); never coin a new
   form. Point 4 also made O4 defer cleanly to O5. `PRIOR-ART.md` backs this line: it is
   exactly the boundary between Webster's spelling changes that survived and those that failed.

4. **Prepositions.** ~60–70 prepositions used arbitrarily/idiomatically; a top source of
   fossilized L1-transfer error.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [grammar.md G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs).
   Point-4 fix: *pay for* / *believe in* removed from the drop list (they merge senses) and
   routed to keep/replace. **Item 8's core lexicon now carries the per-verb canonical-preposition
   table** (35 rulings from the NGSL sweep), wired into both translators. The *for*
   duration-vs-object test (item 16) is now **resolved** —
   [G3's *for* test](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs) drops
   the object-*for* but keeps the duration-*for*, so `wait for` is auto-translated, not flagged.

5. **Verb irregularity, incl. the *be* paradigm.** ~200 irregular verbs in everyday use —
   the densest pure-memorization load in the language; *be* alone has eight forms and is
   the most frequent word in English.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §3](../resources/IRREGULARITIES.md#3-verb-conjugation).
   Status: drafted → [morphology.md M1](morphology.md#rule-m1--all-verbs-are-regular),
   [M2](morphology.md#rule-m2--one-verb-of-be-regularized).
   Point-4 fix: M1 now states the `-e`/`-ed` spelling sub-rule so *beed*/*gived* derive from
   the rule. **Decision resolved:** M2 keeps the **full collapse** (`be`/`beed`) rather than
   the *is/are* legibility concession — it is the only exception-free option (`beed` derives
   from M1), it stays consistent with M3's no-agreement design, and it is the same tradeoff
   already accepted for regular verbs. No example re-sweep was needed: every
   [`grammar.md`](grammar.md)/[`samples.md`](samples.md) column and both translators already
   used `be`/`beed`.

6. **Present perfect / tense-aspect system.** The single most-cited hardest tense — it
   encodes a past-with-present-relevance relationship many languages don't grammaticalize.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [grammar.md G1](grammar.md#rule-g1--a-leaner-tenseaspect-system),
   [style.md S5](style.md#rule-s5--state-relevance-explicitly-cover-for-the-dropped-perfect).
   **Largely resolved in point 4:** G1 now gives one deterministic rendering (still-true →
   present tense; finished → past tense), S5 keeps the standard *for*/*since* split, and
   [samples.md](samples.md) exercises both. Remaining: confirm coverage with more examples.

7. **Phrasal verbs.** Non-compositional meaning plus irregular grammar (separable vs.
   inseparable, pronoun placement); learners without an L1 equivalent often avoid them
   entirely.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [style.md S2](style.md#rule-s2--prefer-plain-verbs-over-phrasal-verbs).
   **Item 8's core lexicon now carries the phrasal→plain map** — 53 phrasal verbs from the NGSL
   sweep, applied by the forward translator (inflected forms included). Not exhaustive: only
   opaque phrasals with a low collision risk earned a row; transparent ones (*sit down*) and
   dangerously polysemous ones (*pick up*) are deliberately left out (the latter documented,
   doc-only, in `vocabulary.md` Table C instead).

---

## Priority 2 — Fill the documented-but-unspecified gaps (decision items now resolved)

`PAIN-POINTS.md` gives these categories real research weight but no `docs/` spec covered them
yet. Item 9 (writing conventions) is now **drafted** → [`writing.md`](writing.md), leaving item
10 (sociolinguistic & pragmatics) as the remaining open work in this tier. The decision items
16, 17, and 18 are now **resolved** and kept here for the record.

9. **Writing conventions.** Register/tone, punctuation conventions, paragraph/essay
   structure, and coherence/cohesion (Kaplan's contrastive rhetoric; Halliday & Hasan) —
   repeatedly identified as the weakest aspect of ESL academic writing.
   Source: [PAIN-POINTS §6](../resources/PAIN-POINTS.md#6-writing).
   Status: **drafted** → [`writing.md`](writing.md) W1–W6, the document-level spec (distinct from
   `style.md`, which stays sentence-level). W1 punctuation (**semicolon abolished**; **colon kept
   only before a list**; notational colons like *10:30* untouched; three fixed comma boundaries),
   W2 one plain register (politeness/indirectness deferred to item 10), W3 thesis-first shape
   (Kaplan), W4 one-idea paragraphs with a leading topic sentence, W5 one explicit connective per
   relation (Halliday & Hasan conjunction ties; register-variant synonyms routed to it), W6
   repeat-don't-vary lexical/reference cohesion. Wired into [`README.md`](README.md) (spec table +
   `W*` key) and dogfooded by a new **multi-paragraph** [`samples.md`](samples.md) Passage 6
   (Passages 1–5 are single-paragraph and could not exercise W3–W6); example columns pass the
   linter sweep. **Scope decision:** paragraph-level this pass; a fixed multi-paragraph **essay
   template** is logged as a follow-up rather than baked into the first draft (it prescribes
   rhetoric, a larger and more opinionated commitment — see item 10's similar "needs scoping"
   note).

10. **Sociolinguistic & Pragmatics.** Politeness/indirectness calibration, contextual
    appropriateness, speech acts (refusals, apologies) — pragmatic failure, not grammar
    error, is the most-cited source of cross-cultural miscommunication.
    Source: [PAIN-POINTS §7](../resources/PAIN-POINTS.md#7-sociolinguistic--pragmatic-issues).
    Status: **gap** — needs scoping first. May end up as `style.md` guidance (plain,
    low-context request/refusal templates) rather than a full spec. Worth a design discussion.

16. **Constructions surfaced by dogfooding ([samples.md](samples.md)).** Translating real
    passages exposed four gaps — now all **resolved by rule**:
    - **The *for* test — duration vs. thing-awaited.** ✅ **Done** —
      [G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs) states it (keep
      *for* only before a length of time, else drop) and it is **wired into both translators
      and the linter** via the not-duration guard (`tools/src/core-lexicon.ts`'s
      `isDurationFor`): *wait for the bus* → *wait the bus*, *wait for three minutes* kept.
      `wait for` is no longer a `forward: "flag"` holdout.
    - **Reported speech / content clauses.** ✅ **Done** —
      [G14](grammar.md#rule-g14--content-clauses-and-reported-speech): complementizer *that* is
      always kept (unified with G11's relative *that*), no backshift, natural tense per G1.
      Doc-only (the translator does not insert a dropped *that* — that needs a parser).
    - **The *of*-genitive vs. G10 *'s*.** ✅ **Done** —
      [G10](grammar.md#rule-g10--noun-possessive) draws the boundary: `'s` for genuine
      possession, *of* for relational / part-whole / fixed superlative frames (*trip of hims
      life*). Keeps both (like S5's *for*/*since*); no reordering, Passage 4 unchanged.
      Doc-only.
    - **Subordinating conjunctions.** ✅ **Done** —
      [G15](grammar.md#rule-g15--subordinating-conjunctions): a closed one-per-meaning set
      (*if, unless, because, altho, when, while, before, after, until, so that, so*), natural
      tense, fixed comma placement; register-variant synonyms route to S4/S6. Doc-only.
    Source: [samples.md](samples.md) "Gaps this file surfaced". Status: **resolved** (G3
    for-test tooling built; G14/G15 added; G10 boundary added).

17. **Open decisions the point-5 rules left flagged — now resolved.** Three choices were
    recorded rather than decided silently; now settled — the pronoun on the exceptionless line,
    the comparatives with a deliberate naturalness concession:
    - **Plural *you* → `you all`.** ✅ **Done** — [G4](grammar.md#rule-g4--regular-pronoun-case)
      fixes **`you all`** (subject/object; possessive *you all's*); *yous* stays the singular
      possessive, so nothing collides. The "recommendation, not a settled rule" hedge is removed.
    - **`-ly` adverb comparatives → regular `-lier`, with an optional `more/most` hatch.**
      ✅ **Done** — [M5](morphology.md#rule-m5--one-comparative-rule) keeps *quicklier/carefullier*
      as the regular form but **permits periphrastic *more/most*** (*more carefully*) as an
      optional, natural-sounding alternative for the clumsy `-ly` (and long-adjective) cases.
    - **Quantifier *more/most* → `manyer/manyest`, with *more/most* permitted.** ✅ **Done** —
      M5 keeps *manyer/manyest* as the regular form but lets the standard **`more/most`** back
      in for the bare-quantifier cases (*I want more*); *little/few* likewise take *less/least*.
      *more/most/less/least* are valid World English, so the linter no longer flags them (the
      low-confidence rows were removed from `abolished-forms.json`).
    The escape hatch re-admits the *`-er`*-vs-*more* choice as an **optional** aid only — the
    regular `-er`/`-est` stays available and unambiguous; irregular one-word suppletives
    (*better*, *worse*) remain abolished.
    Source: [grammar.md G4](grammar.md#rule-g4--regular-pronoun-case),
    [morphology.md M5](morphology.md#rule-m5--one-comparative-rule). Status: **resolved**.

18. **Research contradictions from [`PRIOR-ART.md`](../resources/PRIOR-ART.md) — now resolved.**
    The intelligibility research disagrees with three pronunciation rules; each is now settled
    on the reading-aid vs. spoken-intelligibility distinction (the LFC is about *spoken*
    intelligibility, which WoE already makes optional via P5/P6):
    - **/θ/–/ð/ (P3) → kept.** ✅ **Done** — the LFC rates it non-core and safely substitutable,
      and WoE agrees on the spoken axis (a speaker may substitute and be understood); the
      *th*/*dh* split is kept as a **reading-aid** distinction (minimal pairs in the key), which
      the spoken finding does not touch. [P3](pronunciation.md#rule-p3--th-is-split-in-the-key).
    - **Lexical word-stress (P4) → kept.** ✅ **Done** — marked stress is a **reading aid**, not
      claimed load-bearing for intelligibility (the LFC rates lexical stress non-core).
      [P4](pronunciation.md#rule-p4--stress-is-always-marked-never-guessed).
    - **Question intonation (P7) → divergence accepted.** ✅ **Done** — the one genuine *spoken*
      divergence, kept deliberately: one bounded pitch contrast is worth avoiding a coined
      question particle, and writing carries it with the leading `?`.
      [P7](pronunciation.md#rule-p7--intonation-carries-only-the-question).
    Source: [PRIOR-ART.md §C](../resources/PRIOR-ART.md#c-the-empirical-base-on-international-intelligibility).
    Status: **resolved** (rules kept; reconciliation recorded in P3/P4/P7 and PRIOR-ART §C).

---

## Priority 3 — Remaining tooling

Per the [README's methodology](../README.md#methodology). The translators and linter moved up
to Priority 1 (items 11–12) because the rules depend on them; this is what is left.

13. **Pronunciation/speech tool.** Render World English text to the P1–P7 respelling, IPA,
    and spoken audio, so learners can hear the language, not just read the rules.
    Source: [README "Planned tooling"](../README.md#planned-tooling),
    [pronunciation.md](pronunciation.md).
    Status: **respelling + IPA built** (`../tools/pronounce.ts`, `bun run pronounce`; logic in
    `src/{respell,lexicon,pronounce,check}.ts`). Word→respelling is an authored **seed lexicon**
    (`../tools/data/pronunciation.json`, the ~40 gold words in `pronunciation.md`); respelling→IPA
    is the deterministic P2/P3 engine, validated against the authored IPA under `--strict`. Unknown
    words and homographs (`lead`=LED/LEED) are flagged, never guessed; regression-tested against the
    `pronunciation.md` worked sentence. **Audio deferred** (needs `espeak-ng`; `--audio` is a stub),
    exactly as items 11–12 split their lexicon-dependent halves.

---

## Priority 4 — Lower-impact / needs a scope decision

`PAIN-POINTS.md` documents these as real learner difficulties, but they describe listener/
speaker skill-building and psychology, not features of the language itself. Listed here so
they aren't silently dropped; whether they belong in this project is an open question for the
user, not decided here.

14. **Listening & speaking (accent variety, fluency/automaticity).** Understanding fast
    connected speech and diverse accents; building automaticity requires practice volume a
    spec can't provide.
    Source: [PAIN-POINTS §5](../resources/PAIN-POINTS.md#5-listening--speaking).
    Status: partially covered by [pronunciation.md P5](pronunciation.md#rule-p5--connected-speech-is-optional-never-required)
    (connected speech); accent variety and fluency practice have no home yet — likely a
    tooling/pedagogy concern (e.g. an AI speaking-practice partner), not a spec.

15. **Psychological & motivational factors (anxiety, fossilization, plateau).** Real and
    well-evidenced, but these are properties of the *learner and the teaching method*, not the
    language.
    Source: [PAIN-POINTS §8](../resources/PAIN-POINTS.md#8-psychological--motivational-factors).
    Status: not addressed in `docs/`. Recommend explicitly descoping from language design and,
    if pursued at all, treating as a pedagogy/tooling note, not a spec.

---

## Summary

| # | Item | Status | Tier |
| - | ---- | ------ | ---- |
| 8 | Core lexicon (2–3k word families) | **built** — full NGSL sweep (`tools/data/lexicon.json`) | **P1** |
| 11 | SE→WoE translator + linter | **built**, S2+G3 now applied (`tools/`) | **P1** |
| 12 | WoE→SE reverse translator | **built**, G3 preposition restoration wired | **P1** |
| 1 | Articles | drafted (point-4 fix applied) | P1 |
| 2 | Pronunciation system | drafted (point-4 fix; see item 18) | P1 |
| 3 | Spelling opacity | drafted (resolved) | P1 |
| 4 | Prepositions | drafted (refined; item 8 lookup table built) | P1 |
| 5 | Verb irregularity / *be* | drafted (M2 resolved: full collapse `be`/`beed`) | P1 |
| 6 | Present perfect / tense | drafted (largely resolved in point 4) | P1 |
| 7 | Phrasal verbs | drafted (map built via item 8, 53 rows) | P1 |
| 9 | Writing conventions | **drafted** → [`writing.md`](writing.md) W1–W6 (semicolon abolished, colon for lists only; paragraph-level; essay template logged as follow-up) | P2 |
| 10 | Sociolinguistic & pragmatics | **gap**, needs scoping | P2 |
| 16 | Constructions surfaced by dogfooding | **resolved** — G3 for-test (tooling), G14, G15, G10 boundary | P2 |
| 17 | Open decisions from point 5 (plural-you, `-ly` comparatives, `more/most`) | **resolved** — `you all`; `-lier`/`manyer` regular, with an optional `more/most` escape hatch | P2 |
| 18 | Research contradictions (LFC vs P3/P4/P7) | **resolved** — P3/P4 kept as reading aids; P7 divergence accepted | P2 |
| 13 | Pronunciation/speech tool | **respelling + IPA built** (`tools/pronounce.ts`); seed lexicon; audio deferred (espeak-ng) | P3 |
| 14 | Listening & speaking support | uncovered, needs scoping | P4 |
| 15 | Psychological/motivational factors | uncovered, likely out of scope | P4 |
