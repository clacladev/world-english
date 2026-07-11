# To-Do — Prioritized Problem Backlog

> What to work on next. Every item traces back to a difficulty documented in
> [`../resources/PAIN-POINTS.md`](../resources/PAIN-POINTS.md) (why it's hard) and/or
> [`../resources/IRREGULARITIES.md`](../resources/IRREGULARITIES.md) (what must be
> memorized), ranked by **learner impact** tempered by **what the rules depend on**.

## How to read this list

- **Status** — `drafted` (spec exists, may need refinement), `built` (tooling shipped),
  `resolved` (decision made and implemented), or `descoped` (out of language-design scope).
- Priority tiers are highest-priority-first. **Item numbers are stable identifiers, not
  priority order** — read the tier, not the number.

---

## Priority 1 — Foundations + highest-impact drafted rules

8. **Core lexicon (2–3k word families).** Carries the per-word data G3/S2/S3/S6 look up:
   canonical prepositions, phrasal→plain, preferred senses, collocations, false friends,
   register defaults.
   Source: [PAIN-POINTS §4](../resources/PAIN-POINTS.md#4-vocabulary--lexis).
   Status: **built** — [`tools/data/lexicon.json`](../tools/data/lexicon.json) (full NGSL 1.2
   sweep, 2,809 word families); [`vocabulary.md`](vocabulary.md) is the schema doc. 37
   dropped-prep rulings, 56 phrasal verbs, 44 senses, 52 collocations, 27 register defaults.
   G3/S2 wired into translators; S3/S6 doc-only by design. Growth continues opportunistically.

11. **SE→WoE translator + linter.** Applies deterministic closed-class transforms and flags
    everything needing POS/syntax. Sweeps spec example columns for abolished forms.
    Source: [README "Tooling"](../README.md#tooling), [samples.md](samples.md).
    Status: **built** — [`tools/`](../tools) (`bun run lint`, `bun run translate`).
    Gates CI. Forward translator handles spelling, `be`, pronouns, comparatives,
    non-homograph irregular verbs/plurals, G3 dropped prepositions, S2 phrasal verbs,
    plus conservative POS detectors (article drop, 3sg `-s`, dropped-`that`, coordinated
    zero-past). Regression-tested against eight `samples.md` gold passages.

12. **WoE→SE reverse translator.** Proves the mapping is reversible; restores standard forms
    by inverting the dataset.
    Source: [README "Tooling"](../README.md#tooling).
    Status: **built** — [`tools/translate.ts --reverse`](../tools) (logic in `src/reverse.ts`).
    Lossless classes round-trip cleanly; deliberate collapses (`be`→is, `beed`→was,
    possessives, past/participle) restore a canonical default and flag the guess. G3
    preposition restoration wired. Proven by `test/reverse.test.ts`.

1. **Articles (a/an/the/zero).** The single hardest grammatical feature for many learners.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [grammar.md G2](grammar.md#rule-g2--one-article-rule).

2. **Pronunciation system (stress, vowels, `th`).** The area learners can least self-correct.
   Source: [PAIN-POINTS §1](../resources/PAIN-POINTS.md#1-pronunciation--phonology),
   [IRREGULARITIES §2](../resources/IRREGULARITIES.md#2-pronunciation).
   Status: drafted → [pronunciation.md P1–P7](pronunciation.md). LFC contradictions resolved
   (item 18): P3/P4 kept as reading aids, P7 question-intonation divergence accepted.

3. **Spelling opacity.** ~25% of common words have unpredictable spelling.
   Source: [PAIN-POINTS §2](../resources/PAIN-POINTS.md#2-spelling--orthography),
   [IRREGULARITIES §1](../resources/IRREGULARITIES.md#1-spelling--orthography).
   Status: drafted → [orthography.md O1–O5](orthography.md). O5 stopping criterion: adopt
   existing informal spellings only (*thru/tho/altho*), never coin new ones.

4. **Prepositions.** ~60–70 used arbitrarily; top source of fossilized L1-transfer error.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [grammar.md G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs).
   Core lexicon carries 37 per-verb canonical-preposition rulings (31 drop / 4 keep / 2
   replace). *for* duration-vs-object
   test resolved (item 16): not-duration guard auto-translates `wait for`.

5. **Verb irregularity, incl. *be*.** ~200 irregular verbs; *be* has eight forms.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §3](../resources/IRREGULARITIES.md#3-verb-conjugation).
   Status: drafted → [morphology.md M1](morphology.md#rule-m1--all-verbs-are-regular),
   [M2](morphology.md#rule-m2--one-verb-of-be-regularized). M2 full collapse (`be`/`beed`).

6. **Present perfect / tense-aspect system.** The single most-cited hardest tense.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [grammar.md G1](grammar.md#rule-g1--a-leaner-tenseaspect-system),
   [style.md S5](style.md#rule-s5--state-relevance-explicitly-cover-for-the-dropped-perfect).
   G1: still-true → present, finished → past + time word. Full range dogfooded in
   [samples.md](samples.md) Passage 8.

7. **Phrasal verbs.** Non-compositional meaning plus irregular grammar.
   Source: [PAIN-POINTS §3](../resources/PAIN-POINTS.md#3-grammar),
   [IRREGULARITIES §7](../resources/IRREGULARITIES.md#7-grammar-systems-articles-prepositions-tense-phrasal-verbs).
   Status: drafted → [style.md S2](style.md#rule-s2--prefer-plain-verbs-over-phrasal-verbs).
   Core lexicon carries 56 phrasal→plain mappings, applied by the forward translator.

---

## Priority 2 — Drafted gaps and resolved decisions

9. **Writing conventions.** Punctuation, register, paragraph structure, cohesion.
   Source: [PAIN-POINTS §6](../resources/PAIN-POINTS.md#6-writing).
   Status: **drafted** → [`writing.md`](writing.md) W1–W6. Semicolon abolished; colon for
   lists only; thesis-first shape; one-idea paragraphs; explicit connectives; repeat-don't-vary
   reference. Essay template descoped — W3/W4 already cover document scope.

10. **Sociolinguistic & pragmatics.** Politeness, speech acts, contextual appropriateness.
    Source: [PAIN-POINTS §7](../resources/PAIN-POINTS.md#7-sociolinguistic--pragmatic-issues).
    Status: **drafted (minimal)** → [`style.md`](style.md) S8–S9. Fixed politeness markers
    (*please*/*sorry*/*thank you*), plain speech-act templates. Cultural mastery descoped.

16. **Constructions surfaced by dogfooding.** All **resolved**:
    - G3 *for* test (duration vs. object) — not-duration guard wired into translators.
    - G14 content clauses — *that* always kept, no backshift, dropped-`that` restoration.
    - G10 *of*-genitive boundary — `'s` for possession, *of* for relational/superlative.
    - G15 subordinating conjunctions — closed one-per-meaning set.

17. **Open decisions — resolved.** `you all` for plural *you*; `-lier`/`manyer` regular with
    optional `more/most` escape hatch; *more/most/less/least* valid World English.

18. **LFC research contradictions — resolved.** P3/P4 kept as reading aids (LFC concerns
    spoken intelligibility, which WoE makes optional); P7 question-intonation divergence
    accepted deliberately.

---

## Priority 3 — Remaining tooling

13. **Pronunciation/speech tool.** Render WoE text to respelling, IPA, and audio.
    Source: [README "Tooling"](../README.md#tooling), [pronunciation.md](pronunciation.md).
    Status: **built** — [`tools/pronounce.ts`](../tools) (`bun run pronounce`). Seed lexicon
    (66 entries, 64 distinct words); deterministic P2/P3 respelling→IPA engine; `--audio` speaks our
    phonemes via `espeak-ng` (external dependency). Unknown words/homographs flagged, never
    guessed. Growth opportunity: lexicon is a seed, not exhaustive.

19. **AI speaking-practice partner tool.** Item 14 descoped the listening/speaking pain point
    (accent variety, fluency/automaticity) *to* a tooling concern rather than a spec, but no
    backlog item ever carried that tooling forward — the pain point had no live owner. This
    item is that owner: an interactive tool that lets a learner practice speaking and listening
    against WoE's own respelling/IPA/audio pipeline ([`tools/pronounce.ts`](../tools)), giving
    corrective feedback the way item 13's renderer already does for text.
    Source: [PAIN-POINTS §5](../resources/PAIN-POINTS.md#5-listening--speaking).
    Status: **backlog** (not started).

20. **S4 idiom-to-literal lexicon support.** PR #8 declared S4 (idioms and culture-bound
    expressions) out of scope alongside the full 2–3k lexicon build. The lexicon build was
    later delivered (item 8), but S4's own lexicon half — a per-idiom mapping to a literal
    plain-English replacement, the same kind of machine-actionable data G3/S2 already have —
    never entered the backlog and was never built. S4 remains pure advice in `style.md` while
    S2/S3/S6 all got lexicon backing. This item is that gap's owner.
    Source: [style.md S4](style.md#rule-s4--avoid-idioms-and-culture-bound-expressions),
    [PAIN-POINTS §4](../resources/PAIN-POINTS.md#4-vocabulary--lexis).
    Status: **backlog** (not started).

21. **Grow the false-friends lexicon.** `falseFriends` in
    [`tools/data/lexicon.json`](../tools/data/lexicon.json) ships as a 2-row stub — the two
    examples copied directly from PAIN-POINTS' own illustration — under a **built** status in
    item 8, with no plan to grow it. False friends are flagged in PAIN-POINTS as a major
    hazard ("confident errors"), so a 2-row stub undersells the item-8 "built" status for this
    part of the lexicon. This item tracks growing false-friends coverage the same
    frequency-first way the rest of the core lexicon grows.
    Source: [PAIN-POINTS §4](../resources/PAIN-POINTS.md#4-vocabulary--lexis),
    [vocabulary.md Table E](vocabulary.md#table-e--false-friends-falsefriends-doc-only).
    Status: **backlog** (not started).

---

## Priority 4 — Descoped from language design

14. **Listening & speaking.** Connected speech covered by P5/P6. Accent variety and
    fluency/automaticity are tooling concerns (AI speaking-practice partner), not specs.
    Source: [PAIN-POINTS §5](../resources/PAIN-POINTS.md#5-listening--speaking).
    Status: **descoped** from language design — the tooling concern this item descoped *to*
    now has an owner: see item 19.

15. **Psychological & motivational factors.** Properties of the learner and teaching method,
    not the language.
    Source: [PAIN-POINTS §8](../resources/PAIN-POINTS.md#8-psychological--motivational-factors).
    Status: **descoped**.

---

## Summary

| # | Item | Status | Tier |
| - | ---- | ------ | ---- |
| 8 | Core lexicon | **built** | P1 |
| 11 | SE→WoE translator + linter | **built** | P1 |
| 12 | WoE→SE reverse translator | **built** | P1 |
| 1 | Articles | drafted | P1 |
| 2 | Pronunciation system | drafted | P1 |
| 3 | Spelling opacity | drafted | P1 |
| 4 | Prepositions | drafted | P1 |
| 5 | Verb irregularity / *be* | drafted | P1 |
| 6 | Present perfect / tense | drafted | P1 |
| 7 | Phrasal verbs | drafted | P1 |
| 9 | Writing conventions | **drafted** | P2 |
| 10 | Sociolinguistic & pragmatics | **drafted (minimal)** | P2 |
| 16 | Dogfooding gaps | **resolved** | P2 |
| 17 | Open decisions | **resolved** | P2 |
| 18 | LFC contradictions | **resolved** | P2 |
| 13 | Pronunciation/speech tool | **built** | P3 |
| 19 | AI speaking-practice partner tool | backlog | P3 |
| 20 | S4 idiom-to-literal lexicon support | backlog | P3 |
| 21 | Grow the false-friends lexicon | backlog | P3 |
| 14 | Listening & speaking | **descoped** | P4 |
| 15 | Psychological/motivational | **descoped** | P4 |
