# World English Specifications

These are the **fix specifications** for World English: each file takes a class of English
irregularity (catalogued in [`../resources/IRREGULARITIES.md`](../resources/IRREGULARITIES.md))
and replaces it with a regular, predictable rule.

Every rule in these specs follows the same template, per the project
[design principles](../README.md#design-principles):

> **Rule** — what World English does.
> **Problem it solves** — the irregularity it removes (linked to the catalogue).
> **Examples** — standard English → World English.
> **Divergence & trade-off** — how far this departs from standard English, and the cost.

## The specifications

| Spec | Covers | Fixes (catalogue) |
| ---- | ------ | ----------------- |
| [orthography.md](orthography.md) | Spelling regularization (light, legibility-preserving) | §1 |
| [pronunciation.md](pronunciation.md) | Sound↔spelling mapping, respelling key, stress rule | §1, §2 |
| [morphology.md](morphology.md) | Regular verbs, plurals, comparatives, adverbs | §3, §4, §5 |
| [grammar.md](grammar.md) | Tense/aspect, articles, prepositions, pronouns, countability, questions, negation, modals, conditionals, passive, possessive, relative clauses, reflexives, complementation | §4, §6, §7, §8 |
| [style.md](style.md) | Plain, unambiguous phrasing; word order; adverb placement; avoiding idiom | §7, §8 |

## Backlog

[`to-do.md`](to-do.md) is the prioritized list of what to work on next — spec gaps, open
decisions inside existing specs, and planned tooling — ranked by learner impact per
[`../resources/PAIN-POINTS.md`](../resources/PAIN-POINTS.md).

## How the specs fit together

- **orthography.md and pronunciation.md are a pair.** A spelling change implies a sound,
  and a sound implies a spelling. Where one spec makes a choice, the other reflects it.
- **morphology.md does most of the "reform" work** (design principle 2): regular English
  already points the way (most verbs are `-ed`, most plurals are `-s`), so World English
  just removes the exceptions.
- **grammar.md and style.md overlap** on phrasal verbs and word order — grammar.md states
  the rule, style.md gives the usage guidance.

## Status

Provisional. These specs are a first design pass executing methodology steps 3–4 in the
[README](../README.md#methodology). Every divergence from standard English is recorded with
its rationale; nothing is decided silently.
