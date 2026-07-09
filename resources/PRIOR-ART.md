# Prior Art: What Has Been Tried Before

## TL;DR

- World English is not the first attempt to make English easier. Roughly a century of
  **controlled-language subsets**, **spelling and grammar reforms**, and **empirical
  intelligibility research** sits behind it, and the pattern in that history is sharp:
  **subsets that live inside a bounded domain survive; top-down reforms that ask everyone to
  respell or re-learn fail.** That is direct evidence for the project's own
  [design principles](../README.md#design-principles) — *subtract before you add*, *stay
  legible*, *adopt an existing form, never coin a new one*.
- The one place the evidence **contradicts** World English is pronunciation: Jennifer
  Jenkins' empirically-derived **Lingua Franca Core** finds the *th* sounds /θ/ and /ð/ are
  **not** needed for international intelligibility and are safely substitutable — yet
  [pronunciation.md](../docs/pronunciation.md) keeps them. That tension is recorded honestly
  in §C below.
- The one place it is strongly **corroborated** is grammar: English-based creoles and adult
  learner interlanguage independently converge on several of the exact moves World English
  makes — no third-person *-s*, preverbal negation, invariant tags, regularized past tense —
  suggesting these are what English *becomes* under simplification pressure, not arbitrary
  inventions.

> **How to read this file.** Each entry follows one template: **what it was · what it tried ·
> what happened · lesson for World English · which WoE rules it bears on.** Dates and claims
> were web-verified; where a source is weak or a figure varies, it is flagged inline. Sources
> are listed per-entry and consolidated at the end, in the style of
> [`PAIN-POINTS.md`](PAIN-POINTS.md).

---

## A. Subsets that survived

The common thread: each is a **subset** of ordinary English (a restricted vocabulary and a
tamed grammar), deployed in a **bounded context** (news, aircraft manuals, business), with
**institutional backing**. None asked anyone to spell differently. That is exactly the
"subtract, stay legible" bet World English makes.

### Basic English

- **What it was.** An 850-word regularized subset of English designed by **C.K. (Charles
  Kay) Ogden**, published in *Basic English: A General Introduction with Rules and Grammar*
  (**1930**), growing out of *The Meaning of Meaning* (Ogden & Richards, 1923).
- **What it tried.** One vocabulary (600 nouns, 150 adjectives, 100 "operations"/structure
  words) plus ~18 grammar rules, meant to serve at once as an international auxiliary, an
  on-ramp to full English, and a plain English — covering ~90% of everyday concepts.
- **What happened.** Briefly prominent (**Churchill promoted it in 1943**), then faded after
  WWII. It survives as a beginner word-list and an influence on VOA and Simplified Technical
  English.
- **Lesson for WoE.** A small **core lexicon** is powerful, but a word-list alone is not a
  language — Basic English under-specified grammar and over-trusted paraphrase. World English
  should pair its core word-list with the full rule specs, not lean on vocabulary limits
  alone.
- **Bears on.** The core-lexicon backlog item ([to-do.md](../docs/to-do.md) item 8);
  [S3](../docs/style.md#rule-s3--one-word-one-meaning-avoid-heavy-polysemy),
  [S4](../docs/style.md#rule-s4--avoid-idioms-and-culture-bound-expressions).

### VOA Special English (now "Learning English")

- **What it was.** A controlled register broadcast by the **Voice of America**, first aired
  **October 19, 1959** (*Word Book* first published 1962; rebranded **"Learning English" in
  2014**).
- **What it tried.** World news in a **~1,500-word** core vocabulary, short sentences, no
  idioms, read **about one-third slower** than standard broadcast English.
- **What happened.** Still produced daily — one of the most durable controlled-English
  projects, precisely because it is a *delivery style*, not a reform.
- **Lesson for WoE.** **Slower, fully-articulated speech is a feature, not a defect** — VOA
  proves learners rely on it and it scales. This is direct support for World English's
  pronunciation stance.
- **Bears on.** [P5](../docs/pronunciation.md#rule-p5--connected-speech-is-optional-never-required)
  and [P6](../docs/pronunciation.md#rule-p6--sentence-rhythm-is-optional-syllable-timing-is-acceptable)
  (careful, syllable-timed speech is always correct); the core lexicon.

### ASD-STE100 Simplified Technical English (STE)

- **What it was.** A controlled natural language for technical documentation: **~65 writing
  rules** plus a **dictionary of approved / non-approved words**. Developed in the **late
  1970s** by **AECMA** (European aerospace industry) at airlines' request; first issued as the
  *AECMA Simplified English Guide* in **1986**.
- **What it tried.** Enforce **one word = one meaning**, one part of speech per word, short
  sentences, and active voice, so non-native mechanics could safely read maintenance manuals.
- **What happened.** Thriving and mandatory across aerospace/defense; now owned by **ASD** and
  maintained by the **STE Maintenance Group** (became an international specification in 2005;
  the organization states it became an international standard in 2025 — ⚠ vendor-stated, not
  independently confirmed).
- **Lesson for WoE.** The single closest precedent to World English's *method*: a hard rule
  set plus a controlled lexicon, proven to work **where safety and intelligibility matter
  most**. "One word, one meaning" and "prefer active voice" are STE rules World English
  reaches independently.
- **Bears on.** [S3](../docs/style.md#rule-s3--one-word-one-meaning-avoid-heavy-polysemy)
  (one meaning), [S2](../docs/style.md#rule-s2--prefer-plain-verbs-over-phrasal-verbs) (plain
  verbs), [G9](../docs/grammar.md#rule-g9--passive-voice)+[S1](../docs/style.md#rule-s1--fixed-subjectverbobject-order)
  (prefer active), and the whole controlled-grammar approach.

### Globish

- **What it was.** A ~1,500-word subset of English formalized and named (a *global* + *English*
  portmanteau) by **Jean-Paul Nerrière** in **2004** — a former IBM executive who had observed
  non-native speakers communicating with each other through the 1990s.
- **What it tried.** Codify the "common ground" non-natives already use for international
  business — explicitly "not a language" but a pragmatic tool for intelligibility, not
  nativeness.
- **What happened.** Persists as a commercial teaching brand (books, a foundation) rather than
  an institutional standard.
- **Lesson for WoE.** **Intelligibility, not native-likeness, is the right target** — Globish's
  founding insight matches World English's philosophy that ease and clarity outrank
  fluency-flavored polish.
- **Bears on.** The whole subset philosophy ([README](../README.md#what-is-world-english));
  the ~1.5–3k core-lexicon target (to-do item 8).

### Plain English / Plain Language movement

- **What it was.** A movement to make public, legal, and government writing clear. Key
  institutions: the **UK Plain English Campaign (founded 1979** by Chrissie Maher) and the
  **US Plain Writing Act of 2010** (signed October 13, 2010; US roots go back to 1970s
  paperwork-reduction efforts).
- **What it tried.** Eliminate jargon, gobbledygook, and officialese; require clear language
  the public can actually understand.
- **What happened.** Institutionalized and ongoing — mandatory for US federal agencies,
  influential in drafting standards worldwide.
- **Lesson for WoE.** Plain phrasing is **adoptable at scale when it is guidance backed by
  authority**, and it targets sentence- and document-level clarity — the exact scope of
  World English's style spec.
- **Bears on.** The entire [style.md](../docs/style.md) spec (S1–S7).

---

## B. Reforms that failed

The common thread: each asked the general public to **spell or read differently**, or existed
only as a **proposal**. All failed or stalled. The only spelling changes in history that stuck
are the **conservative subset** — which is precisely the line World English draws in
[O4](../docs/orthography.md#rule-o4--what-is-deliberately-left-alone)/[O5](../docs/orthography.md#rule-o5--respell-ough-words-only-where-an-informal-form-already-exists):
**adopt an already-common form, never coin a new one.**

### Noah Webster's spelling reforms

- **What it was.** Americanized spellings promoted in Webster's *Compendious Dictionary*
  (**1806**) and *American Dictionary* (**1828**).
- **What it tried.** A mix of conservative regularizations and radical phonetic respellings.
- **What happened — the key data point.** The **conservative** changes became standard
  American English: *color* (‹ colour), *center* (‹ centre), *-ize*, *defense/offense*,
  *traveled* (single *-l-*), *plow*, *check*. The **radical** ones **all failed**: *tho, thru,
  tung, wimmen, fether, iland* — Webster himself dropped several by 1828.
- **Lesson for WoE.** The sharpest lesson in the whole file: **the same reformer's
  conservative changes survived and radical ones died.** World English's
  [O1](../docs/orthography.md#rule-o1--one-dialect-one-spelling) adopts exactly Webster's
  *winning* set (color/center/-ize) and its [O4](../docs/orthography.md#rule-o4--what-is-deliberately-left-alone)/[O5](../docs/orthography.md#rule-o5--respell-ough-words-only-where-an-informal-form-already-exists)
  restraint refuses exactly his *losing* set — except *thru/tho*, which O5 permits **only
  because they have since become common informal spellings** (the very condition Webster's
  versions lacked in 1806).
- **Bears on.** [O1](../docs/orthography.md#rule-o1--one-dialect-one-spelling) (the successful
  subset), [O4](../docs/orthography.md#rule-o4--what-is-deliberately-left-alone)/[O5](../docs/orthography.md#rule-o5--respell-ough-words-only-where-an-informal-form-already-exists)
  (the coinage line).

### Simplified Spelling Board (SSB)

- **What it was.** A US reform body **announced 1906**, **funded by Andrew Carnegie** (annual
  sums; the exact figure varies by source — ⚠ do not cite a single precise number). Members
  included Melvil Dewey and Mark Twain among the backers.
- **What it tried.** Promote simplified spellings, publishing a **300-word list** in 1906
  (over half of which were already common American forms).
- **What happened.** **President Theodore Roosevelt ordered the Government Printing Office to
  adopt the list in August 1906**; **Congress reversed it in December 1906** and Roosevelt
  rescinded the order. The reform collapsed and never recovered.
- **Lesson for WoE.** **Top-down, mandated respelling fails even with a president and a
  fortune behind it.** This is the strongest argument for keeping World English's orthography
  *light, optional, and legible* rather than a decreed rewrite — and for delivering
  predictability through the separate
  [respelling key](../docs/pronunciation.md) instead of changing the base spelling.
- **Bears on.** [O4](../docs/orthography.md#rule-o4--what-is-deliberately-left-alone) (restraint);
  the whole orthography/pronunciation split.

### Cut Spelling

- **What it was.** A reform scheme by **Christopher Upward**, published by the **Simplified
  Spelling Society** (handbook, **1991**).
- **What it tried.** Delete *redundant* letters (not full phonetic spelling) — shorter words,
  better sound-symbol fit.
- **What happened.** No adoption; a niche enthusiast scheme.
- **Lesson for WoE.** Even **modest, principled letter-deletion** fails to spread when it
  touches ordinary spelling broadly. World English's
  [O2](../docs/orthography.md#rule-o2--drop-purely-silent-etymological-letters) does the same
  *kind* of thing (dropping silent *b* in *debt* → *det*) but confines it to a **short list of
  the worst offenders**, precisely to avoid Cut Spelling's fate.
- **Bears on.** [O2](../docs/orthography.md#rule-o2--drop-purely-silent-etymological-letters)
  (keep it small).

### Initial Teaching Alphabet (ITA)

- **What it was.** A **44-character** augmented alphabet devised by **Sir James Pitman**,
  introduced in English schools in **1961** as a *transitional* medium for teaching young
  children to read, before switching to standard spelling around age 7.
- **What it tried.** Make early reading easier with a near-phonemic symbol set, then hand off
  to normal orthography.
- **What happened.** Faded by the 1970s. The fatal flaw was **transfer**: children struggled
  to move from ITA back to standard spelling, and ITA reading material was scarce.
- **Lesson for WoE.** A phonetic learning layer must **not replace** the real orthography, or
  the transfer problem bites. World English's
  [respelling key](../docs/pronunciation.md#rule-p1--every-word-carries-a-respelling) is
  deliberately a **parallel annotation** over unchanged spelling — the opposite of ITA's
  replace-then-transfer design — so there is nothing to transfer *away from*.
- **Bears on.** [P1](../docs/pronunciation.md#rule-p1--every-word-carries-a-respelling)/[P2](../docs/pronunciation.md#rule-p2--the-respelling-alphabet-one-symbol-per-sound)
  (respelling as a separate layer, not a new orthography).

### Quirk's Nuclear English

- **What it was.** A concept proposed by **Randolph Quirk** (~**1982**) for a restricted,
  culture-neutral "nuclear" core of English for international use. ⚠ Corroborated via the
  World Englishes literature (e.g. Close 1985), not Quirk's own encyclopedia entry; do **not**
  confuse it with the unrelated later "Nuclear English" for the nuclear-power industry.
- **What it tried.** Strip English to an unambiguous common core suitable as an international
  medium.
- **What happened.** **It stayed a proposal.** It was never worked out into a full system or
  adopted — cited in the literature as a notable but unrealized idea.
- **Lesson for WoE.** The cautionary twin: a good *idea* for a reduced international English,
  never built, so it changed nothing. World English's answer is **methodology** — write the
  specs, dogfood them ([samples.md](../docs/samples.md)), and build the tooling — so it does
  not remain, like Nuclear English, a proposal.
- **Bears on.** The [README methodology](../README.md#methodology) and the tooling backlog
  (to-do items 11–13); the samples/regression discipline.

---

## C. The empirical base on international intelligibility

The subsets and reforms above are *precedent*; this section is *evidence* — research on what
actually helps or hurts understanding between non-native speakers. It is where prior art both
**contradicts** and **corroborates** specific World English rules.

### Jenkins' Lingua Franca Core (LFC) — a real contradiction

- **What it was.** An empirically-derived set of pronunciation priorities from **Jennifer
  Jenkins**, *The Phonology of English as an International Language* (**2000**), based on what
  did and did not cause breakdowns between non-native speakers of English as a Lingua Franca.
- **What it found.** **Core** (needed for intelligibility): most consonants, **word-initial
  consonant clusters**, **vowel length** contrasts, and **nuclear/contrastive stress**
  placement. **Non-core** (variation tolerated, treat as accent): **the *th* sounds /θ/ and
  /ð/**, fine **vowel quality**, **lexical word-stress** placement, weak forms/schwa,
  stress-timed rhythm, and attitudinal intonation.
- **Where it contradicts WoE.** Three places, recorded honestly — and now **resolved
  deliberately** (see [to-do.md](../docs/to-do.md) item 18): P3 and P4 are kept on
  reading-aid grounds, P7's spoken divergence is accepted.
  1. **The *th* split.** Jenkins found /θ/ and /ð/ are **non-core and safely substitutable**
     (with /t d/, /s z/, /f v/) without harming international intelligibility. Yet
     [P3](../docs/pronunciation.md#rule-p3--th-is-split-in-the-key) *keeps and distinguishes*
     them. World English's justification is on the **writing/disambiguation** side (the
     *th*/*dh* key marks minimal pairs like *breath*/*breathe*) and its
     [scope note](../docs/pronunciation.md#scope-note--contrasts-the-respelling-cant-remove)
     already concedes that *producing* /θ/ stays ordinary learner effort. **The LFC says that
     effort is unnecessary for being understood** — and WoE agrees on the spoken axis: a
     speaker may substitute and still be understood. **Resolved: the split is kept** because
     it lives on the reading-aid axis (marking minimal pairs in the key), which the LFC's
     spoken finding does not bear on.
  2. **Word stress.** [P4](../docs/pronunciation.md#rule-p4--stress-is-always-marked-never-guessed)
     invests heavily in marking lexical stress on every word; the LFC rates *lexical* stress
     **non-core** (only *nuclear/contrastive* stress is essential). World English's marking is
     still defensible as a *reading aid*, but it is not, per Jenkins, load-bearing for
     intelligibility. **Resolved: the marking is kept** as a reading aid, not claimed as an
     intelligibility requirement.
  3. **Question intonation.** The LFC rates **grammatical intonation non-core**, yet
     [P7](../docs/pronunciation.md#rule-p7--intonation-carries-only-the-question) — as
     redesigned — deliberately *load-bears* rising intonation for the yes/no question. This one
     **flipped**: before the redesign P7 said intonation carries no grammatical load, which the
     LFC *supported*; the choice to let questions ride on pitch (rather than coin a particle)
     turned it into a divergence. World English still treats *attitudinal* intonation as
     non-load-bearing (aligned with the LFC); only the *question* now rides on pitch, and it is
     mitigated in writing by the leading `?`. **Resolved: the divergence is accepted** — one
     bounded pitch contrast is worth avoiding a coined question particle.
- **Where it agrees with WoE.** The LFC rates **stress-timed rhythm** non-core — direct
  empirical support for
  [P6](../docs/pronunciation.md#rule-p6--sentence-rhythm-is-optional-syllable-timing-is-acceptable)
  (syllable-timing is fine) — and its treatment of **attitudinal** intonation as non-core
  matches P7 for everything except the question. Its emphasis on **vowel length over quality**
  aligns with [P2](../docs/pronunciation.md#rule-p2--the-respelling-alphabet-one-symbol-per-sound)
  keeping length contrasts (*book* BUUK vs *moon* MOON).
- **Bears on.** [P2](../docs/pronunciation.md#rule-p2--the-respelling-alphabet-one-symbol-per-sound),
  [P3](../docs/pronunciation.md#rule-p3--th-is-split-in-the-key) (**contradiction**),
  [P4](../docs/pronunciation.md#rule-p4--stress-is-always-marked-never-guessed) (**partial
  contradiction**), [P6](../docs/pronunciation.md#rule-p6--sentence-rhythm-is-optional-syllable-timing-is-acceptable)
  (support), [P7](../docs/pronunciation.md#rule-p7--intonation-carries-only-the-question)
  (**partial divergence — question intonation**).

### Creole & learner-English convergence — strong corroboration

- **What it is.** English-based creoles and adult **learner interlanguage** independently
  simplify English in strikingly similar ways, under the shared pressure of reduced/imperfect
  input (Bickerton's *Language Bioprogram Hypothesis*, 1981/1984, and the World Englishes /
  ELF literature). ⚠ Bickerton's *strong* universalist claim is **contested** among creolists
  (substrate and gradualist accounts compete), so this is best read as a **robust descriptive
  tendency**, not a settled law.
- **The convergent features — several of which WoE independently reinvented:**
  - **Loss of third-person singular *-s*** → World English
    [M3](../docs/morphology.md#rule-m3--no-third-person--s).
  - **Preverbal negation** (a single *not*/*no* before the verb) → World English
    [G6](../docs/grammar.md#rule-g6--regular-questions-and-negation-no-do-support) (*I not
    like it*, *Not go!*).
  - **Invariant / generalized tags** (one fixed tag regardless of the main clause) → World
    English's invariant [G6](../docs/grammar.md#rule-g6--regular-questions-and-negation-no-do-support)
    tag *right?*.
  - **Regularized / analytic tense-marking** (reduced inflection, periphrastic markers,
    regularized past) → World English [M1](../docs/morphology.md#rule-m1--all-verbs-are-regular)
    (*-ed* everywhere) and [G1](../docs/grammar.md#rule-g1--a-leaner-tenseaspect-system) (a
    leaner tense set).
- **Lesson for WoE.** These moves are **not arbitrary designer choices** — they are where
  English repeatedly *lands* when simplified by real speakers. That is strong evidence they
  are learnable and natural, and a good rebuttal to "but that's not how English works."
- **Bears on.** [M1](../docs/morphology.md#rule-m1--all-verbs-are-regular),
  [M3](../docs/morphology.md#rule-m3--no-third-person--s),
  [G1](../docs/grammar.md#rule-g1--a-leaner-tenseaspect-system),
  [G6](../docs/grammar.md#rule-g6--regular-questions-and-negation-no-do-support).

---

## What the pattern tells World English

| Prior art | Verdict | What it tells World English |
| --------- | ------- | --------------------------- |
| Basic English, VOA, STE, Globish, Plain English | **survived** | Subsets in a bounded domain, backed by institutions, work. Don't reform spelling; constrain vocabulary and grammar and stay legible. |
| Webster (radical set), SSB, Cut Spelling, ITA | **failed** | Public respelling fails; only the conservative subset ever sticks. Adopt existing forms, never coin; keep the phonetic layer separate from the orthography. |
| Quirk's Nuclear English | **stalled** | A proposal that is never built changes nothing. Ship specs, dogfood, and tool. |
| Jenkins' LFC | **contradicts (th, word-stress, question intonation)** | Keeping /θ/–/ð/, marking lexical stress, and load-bearing question intonation are not required for intelligibility — the tension is now **resolved** (item 18): P3/P4 kept as reading aids, P7's spoken divergence accepted. |
| Creole / interlanguage convergence | **corroborates** | No 3rd-sg *-s*, preverbal negation, invariant tags, regularized past are what English becomes when simplified — natural, not arbitrary. |

---

## Sources & references

**A — Subsets**
- Basic English — https://en.wikipedia.org/wiki/Basic_English
- VOA Learning English — https://en.wikipedia.org/wiki/Learning_English_(version_of_English)
- Simplified Technical English (ASD-STE100) — https://en.wikipedia.org/wiki/Simplified_Technical_English ;
  https://www.asd-ste100.org/about_STE.html *(2025 "international standard" claim is vendor-stated)*
- Globish — https://en.wikipedia.org/wiki/Globish_(Nerri%C3%A8re)
- Plain English — https://en.wikipedia.org/wiki/Plain_English_Campaign ;
  https://en.wikipedia.org/wiki/Plain_Writing_Act_of_2010

**B — Reforms**
- Webster's reforms — https://www.merriam-webster.com/grammar/noah-websters-spelling-wins-and-fails ;
  https://en.wikipedia.org/wiki/English-language_spelling_reform
- Simplified Spelling Board / Roosevelt 1906 — https://en.wikipedia.org/wiki/Simplified_Spelling_Board ;
  https://www.history.com/news/theodore-roosevelt-spelling-controversy *(Carnegie dollar figure varies by source)*
- Cut Spelling — https://en.wikipedia.org/wiki/Cut_Spelling
- Initial Teaching Alphabet — https://en.wikipedia.org/wiki/Initial_Teaching_Alphabet ;
  https://www.britannica.com/topic/Initial-Teaching-Alphabet
- Nuclear English — Close, R.A. (1985), "Nuclear English: A Pedagogical Viewpoint," *World
  Englishes* 4(3) — https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-971X.1985.tb00373.x ;
  Quirk, R. (1982), *Style and Communication in the English Language* *(not on Quirk's
  Wikipedia page — corroborated via the World Englishes literature)*

**C — Empirical base**
- Jenkins, J. (2000), *The Phonology of English as an International Language*, OUP —
  https://en.wikipedia.org/wiki/Lingua_Franca_Core ; https://eprints.soton.ac.uk/65985/
- Creole/interlanguage convergence — https://en.wikipedia.org/wiki/Creole_language ;
  APiCS (negation typology) https://apics-online.info/parameters/100.chapter.html ;
  Bickerton, D. (1981) *Roots of Language* and (1984) *The Language Bioprogram Hypothesis*
  *(strong universalist claim is contested — treat as a descriptive tendency)*

> **Caveat.** Dates and outcomes above were web-verified (2026), but several figures (Carnegie's
> SSB funding, STE's "2025 standard" status) and one theoretical claim (Bickerton's bioprogram)
> are flagged as source-dependent or contested. Where prior art contradicts a World English rule
> — most importantly the LFC on /θ/–/ð/ — the contradiction was recorded honestly and is now
> resolved deliberately (§C; [to-do.md](../docs/to-do.md) item 18): the diverging rules are
> kept, on reading-aid grounds for P3/P4 and as an accepted spoken trade-off for P7.
