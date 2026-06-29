# Pronunciation — Sound↔Spelling Mapping, Respelling Key, Stress

> Fixes [§1 Spelling & Orthography](../resources/IRREGULARITIES.md#1-spelling--orthography)
> and [§2 Pronunciation](../resources/IRREGULARITIES.md#2-pronunciation).
> Companion to [orthography.md](orthography.md).

The project's core promise is that **how a word is written should tell you how it is said.**
Because [orthography.md](orthography.md) keeps spelling *light and legible* (it does not
phonetically rewrite every word), that promise is delivered here by a **respelling key**:
a simple layer that, for any word, gives an unambiguous reading. Pronunciation is documented
two ways for two audiences — a symbol-free **learner respelling** and **IPA** for
precision.

---

## Rule P1 — Every word carries a respelling

**Rule.** Each word's pronunciation is given in a **learner respelling** using only
ordinary letters, hyphens between syllables, and CAPITALS for the stressed syllable. No
special symbols.

**Problem it solves.** Standard spelling does not predict sound (see
[§1](../resources/IRREGULARITIES.md#1-spelling--orthography),
[§2](../resources/IRREGULARITIES.md#2-pronunciation)); the respelling does, with zero
training.

**Examples.**

| Word | Learner respelling | IPA |
| ---- | ------------------ | --- |
| World English | WURLD ING-glish | /wɜːld ˈɪŋɡlɪʃ/ |
| computer | kom-PYOO-ter | /kəmˈpjuːtər/ |
| through *(thru)* | THROO | /θruː/ |
| knight | NITE | /naɪt/ |

**Divergence & trade-off.** Adds a layer rather than changing the word. The base spelling
stays recognizable (principle 3); predictability lives in the key.

---

## Rule P2 — The respelling alphabet (one symbol per sound)

**Rule.** The respelling uses a **fixed, one-sound-per-spelling** set. Each English
phoneme has exactly one respelling, so the key itself is fully regular.

**Consonants** (mostly as written): `b d f g h j k l m n p r s t v w y z`, plus digraphs
`ch sh zh th(thin) dh(this) ng`.

**Vowels:**

| Respelling | Sound (IPA) | Example |
| ---------- | ----------- | ------- |
| a | /æ/ | cat → KAT |
| e | /ɛ/ | bed → BED |
| i | /ɪ/ | sit → SIT |
| o | /ɒ/ | hot → HOT |
| u | /ʌ/ | cup → KUP |
| ee | /iː/ | see → SEE |
| ay | /eɪ/ | day → DAY |
| eye | /aɪ/ | my → MEYE |
| oh | /oʊ/ | go → GOH |
| oo | /uː/ | too → TOO |
| aw | /ɔː/ | law → LAW |
| ow | /aʊ/ | now → NOW |
| oy | /ɔɪ/ | boy → BOY |
| er | /ɜː, ər/ | her → HER |
| uh | /ə/ (schwa) | about → uh-BOWT |

**Problem it solves.** The ~20-vowel inventory written with five letters, and the schwa
that is never written as itself (see
[§2](../resources/IRREGULARITIES.md#2-pronunciation)). Here each sound has one and only one
spelling.

**Divergence & trade-off.** This alphabet governs the *respelling*, not the base
orthography — so the page still reads as English while the key stays perfectly phonetic.

---

## Rule P3 — `th` is split in the key

**Rule.** The two `th` sounds are written distinctly in the respelling: **`th`** for
voiceless /θ/ (*thin* → THIN) and **`dh`** for voiced /ð/ (*this* → DHIS).

**Problem it solves.** One digraph spelling two unpredictable sounds (see
[§2](../resources/IRREGULARITIES.md#2-pronunciation)).

**Divergence & trade-off.** Base spelling keeps `th`; only the key disambiguates. No new
letters in running text.

---

## Rule P4 — One stress rule

**Rule.** Default stress falls on the **first syllable** of the root. When a word's stress
differs, the respelling's CAPITALS mark it — so stress is *always shown*, never guessed.
Noun/verb stress pairs (*REcord*/*reCORD*) are eliminated: the two senses take the **same**
first-syllable stress (RE-kord) and are distinguished by context.

**Problem it solves.** Unpredictable, contrastive word stress — a leading cause of being
misunderstood (see [§2](../resources/IRREGULARITIES.md#2-pronunciation)).

**Examples.** *present* (gift) and *present* (to give) → both **PREZ-ent**; *record* (noun)
and *record* (verb) → both **REK-ord**.

**Divergence & trade-off.** Loses the stress-based noun/verb cue (recovered from context
and word order, per [grammar.md](grammar.md)). Gains a single rule plus always-visible
stress marking.

---

## Rule P5 — Connected speech is optional, never required

**Rule.** Weak forms, elision, and assimilation (*of* → /əv/, *next week* → *nex' week*)
are **permitted but never required**. The full, respelled form is always correct.

**Problem it solves.** Connected speech makes native audio hard to *recognize* (see
[§2](../resources/IRREGULARITIES.md#2-pronunciation)). World English guarantees that the
careful pronunciation a learner reads from the key is always acceptable speech.

**Divergence & trade-off.** Natural fast speech still exists; the difference is that it is
never *obligatory*, so a learner is never penalized for speaking "as written."

---

## Cross-spec note

The respelling key and [orthography.md](orthography.md) move together. The few words
respelled in orthography (*thru*, *tho*) take the obvious key reading (THROO, THOH); every
word *not* respelled there (*knight*, *through*-as-retained) is still fully covered by its
entry here. No word is left without a predictable pronunciation.
