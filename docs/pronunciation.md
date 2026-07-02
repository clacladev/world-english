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

**Reference accent.** The key is anchored to **rhotic General American**: a written `r` is
always pronounced, so it is the most phonetically transparent model and the one most
learners are already trained on. Every IPA form and respelling below follows it — no `r`
is silent, and the vowel inventory is the GA one.

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

| Word | Learner respelling | IPA (rhotic General American) |
| ---- | ------------------ | --- |
| World English | WERLD ING-glish | /wɝld ˈɪŋɡlɪʃ/ |
| computer | kom-PYOO-ter | /kəmˈpjutɚ/ |
| through *(thru)* | THROO | /θru/ |
| knight | NYT | /naɪt/ |

**Divergence & trade-off.** Adds a layer rather than changing the word. The base spelling
stays recognizable (principle 3); predictability lives in the key.

---

## Rule P2 — The respelling alphabet (one symbol per sound)

**Rule.** The respelling uses a **fixed, one-sound-per-spelling** set. Each English
phoneme has exactly one respelling, so the key itself is fully regular.

**Consonants** (mostly as written): `b d f g h j k l m n p r s t v w y z`, plus digraphs
`ch sh zh th(thin) dh(this) ng`.

**Vowels** (simple and diphthong):

| Respelling | Sound (IPA) | Example |
| ---------- | ----------- | ------- |
| a | /æ/ | cat → KAT |
| e | /ɛ/ | bed → BED |
| i | /ɪ/ | sit → SIT |
| o | /ɑ/ | hot → HOT |
| u | /ʌ/ | cup → KUP |
| uu | /ʊ/ | book → BUUK |
| ee | /i/ | see → SEE |
| ay | /eɪ/ | day → DAY |
| y | /aɪ/ | my → MY |
| oh | /oʊ/ | go → GOH |
| oo | /u/ | too → TOO |
| aw | /ɔ/ | law → LAW |
| ow | /aʊ/ | now → NOW |
| oy | /ɔɪ/ | boy → BOY |
| uh | /ə/ (schwa) | about → uh-BOWT |

**R-colored vowels.** Because the reference accent is rhotic, a vowel before `r` is written
as **vowel + `r`** — no extra symbols, and no separate "centring diphthongs" to learn:

| Respelling | Sound (IPA) | Example |
| ---------- | ----------- | ------- |
| er | /ɝ/, /ɚ/ | her → HER, letter → LET-er |
| ar | /ɑr/ | car → KAR |
| or | /ɔr/ | for → FOR |
| eer | /ɪr/ | here → HEER |
| air | /ɛr/ | air → AIR |
| oor | /ʊr/ | poor → POOR |

**Problem it solves.** The ~20-vowel inventory written with five letters, the missing
short/long contrasts (*book*/*moon*, *sit*/*seat*), and the schwa that is never written as
itself (see [§2](../resources/IRREGULARITIES.md#2-pronunciation)). Here each sound has one
and only one spelling — including `uu` for the FOOT vowel /ʊ/, distinct from `oo` for the
GOOSE vowel /u/.

**Note on /ɑ/.** General American merges the LOT and PALM vowels into a single /ɑ/, so both
take one spelling, `o` (*hot* → HOT, *father* → FO-dher). This keeps the frequent LOT words
reading naturally at the mild cost of a few PALM words looking odd in the key — the trade we
accept to hold "one sound, one spelling."

**Note on `y`.** `y` spells the **vowel** /aɪ/ when it is a syllable's vowel (*my* → MY,
*night* → NYT) and the **consonant glide** /j/ when it leads into another vowel (*yes* →
YES, *computer* → kom-PYOO-ter). The two never compete — a glide cannot be a syllable's
vowel — so position tells them apart, exactly as it does in English *my* vs *yes*.

**Divergence & trade-off.** This alphabet governs the *respelling*, not the base
orthography — so the page still reads as English while the key stays perfectly phonetic.

---

## Rule P3 — `th` is split in the key

**Rule.** The two `th` sounds are written distinctly in the respelling: **`th`** for
voiceless /θ/ (*thin* → THIN) and **`dh`** for voiced /ð/ (*this* → DHIS).

**Examples.**

| Voiceless `th` /θ/ | Voiced `dh` /ð/ |
| ------------------ | --------------- |
| thin → THIN | this → DHIS |
| three → THREE | mother → MUDH-er |
| bath → BATH | bathe → BAYDH |
| breath → BRETH | breathe → BREEDH |

The last pair (*breath*/*breathe*) is a minimal pair: only the `th`/`dh` split tells them
apart in the key.

**Problem it solves.** One digraph spelling two unpredictable sounds (see
[§2](../resources/IRREGULARITIES.md#2-pronunciation)).

**Reading the digraph.** The syllable hyphens keep `dh` from being misread as *d + h* (and
likewise guard `s-h`, `n-g` boundaries): a digraph never straddles a hyphen, so *mishap* is
MIS-hap, not "mi-shap." The hyphen is the key's disambiguation mechanism.

**Divergence & trade-off.** Base spelling keeps `th`; only the key disambiguates. No new
letters in running text.

---

## Rule P4 — Stress is always marked, never guessed

**Rule.** World English keeps each word's **native lexical stress** and **always marks it**
with CAPITALS in the respelling. The predictability comes from *showing* the stress on every
word, not from moving it to a fixed position — so a learner never has to memorize or guess
where the stress falls, but the word still sounds like English. The one regularization is
that **stress-based noun/verb pairs are eliminated**: the two senses take the same stress
and are distinguished by context.

**Problem it solves.** Unpredictable, contrastive word stress — a leading cause of being
misunderstood (see [§2](../resources/IRREGULARITIES.md#2-pronunciation)). Learners cannot
derive stress placement from the written word; the respelling supplies it directly.

**Examples.** *present* (gift) and *present* (to give) → both **PREZ-ent**; *record* (noun)
and *record* (verb) → both **REK-erd**. Words with no such pair keep their ordinary stress,
always shown — and it is often *not* first:

| Word | Respelling | Stressed syllable |
| ---- | ---------- | ----------------- |
| about | uh-BOWT | 2nd |
| computer | kom-PYOO-ter | 2nd |
| banana | buh-NAN-uh | 2nd |
| understand | un-der-STAND | 3rd |
| photograph | FOH-tuh-graf | 1st |

The CAPITALS place the stress for you every time, so none of this has to be memorized.

**Divergence & trade-off.** Loses only the stress-based noun/verb cue (recovered from
context and word order, per [grammar.md](grammar.md)). It does *not* regularize all stress
to one syllable — doing so would make many words unrecognizable, breaking legibility
(principle 3). The gain is that stress is never a guess: it is on the page for every word.

---

## Rule P5 — Connected speech is optional, never required

**Rule.** Weak forms, elision, and assimilation (*of* → /əv/, *next week* → *nex' week*)
are **permitted but never required**. The full, respelled form is always correct.

**Examples.** Each has a careful form (always correct) and an optional fast form:

| Written | Careful (always OK) | Fast (optional) |
| ------- | ------------------- | --------------- |
| want to | WONT-too | WO-nuh |
| and | AND | uhn |
| of | UV | uhv |
| next week | NEKST-week | NEKS-week |

**Problem it solves.** Connected speech makes native audio hard to *recognize* (see
[§2](../resources/IRREGULARITIES.md#2-pronunciation)). World English guarantees that the
careful pronunciation a learner reads from the key is always acceptable speech.

**Divergence & trade-off.** Natural fast speech still exists; the difference is that it is
never *obligatory*, so a learner is never penalized for speaking "as written."

---

## Rule P6 — Sentence rhythm is optional (syllable-timing is acceptable)

**Rule.** English is *stress-timed* — it compresses the syllables between stresses so
stressed beats recur at roughly even intervals. World English does **not require** this:
**even-weight, syllable-timed speech** — giving each syllable its full written value — is
always intelligible and correct. Stress-timing and the vowel reduction that drives it are
permitted but never required.

**Example.** *Tell me the name of the street.* A stress-timed speaker crushes the small
words (*t'll me the NAME of the STREET*); a syllable-timed speaker gives each word full
weight (*TELL — MEE — DHUH — NAYM — UV — DHUH — STREET*). **Both are correct** — the
even-weight reading is never wrong.

**Problem it solves.** Speakers of syllable-timed L1s (Spanish, French, Italian, Mandarin,
Hindi) find English rhythm hard both to *produce* and to *hear*, and are told their natural
rhythm sounds "wrong" (see [PAIN-POINTS §1](../resources/PAIN-POINTS.md#1-pronunciation--phonology),
stress-timing, Pike 1945). World English removes that penalty.

**Divergence & trade-off.** The same relief as P5, one level up: fast stress-timed rhythm
still exists, it is simply never *obligatory*. A learner speaking each syllable evenly is
always understood.

---

## Rule P7 — Intonation carries no grammatical load

**Rule.** Meaning is carried by **words and word order**, never by required pitch. Questions,
negation, and emphasis are marked grammatically (see [grammar.md](grammar.md)), so a flat or
L1-native intonation **never changes the literal meaning** of a sentence.

**Example.** In standard English *You like it.* becomes a question only by a rising pitch.
World English marks it with a word instead (see [grammar.md](grammar.md) G6): the question
is *Q you like it?* — so a flat, unchanging pitch reads correctly as either the statement or
the question, told apart by the marker, not the tune.

**Problem it solves.** English uses pitch movement to signal questions, contrast, and
attitude, and learners from languages with different intonation patterns both mis-signal and
mis-hear these (see [PAIN-POINTS §1](../resources/PAIN-POINTS.md#1-pronunciation--phonology),
intonation). World English does not make understanding depend on hearing or producing pitch.

**Divergence & trade-off.** Intonation still exists for naturalness and emotion, but it is
never load-bearing: nothing a learner needs to understand or be understood rides on it.

---

## Scope note — contrasts the respelling can't remove

World English regularizes the **mapping** (which sound a spelling represents) and **what is
required** of a speaker (P5–P7). It does **not** erase the phonetic difficulty of individual
sounds. Phonemic contrasts that carry meaning are kept — *rice*/*lice* (r vs l),
*think*/*sink* (/θ/ vs /s/), *ship*/*sheep* (/ɪ/ vs /i/) — because collapsing them would
lose information. What the key guarantees is that it always shows **which** sound is
intended, so a reader is never ambiguous; *producing* r vs l, or /θ/, remains ordinary
learner effort, not something a language redesign can subtract (see
[PAIN-POINTS §1](../resources/PAIN-POINTS.md#1-pronunciation--phonology), r/l and th).

---

## Worked examples

The rule-by-rule examples above show each piece in isolation. Here the whole system runs
together — first on a spread of words that exercise the full inventory, then on a complete
sentence.

### Word bank

| Word | Respelling | IPA |
| ---- | ---------- | --- |
| cat | KAT | /kæt/ |
| thing | THING | /θɪŋ/ |
| this | DHIS | /ðɪs/ |
| judge | JUJ | /dʒʌdʒ/ |
| see | SEE | /si/ |
| book | BUUK | /bʊk/ |
| moon | MOON | /mun/ |
| doctor | DOK-ter | /ˈdɑktɚ/ |
| water | WAW-ter | /ˈwɔtɚ/ |
| go | GOH | /ɡoʊ/ |
| now | NOW | /naʊ/ |
| boy | BOY | /bɔɪ/ |
| night | NYT | /naɪt/ |
| measure | MEZH-er | /ˈmɛʒɚ/ |
| nature | NAY-cher | /ˈneɪtʃɚ/ |
| bird | BERD | /bɝd/ |
| here | HEER | /hɪr/ |
| air | AIR | /ɛr/ |
| poor | POOR | /pʊr/ |
| about | uh-BOWT | /əˈbaʊt/ |
| computer | kom-PYOO-ter | /kəmˈpjutɚ/ |

Note the pairs the key keeps apart that the base spelling blurs: **book** BUUK /ʊ/ vs
**moon** MOON /u/; **thing** THING /θ/ vs **this** DHIS /ð/. And multi-syllable words wear
their stress openly — nothing to guess (kom-**PYOO**-ter, uh-**BOWT**).

### A full sentence

> *The doctor gave the young child a book about birds.*

**Respelling:** dhuh **DOK**-ter **GAYV** dhuh **YUNG** **CHYLD** uh **BUUK** uh-**BOWT** **BERDZ**

**IPA:** /ðə ˈdɑktɚ ɡeɪv ðə jʌŋ tʃaɪld ə bʊk əˈbaʊt bɝdz/

The function words (*the*, *a*) sit unstressed and lowercase; the content words carry the
CAPITAL-marked stress. Reading it exactly like this — each word at full value — is **always
correct** (P5–P6). A fast speaker might blur *the* and link the words together, but that is
optional, never required.

---

## Cross-spec note

The respelling key and [orthography.md](orthography.md) move together. The `ough` words
respelled in orthography O5 take the obvious key reading — *thru* → THROO, *tho* → THOH,
*altho* → awl-THOH; every word *not* respelled there (*knight* → NYT, *through*-as-retained)
is still fully covered by its entry here. No word is left without a predictable
pronunciation.

---

## Summary table

| Rule | What it guarantees |
| ---- | ------------------ |
| P1 | Every word carries a symbol-free respelling — CAPITALS = stress, hyphens = syllables |
| P2 | A fixed alphabet, one spelling per sound (~20 vowels, rhotic General American) |
| P3 | The `th` split — `th` for /θ/, `dh` for /ð/ |
| P4 | Native stress is kept and *always* marked; only noun/verb pairs collapse |
| P5 | Connected speech is permitted, never required |
| P6 | Syllable-timed rhythm is always acceptable |
| P7 | Intonation is never load-bearing — grammar carries the meaning |
