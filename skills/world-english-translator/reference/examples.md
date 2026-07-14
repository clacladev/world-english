# Worked examples

Lifted from `docs/samples.md` (the project's gold regression corpus, CC BY 4.0) — read these
alongside `rules.md` as few-shot anchors for the notes format and for how deterministic and
judgment cases interleave in real text.

## SE → WoE, with notes

**Standard English**

> "Have you seen my keys?" asked Tom.
> "No, I haven't. Did you look under the sofa?" said Mary.
> "I already looked there. I can't find them anywhere."
> "Maybe they are in your coat. You should check the pockets."

**World English**

> "You seed my keys?" Tom asked.
> "No. You looked under the sofa?" Mary sayed.
> "I already looked there. I can not find them anywhere."
> "Maybe they be in your coat. You should check the pockets."

**Notes**

1. *You seed my keys? Tom asked.* — `[G6]` yes/no question, trailing `?`, no *do*/inversion ·
   `[G1]` present perfect → simple past · `[M1]` see → **seed** · `[S1]` undo *asked Tom*
   inversion → **Tom asked**. (*my* is standard — G4 leaves it unchanged.)
2. *No. You looked under the sofa? Mary sayed.* — `[G6]` invariant short answer **No.** (no
   *I haven't* echo) · `[M1]` look → looked, say → **sayed** · `[G3]` keep **under** (real
   spatial relation).
3. *I already looked there. I can not find them anywhere.* — `[S3]` **already** carries the
   perfect's relevance · `[G7]`/`[G6]` modal negation **can not** · `[G4]` **them** (standard
   object form).
4. *Maybe they be in your coat. You should check the pockets.* — `[G7]` sentence adverb
   **maybe**, modal **should** · `[M2]` are → **be** · `[G3]` keep **in** (containment, a real
   relation).

## SE → WoE, personal narrative (dense M/G coverage)

**Standard English**

> Last year I went to Japan with my two children. We took the train from Tokyo to Kyoto. The
> food was better than I expected, and the people were very kind. My son said that it was the
> best trip of his life. We have already booked our tickets to go again next spring.

**World English**

> Last year I goed to Japan with my two childs. We taked the train from Tokyo to Kyoto. The
> food beed gooder than I expected, and the persons beed very kind. My son sayed that it beed
> the goodest trip of his life. We already booked our tickets to go again next spring.

**Notes**

1. `[M1]` go → **goed** · `[G3]` keep **to**/**with** (direction/accompaniment) · `[M4]` child →
   **childs**.
2. `[M1]` take → **taked** · `[G3]` keep **from**/**to** (direction).
3. `[M2]` was/were → **beed** · `[M5]` better → **gooder** · `[M4]` people → **persons** ·
   `[M1]` expect → **expected**.
4. `[M1]` say → **sayed** · `[M2]` was → **beed** · `[M5]` best → **goodest** · `[G11]` **that**
   kept, natural tense · `[G10]` keep **of** (fixed superlative frame *trip of his life*, not
   possession — not *his life's*).
5. `[S3]` **already** (dropped perfect) · `[M1]` book → **booked** · `[G12]` *to go* plain
   infinitive of purpose.

## SE → WoE, email (pragmatics templates, no notes)

Notes are opt-in — this is the default clean-translation output a plain "translate this" request
gets, no annotation.

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
> Thank you. I seed your message about the meeting on Friday. No. Sorry, I can not come, because
> I will be away. Please send me the notes. I will read them next week.
>
> Goodbye,
> Tom

Note how the graded-indirectness request *Could you please send me the notes?* becomes the flat
`[S5]` template **please** + plain imperative, and the refusal becomes invariant **No.** + reason
with an optional **Sorry** softener — never a longer, softer paraphrase.

## SE → WoE, short exchange (G11 relative clause, G10 possessive, G5, G8)

**Standard English**

> Where do you live now? Sara's neighbor is the man we met last year. If you have much
> homework, you will stay home. Many visitors listen to music while they wait for the bus.

**World English**

> Where you live now? Sara's neighbor be the man that we meeted last year. If you have many
> homeworks, you will stay home. Many visitors listen to music while they wait for the bus.

**Notes**

1. `[G6]` wh-word **where** fronts, rest keeps SVO, no *do*.
2. `[G10]` noun possessive **'s** kept (**Sara's**) · `[G11]` relative clause: invariant **that**
   kept even though the SE original has a zero relative (*the man we met*) · `[M1]` meet →
   **meeted** · `[M2]` is → **be**.
3. `[G5]` determiner **much → many** (*much homework → many homeworks*) · `[G8]` predictive
   conditional: *if*-clause present tense, result clause **will**.
4. `[G3]` verb-selected prepositions kept: *listen **to***, *wait **for*** (vocabulary, not
   dropped).

## WoE → SE (reverse direction)

The reverse direction restores standard English. Lossless classes (irregular verbs/plurals,
comparatives, silent letters, `ough`) restore uniquely; lossy classes (`be`'s collapsed forms,
`-ed` pasts that also stand for the participle) restore to a canonical default and get flagged in
notes mode, since the original distinction can't be recovered from the WoE text alone.

**World English** → **Standard English**

> She taked the childs to see the mouses. → She took the children to see the mice.
> The house beed builded by them. → The house was built by them. *(flag: `beed` collapses
> was/were — `was` chosen as the canonical default; `builded` collapses built/build's participle
> — `built` chosen the same way.)*
