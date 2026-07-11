# Samples — Dogfooding & Regression Test

> Worked translations of real English into World English, annotated rule-by-rule. This file
> is the project's **regression test**: it applies the whole ruleset at once, so any spec
> change that breaks a sample — or any sample that needs a rule the specs don't have — is
> caught here.

Each passage is given three ways: the **standard English** original, the **World English**
translation, and a **per-sentence annotation** naming every rule applied (`[M1]`, `[G2]`, …).
Where a sentence needs a construction the specs do **not** yet cover, it is **flagged inline**
and logged in [`to-do.md`](to-do.md) — never silently improvised.

Rule keys: `O*` [orthography](orthography.md) · `P*` [pronunciation](pronunciation.md) ·
`M*` [morphology](morphology.md) · `G*` [grammar](grammar.md) · `S*` [style](style.md) ·
`W*` [writing](writing.md).

---

## Passage 1 — News paragraph

**Standard English**

> The mayor announced yesterday that the city has built a new hospital. It was designed by a
> famous architect and cost fifty million dollars. Officials say it will open in September.
> Many residents have waited years for better health care.

**World English**

> The mayor announced yesterday that the city builded new hospital. It beed designed by
> famous architect and costed fifty million dollars. Officials say that it will open on
> September. Many residents wait gooder health care for years.

**Annotations**

1. *…the city builded new hospital.* — `[M1]` build → **builded** · `[G1]` present perfect
   *finished action* → simple past (the hospital is already complete; the tense is licensed by
   the content clause's own finished-ness, not by *yesterday*, which is the **matrix** clause's
   time word for *announced*) · `[G2]` drop indefinite article (*a new hospital* →
   **new hospital**) · `[G14]` content clause: complementizer **that** kept after *announced*.
   *announced* is already regular (`[M1]`, no change).
2. *It beed designed by famous architect and costed fifty million dollars.* — `[G9]` passive
   *be + -ed* (**beed designed**) · `[M2]` was → **beed** · `[G2]` drop *a* · `[M1]` cost →
   **costed** (no more zero-past).
3. *Officials say that it will open on September.* — `[M4]` official → **officials** ·
   `[G14]` content clause: complementizer **that** kept after *say* — always kept, never
   dropped, so *Officials say **that** it will open* (not *officials say it will open*) ·
   `[G7]` future **will** kept · `[G3]` time preposition defaults to **on** (*in September* →
   **on September**).
4. *Many residents wait gooder health care for years.* — `[M4]` **residents** (already standard
   English here — *many residents* needed no `[G5]` transformation; `[G5]` fires only where an
   uncountable noun is forced to count, which does not happen in this sentence) · `[G1]`
   present perfect *still ongoing* → **present tense** (they are still waiting) · `[G3]` drop
   verb-selected *for* (*wait for X* → **wait X**) · `[M5]` better → **gooder** · `[S5]`
   duration keeps **for** (*for years*).
   ✅ **Resolved** ([G3 *for* test](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs)):
   *wait X* (dropped object-*for*) and *for years* (kept duration-*for*) both follow the rule —
   keep *for* only before a length of time, drop it otherwise.
   **Legibility note.** This sentence stacks three reforms at once — transitive *wait*
   (dropped object-*for*), the present-for-still-true mapping, and the kept duration *for* —
   and the result is the corpus's hardest sentence to parse: an English reader's first pass
   reads *wait* as intransitive and stumbles on the bare NP *gooder health care* before
   recovering. Recorded here as a real legibility cost of combining reforms, not smoothed over.

---

## Passage 2 — Dialogue

**Standard English**

> "Have you seen my keys?" asked Tom.
> "No, I haven't. Did you look under the sofa?" said Mary.
> "I already looked there. I can't find them anywhere."
> "Maybe they are in your coat. You should check the pockets."

**World English**

> "?You seed mes keys?" Tom asked.
> "No. ?You looked under the sofa?" Mary sayed.
> "I already looked there. I can not find them anywhere."
> "Maybe they be in yous coat. You should check the pockets."

**Annotations**

1. *?You seed mes keys? Tom asked.* — `[G6]` yes/no question marked by the **leading `?`**
   (rising intonation in speech; no *do*, no inversion) · `[G1]` present perfect → simple past ·
   `[M1]` see → **seed** · `[G4]` my → **mes** · `[M4]` **keys** · `[S1]` undo the *asked Tom*
   inversion → **Tom asked**.
2. *No. ?You looked under the sofa? Mary sayed.* — `[G6]` short answer is invariant **No.**
   (no *I haven't* echo) · `[G6]` **leading `?`** + rising intonation, no *do*-support · `[M1]`
   look → **looked**, say → **sayed** · `[G3]` keep **under** (real spatial relation) · `[S1]`
   undo inversion.
3. *I already looked there. I can not find them anywhere.* — `[S5]` **already** carries the
   perfect's relevance · `[M1]` **looked** · `[G6]`/`[G7]` modal negation **can not** (*not*
   after the modal, before the verb) · `[G4]` **them** (object form).
4. *Maybe they be in yous coat. You should check the pockets.* — `[G7]` sentence adverb
   **maybe**, modal **should** · `[M2]` are → **be** · `[G3]` keep **in** (containment, a
   real relation) · `[G4]` your → **yous** · `[M4]` **pockets**.

---

## Passage 3 — Instructions

**Standard English**

> To make tea, first boil the water. Put a tea bag in a cup and pour the hot water over it.
> Wait for three minutes, then remove the bag. Add milk or sugar if you like. Do not drink it
> while it is too hot.

**World English**

> To make tea, first boil the water. Put tea bag in cup and pour the hot water over it. Wait
> for three minutes, then remove the bag. Add milk or sugar if you like. Not drink it while
> it be too hot.

**Annotations**

1. *To make tea, first boil the water.* — unchanged; `[G2]` **the water** stays (definite,
   the specific water you are boiling). `[G13]` *to make* is the plain *to* + base infinitive.
2. *Put tea bag in cup and pour the hot water over it.* — `[G2]` drop *a* twice (**tea bag**,
   **cup**) · `[G3]` keep **in** and **over** (real spatial relations) · **the hot water**
   stays definite.
3. *Wait for three minutes, then remove the bag.* — `[S5]` keep **for** (it marks a
   **duration**, so it is not the droppable verb-selected *for*) · **the bag** definite.
   ✅ **Resolved** ([G3 *for* test](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs)):
   *for* is kept because *three minutes* is a span, not the thing awaited.
4. *Add milk or sugar if you like.* — `[G2]` no article on **milk** / **sugar** (indefinite) ·
   `[G8]` *if* + natural present tense · `[G15]` *if* as the condition subordinator.
5. *Not drink it while it be too hot.* — `[G6]` negative imperative **Not drink** (no
   *do*-support) · `[M2]` is → **be** · `[G15]` *while* (time — during), trailing clause, no comma.

---

## Passage 4 — Personal narrative

**Standard English**

> Last year I went to Japan with my two children. We took the train from Tokyo to Kyoto. The
> food was better than I expected, and the people were very kind. My son said that it was the
> best trip of his life. We have already booked our tickets to go again next spring.

**World English**

> Last year I goed to Japan with mes two childs. We taked the train from Tokyo to Kyoto. The
> food beed gooder than I expected, and the persons beed very kind. Mes son sayed that it beed
> the goodest trip of hims life. We already booked uss tickets to go again next spring.

**Annotations**

1. *Last year I goed to Japan with mes two childs.* — `[M1]` go → **goed** · `[G3]` keep
   **to** (direction) and **with** (accompaniment) · `[G4]` my → **mes** · `[M4]` child →
   **childs**.
2. *We taked the train from Tokyo to Kyoto.* — `[M1]` take → **taked** · `[G3]` keep
   **from**/**to** (direction) · **the train** definite.
3. *The food beed gooder than I expected, and the persons beed very kind.* — `[M2]`
   was/were → **beed** · `[M5]` better → **gooder** · `[M4]` people → **persons** · `[M1]`
   expect → **expected**.
4. *Mes son sayed that it beed the goodest trip of hims life.* — `[G4]` my → **mes**, his →
   **hims** · `[M1]` say → **sayed** · `[M2]` was → **beed** · `[M5]` best → **goodest** ·
   `[G14]` reported speech: complementizer **that** kept, natural tense (no backshift) ·
   `[G10]` keep **of** — a fixed superlative frame (*trip of hims life*), not a possession, so
   the *of*-genitive is preferred over *hims life's*.
   ✅ **Resolved:** [G14](grammar.md#rule-g14--content-clauses-and-reported-speech) settles the
   reported clause (keep *that*, no backshift — *beed* is past because the trip is over), and
   [G10](grammar.md#rule-g10--noun-possessive)'s `'s`-vs-*of* boundary keeps *of* here.
5. *We already booked uss tickets to go again next spring.* — `[S5]` **already** (dropped
   perfect) · `[M1]` book → **booked** · `[G4]` our → **uss** · `[G13]` *to go* plain
   infinitive of purpose.

---

## Passage 5 — Feedback note

**Standard English**

> You all worked more quickly this year, so more of you passed the test. Next time, plan
> more carefully.

**World English**

> You all worked more quickly this year, so more of you all passed the test. Next time, plan
> more carefully.

**Annotations**

1. *You all worked more quickly this year, so more of you all passed the test.* — `[G4]`
   plural *you* → **you all**, subject and object alike; the subject *you all* is already the
   SE original's form (no transformation there), so the actual `[G4]` transformation in this
   sentence is the **object** *of you* → **of you all** · `[M1]` **worked** / **passed**
   (already regular) · `[M5]` `-ly` adverb comparative via the **optional *more/most* escape
   hatch** (*more quickly* kept, over the regular *quicklier*) · `[M5]` quantifier **more of**
   (escape hatch, over the regular *manyer of*) · `[G15]` *so* (result) subordinator · `[S7]`
   the comparative phrase **more quickly** stays in its natural **post-verb** position (*worked
   more quickly*), the stated exception to S7's single-word pre-verb slot for multi-word
   comparative adverb phrases — fronting it (*more quickly worked*) would read worse than the
   order it replaces.
2. *Next time, plan more carefully.* — `[M5]` `-ly` adverb comparative, again the **escape
   hatch** *more carefully* (over *carefullier*) · `[S7]` **more carefully** likewise stays
   post-verb under the same comparative-adverb-phrase exception · `[S7]` the time adjunct
   **Next time** is **fronted** for topicalization, a licensed option (clause-final is only the
   unmarked position). This passage exercises item-17: `you all` plus the optional `more/most`
   hatch — *more/most* is valid World English, so the linter does not flag it.

---

## Passage 6 — Multi-paragraph text (exercises the writing rules)

Passages 1–5 are single paragraphs, so they cannot test the document-level rules
([writing.md](writing.md) W1–W6). This passage is two paragraphs, chosen to exercise the
punctuation set, thesis-first shape, topic sentences, explicit connectives, and repeat-don't-vary
reference.

**Standard English**

> The new library is very popular. The university built it because students needed a quiet place
> to study. The library offers three things: fast internet, long hours, and many books. Students
> use the facility every day.
>
> The building was expensive; however, the university thinks it was worth the cost. Donors gave
> most of the money, so tuition stayed low. Also, it created many jobs. For example, it hired
> twenty students last term.

**World English**

> The new library be very popular. The university builded it because students needed quiet place
> to study. The library offer three things: fast internet, long hours, and many books. Students
> use the library every day.
>
> The university think that the building beed worth the cost. But the building beed expensive.
> Donors gived most of the money, so tuition stayed low. Also, the library created many jobs.
> For example, the library hired twenty students last term.

**Annotations**

*Paragraph 1 — one idea (the library is popular), point first.*

1. *The new library be very popular.* — `[W3]`/`[W4]` topic sentence states the paragraph's one
   idea first · `[M2]` is → **be**.
2. *The university builded it because students needed quiet place to study.* — `[M1]` build →
   **builded** · `[G2]` drop *a* (**quiet place**) · `[W5]`/`[G15]` explicit **because** carries
   the reason · `[G13]` *to study* plain infinitive.
3. *The library offer three things: fast internet, long hours, and many books.* — `[W1]` the
   **colon** is kept — a **list** follows — with the always-present serial comma · `[M4]`
   **hours**/**books** (*many books* was already standard English here — no `[G5]`
   transformation fires; `[G5]` matters only where an uncountable noun is forced to count,
   which isn't the case for *books*) · third-person *offers* → **offer**
   ([M3](morphology.md), no agreement).
4. *Students use the library every day.* — `[W6]` **repeat the noun** *the library* instead of
   the elegant variation *the facility*.

*Paragraph 2 — one idea (the building was worth the cost), point first.*

5. *The university think that the building beed worth the cost. But the building beed
   expensive.* — `[W3]`/`[W4]` topic sentence leads with the paragraph's one idea — **worth the
   cost** — instead of the SE original's concession-first order (*The building was expensive;
   however…*); the concession now follows as the paragraph's second, supporting sentence, as
   point-first requires · `[G14]` content clause: complementizer **that** kept after *think* ·
   `[W1]` the standard **semicolon** is abolished → two sentences · `[W5]` *however* → **but**
   (one connective per relation) · `[M2]` was → **beed** (twice) · third-person *thinks* →
   **think** ([M3](morphology.md)) · `[W6]` **the building** is repeated instead of a pronoun
   *it* in the first sentence — the semicolon's collapse into two clauses puts *the university*
   nearer to any pronoun than *the building*, so W6's nearest-antecedent rule requires the noun,
   not *it*, here.
6. *Donors gived most of the money, so tuition stayed low.* — `[M1]` give → **gived** · `[W5]`
   result connective **so**, with the `[W1]` comma before a coordinator joining two independent
   clauses.
7. *Also, the library created many jobs. For example, the library hired twenty students last
   term.* — `[W5]` addition **also** and illustration **for example** · `[W6]` *it* → **the
   library** repeated for an unmistakable reference · `[M1]` **created**/**hired** (already
   regular).

This passage needed no construction the specs do not cover — every mark, connective, and
reference resolved by rule.

---

## Passage 7 — Email (exercises the pragmatics rules)

A short email — the setting §7 singles out (*"students who omit greetings and closings are
perceived as impolite"*). It exercises the [style.md](style.md) pragmatics rules inside a real
message: the fixed politeness markers ([S8](style.md#rule-s8--fixed-politeness-markers-not-graded-indirectness))
and the plain speech-act templates ([S9](style.md#rule-s9--plain-templates-for-the-hard-speech-acts)).

**Standard English**

> Hello Sara,
>
> Thank you. I saw your message about the meeting on Friday. I am sorry, but I cannot come,
> because I will be away. Could you please send me the notes? I will read them next week.
>
> Goodbye,
> Tom

**World English**

> Hello Sara,
>
> Thank you. I seed yous message about the meeting on Friday. No. Sorry, I can not come, because
> I will be away. Please send me the notes. I will read them next week.
>
> Goodbye,
> Tom

**Annotations**

1. *Hello Sara,* — `[S9]` fixed email **greeting** (omitting it reads as impolite).
2. *Thank you.* — `[S9]` invariant **thanks**.
3. *I seed yous message about the meeting on Friday.* — `[M1]` see → **seed** · `[G4]` your →
   **yous** · `[G3]` keep **about**/**on** (real relations) · `[G1]` finished action → past tense.
4. *No. Sorry, I can not come, because I will be away.* — `[S8]`/`[S9]` **refusal** template:
   invariant **No.** + plain reason, with the **optional `Sorry` softener** (permitted, never
   required) — not graded indirectness (standard *I'm terribly sorry, but I'm afraid I won't be
   able to…* → direct) · `[G6]` modal negation **can not** · `[W5]`/`[G15]` explicit **because** ·
   `[G7]` future **will**.
5. *Please send me the notes.* — `[S8]`/`[S9]` **request** template: **please** + plain
   imperative (`[G6]`, no *do*), replacing the graded *Could you possibly…?* · `[G4]` **me**.
6. *I will read them next week.* — `[G7]` **will** · `[G4]` **them** (object) · time adjunct
   *next week* stays clause-final.
7. *Goodbye, Tom* — `[S9]` fixed email **closing**.

This passage needed no construction the specs do not cover — every speech act resolved by an
S8/S9 template.

---

## Passage 8 — Tense-aspect spread (exercises the perfect's replacements)

Passages 1–7 touch the dropped perfect only in passing (a stray *already* or *for years*).
This passage packs the full [G1](grammar.md#rule-g1--a-leaner-tenseaspect-system) tense/aspect
range into one paragraph: present-perfect-with-**since**, **continuous aspect** (present and
past), **past perfect**, **future perfect**, and the relevance words **`just`** / **`yet`** —
each rendered by G1's one deterministic test (*still true?* → tense) plus an
[S5](style.md#rule-s5--state-relevance-explicitly-cover-for-the-dropped-perfect) time word.

**Standard English**

> I have lived in this city since 2015, and I still work in the same office. I have studied
> English for three years, and I am still learning it. By next June, I will have finished my
> degree. When you called, I had already gone home, because I was feeling tired. I have not
> seen the new film yet, but my sister has just watched it.

**World English**

> I live in this city since 2015, and I still work in the same office. I study English for
> three years, and I be still learning it. By next June, I finish mes degree. When you called,
> I already goed home, because I beed feeling tired. I not see the new film yet, but mes
> sister just watched it.

**Annotations**

1. *I live in this city since 2015, and I still work in the same office.* — `[G1]` present
   perfect *still true* → **present tense** (*have lived* → **live**; the residence continues) ·
   `[S5]` **since** kept for a **starting point** (*since 2015*) and **still** carries the
   ongoing relevance · `[G3]` keep **in** twice (real spatial relation).
2. *I study English for three years, and I be still learning it.* — `[G1]` present perfect
   *still true* → **present** (*have studied* → **study**) · `[S5]` **for** kept for a
   **duration** (*for three years*) · `[G1]` **continuous aspect** *am + -ing* → **be
   learning** (present continuous) · `[M2]` am → **be** · `[S5]` **still**.
3. *By next June, I finish mes degree.* — `[G1]` **future perfect** → **present tense** + a
   time word (*will have finished* → **finish**; *By next June* carries the completion) ·
   `[G4]` my → **mes**.
4. *When you called, I already goed home, because I beed feeling tired.* — `[G1]` **past
   perfect** → **simple past** + a time word (*had already gone* → **already goed**; *already*
   carries the earlier-past) · `[M1]` go → **goed** · `[S5]` **already** · `[G1]` **past
   continuous** *was + -ing* → **beed feeling** · `[M2]` was → **beed** · `[G15]` **when** /
   **because** subordinators, natural tense.
5. *I not see the new film yet, but mes sister just watched it.* — `[G1]` present perfect
   *still true* (negative) → **present tense** (*have not seen* → **not see**; the film remains
   unseen) · `[S5]` **`yet`** carries the ongoing relevance · `[G6]` negation **not** before the
   verb, no *do*-support · `[G1]` present perfect *finished* → **past tense** (*has just watched*
   → **just watched**) · `[S5]` **`just`** carries the relevance the perfect used to · `[G4]`
   my → **mes** · **the new film** stays definite.

This passage needed no construction the specs do not cover — every tense-aspect case resolved
by [G1](grammar.md#rule-g1--a-leaner-tenseaspect-system)'s *still-true?* test plus an
[S5](style.md#rule-s5--state-relevance-explicitly-cover-for-the-dropped-perfect) time word.

---

## Passage 9 — Short exchange (closes dogfooding blind spots)

Review 2's Theme 6 audit found that Passages 1–8 never exercise several rules at all — most
notably **G11 relative clauses** (the largest single blind spot), G10's `'s` possessive, a
wh-question, a `will`/`would` result clause, and a real *much → many* substitution. This short
passage targets exactly those gaps; it is not a narrative, just a compact set of sentences
built to fire the rules the rest of the corpus never touches.

**Standard English**

> Where do you live now? Sara's neighbor is the man we met last year. If you have much
> homework, you will stay home. Many visitors listen to music while they wait for the bus.

**World English**

> ?Where you live now? Sara's neighbor be the man that we meeted last year. If you have many
> homeworks, you will stay home. Many visitors listen music while they wait the bus.

**Annotations**

1. *?Where you live now?* — `[G6]` **wh-question**: the question word **where** moves to the
   front, no dummy *do*, and the rest keeps normal SVO order (*you live now*, not *do you live*).
2. *Sara's neighbor be the man that we meeted last year.* — `[G10]` the noun possessive **'s**
   is kept unchanged (**Sara's**) — the one construction that still takes an apostrophe, unlike
   the apostrophe-less pronoun possessive elsewhere in this file (`[G4]`: *mes*, *hims*) ·
   `[G11]` **relative clause**: invariant **that** introduces the clause and is kept even though
   standard English drops it here (the SE original's zero relative *the man we met* has no
   relativizer at all) · `[M1]` meet → **meeted** · `[M2]` is → **be**.
3. *If you have many homeworks, you will stay home.* — `[G5]` determiner **much → many**
   (*much homework* → **many homeworks**; *homework* pluralizes like every other noun now that
   the uncountable category is removed) · `[G8]` **predictive conditional**: the *if*-clause
   stays present tense and the result clause marks a real/expected outcome with **will**.
4. *Many visitors listen music while they wait the bus.* — `[G3]` drop the verb-selected
   preposition twice: *listen to* → **listen**, *wait for* → **wait** (the bus is the thing
   awaited, not a duration, so the not-duration guard drops *for* — see the item-16/G3 *for*
   test) · `[G15]` **while** (time — during), trailing clause, no comma.

This passage needed no construction the specs do not cover; it exists to close the blind spots
[review.md](review.md) issue #46 identified, not to showcase a new one.

---

## Gaps this file surfaced — now closed

Dogfooding turned up four constructions the specs did not cover. Each was logged in
[`to-do.md`](to-do.md) (item 16) and has since been **fixed by rule**:

1. ✅ **The *for* test — duration vs. thing-awaited.**
   [G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs) now states it: keep
   *for* only before a length of time (*for three minutes*), drop it otherwise (*wait the
   bus*). Wired into both translators.
2. ✅ **Reported speech / content clauses.**
   [G14](grammar.md#rule-g14--content-clauses-and-reported-speech): complementizer *that* is
   always kept, and the reported clause takes its natural tense (no backshift, per G1).
3. ✅ **The *of*-genitive vs. G10 *'s*.**
   [G10](grammar.md#rule-g10--noun-possessive) now draws the boundary: `'s` for genuine
   possession, *of* for relational and fixed superlative frames (*trip of hims life*).
4. ✅ **Subordinating conjunctions.**
   [G15](grammar.md#rule-g15--subordinating-conjunctions): a closed, one-per-meaning set
   (*if, unless, because, altho, when, while, before, after, until, so that, so*), natural
   tense, fixed comma placement.

---

## Keeping this file honest

`samples.md` is a **regression test**, not decoration. Per
[docs/README.md](README.md#status), **every future spec change must re-run these passages**
and keep them consistent: if a rule changes, the affected sentences and annotations here
change with it, and any newly-uncovered construction is flagged and sent to
[`to-do.md`](to-do.md) rather than quietly translated.
