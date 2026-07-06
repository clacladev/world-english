# Vocabulary — The Core Lexicon

> The word list several rules quietly depend on. [G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs)
> (drop a verb's preposition), [S2](style.md#rule-s2--prefer-plain-verbs-over-phrasal-verbs)
> (phrasal → plain), [S3](style.md#rule-s3--one-word-one-meaning-avoid-heavy-polysemy)
> (preferred sense), and [S6](style.md#rule-s6--prefer-regular-replacements-for-collocations)
> (regular collocations) each quote a per-word list to do their job. This file **is** that
> list. Without it those rules are promissory notes — statable in prose, but not verifiable or
> reversible. See [`to-do.md` item 8](to-do.md).

## Purpose

Four drafted rules resolve a word only by looking it up:

- **G3** drops a verb's selected preposition (*listen to* → *listen*), and a
  [reverse translator](to-do.md) must restore it by lookup — so each such verb needs **one
  canonical preposition** recorded.
- **S2** replaces a non-compositional phrasal verb with a plain one (*give up* → *quit*) — so
  the **phrasal → plain** map must be written down.
- **S3** avoids rare senses of highly polysemous words (*run a business* → *manage*) — so the
  **preferred sense** per risky word must be fixed.
- **S6** allows a regular pairing where standard English forces an arbitrary collocation
  (*heavy rain* → *strong rain*) — so the **collocation → regular** map must exist.

This file also carries the two lexical hazards [PAIN-POINTS §4](../resources/PAIN-POINTS.md#4-vocabulary--lexis)
names as advanced traps: **false friends** and **near-synonym registers**.

## Status & scope

**Status: seed.** This pass records only the **load-bearing entries the specs already
reference** — enough to make G3/S2/S3/S6 verifiable and reversible today. It is not yet the
full lexicon.

**Target scope.** The vocabulary research in [PAIN-POINTS §4](../resources/PAIN-POINTS.md#4-vocabulary--lexis)
gives the natural ceiling: the first **1,000 word families cover ~75%** of written English and
~80% of speech, **2,000 reach ~87%** of speech, and **3,000 cover ~95%** of film and TV. So the
target is **2–3k word families**, not the whole dictionary.

**Growth is frequency-ordered.** Expansion beyond this seed follows a published high-frequency
word-family list — e.g. the [New General Service List (NGSL)](https://www.newgeneralservicelist.com/)
or Nation's BNC–COCA families — worked highest-frequency-first, so coverage grows against a
known curve instead of ad hoc. A word earns an entry when at least one of the six columns below
has something non-default to say about it; a fully regular word (*table*, *walk*) needs no row.

## How each rule reads this file

| Rule | Table | What it looks up |
| ---- | ----- | ---------------- |
| [G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs) | **A** | the verb's one canonical preposition (to restore on reverse-translation) |
| [S2](style.md#rule-s2--prefer-plain-verbs-over-phrasal-verbs) | **B** | the plain verb that replaces a phrasal one |
| [S3](style.md#rule-s3--one-word-one-meaning-avoid-heavy-polysemy) | **C** | the plain word for a risky sense of a polysemous word |
| [S6](style.md#rule-s6--prefer-regular-replacements-for-collocations) | **D** | the regular pairing that replaces an arbitrary collocation |
| — (advanced hazards) | **E**, **F** | false friends; the register-neutral default among near-synonyms |

---

## Table A — G3 canonical prepositions (drop, and reverse-map)

Verbs whose selected preposition is **meaning-neutral**: G3 drops it and the verb goes
transitive. The **canonical preposition** column is what a reverse translator restores by
lookup, so each verb has exactly one — this is what makes the drop lossless.

| Verb | Dropped prep | World English (transitive) | Reverse-map restores |
| ---- | ------------ | -------------------------- | -------------------- |
| listen | to | **listen** music | listen **to** |
| wait | for | **wait** the bus | wait **for** |
| depend | on | **depend** the weather | depend **on** |
| look | at | **look** the picture | look **at** |

**Boundary rulings (recorded, *not* dropped).** These fail G3's "meaning unchanged" test, so
they are logged here to keep them out of Table A:

| Pairing | Ruling | Why |
| ------- | ------ | --- |
| believe **in** | **replace** → *trust* (Table B) | *believe* (accept as true) ≠ *believe in* (have faith in); dropping *in* would merge the senses |
| pay **for** | **keep** *for* | *pay* already takes a recipient object (*pay the waiter*); *pay for* marks a real relation, so dropping it would collide *pay the meal* with *pay the person* |

## Table B — S2 phrasal → plain

Non-compositional phrasal verbs and their plain replacement. Transparent phrasals (*sit down*,
*stand up*) are **not** listed — S2 leaves them alone; only the opaque ones are replaced.

| Phrasal verb | Plain World English |
| ------------ | ------------------- |
| give up | **quit** / **stop** |
| put off | **delay** |
| look after | **mind** / **tend** |
| come up with | **invent** / **devise** |
| find out | **learn** / **discover** |
| look for | **seek** |
| believe in | **trust** |

*look for* and *believe in* are routed here from G3's drop/replace test (they change the verb's
meaning, so they are phrasal, not droppable).

## Table C — S3 preferred sense (avoid heavy polysemy)

Where a common word has a rare or risky sense, use the plain word instead. *run*, *get*, and
*take* are reserved for their most concrete meaning.

| Standard phrase | Risky sense | World English |
| --------------- | ----------- | ------------- |
| run a business | *run* = manage | **manage** a business |
| run a program | *run* = start | **start** a program |
| run (on foot) | — | **run** (kept — physical running only) |
| get a letter | *get* = receive | **receive** a letter |
| get tired | *get* = become | **become** tired |
| take a photo | *take* = make | **make** a photo |
| take a bus | *take* = use | **use** a bus |

## Table D — S6 collocation → regular pairing

Where standard English forces an arbitrary word-partnership, a regular literal pairing is
allowed. Includes the **adjective- and noun-selected prepositions** that
[G3 explicitly hands to S6](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs)
(a predicate adjective can't take a direct object, so these are not dropped).

| Standard collocation | World English |
| -------------------- | ------------- |
| heavy rain | **strong rain** |
| make a decision | **decide** |
| do homework | **do homework** / **study** |
| make the bed | **make the bed** (kept — regular verb+object, no swap needed) |
| make friends | **make friends** (kept — regular, over *get friends*) |
| good **at** math | **good at** math (adjective-selected prep — kept, not dropped) |
| afraid **of** dogs | **afraid of** dogs (adjective-selected prep — kept) |
| reason **for** it | **reason for** it (noun-selected prep — kept) |

## Table E — False friends

Words that resemble an L1 word but mean something else — a source of confident error
([PAIN-POINTS §4](../resources/PAIN-POINTS.md#4-vocabulary--lexis)). This table is
**L1-specific and grows per language pair**; the seed records the two canonical cases.

| L1 | Looks like | Actually means | Note |
| -- | ---------- | -------------- | ---- |
| Spanish | *embarazada* → "embarrassed" | **pregnant** | not *embarrassed* |
| Spanish | *actually* ← "actualmente" | **in fact / really** | *actualmente* = "currently", a partial false friend |

## Table F — Near-synonym register

Germanic vs. Latinate layers give English two or three words for one concept, differing only in
register ([PAIN-POINTS §4](../resources/PAIN-POINTS.md#4-vocabulary--lexis)). World English
picks the **register-neutral default** and drops the rest for everyday use.

| Concept | Standard variants | World English default |
| ------- | ----------------- | --------------------- |
| request information | ask / inquire / interrogate | **ask** |
| of a monarch | kingly / royal / regal | **royal** |

---

## Acceptance criteria

Per [README methodology step 5](../README.md#methodology), an entry is "done" only when:

1. It is **consistent with its source rule** — Table A matches G3's drop list and boundary
   rulings, B matches S2, C matches S3, D matches S6.
2. It stays **consistent with [`samples.md`](samples.md)** — e.g. *listen music* / *wait the
   bus* agree with Passage 1.
3. Every Table A verb has **exactly one** canonical preposition, so the drop is **reversible**
   by lookup (the goal of the [WoE→SE reverse translator](to-do.md), item 12).

These tables are the data the planned **linter** (item 11) and **reverse translator** (item 12)
will consume; until those exist, criterion 1 is checked by hand on every spec change.
