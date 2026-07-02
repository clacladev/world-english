# Orthography — Spelling Regularization

> Fixes [§1 Spelling & Orthography](../resources/IRREGULARITIES.md#1-spelling--orthography).
> Companion to [pronunciation.md](pronunciation.md).

This is the **most conservative** spec in World English. Per design principle 3 (*stay
legible*), spelling changes are kept light: a page of World English must still read like
English to an English reader. The heavy lifting of "spelling predicts sound" is carried by
the **respelling key** in [pronunciation.md](pronunciation.md), *not* by rewriting every
word phonetically. So we only fix the worst, highest-frequency offenders, and we record
what we deliberately leave alone.

---

## Rule O1 — One dialect, one spelling

**Rule.** Where British and American English differ in spelling, World English adopts a
single form. The chosen base is the **shorter, more phonetic** variant (largely the
American set), applied as regular patterns:

| Pattern | Standard (BrE / AmE) | World English |
| ------- | -------------------- | ------------- |
| `-our` → `-or` | colour / color | **color** |
| `-re` → `-er` | centre / center | **center** |
| `-ise` → `-ize` | realise / realize | **realize** |
| `-ogue` → `-og` | catalogue / catalog | **catalog** |
| `-ce` → `-se` (noun/verb) | defence / defense | **defense** |
| single `-l-` in inflection | travelled / traveled | **traveled** |
| `-ae-/-oe-` → `-e-` | encyclopaedia / encyclopedia | **encyclopedia** |

**Problem it solves.** The British/American split forces every learner to pick a camp and
still read the other. One spelling halves the surface to learn.

**Examples.** *colour → color*, *organise → organize*, *centre → center*,
*programme → program*, *defence → defense*.

**Divergence & trade-off.** None from American English; a visible but trivially-readable
divergence from British English. The rule is mechanical and reversible by a translator.

---

## Rule O2 — Drop purely silent etymological letters

**Rule.** Remove letters that are *never pronounced* and were inserted only to show a
Latin/Greek root, **provided the word stays recognizable**.

**Problem it solves.** Silent letters like the *b* in *debt* are pure memorization with no
payoff — *debt* is not even from a Latin *-b-* word natively; the letter was added by
Renaissance scholars (see [§1](../resources/IRREGULARITIES.md#1-spelling--orthography)).

**Examples.**

| Standard | World English | Silent letter removed |
| -------- | ------------- | --------------------- |
| debt | **det** | b |
| doubt | **dout** | b |
| receipt | **receit** | p |
| island | **iland** | s |
| subtle | **suttle** | b |

**Divergence & trade-off.** Departs from standard spelling, but each result is still
read aloud the same way and recognized at a glance. We do **not** touch silent letters that
help distinguish a word or that anchor a very common spelling pattern (see O4).

---

## Rule O3 — One consonant-doubling rule

**Rule.** Double a final consonant before a vowel-initial suffix **only** when the final
syllable is stressed and ends in a single vowel + single consonant. Apply it the same way
regardless of dialect.

**Problem it solves.** Standard English doubling is inconsistent across dialects
(*travelling*/*traveling*) and hard to predict.

**Examples.** *refer → referred* (stressed final syllable, doubles), *travel → traveled*
(unstressed, does not), *stop → stopped*, *offer → offered*, *begin → beginned* (stressed
final, doubles), *open → opened* (unstressed, does not).

**Divergence & trade-off.** Matches American practice; removes the British double-`l`
exceptions. One rule, no list.

---

## Rule O4 — What is deliberately left alone

To stay legible, World English does **not**:

- **Phonetically respell common words.** *knight* stays *knight*, *night* stays *night*,
  *light*, *through* (see O5), *one*, *two*, *who*. Rewriting these (*nite*, *thru*) would
  make the page look alien for little gain — predictability comes from the respelling key
  in [pronunciation.md](pronunciation.md), not from mutilating the spelling.
- **Merge homophones.** *flour/flower*, *their/there/they're*, *hear/here* keep distinct
  spellings — collapsing them would *lose* information, not simplify.
- **Touch proper nouns, brand names, or loanwords** still felt as foreign.
- **Reform `-tion`, `-ough` in retained words, or vowel digraphs** beyond the cases above.
  These are noted as *known residue*: predictable via the pronunciation key, not yet
  respelled.

**Why the restraint.** Principle 1 (*subtract before you add*) and principle 3 (*stay
legible*) jointly cap how much spelling we change. Aggressive phonetic spelling is a
*different project*; World English keeps the written word recognizable and lets the
pronunciation layer carry predictability.

---

## Rule O5 — `through` and the worst `ough` words (optional, flagged)

**Rule (provisional).** The single most-cited offender, `ough` (8–9 sounds, see
[§1](../resources/IRREGULARITIES.md#1-spelling--orthography)), is regularized **only** for
the highest-frequency words, toward their actual sound:

| Standard | World English | Sound |
| -------- | ------------- | ----- |
| through | **thru** | /θruː/ |
| though | **tho** | /ðoʊ/ |
| although | **altho** | /ɔːlˈðoʊ/ |

**Divergence & trade-off.** *thru* and *tho* are already common informal spellings, so the
divergence is mild and familiar. We stop here rather than respelling *thought, cough,
rough, bough* — those are left to the pronunciation key (O4) to avoid a cascade of
unfamiliar forms. This rule is **flagged for review**: it is the boundary case between
"light cleanup" and "phonetic reform."

---

## Cross-spec note

Every spelling kept by O4 must still be *pronounceable from the key* in
[pronunciation.md](pronunciation.md). The two specs are maintained together: if a future
revision respells a word here, its entry in the pronunciation key changes in lockstep.
