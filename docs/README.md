# World English Specifications

These are the **fix specifications** for World English: each file takes a class of English
irregularity (catalogued in [`../resources/IRREGULARITIES.md`](../resources/IRREGULARITIES.md))
and replaces it with a regular, predictable rule. For how earlier reforms and controlled-English
subsets approached the same problems — and what the intelligibility research says about these
choices — see [`../resources/PRIOR-ART.md`](../resources/PRIOR-ART.md).

Every rule in `orthography.md`, `pronunciation.md`, `morphology.md`, and `grammar.md` follows
the same four-part template, per the project [design principles](../README.md#design-principles):

> **Rule** — what World English does.
> **Problem it solves** — the irregularity it removes (linked to the catalogue).
> **Examples** — standard English → World English.
> **Divergence & trade-off** — how far this departs from standard English, and the cost.

Two exceptions, noted here rather than left to surprise a reader: `style.md` and `writing.md`
use the same three opening parts but shorten the fourth label to a bare **Trade-off.**; and
[O4](orthography.md#rule-o4--what-is-deliberately-left-alone) does not follow the template at
all — it is a list of what orthography deliberately leaves alone, not a single rule with its
own divergence to record.

## The specifications

| Spec | Covers | Fixes (catalogue) |
| ---- | ------ | ----------------- |
| [orthography.md](orthography.md) | Spelling regularization (light, legibility-preserving) | §1 |
| [pronunciation.md](pronunciation.md) | Sound↔spelling mapping, respelling key, stress rule | §1, §2 |
| [morphology.md](morphology.md) | Regular verbs, plurals, comparatives, adverbs | §3, §4, §5 |
| [grammar.md](grammar.md) | Tense/aspect, articles, prepositions, pronouns, countability, questions, negation, modals, conditionals, passive, possessive, relative clauses, reflexives, complementation, content clauses & reported speech, subordinating conjunctions | §4, §6, §7, §8 |
| [style.md](style.md) | Plain, unambiguous phrasing; word order; adverb placement; avoiding idiom; politeness markers & speech-act templates | §7, §8 |
| [writing.md](writing.md) | Document-level conventions — punctuation set, one register, thesis-first structure, paragraph shape, cohesion | [PP §6](../resources/PAIN-POINTS.md#6-writing) |
| [vocabulary.md](vocabulary.md) | Core lexicon — the per-word list G3/S2/S3/S6 look up (canonical prepositions, phrasal→plain, preferred sense, collocations, false friends, register) | §4 |
| [samples.md](samples.md) | Dogfooded translations, annotated rule-by-rule — the regression test | all |

## How the specs fit together

- **orthography.md and pronunciation.md are a pair.** A spelling change implies a sound,
  and a sound implies a spelling. Where one spec makes a choice, the other reflects it.
- **morphology.md does most of the "reform" work** (design principle 2): regular English
  already points the way (most verbs are `-ed`, most plurals are `-s`), so World English
  just removes the exceptions.
- **grammar.md and style.md overlap** on phrasal verbs and word order — grammar.md states
  the rule, style.md gives the usage guidance.
- **writing.md sits above style.md.** style.md governs the sentence (word order, phrasing);
  writing.md governs everything above it (punctuation that joins clauses, paragraph shape,
  cohesion). Its source is [PAIN-POINTS §6](../resources/PAIN-POINTS.md#6-writing), a
  research-documented difficulty rather than a form-irregularity in the catalogue — which is
  why its row cites PAIN-POINTS, not IRREGULARITIES.
- **vocabulary.md is the data behind four rules.** G3, S2, S3, and S6 each resolve a word by
  lookup; `vocabulary.md` holds that per-word list, so those rules are only as complete as it
  is. It is what the built, tested, CI-gating linter and reverse translator read (see
  [`tools/README.md`](../tools/README.md)).

## The regression test

[`samples.md`](samples.md) applies the whole ruleset to real passages, annotated
rule-by-rule. It is the project's **regression test**: **every future spec change must re-run
those passages and keep them consistent.** If a rule changes, the affected sentences and
their annotations change with it; if a passage needs a construction no rule covers, it is
flagged in `samples.md` — never silently improvised.
This is how the specs are kept from drifting back into the contradictions they were written
to remove.

## Status

Provisional. These specs are a first design pass executing methodology steps 3–4 in the
[README](../README.md#methodology). Every divergence from standard English is recorded with
its rationale; nothing is decided silently.
