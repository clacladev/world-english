# To-Do — Prioritized Problem Backlog

> What to work on next. Every item below traces back to a difficulty documented in
> [`../resources/PAIN-POINTS.md`](../resources/PAIN-POINTS.md) (why it's hard) and/or
> [`../resources/IRREGULARITIES.md`](../resources/IRREGULARITIES.md) (what must be
> memorized), and is ranked by **learner impact** — how much difficulty the source
> research attributes to it — not by effort or build order.

## How to read this list

- **Status** — `drafted` (a spec exists in `docs/`, may still need refinement or have an
  open decision), `gap` (a documented problem with no spec yet), or `tooling` (not a
  spec problem — something to build).
- Priority tiers are ordered highest-impact-first. Within a tier, order follows the
  emphasis given in `PAIN-POINTS.md` itself (e.g. articles are explicitly called out as
  *the* hardest single feature).

---

## Priority 1 — Refine the highest-impact drafted rules

These are the problems `PAIN-POINTS.md` singles out as hardest or most damaging to
learners. A World English rule already exists for each; the work here is refinement,
not invention — and two have an explicit open decision blocking them.

1. **Articles (a/an/the/zero).** Called "a universally acknowledged difficulty" and the
   single hardest grammatical feature for many learners (article-less L1s especially);
   corpus accuracy never exceeds ~60–80% even in advanced learners.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [grammar.md G2](grammar.md#rule-g2--one-article-rule).

2. **Pronunciation system (stress, vowels, `th`).** The area learners can least
   self-correct, and the leading cause of being misunderstood (unpredictable word
   stress, the 20-phoneme vowel inventory, /θ/ vs /ð/).
   Source: [PAIN-POINTS §1](../resources/PAIN-POINTS.md#1-pronunciation--phonology),
   [IRREGULARITIES §2](../resources/IRREGULARITIES.md#2-pronunciation).
   Status: drafted → [pronunciation.md P1–P5](pronunciation.md).

3. **Spelling opacity.** One of the least phonetically transparent alphabetic systems;
   ~25% of common words have unpredictable spelling.
   Source: [PAIN-POINTS §2](../resources/PAIN-POINTS.md#2-spelling--orthography),
   [IRREGULARITIES §1](../resources/IRREGULARITIES.md#1-spelling--orthography).
   Status: drafted → [orthography.md O1–O5](orthography.md).
   **Decision resolved:** O5 now has an explicit stopping criterion — respell an `ough`
   word only where a conventional informal spelling already exists (*thru/tho/altho*);
   never coin a new form (*thot/cof/ruf*). That draws the "light cleanup vs. phonetic
   reform" boundary in line with O4, so the rule is no longer flagged.

4. **Prepositions.** ~60–70 prepositions used arbitrarily/idiomatically; a top source of
   fossilized L1-transfer error.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [grammar.md G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs).
   Refined: G3 now covers dependent prepositions too — the arbitrary verb-selected ones are
   dropped (*listen music*, *wait the bus*), with a keep/drop/replace boundary that routes
   meaning-changing particles to [S2](style.md#rule-s2--prefer-plain-verbs-over-phrasal-verbs).

5. **Verb irregularity, incl. the *be* paradigm.** ~200 irregular verbs in everyday use —
   the densest pure-memorization load in the language; *be* alone has eight forms and is
   the most frequent word in English.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §3](../resources/IRREGULARITIES.md#3-verb-conjugation).
   Status: drafted → [morphology.md M1](morphology.md#rule-m1--all-verbs-are-regular),
   [M2](morphology.md#rule-m2--one-verb-of-be-regularized).
   **Open decision:** M2 is explicitly "flagged for review" — whether to keep *is/are* as
   a legibility concession instead of collapsing everything to *be/beed*. Needs a decision.

6. **Present perfect / tense-aspect system.** The single most-cited hardest tense — it
   encodes a past-with-present-relevance relationship many languages don't grammaticalize.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [grammar.md G1](grammar.md#rule-g1--a-leaner-tenseaspect-system),
   [style.md S5](style.md#rule-s5--state-relevance-explicitly-cover-for-the-dropped-perfect).
   Worth a review pass: confirm the S5 "explicit time word" recovery actually covers the
   nuance G1 drops, with more worked examples.

7. **Phrasal verbs.** Non-compositional meaning plus irregular grammar (separable vs.
   inseparable, pronoun placement); learners without an L1 equivalent often avoid them
   entirely.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [style.md S2](style.md#rule-s2--prefer-plain-verbs-over-phrasal-verbs).
   Currently a short usage guideline with five examples — the phrasal-verb inventory is
   large; consider whether this needs a fuller reference list, not just a rule statement.

---

## Priority 2 — Fill the documented-but-unspecified gaps

`PAIN-POINTS.md` gives these categories real research weight, but no `docs/` spec covers
them yet — this is the biggest structural gap in the project relative to its own
methodology (README step 3: "design the fixes" is incomplete for these three).

8. **Vocabulary & Lexis.** Sheer size (500k+ OED entries), collocations ("heavy rain" not
   "strong rain"), polysemy (*run* has 645 senses), false friends, and Germanic/Latinate
   near-synonym layering (*ask/inquire/interrogate*).
   Source: [PAIN-POINTS §4](../resources/PAIN-POINTS.md#4-vocabulary--lexis).
   Status: **gap** — only thinly touched by
   [style.md S3](style.md#rule-s3--one-word-one-meaning-avoid-heavy-polysemy) (polysemy) and
   [S6](style.md#rule-s6--prefer-regular-replacements-for-collocations) (collocations).
   Needs: a proper `docs/vocabulary.md` — a core-word-list strategy (the 1k/2k/3k
   word-family coverage curve already cited in PAIN-POINTS §4 is a natural starting
   point), and explicit treatment of false friends and near-synonym registers.

9. **Writing conventions.** Register/tone, punctuation conventions, paragraph/essay
   structure, and coherence/cohesion (Kaplan's contrastive rhetoric; Halliday & Hasan) —
   repeatedly identified as the weakest aspect of ESL academic writing.
   Source: [PAIN-POINTS §6](../resources/PAIN-POINTS.md#6-writing).
   Status: **gap** — no spec at all.
   Needs: a new `docs/writing.md` covering punctuation rules, a default paragraph/essay
   shape, and explicit cohesion devices — distinct from `style.md`, which governs
   sentence-level phrasing, not document-level structure.

10. **Sociolinguistic & Pragmatics.** Politeness/indirectness calibration, contextual
    appropriateness, speech acts (refusals, apologies) — pragmatic failure, not grammar
    error, is the most-cited source of cross-cultural miscommunication.
    Source: [PAIN-POINTS §7](../resources/PAIN-POINTS.md#7-sociolinguistic--pragmatic-issues).
    Status: **gap** — no spec at all.
    Needs: scoping first. Unlike articles or verbs, pragmatics resists a single "rule" —
    this may end up as `style.md` guidance (plain, low-context request/refusal templates)
    rather than a full spec. Worth a design discussion before writing.

16. **Constructions surfaced by dogfooding ([samples.md](samples.md)).** Translating real
    passages exposed four gaps the specs do not yet cover — logged here so they are fixed by
    rule, not improvised:
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

---

## Priority 3 — Build the planned tooling

Per the [README's methodology](../README.md#methodology), step 5 ("build the tools") has
not started. These depend on Priority 1's open decisions being resolved first, since a
translator needs stable rules to translate against.

11. **Standard English → World English translator.** Apply the finalized
    `docs/grammar.md`, `morphology.md`, `orthography.md` rules to existing text.
    Source: [README "Planned tooling"](../README.md#planned-tooling). Status: **tooling**,
    not started.

12. **World English → standard English reverse translator.** The morphology rules
    (M1 *goed*, M4 *childs*, etc.) are explicitly designed to be "mapped back losslessly" —
    this is the tool that proves that claim.
    Source: [README "Planned tooling"](../README.md#planned-tooling). Status: **tooling**,
    not started.

13. **Pronunciation/speech tool.** Render World English text to the P1–P5 respelling, IPA,
    and spoken audio, so learners can hear the language, not just read the rules.
    Source: [README "Planned tooling"](../README.md#planned-tooling),
    [pronunciation.md](pronunciation.md). Status: **tooling**, not started — but the
    underlying rules (P1–P5) are already fully drafted, so this is more implementation-
    ready than the translators.

---

## Priority 4 — Lower-impact / needs a scope decision

`PAIN-POINTS.md` documents these as real learner difficulties, but they describe listener/
speaker skill-building and psychology, not features of the language itself — it's not
obvious a *language redesign* can fix them the way it can fix an irregular plural. Listed
here so they aren't silently dropped; whether they belong in this project (as tooling or
pedagogy guidance) rather than out of scope is an open question for the user, not decided
here.

14. **Listening & speaking (accent variety, fluency/automaticity).** Understanding fast
    connected speech and diverse accents; building automaticity requires practice volume a
    spec can't provide.
    Source: [PAIN-POINTS §5](../resources/PAIN-POINTS.md#5-listening--speaking).
    Status: partially covered by [pronunciation.md P5](pronunciation.md#rule-p5--connected-speech-is-optional-never-required)
    (connected speech); accent variety and fluency practice have no home in this project
    yet — likely a tooling/pedagogy concern (e.g. an AI speaking-practice partner), not a
    spec.

15. **Psychological & motivational factors (anxiety, fossilization, plateau).** Real and
    well-evidenced (Horwitz's FLA scale, Selinker's fossilization estimate of ~95% of
    learners never reaching native-like competence), but these are properties of the
    *learner and the teaching method*, not the language.
    Source: [PAIN-POINTS §8](../resources/PAIN-POINTS.md#8-psychological--motivational-factors).
    Status: not addressed anywhere in `docs/`. Recommend explicitly descoping from language
    design and, if pursued at all, treating as a pedagogy/tooling note (e.g. low-stakes AI
    conversation practice) rather than a spec.

---

## Summary

| # | Item | Status | Tier |
| - | ---- | ------ | ---- |
| 1 | Articles | drafted (refine) | P1 |
| 2 | Pronunciation system | drafted (refine) | P1 |
| 3 | Spelling opacity | drafted | P1 |
| 4 | Prepositions | drafted (refine) | P1 |
| 5 | Verb irregularity / *be* | drafted (open decision: M2) | P1 |
| 6 | Present perfect / tense | drafted (review) | P1 |
| 7 | Phrasal verbs | drafted (refine) | P1 |
| 8 | Vocabulary & lexis | **gap** | P2 |
| 9 | Writing conventions | **gap** | P2 |
| 10 | Sociolinguistic & pragmatics | **gap**, needs scoping | P2 |
| 11 | Standard → World English translator | tooling | P3 |
| 12 | World English → standard translator | tooling | P3 |
| 13 | Pronunciation/speech tool | tooling | P3 |
| 14 | Listening & speaking support | uncovered, needs scoping | P4 |
| 15 | Psychological/motivational factors | uncovered, likely out of scope | P4 |
| 16 | Constructions surfaced by dogfooding | **gap** | P2 |
