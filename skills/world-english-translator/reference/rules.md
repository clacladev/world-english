# World English rules — distilled

Source: World English (WoE) `docs/{orthography,pronunciation,morphology,grammar,style,writing}.md`
(CC BY 4.0, [clacladev/world-english](https://github.com/clacladev/world-english)), distilled for
translation use. This file states each rule; it does not restate the problem it solves or the
trade-off — read the source specs for that.

Rule keys: `O*` orthography · `M*` morphology · `G*` grammar · `S*` style (sentence-level
guidance) · `W*` writing (document-level guidance).

## The translate-vs-judge split

World English ships a **deterministic** translator that applies only closed-class, unambiguous
transforms and **flags** everything that needs part-of-speech or semantic judgment — it never
guesses. You are the judgment layer: apply the deterministic transforms below exactly (consulting
`data/*.json` for the closed lists), **and** resolve the flagged cases using the rule text, since
you can read part of speech and meaning where a mechanical scanner cannot.

**Deterministic (apply mechanically, use `data/*.json` for the closed lists):**
- `be`, irregular verbs (M1), irregular plurals (M4), suppletive comparatives (M5) — look up in
  `data/irregular-verbs.json`, `data/irregular-plurals.json`, `data/abolished-forms.json`.
- British→American spelling, silent-letter drops, `ough` respellings (O1/O2/O5) — see
  `data/abolished-forms.json`.
- `whom` → `who` (G4).
- Phrasal verbs (S2) — `data/lexicon.json`'s `phrasalVerbs` array (`give up` → `quitted`, inflected
  forms included). Skip any entry with `"confidence": "low"` unless context clearly resolves the
  polysemy the note describes.

**Judgment (the deterministic tool flags these; you resolve them):**
- Third-person `-s` drop (M3), article drop (G2), do-support removal (G6), homograph
  disambiguation, and the perfect→tense mapping (G1) — all need to know the sentence's part of
  speech or whether a situation still holds, which the rules below make explicit enough to decide
  from context.

Never silently improvise a construction the rules below don't cover — flag it the way
`docs/samples.md` does (see "Notes format" below), stating what's uncertain.

## Spelling (O)

- **O1 — One spelling.** American spelling only. *colour → color*, *centre → center*,
  *realise → realize*, *catalogue → catalog*, *defence → defense*, *travelled → traveled*.
- **O2 — Drop silent letters.** A closed five-word list only: *debt → det*, *doubt → dout*,
  *receipt → receit*, *island → iland*, *subtle → suttle*. No other word.
- **O3 — One doubling rule.** Double a final consonant only after a stressed single vowel +
  single consonant, before a vowel-initial suffix. *stop → stopped*, *travel → traveled*
  (unstressed, no doubling), *refer → referred*.
- **O4 — Left alone.** Everything else keeps its standard spelling — *knight*, *write*, *comb*,
  *honest*, *Wednesday*, *colonel* are unchanged. Do not invent phonetic spellings.
- **O5 — `ough` respelling, closed list.** Only *through → thru*, *though → tho*,
  *although → altho* (existing informal spellings). Never *thought, cough, rough, bough, thorough*.

## Word forms (M)

- **M1 — All verbs regular.** Past tense and past participle are the same `-ed` form for every
  verb, no exceptions. Look up the standard irregular in `data/irregular-verbs.json` and
  regularize: silent final `-e` → add `-d` (*give → gived*); pronounced-vowel stem → add `-ed`
  (*be → beed*, *go → goed*); consonant + `y` → `-ied` (*try → tried*); stressed
  single-vowel+consonant → double it (*stop → stopped*). *take → taked*, *see → seed*,
  *sing → singed*.
- **M2 — One `be`.** Present (all persons) = **be**; past and participle = **beed**; `-ing` stays
  **being**. *I be here. They beed late.*
- **M3 — No third-person `-s`.** One present-tense form for every person — drop it.
  *he goes → he go*, *she tries → she try*, *it works → it work*, *he has → he have*,
  *she does → she do*. (Judgment case: only fires on a present-tense verb after a 3rd-person
  singular subject.)
- **M4 — All plurals regular.** Every noun takes `-s`/`-es`. Look up the standard irregular in
  `data/irregular-plurals.json`. Consonant+`y` → `-ies` (*city → cities*); `-o` nouns → plain `-s`
  (*hero → heros*, not *heroes*); `-f`/`-fe` nouns → plain `-s` (*knife → knifes*, not *knives*).
  *child → childs*, *foot → foots*, *mouse → mouses*, *man → mans*, *sheep → sheeps*.
- **M5 — Comparatives.** Both `-er`/`-est` and periphrastic `more`/`most` are always valid — pick
  whichever reads better; never the suppletive. *good → gooder/goodest* (or *more good/most
  good*), never *better/best*. *bad → badder/baddest*, never *worse/worst*.
  *many/much → more/most*; *little/few → less/least* (also valid, alongside regular
  *littler/littlest*). Consonant+`y` takes `y→i` (*happy → happier*).
- **M6 — One adverb rule.** Add `-ly`, always, with one exception: *hard* stays zero-derived for
  the manner sense (*hit hard*) because *hardly* is reassigned to mean only "barely." *quick →
  quickly*, *good → goodly* (= "well"), *fast → fastly*.

## Sentence grammar (G)

- **G1 — No perfect; one test.** Three tenses (past/present/future) + optional `-ing`. The
  perfect splits by one test: **still holds** → present tense + time phrase; **finished** → past
  tense + time word. Future perfect (still holds at a future point) also collapses to present +
  time phrase. *I have lived here for ten years → I live here for ten years.* *I have finished →
  I finished already.* *I will have lived here by then → I live here by then.*
- **G2 — One article.** Only **the**, for definite/already-known things (singular or plural — no
  a/an). Indefinite = no article, or a number/quantifier when count matters. Generics take the
  bare plural (never generic *the*+singular or *a*+singular). *I saw a dog → I seed dog.*
  *She is a doctor → She be doctor.* *Dogs are loyal / The dog is a loyal animal / A dog is a
  loyal animal → Dogs be loyal (animals).* (Judgment case: requires knowing whether the referent is
  already known to the reader.)
- **G3 — Prepositions.** Arbitrary time/place choices collapse to one default each: time (point or
  part of day) → **on** (*on 3, on Monday, on July, on the morning*); location → **in** (*in the
  shop, in home*); motion → **to**; arriving → **arrive to**. Real spatial/relational prepositions
  (*on* = surface, *under*, *between*, *with*, directional *to*) keep their meaning unchanged. A
  verb keeps its own standard preposition as vocabulary — never drop it (*listen to*, *wait for*,
  *depend on*, *look at* are untouched). Particles that *change* the verb's meaning are S2's job,
  not G3's (*look after → mind*, via `data/lexicon.json`).
- **G4 — Pronoun case.** Standard forms unchanged, one change only: *whom* → **who** always
  (*the man whom I saw → the man who I seed*). *whose* is kept. Don't touch *my/mine/his/her/…*.
- **G5 — All nouns countable.** Every noun can pluralize (via M4); no uncountable category.
  Determiner *much* → **many** (but *little/few* keep *less/least* as a valid alternative to
  *littler/littlest*, per M5 — not forced to *fewer*). *some information → informations*,
  *a piece of advice → one advice*, *much homework → many homeworks*. The **degree-adverb** *much*
  (*much gooder*, intensifying a comparative) is untouched — only the noun-quantifier *much*
  swaps.
- **G6 — No do-support.** No dummy *do*, no subject–verb inversion. Wh- question: front the
  question word, keep SVO after it. Yes/no question: nothing moves; mark with a trailing `?` in
  writing (rising intonation in speech). Negative: **not** immediately before the main verb, in
  every clause type including *be*, continuous, passive, existential (*I not be living*, *It not
  be red*, *There not be problem*). If a pre-verb adverb is also present, `not` comes first, closer
  to the verb. Modal negation: *modal + not + verb* (*I will not go*, *She can not swim*).
  Negative imperative: *Not go!* (never *No go!* — *No* is reserved for the short answer). Short
  answers are invariant **Yes**/**No**, no auxiliary echo. Existential *there is/are* → invariant
  **there be** (past **there beed**). Embedded questions keep the wh-word or **whether** (never
  *if*) but use plain declarative order, no fronting. Tag questions collapse to invariant
  **right?**. *Do you like it? → You like it?* *Who did you call? → Who you called?*
  *I do not like it → I not like it.*
- **G7 — Four modals.** **can** (ability/possibility/permission), **must**
  (obligation/necessity), **should** (advice), **will** (future). Drop *could, may, might, have
  to, need to, shall, ought to*. Finer probability shades come from adverbs (*maybe, probably,
  certainly*) before the verb. No past `-ed`/`-ing` on modals; past/hypothetical comes from time
  words or G8. *It may rain → Maybe it will rain.* *You ought to rest → You should rest.*
- **G8 — One conditional shape.** `if` + clause, natural tense (never backshifted), + result
  clause. Generic/zero: both clauses present tense, no will/would (*If it rain, the ground get
  wet*). Predictive (real/expected): result takes **will** (*If it rain, I will go*).
  Hypothetical/unreal: result takes **would** (*If I have money, I would buy it*). Past-unreal
  uses a time word, since there's no perfect. *If I had known, I would have told you → If I knowed
  before, I would tell you.*
- **G9 — Passive.** `be` + the verb's `-ed` form, optional `by`-phrase. *The house was built by
  them → The house beed builded by them.* Style prefers active (S1); use passive only when the
  agent is unknown/irrelevant.
- **G10 — Noun possessive kept.** Standard `'s` (singular) / `s'` (plural), unchanged — apostrophe
  is what keeps plural/possessive/plural-possessive apart in writing now that every plural ends in
  `-s`. *the child's toy*, *the childs' toys*. Use **'s**/pronoun-possessive for genuine
  possession; keep **of** for part-whole, relational, and fixed superlative frames (*the captain
  of the team*, *the goodest trip of his life*) — the two aren't interchangeable, don't force one
  over the other.
- **G11 — `that` everywhere.** One invariant word, **that**, introduces every relative clause
  (people or things, subject or object) and every content clause (object of a reporting/mental
  verb) — **never dropped**, even where standard English drops it or uses *who/whom/which*.
  Possessive relatives use a resumptive pronoun instead of *whose* (*the man that his car
  breaked*). No restrictive/non-restrictive comma distinction — no comma on a relative clause,
  ever. Content clauses take **natural tense, no backshift** — apply G1's still-holds test
  regardless of the reporting verb's tense. *the man whom I saw → the man that I seed.*
  *he said (that) it was cold (now over) → he sayed that it beed cold.* *he said he lived there
  (and still does) → he sayed that he live there.*
- **G12 — Verb complementation.** Complement is always **to + base verb** — no gerund/infinitive
  choice (*enjoy doing* / *want to do* both become *to*-infinitive). Two closed exceptions take
  the **bare infinitive**: modals (*must go*, never *must to go*) and causative/perception verbs
  (*let, make, help, see, hear* + object + bare verb: *Let him go*, *I saw him fall*). *I enjoy
  swimming → I enjoy to swim.* *She finished eating → She finished to eat.* No subjunctive
  anywhere — indicative only, including after *insist/demand/suggest* (*I insist that he go → I
  insist that he goes*) and in *if I were you → if I be you*.
- **G13 — Subordinators, one per meaning.** condition **if** · negative condition **unless** ·
  cause **because** (not *since/as/for*) · concession **altho** (not *though/even though*) ·
  time-point **when** · time-during **while** (not *whilst*) · sequence **before/after/until**
  (not *till*) · purpose **so that** · result **so** (not *and so/therefore*). Natural tense, no
  backshift. Comma: a **leading** subordinate clause takes a comma; a **trailing** one takes none.

## Sentence-level style (S) — guidance, apply by default

- **S1 — Fixed SVO.** No fronting, inversion, or clefting. *Never have I seen it → I never seed
  it.* *It was John who called → John called.*
- **S2 — Plain, single-sense words.** Prefer the plain word over: an opaque phrasal verb (use
  `data/lexicon.json`'s `phrasalVerbs`: *give up → quit*, *look after → mind*; transparent
  phrasals like *sit down* are fine, leave them), a rare/heavily-polysemous sense (*run a business
  → manage*, *get a letter → receive*), an idiom (*bite the bullet → accept the hard thing*), or an
  arbitrary collocation (*heavy rain → strong rain*, *make a decision → decide*). Boundary with
  G3: G3 keeps a verb's meaning-neutral preposition; S2 only swaps particles that change the
  verb's meaning.
- **S3 — Explicit time words cover the dropped perfect.** *already, since, still, just, yet, until
  now, so far.* Use **for** for a duration, **since** for a starting point — that split is real,
  keep it. *I have finished → I already finished.*
- **S4 — One adverb slot.** Manner/frequency/degree adverbs go immediately before the main verb
  (after any modal/`be`); sentence adverbs (*maybe, probably*) may lead the clause instead. `not`
  takes the same slot and comes first if both are present. Exception: a multi-word periphrastic
  comparative phrase (*more quickly*, *more carefully*) stays in its natural post-verb position,
  not fronted. Time/place adjuncts keep their clause-final spot (fronting one for emphasis is
  still allowed). *He drives carefully → He carefully drive.* *She worked more quickly.* (comparative
  phrase, post-verb, exception to the rule)
- **S5 — Fixed politeness markers, no graded indirectness.** **please** (request) + plain
  imperative; **No.** + plain reason (+ optional **Sorry** softener) for a refusal; **Sorry.** +
  what happened for an apology; invariant **Thank you.** Directness is neutral, not rude — never
  soften with a longer indirect phrasing (*Could you possibly…* → *Please…*).

## Document-level writing (W) — guidance, apply for multi-sentence text

- **W1 — One punctuation set.** No semicolon (→ period, or a W5 connective). Colon only
  introduces a list (a non-list colon → period or connective; clock times/ratios untouched).
  Comma has one closed set of jobs: **boundary** (after a fronted clause/adjunct/connective;
  before *and/but/so* joining independent clauses; before *then* in a sequence), **list**
  (between every item, serial comma always present, including a list of clauses), **set-off**
  (direct address, *please/sorry*, a greeting name, the trailing tag before `right?`, a trailing
  duration afterthought). No restrictive/non-restrictive comma ever.
- **W2 — One plain register.** No formal/informal split — write the same way to a professor and a
  friend.
- **W3 — Point first.** State the claim/conclusion first, then support it — no build-up.
- **W4 — One idea per paragraph.** First sentence states it; every other sentence supports only
  that idea.
- **W5 — Explicit connectives, one per relation.** addition **and/also** · contrast **but**
  (not *however/nevertheless/yet*) · result **so** (not *therefore/thus/hence*) · reason
  **because** · illustration **for example** (not *e.g.*) · sequence **then**. Never leave a
  logical link implicit or carried by punctuation alone.
- **W6 — Repeat, don't vary.** Repeat the noun rather than swap in a synonym ("elegant
  variation"). Every pronoun's antecedent must be unambiguous — use the noun instead if a pronoun
  would be unclear.

## Data files

- `data/irregular-verbs.json` — `{base, past, pp}` triples for M1; regularize with the M1
  spelling sub-rules above. Some entries carry `"homograph": true` (the abolished form is also a
  valid standard word, e.g. *saw*) — leave those untouched unless the sentence unambiguously calls
  for the World English form.
- `data/irregular-plurals.json` — `{singular, plural}` pairs for M4; regularize `singular` with
  M4's sub-rules.
- `data/abolished-forms.json` — `{abolished, woe, class, rule}` entries for `be`, comparatives,
  British spellings, silent letters, `ough`, and the POS-dependent classes. Direct
  abolished→World-English mapping.
- `data/lexicon.json` — `phrasalVerbs` (S2, apply the `plain` replacement; skip
  `"confidence": "low"` entries unless context resolves the ambiguity noted in `note`); the other
  arrays (`sensePreferences`, `collocations`, `falseFriends`, `registerDefaults`) are doc-only
  background for judgment calls, not machine-applied.

## Notes format

Notes are **opt-in** — default output is the clean translation with no annotation. When asked to
"explain," "annotate," or "add notes," append a per-sentence annotation exactly like
`docs/samples.md`: after each translated sentence, list the rules applied, each tagged in
brackets, e.g. `[M1] go → goed`, `[G2] drop indefinite article`, `[G11] that kept after "said"`.
Chain multiple rules on one line with ` · `. If a construction the rules above don't cover shows
up, **flag it inline** rather than guessing — say what's uncertain and why, the same way
`docs/samples.md` calls out an unresolved case instead of inventing a form.
