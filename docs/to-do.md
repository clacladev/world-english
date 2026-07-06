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
   Status: **gap** (was Priority 2). Needs a `docs/vocabulary.md` plus the actual list.

11. **SE→WoE translator + linter — the consistency checker.** A rough tool that applies the
    finalized `morphology.md`/`grammar.md`/`orthography.md` rules to text, and — critically —
    **flags rule violations in the specs' own example columns**. It would have caught every
    point-4 bug mechanically. The rules cannot stabilize without it, which is why it moves out
    of "tooling someday" into Priority 1.
    Source: [README "Planned tooling"](../README.md#planned-tooling),
    [samples.md](samples.md). Status: **tooling** (was Priority 3), now a prerequisite.
    Acceptance criteria per [README methodology step 5](../README.md#methodology): a rule is
    "done" only when it is
    statable without a hidden word list, `samples.md` stays consistent, and the example
    columns pass the linter sweep.

12. **WoE→SE reverse translator — the lossless-mapping proof.** The morphology rules
    (M1 *goed*, M4 *childs*, G3's dropped prepositions) are explicitly designed to map back
    losslessly; this tool proves the claim and depends on the same core lexicon (item 8) for
    the preposition/phrasal restorations.
    Source: [README "Planned tooling"](../README.md#planned-tooling). Status: **tooling**
    (was Priority 3), paired with item 11.

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
   **Open decision (see item 18):** [`PRIOR-ART.md`](../resources/PRIOR-ART.md) surfaced
   that Jenkins' Lingua Franca Core rates /θ/–/ð/, lexical stress, *and* grammatical intonation
   *non-core* for intelligibility — a research contradiction with P3/P4/P7 worth revisiting.

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
   routed to keep/replace. **Depends on item 8** for the per-verb canonical-preposition table.
   Open sub-question logged by [samples.md](samples.md): the *for* duration-vs-object test
   (item 16).

5. **Verb irregularity, incl. the *be* paradigm.** ~200 irregular verbs in everyday use —
   the densest pure-memorization load in the language; *be* alone has eight forms and is
   the most frequent word in English.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §3](../resources/IRREGULARITIES.md#3-verb-conjugation).
   Status: drafted → [morphology.md M1](morphology.md#rule-m1--all-verbs-are-regular),
   [M2](morphology.md#rule-m2--one-verb-of-be-regularized).
   Point-4 fix: M1 now states the `-e`/`-ed` spelling sub-rule so *beed*/*gived* derive from
   the rule. **Open decision (unresolved):** M2 is still "flagged for review" — whether to
   keep *is/are* as a legibility concession instead of collapsing to *be/beed*. Needs a
   decision; if it flips, re-run the example sweep.

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
   Currently a short guideline with five examples; the full phrasal→plain map is part of the
   **core lexicon (item 8)** — S2 cannot be exhaustive until that list exists.

---

## Priority 2 — Fill the documented-but-unspecified gaps, and the new open decisions

`PAIN-POINTS.md` gives these categories real research weight but no `docs/` spec covers them
yet, plus the open decisions the point-5 rules deliberately left flagged.

9. **Writing conventions.** Register/tone, punctuation conventions, paragraph/essay
   structure, and coherence/cohesion (Kaplan's contrastive rhetoric; Halliday & Hasan) —
   repeatedly identified as the weakest aspect of ESL academic writing.
   Source: [PAIN-POINTS §6](../resources/PAIN-POINTS.md#6-writing).
   Status: **gap** — no spec at all. Needs a new `docs/writing.md` (punctuation rules, a
   default paragraph/essay shape, explicit cohesion devices) — distinct from `style.md`,
   which governs sentence-level phrasing, not document-level structure.

10. **Sociolinguistic & Pragmatics.** Politeness/indirectness calibration, contextual
    appropriateness, speech acts (refusals, apologies) — pragmatic failure, not grammar
    error, is the most-cited source of cross-cultural miscommunication.
    Source: [PAIN-POINTS §7](../resources/PAIN-POINTS.md#7-sociolinguistic--pragmatic-issues).
    Status: **gap** — needs scoping first. May end up as `style.md` guidance (plain,
    low-context request/refusal templates) rather than a full spec. Worth a design discussion.

16. **Constructions surfaced by dogfooding ([samples.md](samples.md)).** Translating real
    passages exposed four gaps the specs do not yet cover — logged so they are fixed by rule,
    not improvised:
    - **The *for* test — duration vs. thing-awaited.** [G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs)
      drops verb-selected *for* (*wait the bus*) but [S5](style.md#rule-s5--state-relevance-explicitly-cover-for-the-dropped-perfect)
      keeps duration *for* (*for three minutes*); one clause can hold both, so the specs need
      an explicit test for which survives.
    - **Reported speech / content clauses.** Whether tense backshifts, and how complementizer
      *that* behaves in nominal clauses (*He said that it beed…*), is unspecified.
    - **The *of*-genitive vs. G10 *'s*.** *the trip of hims life* vs. *hims life's trip* —
      [G10](grammar.md#rule-g10--noun-possessive) fixes *'s* but not when the *of*-phrase is
      preferred.
    - **Subordinating conjunctions.** *while, because, when, if* (beyond G8's conditional) are
      used on the standard model with no spec of their own.
    Source: [samples.md](samples.md) "Gaps this file surfaced". Status: **gap**.

17. **Open decisions the point-5 rules left flagged.** New rules were added with their
    unresolved choices recorded rather than decided silently:
    - **Plural *you*.** [G4](grammar.md#rule-g4--regular-pronoun-case) recommends **`you all`**
      (since *yous* is taken by the singular possessive) but flags it as not settled.
    - **`-ly` adverb comparatives.** [M5](morphology.md#rule-m5--one-comparative-rule) gives
      *quicklier/carefullier*; whether long `-ly` adverbs should get a *more/most* escape hatch
      is open (the forms are exceptionless but clumsy).
    - **Quantifier *more/most*.** M5 gives *manyer/manyest* (*manyer than 100 persons*); as bare
      quantifiers (*I want manyer*) these may be too absurd to keep.
    Source: [grammar.md G4](grammar.md#rule-g4--regular-pronoun-case),
    [morphology.md M5](morphology.md#rule-m5--one-comparative-rule). Status: **open decisions**.

18. **Research contradictions from [`PRIOR-ART.md`](../resources/PRIOR-ART.md).** The
    intelligibility research disagrees with three pronunciation rules, recorded for a decision:
    - Jenkins' **Lingua Franca Core rates /θ/–/ð/ non-core** and safely substitutable, yet
      [P3](pronunciation.md#rule-p3--th-is-split-in-the-key) keeps and marks the contrast.
    - The **LFC rates lexical word-stress non-core** (only nuclear stress is essential), yet
      [P4](pronunciation.md#rule-p4--stress-is-always-marked-never-guessed) marks it on every
      word.
    - The **LFC rates grammatical intonation non-core**, yet
      [P7](pronunciation.md#rule-p7--intonation-carries-only-the-question) — as redesigned —
      now *load-bears* rising intonation for the yes/no question. (This one flipped: before the
      P7 redesign it *supported* the LFC; the deliberate choice to make questions ride on pitch
      turned it into a divergence. Mitigated in writing by the leading `?`.)
    None is a bug — all are defensible on writing-side/reading-aid grounds — but the tension
    with the empirical evidence should be resolved deliberately, not ignored.
    Source: [PRIOR-ART.md §C](../resources/PRIOR-ART.md#c-the-empirical-base-on-international-intelligibility).
    Status: **open decision**.

---

## Priority 3 — Remaining tooling

Per the [README's methodology](../README.md#methodology). The translators and linter moved up
to Priority 1 (items 11–12) because the rules depend on them; this is what is left.

13. **Pronunciation/speech tool.** Render World English text to the P1–P7 respelling, IPA,
    and spoken audio, so learners can hear the language, not just read the rules.
    Source: [README "Planned tooling"](../README.md#planned-tooling),
    [pronunciation.md](pronunciation.md). Status: **tooling**, not started — but the
    underlying rules (P1–P7) are fully drafted, so this is the most implementation-ready tool.

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
| 8 | Core lexicon (2–3k word families) | **gap** — hidden dependency | **P1** |
| 11 | SE→WoE translator + linter | tooling — prerequisite | **P1** |
| 12 | WoE→SE reverse translator | tooling — prerequisite | **P1** |
| 1 | Articles | drafted (point-4 fix applied) | P1 |
| 2 | Pronunciation system | drafted (point-4 fix; see item 18) | P1 |
| 3 | Spelling opacity | drafted (resolved) | P1 |
| 4 | Prepositions | drafted (refined; depends on item 8) | P1 |
| 5 | Verb irregularity / *be* | drafted (open decision: M2) | P1 |
| 6 | Present perfect / tense | drafted (largely resolved in point 4) | P1 |
| 7 | Phrasal verbs | drafted (depends on item 8) | P1 |
| 9 | Writing conventions | **gap** | P2 |
| 10 | Sociolinguistic & pragmatics | **gap**, needs scoping | P2 |
| 16 | Constructions surfaced by dogfooding | **gap** | P2 |
| 17 | Open decisions from point 5 (plural-you, `-ly` comparatives, `more/most`) | **open** | P2 |
| 18 | Research contradictions (LFC vs P3/P4) | **open** | P2 |
| 13 | Pronunciation/speech tool | tooling | P3 |
| 14 | Listening & speaking support | uncovered, needs scoping | P4 |
| 15 | Psychological/motivational factors | uncovered, likely out of scope | P4 |
