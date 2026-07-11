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

**Scope — a closed, enumerated list.** O2 is deliberately narrow: it respells exactly the
five words below, and no others. It is not a productive rule a writer applies to new words;
it is a fixed list, closed here. Every other silent-letter word from
[§1](../resources/IRREGULARITIES.md#1-spelling--orthography)'s list (*knight, gnome, write,
comb, honest, Wednesday, colonel*) is kept as-is under [O4](#rule-o4--what-is-deliberately-left-alone),
which now names them explicitly — so there is no word left in an undefined middle ground.

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
  *light*, *one*, *two*, *who*. Rewriting these (*nite*, *lite*, *wun*) would make the page
  look alien for little gain — predictability comes from the respelling key in
  [pronunciation.md](pronunciation.md), not from mutilating the spelling. The **one
  exception** is the `ough` set, and only where a conventional informal spelling already
  exists (*through → thru*): that narrow case is [O5](#rule-o5--respell-ough-words-only-where-an-informal-form-already-exists)'s
  job, and O4 defers to it — the boundary is "adopt an existing informal form, never coin a
  new one," so O4 and O5 never disagree about a given word.
- **Kept silent-letter words (outside O2's closed list).** *gnome*, *write*, and *comb* keep
  their silent letters for the same reason as *knight* above — each anchors a very common
  spelling pattern (*gn-*, *wr-*, *-mb*) shared by many other kept words, so touching one
  would only make it an inconsistent outlier among the rest. **`honest`, `Wednesday`, and
  `colonel`** are also explicitly kept: each is low enough frequency, and its silent/altered
  letters distinctive enough as a whole-word shape, that respelling would cost recognizability
  for little predictability gain — exactly O2's own "provided the word stays recognizable"
  test, applied here to say *no*. Together with O2's five-word list, this closes every word
  named in [§1](../resources/IRREGULARITIES.md#1-spelling--orthography)'s silent-letter
  example set: each is either respelled by O2 or explicitly kept here — none is left
  undecided.
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

## Rule O5 — Respell `ough` words only where an informal form already exists

**Rule.** The single most-cited offender, `ough` (8–9 sounds, see
[§1](../resources/IRREGULARITIES.md#1-spelling--orthography)), is regularized toward its
actual sound **only for words that already have a conventional informal respelling in
common use**:

| Standard | World English | Sound |
| -------- | ------------- | ----- |
| through | **thru** | /θru/ |
| though | **tho** | /ðoʊ/ |
| although | **altho** | /ɔlˈðoʊ/ |

**The stopping criterion.** The list stops where it does for a *principled* reason, not an
arbitrary one: *thru*, *tho*, and *altho* are already everyday informal spellings, so
adopting them changes nothing a reader hasn't already seen. We do **not** respell *thought,
cough, rough, bough, thorough* — none of these has an established informal form, so
respelling them would mean **inventing** new spellings. That is precisely the
phonetic-reform line O4 refuses to cross: unfamiliar coinages (*thot*, *cof*, *ruf*) trade
legibility for predictability the pronunciation key already supplies. So the boundary is:
**adopt an existing informal spelling; never coin a new one.**

**Divergence & trade-off.** Mild and familiar — these three forms are already in wide
informal use. Every other `ough` word keeps its standard spelling and is made predictable
by the respelling key in [pronunciation.md](pronunciation.md), consistent with O4.

---

## Cross-spec note

Every spelling kept by O4 must still be *pronounceable from the key* in
[pronunciation.md](pronunciation.md). The two specs are maintained together: if a future
revision respells a word here, its entry in the pronunciation key changes in lockstep.

**IPA convention.** This spec's IPA follows [pronunciation.md](pronunciation.md#rule-p2--the-respelling-alphabet-one-symbol-per-sound)'s
rhotic General American convention throughout, including its choice **not** to mark vowel
length (`ː`): GA does not phonemically contrast vowel length the way length marks imply, so
transcriptions here write */θru/*, not */θruː/*. Any IPA appearing in this document should
be read against that same convention.
