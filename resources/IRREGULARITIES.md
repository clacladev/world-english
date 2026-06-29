# The Irregularities of English: A Catalogue of What Must Be Memorized

## TL;DR
- This document catalogues the **systematic irregularities** of English — the places where
  the language forces you to memorize a list instead of applying a rule. It is the
  *what-and-how-much* companion to [`PAIN-POINTS.md`](PAIN-POINTS.md), which covers the
  broader *why-it's-hard* (psychology, listening, pragmatics, L1 transfer). Where they
  overlap, this file links rather than repeats.
- An irregularity here means: **knowing the rule does not let you produce the form.** You
  must be told that the past of *go* is *went*, that the plural of *child* is *children*,
  that *ough* is pronounced eight different ways. None of it is derivable.
- The damage is concentrated in a handful of systems: **spelling↔sound**, **verb
  conjugation**, **noun plurals**, **comparatives**, **pronoun case**, **articles**,
  **prepositions**, and **question/negation formation**. Each chapter below ends with a
  **World English target** — a pointer to the `docs/` specification that regularizes it.
- Scale, at a glance: ~200 irregular verbs in everyday use (400–600 counting variants),
  ~20 vowel phonemes written with 5 vowel letters, `ough` with 8–9 sounds, dozens of
  irregular plurals, and a closed but heavily-used set of suppletive comparatives and
  pronouns.

> **How to read this file.** Each chapter states *what is irregular*, gives *concrete
> examples*, estimates the *scale of the problem*, and names the *World English target*
> that fixes it. The fixes themselves live in [`../docs/`](../docs/README.md).

---

## 1. Spelling & Orthography

English is a **deep (opaque) orthography**: the written form is a poor predictor of the
spoken form, and vice-versa. This is historical residue — layered borrowing from Old
English, Norse, French, Latin, and Greek; the printing press freezing spellings around
1475–1630 just as pronunciation kept shifting; etymological "corrections" that inserted
silent letters; and the absence of any regulating academy (see
[`PAIN-POINTS.md` §2](PAIN-POINTS.md)).

**The irregularities:**

- **One sound, many spellings.** The vowel /iː/ is spelled at least eight ways:
  *see, sea, scene, receive, key, machine, field, people*.
- **One spelling, many sounds.** The digraph `ough` has **8–9 pronunciations** with no
  governing rule: *through* /uː/, *though* /oʊ/, *thought* /ɔː/, *cough* /ɒf/,
  *rough* /ʌf/, *bough* /aʊ/, *thorough* /ə/, *hiccough* /ʌp/, *lough* /ɒx/. The letter
  `c` is /k/ in *cat* but /s/ in *city*; `g` is /g/ in *get* but /dʒ/ in *gem*.
- **Silent letters.** *knight, gnome, write, comb, debt, doubt, subtle, island, honest,
  Wednesday, colonel, receipt.* Several were never pronounced — they were added to show
  Latin/Greek roots (the *b* in *debt*), and one (*island*) is a plain mistake.
- **Unpredictable consonant doubling.** *travelling* vs *traveling*, *referred* vs
  *offered*; *fulfil* vs *fulfill*. The rule (double after a stressed short vowel) has
  many exceptions and splits by dialect.
- **British/American divergence.** *colour/color, centre/center, realise/realize,
  catalogue/catalog, defence/defense, travelled/traveled.* A learner must pick a camp and
  still read the other.
- **Homophones & homographs.** *flour/flower, hear/here, their/there/they're* sound alike
  but differ in writing; *lead* (metal) vs *lead* (verb), *read* (present) vs *read*
  (past) are written alike but differ in sound.

**Scale.** English is routinely ranked among the least phonetically transparent of all
alphabetic writing systems. Roughly 25% of common words contain a spelling that cannot be
predicted from their sound.

**World English target →** [`docs/orthography.md`](../docs/orthography.md) (light,
legibility-preserving regularization) and [`docs/pronunciation.md`](../docs/pronunciation.md)
(the grapheme↔phoneme mapping that makes spelling predict sound).

---

## 2. Pronunciation

Even setting spelling aside, the spoken system has irregularities a learner cannot derive.

- **Unpredictable word stress.** Stress is contrastive and must often be memorized per
  word: *REcord* (noun) vs *reCORD* (verb), *DESert* vs *deSERT*, *PREsent* vs *preSENT*.
  There is no reliable rule for where stress falls.
- **The schwa and vowel reduction.** /ə/ is the most frequent vowel in English and appears
  in nearly every unstressed syllable (*banana* /bəˈnænə/, *computer* /kəmˈpjuːtər/), yet
  it is never written as itself. The same letter `a` is a full vowel in *cat* and a schwa
  in *about*.
- **A large vowel inventory.** ~20 vowel phonemes written with five vowel letters, forcing
  contrasts (*sheep/ship*, *cat/cot/caught*) that the spelling does not mark.
- **`th` is two sounds.** The single digraph spells both /θ/ (*think*) and /ð/ (*this*),
  and the choice is not predictable from spelling.
- **Connected speech.** Linking, elision, assimilation, and weak forms reshape words in
  running speech (*next week* → *nex' week*; *of* → /əv/), so the careful "dictionary"
  pronunciation is not what is heard.

**Scale.** Pronunciation is the area learners can least self-correct (see
[`PAIN-POINTS.md` §1](PAIN-POINTS.md)); stress errors alone are a leading cause of being
misunderstood.

**World English target →** [`docs/pronunciation.md`](../docs/pronunciation.md) (a regular
sound↔spelling mapping, a learner respelling key, and a single predictable stress rule).

---

## 3. Verb Conjugation

The verb system is the densest pocket of pure memorization in English.

- **Irregular past and past participle.** *go → went → gone*, *take → took → taken*,
  *bring → brought → brought*, *go → went* (suppletion — a completely unrelated stem). The
  three "principal parts" follow no single pattern; Brehe's *Grammar Anatomy* devotes
  [Chapter 3](brehe-grammar-anatomy/03-chapter-3-get-tense-verb-tense-principal-parts-and-irregular-verbs.html)
  entirely to listing them.
- **`be` has eight forms.** *be, am, is, are, was, were, being, been* — the most irregular
  word in the language, and the most frequent.
- **Third-person singular `-s`.** *I go / he goes.* A single agreement ending that exists
  only in one cell of the present tense, with its own spelling sub-rules (*go → goes*,
  *try → tries*).
- **Pattern families that look regular but aren't.** *sing/sang/sung* but *bring/brought*;
  *speak/spoke* but *sneak/sneaked-or-snuck*. Apparent patterns invite wrong guesses.

**Scale.** ~200 irregular verbs in everyday use (400–600 counting prefixed/variant forms),
of which ~50 carry the bulk of daily usage — but those 50 are the *most common verbs in
the language*, so there is no avoiding them.

**World English target →** [`docs/morphology.md`](../docs/morphology.md) (every verb takes
regular `-ed`; the `be` paradigm and third-person `-s` are regularized).

---

## 4. Noun Plurals & Countability

Pluralization should be the simplest rule in any language. In English it is a rule plus a
list of exceptions.

- **Irregular plurals.** *child → children*, *foot → feet*, *tooth → teeth*,
  *mouse → mice*, *man → men*, *woman → women*, *person → people*.
- **Zero plurals.** *sheep → sheep*, *fish → fish*, *deer → deer*, *series → series*.
- **`-f → -ves`.** *leaf → leaves*, *wife → wives*, *knife → knives* — but *roof → roofs*,
  *chief → chiefs*. The exceptions have exceptions.
- **Imported Latin/Greek plurals.** *cactus → cacti*, *fungus → fungi*, *analysis →
  analyses*, *criterion → criteria*, *phenomenon → phenomena*, *index → indices*.
- **Uncountable nouns.** *information, advice, furniture, luggage, news, equipment* take no
  plural and no *a/an*, even though their equivalents are countable in many languages —
  producing the classic errors *informations*, *an advice*, *many furnitures*.

**Scale.** A few dozen high-frequency irregular plurals plus an open-ended tail of
borrowed forms, plus a fuzzy, partly-arbitrary countable/uncountable boundary that must be
learned noun by noun.

**World English target →** [`docs/morphology.md`](../docs/morphology.md) (all nouns
pluralize with `-s`/`-es`) and [`docs/grammar.md`](../docs/grammar.md) (the
countable/uncountable distinction is regularized).

---

## 5. Adjectives & Adverbs

- **Suppletive comparatives.** *good → better → best*, *bad → worse → worst*,
  *far → further/farther → furthest*, *little → less → least*, *many/much → more → most*.
  The comparative is an unrelated word, not a derived form.
- **The `-er`/`-est` vs `more`/`most` boundary.** *big → bigger* but *beautiful → more
  beautiful* (not *beautifuller*). The cutoff depends on syllable count with a grey zone
  (*clever → cleverer* or *more clever*?) that even natives disagree on.
- **Irregular adverb formation.** Most adverbs add `-ly` (*quick → quickly*), but
  *good → well* (suppletive), *fast → fast* (zero), *hard → hard* (and *hardly* means
  something else entirely).

**Scale.** A small closed set of suppletive forms — but they are among the most frequent
adjectives in the language (*good, bad, much, many, little*), so they cannot be skipped.

**World English target →** [`docs/morphology.md`](../docs/morphology.md) (a single regular
comparative rule; regular adverb formation).

---

## 6. Pronouns

Pronouns are the one place modern English still inflects for grammatical case, irregularly.

- **Case forms.** *I / me / my / mine*, *he / him / his*, *they / them / their / theirs*,
  *who / whom / whose*. The forms are suppletive and must be memorized as a grid.
- **`who` vs `whom`.** A case distinction that confuses native speakers and is dying in
  speech, yet still tested in formal writing.
- **Reflexives are inconsistent.** *myself, yourself, himself* (possessive + self) but
  *himself*/*themselves* (object + self) — two different formation patterns in one
  paradigm.

**Scale.** A small closed class, but extremely high frequency, and the case grid is a
common error source for speakers of caseless or differently-cased L1s.

**World English target →** [`docs/grammar.md`](../docs/grammar.md) (regularized pronoun
case and *who/whom*).

---

## 7. Grammar Systems (Articles, Prepositions, Tense, Phrasal Verbs)

These are not single-word exceptions but whole *systems* that resist rule-statement — the
hardest grammar for many learners (see [`PAIN-POINTS.md` §3](PAIN-POINTS.md)).

- **Articles (`a/an/the/zero`).** The single hardest grammatical feature for many learners.
  Choice depends simultaneously on definiteness, specificity, countability, number, and
  shared knowledge, with no fixed rule — *the* alone has four distinct nongeneric uses.
- **Prepositions (~60–70, idiomatic).** Largely arbitrary: *arrive **at** a place* but
  *arrive **in** a country*; ***on** Monday* but ***in** July* but ***at** 3 o'clock*.
  One L1 preposition often maps to several English ones and vice-versa.
- **Tense/aspect overlap.** A rich system whose forms overlap in use; the **present
  perfect** (*I have lived here for ten years*) is the most-cited single difficulty,
  because it encodes a past-with-present-relevance relationship many languages don't
  grammaticalize.
- **Phrasal verbs.** *give up, put off, look after, come up with* — meaning is often
  non-compositional (*give up* ≠ *give* + *up*), and the grammar is irregular too
  (separable *pick it up* vs inseparable, with pronoun-placement rules).
- **Modals (`can/could/may/might/must/shall/should/will/would/ought to`).** Defective verbs
  (no past `-ed`, no `-ing`) whose meanings overlap on two axes — probability
  (*may/might/could/must* all grade certainty) and obligation (*must/have to/should/ought
  to*) — with no clean rule for which to pick, and suppletive past forms (*can*→*could*).
- **Conditionals (zero / first / second / third / mixed).** Five shapes graded by
  tense-backshift plus *would*: *if it rains, I will go* (real) vs *if I had money, I would
  buy it* (present-unreal, marked by a **past** tense) vs *if I had known, I would have told
  you* (past-unreal, marked by *had* + participle). The "remoteness via backshift" device is
  opaque, and the third conditional rides on the present-perfect machinery English encodes
  inconsistently.

**Scale.** Articles are acquired late and often never fully mastered (corpus accuracy
~60–80%); prepositions and phrasal verbs are open-ended, idiom-by-idiom learning with no
rule to fall back on.

**World English target →** [`docs/grammar.md`](../docs/grammar.md) (a leaner tense/aspect
set, a simplified article rule, regularized preposition choices, countable nouns) and
[`docs/style.md`](../docs/style.md) (prefer plain regular verbs over idiomatic phrasal
verbs).

---

## 8. Sentence Structure

Some irregularity lives not in the words but in how sentences are assembled.

- **Do-support.** English questions and negatives require a "dummy" auxiliary *do* that
  carries no meaning: *You like it* → ***Do** you like it?* / *I **do not** like it.* No
  other everyday operation needs an empty helper word, and learners routinely produce
  *You like it?* / *I not like it.*
- **Subject–auxiliary inversion.** Questions invert subject and auxiliary (*She **is**
  here* → ***Is** she here?*), but only the auxiliary, and only sometimes — interacting
  awkwardly with do-support.
- **Tag questions.** *You're coming, **aren't you**? / He left, **didn't he**?* The tag
  must mirror the auxiliary, polarity, and subject of the main clause — a small agreement
  computation for every tag.
- **`that` vs `which` (and the comma).** Restrictive *that* vs non-restrictive *which*,
  with a punctuation rule attached, is a distinction many natives ignore and few can state.

**Scale.** Do-support and inversion affect *every* question and negation in the language,
so the cost is paid constantly even though the rule set is small.

**World English target →** [`docs/grammar.md`](../docs/grammar.md) (regular question and
negation formation) and [`docs/style.md`](../docs/style.md) (fixed, unambiguous word
order).

---

## Catalogue → Fix map

| Irregularity (this file)            | World English fix (`docs/`)                                  |
| ----------------------------------- | ----------------------------------------------------------- |
| 1. Spelling / orthography           | [orthography.md](../docs/orthography.md), [pronunciation.md](../docs/pronunciation.md) |
| 2. Pronunciation                    | [pronunciation.md](../docs/pronunciation.md)                |
| 3. Verb conjugation                 | [morphology.md](../docs/morphology.md)                      |
| 4. Noun plurals & countability      | [morphology.md](../docs/morphology.md), [grammar.md](../docs/grammar.md) |
| 5. Adjectives & adverbs             | [morphology.md](../docs/morphology.md)                      |
| 6. Pronouns                         | [grammar.md](../docs/grammar.md)                            |
| 7. Grammar systems                  | [grammar.md](../docs/grammar.md), [style.md](../docs/style.md) |
| 8. Sentence structure               | [grammar.md](../docs/grammar.md), [style.md](../docs/style.md) |

---

## Sources & references

- [`PAIN-POINTS.md`](PAIN-POINTS.md) — the project's research-backed survey of learner
  difficulty (carries the underlying academic citations: Master; Ionin/Ko/Wexler;
  Liu & Gleason; Selinker; and others).
- [Brehe's *Grammar Anatomy*](brehe-grammar-anatomy/index.html) — the standard-English
  grammar baseline; [Ch. 3](brehe-grammar-anatomy/03-chapter-3-get-tense-verb-tense-principal-parts-and-irregular-verbs.html)
  (irregular verbs), [Ch. 6](brehe-grammar-anatomy/06-chapter-6-among-the-prepositions.html)
  (prepositions), [Ch. 20](brehe-grammar-anatomy/20-chapter-20-many-things-but-no-cabbages-or-kings.html)
  (nouns).
- Irregular-verb count (~200 in regular use; 400–600 with variants):
  [English irregular verbs — Wikipedia](https://en.wikipedia.org/wiki/English_irregular_verbs).
- `ough` pronunciations (8–9):
  [Ough (orthography) — Wikipedia](https://en.wikipedia.org/wiki/Ough_(orthography)).

> **Caveat.** Counts are order-of-magnitude, not exact — they depend on how one defines
> "irregular" and what counts as a distinct word. Irregularity is also *relative to the
> learner's first language*: a feature that is hard for one L1 may be easy for another.
> This catalogue describes structural irregularity, not impossibility — every item here is
> routinely mastered by motivated learners; the point of World English is to make that
> effort unnecessary.
