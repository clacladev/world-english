---
name: world-english-translator
description: Translate text to or from World English (WoE) — a regularized, more predictable revision of standard English. Use when the user asks to "translate to World English", "convert English to World English", "translate to/from WoE", "put this back into standard English", or similar, in either direction, optionally with rule-cited notes explaining each change.
---

# World English translator

World English (WoE) is a deliberate regularization of standard English — regular verbs and
plurals, one article, no do-support, a leaner tense system, and more — defined by the rules in
`reference/rules.md` (distilled from the project's specs) and the closed-list data in
`reference/data/*.json`.

## Workflow

1. **Detect direction.** If the input reads like standard English (irregular verbs, articles,
   do-support, etc.), translate **SE → WoE**. If it already carries World English forms (*be*,
   *beed*, *-ed* pasts on normally-irregular verbs, dropped articles), translate **WoE → SE**. If
   the user states the direction explicitly, use that.
2. **Read `reference/rules.md`** for the full rule set, and consult `reference/data/*.json` for
   the project's specific closed-list decisions — which irregular verb/plural maps to which
   regular form, which phrasal verb has a plain replacement, which prepositions are dropped. Don't
   guess a form the data or rules don't state; when a lookup is missing, apply the general
   spelling/morphology rule directly (e.g. an irregular verb absent from the data file still
   regularizes by the M1 sub-rules).
3. **Translate the whole text**, sentence by sentence:
   - Apply every deterministic transform in `rules.md` exactly (spelling, `be`, irregular
     verbs/plurals, comparatives, phrasal verbs, `whom`→`who`).
   - Resolve the judgment cases the rules make explicit — article drop, third-person `-s`,
     do-support removal, perfect→tense mapping, homograph disambiguation — using sentence meaning
     and context, the way a deterministic scanner cannot.
   - Preserve proper nouns, numbers, punctuation that the rules don't touch, and the original
     formatting (line breaks, paragraphs, quotation marks).
   - For WoE → SE, restore the standard form; where World English collapsed a distinction (e.g.
     `be`/`beed` covering multiple standard forms), pick the most contextually likely standard
     form.
4. **Flag, don't improvise.** If a sentence needs a construction `rules.md` doesn't cover, say so
   explicitly next to the translation rather than inventing a form — see "Flag, don't improvise"
   in `reference/rules.md`'s notes-format section.
5. **Notes are opt-in.** Default output is the clean translation, nothing else. Only when the user
   asks to "explain," "annotate," or "add notes," append the per-sentence rule-cited annotation
   format shown in `reference/examples.md` (`[M1]`, `[G2]`, …), modeled on the project's
   `docs/samples.md`.

See `reference/examples.md` for worked SE↔WoE pairs, including the notes format in use.

## Attribution

`reference/rules.md` and `reference/examples.md` distill World English's `docs/` specs
(CC BY 4.0). `reference/data/*.json` are verbatim copies of the project's `tools/data/*.json`
(MIT). Source: [clacladev/world-english](https://github.com/clacladev/world-english).
