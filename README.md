# World English

> A simpler, more regular, more predictable revision of English — designed so that
> people anywhere can learn the world's de facto language with far less effort.

**Status:** Early design / research project. This repository documents the *goals*,
*principles*, and *plan*. The language itself, and the tools around it, are being
mapped out from scratch.

## Terms

- **World English** — the name of this revision of the English language.
- **WoE** — the short form of "World English".

## Philosophy

Language exists for communication. World English orders its priorities accordingly:
**ease** first (it must be easy to learn and use — achieved through regularity and
predictability), then **clarity** (hard to misread), and last **entertainment**
(expressive and literary richness). Where these conflict, the earlier wins — which
is why WoE trades away nuance, idiom, and flourish. A standing constraint bounds all
three: it must stay **legible as English** — an evolution, not a cipher.

---

## What is World English?

English is the default language of the internet, science, aviation, business, and
travel. It is also, by accident of history rather than design, one of the harder
languages to learn well: its spelling rarely predicts its sound, its verbs and
plurals are riddled with memorized exceptions, and many of its rules are not rules
at all but lists.

**World English** is a deliberate revision of English that keeps what works and
fixes what doesn't. The aim is a variant that is:

- **Regular** — rules apply consistently, with as few exceptions as possible.
- **Predictable** — if you know the rule, you can produce and understand new forms
  without having to be taught each one.
- **Easier** — less to memorize, fewer traps, a gentler learning curve.
- **Readable** — to someone who already knows English, World English still looks
  and reads like English. It is an evolution, not a cipher.

In many respects World English is a **subset** of British and American English: it
takes the common core and drops the irregular edges. In other respects it is a
genuine **reform** — where the existing rules are broken beyond repair, World
English replaces them with something simpler, even if the result is not valid
standard English.

## Why this project exists

A learner today must absorb thousands of irregular spellings, hundreds of irregular
verbs, an oversized tense system, and a layer of near-arbitrary choices (which
preposition? which article?) that native speakers themselves cannot explain. None
of this complexity is *necessary* to communicate clearly. It is historical residue.

If English is going to function as the shared language of the planet, the barrier
to entry should be as low as the language can bear. World English is an attempt to
ask, rigorously: **how simple could English be while still being English?**

This is a **research and design effort**, not a campaign. The goal is to map the
problem honestly, design defensible solutions, and document them well — not to
claim that the world should switch tomorrow.

## Design principles

1. **Subtract before you add.** The first tool is removing irregularity, not
   inventing new grammar. Most wins come from regularizing what already exists.
2. **Reform only where subtraction fails.** Where a rule is irreparably arbitrary,
   replace it with a single predictable rule — even if that form isn't standard
   English (e.g. fully regular verb conjugation).
3. **Stay legible.** Spelling is regularized only *lightly* — fix the worst
   offenders and silent-letter traps, but keep words recognizable. A page of World
   English should never look alien to an English reader.
4. **One rule, no exception lists.** A feature is only "done" when it can be stated
   as a rule a beginner can apply, with no table of special cases to memorize.
5. **Document the *why*.** Every divergence from standard English is recorded with
   the learner problem it solves and the trade-off it accepts.

## What World English is *not*

- Not a replacement for English in literature, law, or native everyday use.
- Not a "dumbed-down" English — it aims to express the same ideas, just with less
  arbitrary machinery.
- Not a phonetic rewrite. Spelling changes are conservative and recognizable.
- Not finished. The design is underway: five specifications are drafted under `docs/`
  (orthography, pronunciation, morphology, grammar, style), backed by the research in
  `resources/`. The rules will keep changing as they are worked out — and the tooling has
  not started.

## Scope of the reform

The detailed catalogue of learner difficulties — *what* is hard, and *why* — lives in
[`resources/PAIN-POINTS.md`](resources/PAIN-POINTS.md) (the research-backed survey) and
[`resources/IRREGULARITIES.md`](resources/IRREGULARITIES.md) (the what-must-be-memorized
companion). Each documented pain point becomes a design target with its own proposed
ruleset. Broadly, the work spans:

- **Orthography** — spelling regularized lightly toward predictable sound.
- **Morphology** — regular verbs, regular plurals, regular comparatives.
- **Syntax & grammar** — a leaner tense/aspect system and simpler rules for the
  arbitrary choices (articles, prepositions).
- **Style** — guidance on plain, unambiguous phrasing.

Each area will get its own specification under `docs/` describing the rule, the
problem it solves, examples, and the divergence (if any) from standard English.

## Pronunciation

A core promise is that **how a word is written should tell you how it is said.**
Pronunciation will be documented two ways, for two audiences:

- **Learner respelling** — a simple, symbol-free key (e.g. *World English* →
  `WERLD ING-glish`) that anyone can read at a glance.
- **IPA** — the International Phonetic Alphabet, for precision and for linguists.

Both will accompany the spelling rules and feed the pronunciation tooling.

## Planned tooling

The end goal is not just documentation but working tools:

- **Translators** — convert British English, American English, and other variants
  *into* World English (and ideally back), so existing text can be experienced in
  the simplified form.
- **Pronunciation / speech** — render World English text to its respelling, IPA,
  and spoken audio, so learners can *hear* the language, not just read it.

These are goals, not yet implementations. Their design will be specified before any
code is written.

## Repository layout

```
world-english/
├── README.md                   # this file — goals, principles, plan
├── docs/
│   ├── README.md               # specs index + how the specs fit together
│   ├── orthography.md          # spelling regularization rules
│   ├── pronunciation.md        # respelling key + IPA conventions
│   ├── morphology.md           # regular verbs, plurals, comparatives
│   ├── grammar.md              # tense/aspect, articles, prepositions
│   ├── style.md                # plain-phrasing guidance
│   └── to-do.md                # prioritized problem backlog
├── resources/
│   ├── IRREGULARITIES.md       # catalogue of what English forces you to memorize
│   ├── PAIN-POINTS.md          # research-backed survey of learner difficulty
│   └── brehe-grammar-anatomy/  # standard-English grammar baseline (reference)
└── tools/                      # translators and pronunciation tooling (planned, not yet created)
```

## Methodology

1. **Map standard English** — document the actual rules, grammar, and style of
   British/American English as the baseline.
2. **Catalogue the difficulties** — record what learners struggle with and *why*
   (`PAIN-POINTS.md`).
3. **Design the fixes** — for each difficulty, propose a regularized or reformed
   rule, with examples and trade-offs.
4. **Specify the language** — consolidate the rules into the `docs/` specifications.
5. **Build the tools** — translators and pronunciation/speech support.

Each step produces documentation that the next step builds on. Nothing is decided
silently: divergences from English are always written down with their rationale.

---

*World English is an open design exploration. Everything here is provisional and
open to revision as the rules are worked out.*
