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
`M*` [morphology](morphology.md) · `G*` [grammar](grammar.md) · `S*` [style](style.md).

---

## Passage 1 — News paragraph

**Standard English**

> The mayor announced yesterday that the city has built a new hospital. It was designed by a
> famous architect and cost fifty million dollars. Officials say it will open in September.
> Many residents have waited years for better health care.

**World English**

> The mayor announced yesterday that the city builded new hospital. It beed designed by
> famous architect and costed fifty million dollars. Officials say it will open on September.
> Many residents wait gooder health care for years.

**Annotations**

1. *…the city builded new hospital.* — `[M1]` build → **builded** · `[G1]` present perfect
   → simple past (finished action; the hospital now exists, no time word needed) · `[G2]`
   drop indefinite article (*a new hospital* → **new hospital**). *announced* is already
   regular (`[M1]`, no change).
2. *It beed designed by famous architect and costed fifty million dollars.* — `[G9]` passive
   *be + -ed* (**beed designed**) · `[M2]` was → **beed** · `[G2]` drop *a* · `[M1]` cost →
   **costed** (no more zero-past).
3. *Officials say it will open on September.* — `[M4]` official → **officials** · `[G7]`
   future **will** kept · `[G3]` time preposition defaults to **on** (*in September* →
   **on September**).
4. *Many residents wait gooder health care for years.* — `[G5]` **many** (all nouns count) ·
   `[M4]` **residents** · `[G1]` present perfect *still ongoing* → **present tense** (they
   are still waiting) · `[G3]` drop verb-selected *for* (*wait for X* → **wait X**) · `[M5]`
   better → **gooder** · `[S5]` duration keeps **for** (*for years*).
   ⚠ **Flag:** *wait X* (dropped *for*) and *for years* (kept *for*) sit in one clause — the
   rule that decides which *for* survives (duration vs. thing-awaited) is only implicit. See
   [to-do.md](to-do.md).

---

## Passage 2 — Dialogue

**Standard English**

> "Have you seen my keys?" asked Tom.
> "No, I haven't. Did you look under the sofa?" said Mary.
> "I already looked there. I can't find them anywhere."
> "Maybe they are in your coat. You should check the pockets."

**World English**

> "Q you seed mes keys?" Tom asked.
> "No. Q you looked under the sofa?" Mary sayed.
> "I already looked there. I can not find them anywhere."
> "Maybe they be in yous coat. You should check the pockets."

**Annotations**

1. *Q you seed mes keys? Tom asked.* — `[G6]` yes/no question marker **Q** (no *do*, no
   inversion) · `[G1]` present perfect → simple past · `[M1]` see → **seed** · `[G4]` my →
   **mes** · `[M4]` **keys** · `[S1]` undo the *asked Tom* inversion → **Tom asked**.
2. *No. Q you looked under the sofa? Mary sayed.* — `[G6]` short answer is invariant **No.**
   (no *I haven't* echo) · `[G6]` **Q** + no *do*-support · `[M1]` look → **looked**, say →
   **sayed** · `[G3]` keep **under** (real spatial relation) · `[S1]` undo inversion.
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
   ⚠ **Flag:** same *for*-ambiguity as Passage 1.4 — here *for* is kept because *three
   minutes* is a span, not the thing awaited. The specs need to state that test. See
   [to-do.md](to-do.md).
4. *Add milk or sugar if you like.* — `[G2]` no article on **milk** / **sugar** (indefinite) ·
   `[G8]` *if* + natural present tense.
   ⚠ **Flag:** *if you like* uses a subordinate clause and the general conjunction *if* beyond
   the [G8](grammar.md#rule-g8--one-conditional-shape) conditional frame; the inventory of
   subordinators (*while*, *because*, *when*) is not yet specified. See [to-do.md](to-do.md).
5. *Not drink it while it be too hot.* — `[G6]` negative imperative **Not drink** (no
   *do*-support) · `[M2]` is → **be**. Uses subordinator *while* (flagged above).

---

## Passage 4 — Personal narrative

**Standard English**

> Last year I went to Japan with my two children. We took the train from Tokyo to Kyoto. The
> food was better than I expected, and the people were very kind. My son said it was the best
> trip of his life. We have already booked our tickets to go again next spring.

**World English**

> Last year I goed to Japan with mes two childs. We taked the train from Tokyo to Kyoto. The
> food beed gooder than I expected, and the persons beed very kind. Mes son sayed it beed the
> goodest trip of hims life. We already booked uss tickets to go again next spring.

**Annotations**

1. *Last year I goed to Japan with mes two childs.* — `[M1]` go → **goed** · `[G3]` keep
   **to** (direction) and **with** (accompaniment) · `[G4]` my → **mes** · `[M4]` child →
   **childs**.
2. *We taked the train from Tokyo to Kyoto.* — `[M1]` take → **taked** · `[G3]` keep
   **from**/**to** (direction) · **the train** definite.
3. *The food beed gooder than I expected, and the persons beed very kind.* — `[M2]`
   was/were → **beed** · `[M5]` better → **gooder** · `[M4]` people → **persons** · `[M1]`
   expect → **expected**.
4. *Mes son sayed it beed the goodest trip of hims life.* — `[G4]` my → **mes**, his →
   **hims** · `[M1]` say → **sayed** · `[M2]` was → **beed** · `[M5]` best → **goodest** ·
   `[G3]` keep **of** (relation).
   ⚠ **Flag:** *sayed it beed…* is **reported speech**, and *of hims life* is an
   **of-genitive** competing with the [G10](grammar.md#rule-g10--noun-possessive) *'s*
   possessive (*hims life's goodest trip*?). Neither reported speech (backshift or not) nor
   the *of* vs *'s* choice is specified. Rendered here with no backshift, on the
   [G8](grammar.md#rule-g8--one-conditional-shape) "natural tense" model. See
   [to-do.md](to-do.md).
5. *We already booked uss tickets to go again next spring.* — `[S5]` **already** (dropped
   perfect) · `[M1]` book → **booked** · `[G4]` our → **uss** · `[G13]` *to go* plain
   infinitive of purpose.

---

## Gaps this file surfaced

Dogfooding turned up constructions the specs do not yet cover. Each is logged in
[`to-do.md`](to-do.md) so it is fixed by rule, not by improvisation:

1. **The *for* test — duration vs. thing-awaited.** [G3](grammar.md#rule-g3--regular-prepositions-for-time-place-and-verbs)
   drops verb-selected *for* (*wait for the bus* → *wait the bus*) while
   [S5](style.md#rule-s5--state-relevance-explicitly-cover-for-the-dropped-perfect) keeps
   duration *for* (*for three minutes*). One clause can hold both; the specs need an explicit
   test for which *for* survives.
2. **Reported speech / content clauses.** *He said (that) it was…* — whether tense
   backshifts, and how the complementizer *that* behaves in nominal clauses, is unspecified.
3. **The *of*-genitive vs. G10 *'s*.** *the trip of his life* vs. *his life's trip* — G10
   fixes the *'s* possessive but does not say when the *of*-phrase is preferred.
4. **Subordinating conjunctions.** *while*, *because*, *when*, *if* (beyond G8's conditional)
   are used on the standard-English model but have no spec of their own.

---

## Keeping this file honest

`samples.md` is a **regression test**, not decoration. Per
[docs/README.md](README.md#status), **every future spec change must re-run these passages**
and keep them consistent: if a rule changes, the affected sentences and annotations here
change with it, and any newly-uncovered construction is flagged and sent to
[`to-do.md`](to-do.md) rather than quietly translated.
