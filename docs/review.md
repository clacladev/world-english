# Full Project Review 2 — Issue Catalogue (2026-07-10)

> The second full review of the World English project, after all Priority 1–3 backlog items
> reached `drafted`/`built`/`resolved`. This is an **issue collection**, not a fix plan: every
> problem, contradiction, forgotten promise, and critique found by re-auditing the initial
> goals ([README](../README.md)), the research base ([`resources/`](../resources)), the
> priorities (`to-do.md`), the specs ([`docs/`](.)), and the tooling
> ([`tools/`](../tools)). A follow-up plan will select, order, and resolve these.

**Method.** Five independent audit passes, each verified against the actual files before
reporting: (1) research→spec traceability, (2) spec internal consistency (every O/P/M/G/S/W
rule cross-checked against every other), (3) tooling code + data + tests (all commands run;
translator/linter/pronouncer probed with adversarial inputs), (4) `samples.md` dogfooding
verification sentence by sentence, (5) project history (all 16 PR bodies, review threads,
and the deleted first `review.md`, recovered from orphaned commit `39c6e25`).

**Baseline at review time:** `bun run lint` clean; `bun run typecheck` clean;
`bun test` → 184 pass / 1 skip (the by-design `espeak-ng` audio test) / 0 fail.
Everything below was found *despite* a green board — which is itself finding #75.

**Reading the catalogue.** Issues are numbered `#1–#106` (stable IDs for the plan). Severity:
**H** = breaks a rule, a promise, or produces wrong output; **M** = real gap or contradiction,
judgment involved; **L** = editorial, stale text, hygiene. Source tags: `[trace]` traceability
audit, `[spec]` consistency audit, `[tool]` tooling audit, `[dog]` dogfooding audit,
`[hist]` history audit. Issues found independently by two or more audits are marked ✕2/✕3.

## Severity summary

| Theme | H | M | L | Total |
| ----- | - | - | - | ----- |
| 1. Punctuation system (W1 vs everything) | 2 | 2 | 2 | 6 |
| 2. Comparatives & quantifiers (M5/G5) | 2 | 4 | 0 | 6 |
| 3. Core grammar gaps & contradictions | 3 | 9 | 2 | 14 |
| 4. Morphology / orthography / pronunciation spec gaps | 1 | 6 | 4 | 11 |
| 5. Philosophy & prior-art tensions | 2 | 3 | 1 | 6 |
| 6. samples.md violations & blind spots | 3 | 4 | 3 | 10 |
| 7. Forward-translator bugs | 3 | 6 | 2 | 11 |
| 8. Reverse-translator bugs | 2 | 2 | 0 | 4 |
| 9. Linter blind spots | 3 | 2 | 2 | 7 |
| 10. Stale claims & doc drift | 0 | 5 | 11 | 16 |
| 11. Data quality | 0 | 2 | 2 | 4 |
| 12. Tests, CI, engineering hygiene | 0 | 2 | 5 | 7 |
| 13. Process & backlog gaps | 0 | 2 | 2 | 4 |
| **Total** | **21** | **49** | **36** | **106** |

---

## Theme 1 — The punctuation system: W1 contradicts the rest of the project

The single highest-leverage cluster. W1 claims a closed inventory that at least six other
rules and five sample passages do not obey.

1. **[H]** W1's comma rule ("exactly three boundaries", `writing.md:23-26`) is violated by
   canonical WoE examples all over the specs and samples: non-restrictive-clause commas
   (`grammar.md:476`), tag-question comma (`grammar.md:288`), vocative/politeness commas
   ("Close the door, please" `grammar.md:82`; "Sorry, I can not come" `samples.md:270`,
   required by S9's own template `style.md:210`), greeting comma ("Hello Sara,"
   `style.md:213`), S5 duration comma (`style.md:109`), connective commas ("Also," /
   "For example," `samples.md:211`, required by W5), leading adjunct commas ("Next time,"
   `samples.md:170`; "By next June," `samples.md:317`), and ", then" (`samples.md:101-102`).
   Either W1's inventory grows or five other rules' examples change. `[spec ✕ dog]`
2. **[H]** style.md's S9 template example puts a comma before a trailing *because*-clause
   ("Sorry, I can not come, because I be busy." `style.md:223`) in direct violation of G15
   ("a trailing one takes none", `grammar.md:583-584`). samples.md inherited the bug in
   Passages 7 and 8 (`samples.md:270`, `:318`) while Passages 3 and 6 follow G15 correctly —
   the corpus is internally inconsistent. `[spec ✕ dog]`
3. **[M]** W1's "small, fixed set" of punctuation omits two marks the language requires:
   the apostrophe (load-bearing for G10 possessives, `grammar.md:430-454`) and the
   exclamation mark (used by G6's canonical imperatives "Not go!" `grammar.md:311,320`;
   `samples.md:118` renders the same construction without one). A learner reading W1 as
   exhaustive cannot produce G10. `[spec ✕ trace]`
4. **[M]** W1/G6 say a question "is bracketed by `?` at both ends" (`writing.md:27-30`,
   `grammar.md:274-276`), but the tag question "It be good, right?" (`grammar.md:288`) has
   only a trailing `?`. Whether tags are exempt is never stated. `[spec]`
5. **[L]** W3's example joins independent clauses with bare commas ("The roads beed icy,
   many drivers haved no experience, and…" `writing.md:110-111`) — legal only if W1's job
   (c) "list items" covers clause lists, which is unstated; under a strict reading the
   spec's own example is a comma splice. `[spec]`
6. **[L]** Whether two coordinated imperative clauses count as "independent clauses" for
   W1(b)'s comma is undefined; `samples.md:101` picks no-comma without a rule. `[dog]`

## Theme 2 — Comparatives and quantifiers: M5 and G5 are mutually inconsistent

7. **[H]** G5 abolishes *less* ("`much` → `many` and `less` → `fewer` **in all cases**",
   `grammar.md:259-261`) while M5 blesses it ("*little/few* take `less`/`least`… valid
   World English", `morphology.md:186-188`) — and to-do item 17 records the M5 side as the
   resolved decision, and the tooling dataset hard-codes "never flag less/least". One spec
   must be amended. `[spec ✕ tool]`
8. **[H]** M5 spells *manyer/manyest* (`morphology.md:152`) two paragraphs before invoking
   the consonant-y → i sub-rule that yields *-lier* for adverbs (`morphology.md:166-172`).
   *many* is consonant+y exactly like *quickly*; the same rule silently not applied, no
   exception stated — a learner cannot derive which spelling is right. `[spec]`
9. **[M]** M5 cites the y→i sub-rule as belonging to "the verb/**plural** rules", but M4
   states no y→i rule at all (only "-s, or -es after a sibilant", `morphology.md:109-111`).
   Dangling cross-reference. `[spec]`
10. **[M]** grammar.md's own showcase of what G5 leaves "untouched" is "*much better*"
    (`grammar.md:261-263`) — but *better* is abolished by M5 ("never *better*",
    `morphology.md:151-162`). Should read *much gooder*; and whether degree *much* even
    survives before comparatives is unstated. `[spec]`
11. **[M]** morphology.md's escape-hatch example presents "*most people*" as valid WoE
    (`morphology.md:185-186`) — *people* is abolished by M4 (samples.md's own annotation
    translates it: "people → persons", `samples.md:145`). `[spec]`
12. **[M]** M5's escape-hatch trigger — "long adjectives", "reads clumsy" — is undefined
    (syllables? letters?), yet the rule makes *more big* ungrammatical, so the boundary is
    load-bearing but underivable. Participial adjectives (*interestinger*? *more tired*?)
    are never classified. The spec acknowledges the grey zone (`morphology.md:156-162`)
    but leaves it unresolved — the exact zone IRREGULARITIES §5 complains natives disagree
    on. `[spec ✕ trace]`

## Theme 3 — Core grammar: contradictions and rules a learner cannot apply

13. **[H]** Negation placement is undefined for *be*-clauses, continuous, passive, and
    existential clauses ("I not be living" or "I be not living"? "There not be problem"?).
    G6 states only "place `not` before the verb" (`grammar.md:279`) and covers no such
    case (`grammar.md:305-329`). Worse: G6 puts *not* before *be* while S7 puts adverbs
    *after* *be* (`style.md:143-146`), so S7's claim that *not* and adverbs "share one
    position rule" (`style.md:163-166`) is false for be-clauses — and the relative order
    of *not* and a pre-verbal adverb ("She not often call" vs "She often not call") is
    undefined. The most learner-critical construction in the language is underivable. `[spec]`
14. **[H]** Wh-question word order: G6 says questions use "**normal word order**"
    (`grammar.md:273-274`), but every example fronts the wh-object ("?Who you called?"
    `grammar.md:287,298`) — which is not normal SVO order. Whether WoE is wh-fronting or
    wh-in-situ ("?You called who?") is underivable from the rule as written. `[spec]`
15. **[H]** The subjunctive has zero trace anywhere. PAIN-POINTS.md:69 lists it alongside
    gerund-vs-infinitive (→ G13), agreement (→ M3), and reported speech (→ G14) — the other
    three all got rules; the subjunctive got no rule, no to-do item, no descope. PR #2
    promised it as "future work". The mandative case (*insist that he be…*) interacts
    directly with G14/M3 and was never ruled on. `[trace ✕ hist]`
16. **[M]** G13's "a verb complement is **always `to` + base verb**" (`grammar.md:521-523`)
    has no modal carve-out, so applied as written it produces "must to go" against G7's
    bare-verb examples (`grammar.md:340-361`). Causative/perception complements
    (*let/make/help/see him go*) are unaddressed entirely. `[spec]`
17. **[M]** G8 says every result clause marks reality "with one word: *will*… *would*"
    (`grammar.md:372-376`), but its own first example has neither ("If it rain, the ground
    get wet", `grammar.md:389`), leaving generic/zero conditionals with no derivable form.
    samples.md hit the same crack (imperative result clause, `samples.md:102`) and did not
    flag it, though `samples.md:10-11` promises flagging uncovered constructions. `[spec ✕ dog]`
18. **[M]** G1's "single deterministic test" (still holds → present; finished → past,
    `grammar.md:17-21`) cannot derive its own future-perfect mapping ("I will have lived
    here by then" → present "I live here by then", `grammar.md:32`): the event is neither
    currently-holding nor finished. The table decrees what the test cannot produce. `[spec]`
19. **[M]** Indirect/embedded questions have no rule at all ("He asked **whether** it
    rained", "I not know **where he goed**") — they fall between G6, G14 (declarative
    *that*-clauses only), and G15 (*if* is condition-only). *whether* is never kept or
    dropped anywhere. `[spec]`
20. **[M]** Zero relatives: G2's example "The information I gived you beed wrong."
    (`grammar.md:56`) drops the relativizer that G11 makes invariant and universal ("*that*
    introduces **every** relative clause", `grammar.md:464-466`) — and the tooling even has
    a dropped-*that* restorer. Whether zero object relatives are legal is contradictory. `[spec]`
21. **[M]** G11's example "Mes car, that be red, be fast." (`grammar.md:476`) keeps the
    non-restrictive comma pair the same rule abolishes ("so is the restrictive/
    non-restrictive comma rule", `grammar.md:466`). `[spec]`
22. **[M]** G4's plural-you possessive "*you all's*" (`grammar.md:235`) takes an apostrophe,
    contradicting G10's rule that pronoun possessives take none — *mes*, *hims*
    (`grammar.md:458-460`). By the stated pattern it should be "you alls". `[spec]`
23. **[M]** G12's second-plural reflexive "*youselfs*" (`grammar.md:504-507`) is built from
    a 2pl object pronoun that G4 says doesn't exist — plural you is "*you all*, subject and
    object alike" (`grammar.md:231-235`). The reflexive of *you all* is undefined; the two
    paradigms describe different pronoun systems. `[spec]`
24. **[M]** Contractions were abolished silently: no rule anywhere states whether *I'm,
    it's, can't* exist in WoE. Every example is uncontracted; W1's punctuation inventory
    is silent on the contraction apostrophe; PAIN-POINTS names *they're/their/there*.
    "Nothing is decided silently" (README:190) — this was. `[trace ✕ spec]`
25. **[L]** G4's prose says pronouns keep "a subject form and a single object/possessive-
    determiner form" (`grammar.md:215-216`); its table shows three forms (*I / me / mes*). `[spec]`
26. **[L]** Standalone possessive pronouns are never ruled on: is "This book be **mes**"
    (= *mine*) grammatical? Implied by the collapsed table column, never stated or
    exemplified. `[spec]`

## Theme 4 — Morphology, orthography, pronunciation: spec gaps

27. **[H]** writing.md's own example column keeps an abolished preposition: "We leaved
    **at** 10:30." (`writing.md:54`) — G3 collapses time-points to *on* ("at 3" → "on 3",
    `grammar.md:117`). The linter cannot see it (see #76/#84). `[spec]`
28. **[M]** M4 has no plural spelling sub-rules for -y/-o/-f nouns: *citys* or *cities*?
    *potatos*? *knifes*? M1's y→i is stated for verbs only. A beginner cannot spell the
    plural of hundreds of common nouns — a direct derivability failure. `[spec]`
29. **[M]** The spelling of `-ing` forms is specified nowhere (silent-e dropping: *giving*
    or *giveing*?). M1 covers only -ed; O3 covers only doubling; G1 keeps the -ing aspect;
    the specs use *being/living* without a rule that produces them. `[spec]`
30. **[M]** O2 has no membership criterion or stopping rule: of the catalogue's own
    silent-letter list (IRREGULARITIES.md:44-46), O2 respells five words, O4's keep-buckets
    absorb four more, and *honest*, *Wednesday*, *colonel* (the most notorious spelling in
    English) fall in no stated bucket at all. Which words are in O2 is a hidden list —
    a principle-4 violation on the project's own cited examples. `[trace]`
31. **[M]** M6 twice defers the *hardly* = "barely" reassignment "per style.md"
    (`morphology.md:201-207`) — style.md contains nothing about *hardly* or *barely*
    (grep-verified), nor does the lexicon. A stated resolution whose target doesn't
    exist. `[spec ✕ trace]`
32. **[M]** M1 manufactures new homographs — *singed* (past of *sing*, SINGD vs past of
    *singe*, SINJD), *seed* (past of *see* vs the plant noun) — while pronunciation.md
    declares the homograph set "small, **closed**" and "**retained**"
    (`pronunciation.md:352-360`). The guarantee is false as stated, and the new pairs have
    no key entries. samples.md uses "You seed mes keys?" (`samples.md:67`) with no
    acknowledgment of the misparse cost. `[spec ✕ dog]`
33. **[M]** Dropped indefinite articles create NP-boundary ambiguity the specs deny:
    pronunciation.md's own showcase sentence "The doctor gived the young child book about
    birds" (`pronunciation.md:334`) parses equally as "gived [the young child] [book]" or
    "[the young child book]" — while G2 claims drops are "never ambiguous"
    (`grammar.md:202`). Standard English's *a* was doing segmentation work; no spec
    acknowledges the misreading class. `[spec ✕ dog]`
34. **[L]** writing.md's flagship examples model the disfavored opaque phrasal "*breaked
    down*" twice (`writing.md:52,173`) — the exact class S2 replaces (*failed*,
    *stopped*). `[spec]`
35. **[L]** S2's table and vocabulary.md both recommend "give up → quit / **stop**"
    (`style.md:46`, `vocabulary.md:124`) — steering writers onto the one verb G13 flags as
    WoE's known complementation ambiguity (*stop to X*), where it prescribes
    *cease/pause* "when it matters" (`grammar.md:538-544`). No cross-note. `[spec]`
36. **[L]** P2 never states how to parse respelling letter-sequences (longest-match is
    assumed: BOWT = b-ow-t); the hyphen disambiguation mechanism is described only for
    consonant digraphs (`pronunciation.md:127-129`). `[spec]`
37. **[L]** P7's argument overclaims: rising intonation is not "the *only* thing" marking a
    spoken yes/no question (`pronunciation.md:237-239`) — G6's invariant tag "right?"
    (`grammar.md:288,299`) is a segmental marker. `[spec]`

## Theme 5 — Philosophy and prior-art tensions never answered

38. **[H]** O2 adopts ***iland*** (`orthography.md:58`) — a spelling PRIOR-ART itself lists
    in Webster's *failed* set — while PRIOR-ART claims WoE "refuses exactly his losing set
    — except thru/tho" (`PRIOR-ART.md:142-149`). That sentence is factually wrong about
    the project's own spec. Moreover *det, dout, receit, iland, suttle* are all coinages
    with no informal currency, violating O5's stated boundary ("adopt an existing informal
    spelling; never coin a new one", `orthography.md:131`); the Cut Spelling comparison
    answers with a different criterion ("keep the list small") that is never reconciled
    with O5's. `[trace]`
39. **[H]** The strongest lesson in the project's own evidence base — surviving reforms
    were *subsets*; "none asked anyone to spell differently"; reforms demanding re-learning
    failed (`PRIOR-ART.md:8-10,34-37`) — is never squared with WoE's non-standard core:
    *beed, goed, mes, hims, informations, meself, you all's* put a coined form in nearly
    every sentence. The creole-convergence section defends M1/M3/G1/G6 as natural, but the
    coined pronoun/reflexive paradigms (G4/G12) — structurally parallel to Webster's failed
    coinages — are never examined, and the "no coined particles" principle is applied
    selectively (used to reject a question particle in G6/P7, waived for G4/G12). The
    LFC contradictions got an honest write-up (item 18); this bigger one has none. `[trace]`
40. **[M]** Design principle 4 ("no table of special cases to memorize") vs reality: G3's
    drop/keep/replace is a per-verb ruling backed by 37 + 56 lexicon rows requiring
    collision analysis a learner cannot do (*depend on* drops, *agree with* keeps), yet
    G3 claims the moves "apply on sight" (`grammar.md:196-198`). The softer acceptance
    criterion ("no *hidden* word list") is met — the lists are explicit — but the gap
    between the principle's letter, the "on sight" claim, and the actual lookup dependence
    is never recorded as a trade-off. `[trace]`
41. **[M]** IRREGULARITIES.md still promises "a single predictable stress rule"
    (`IRREGULARITIES.md:90-91`) as the World English target; P4 deliberately decided
    *against* regularizing stress (`pronunciation.md:144-151,174-177`). The catalogue —
    the traceability spine — tells auditors a rule exists that was consciously rejected. `[trace]`
42. **[M]** "Critique point 1" is unaccounted for anywhere: PR #7 addressed "critique
    points 2–6" of a critique document that was never committed; what point 1 was — fixed,
    rejected, or forgotten — is recorded nowhere (tools/README.md:20 still references
    "the point-4 critique"). An entire numbered critique item vanished from the audit
    trail of a project whose principle is "document the why". `[hist]`
43. **[L]** PRIOR-ART misattributes "adopt an existing form, never coin a new one" to the
    README's design principles (`PRIOR-ART.md:9-11`) — it exists only as O5's local
    stopping criterion. The misattribution obscures the G4/G12 coinage tension (#39). `[trace]`

## Theme 6 — samples.md: violations and dogfooding blind spots

44. **[H]** Two hard G14 violations in the gold corpus: "Officials say ~~that~~ it will
    open on September." (`samples.md:30`) and "the university think ~~that~~ it beed worth
    the cost." (`samples.md:210`) — G14 says *that* is "always kept, never dropped"
    (`grammar.md:550-552`). The annotations silently skip the rule both times. `[dog]`
45. **[H]** Passage 5 violates S7's fixed adverb slot: "worked **more quickly**", "plan
    **more carefully**" (`samples.md:170-171`) — S7 requires the adverb immediately before
    the main verb (`style.md:145-148`), yielding "more quickly worked", which reads badly —
    strong evidence S7 needs a comparative-adverb-phrase exception. The annotations never
    cite S7 anywhere in the file. `[dog]`
46. **[H]** Dogfooding blind spots — rules never exercised by any sample passage: O1, O2,
    O3, O5 (no *ough* word, no concession clause in the corpus), P1–P6 (the pronunciation
    layer is never dogfooded against running text), M6, G5 in substance (no uncountable is
    ever counted; *much*→*many* never fires — its two citations annotate no-ops), G6
    partial (no wh-question, no existential *there be*, no tag "right?"), G7 partial
    (*must*, *probably/certainly* unused), G8 in substance (no *will*/*would* result
    clause), G10's possessive side (zero `'s` anywhere), **G11 relative clauses (nothing —
    the largest single blind spot, for one of the biggest reforms)**, G12 reflexives, G13
    in substance (gerund→infinitive never fires), G15 partial (*unless/altho/before/after/
    until/so that* unused), S2, S3, S4, S6 (no phrasal verb or idiom in any SE original),
    S7 (never cited; violated), W2 (never cited). The lexicon's tables are exercised by
    exactly one sample instance total (*wait*, Passage 1). `[dog]`
47. **[M]** Passage 6 breaks W6's nearest-antecedent rule: in "But the university think it
    beed worth the cost" (`samples.md:210`), the nearest matching noun to *it* is *the
    university*, not the intended *the building* — read mechanically per W6
    (`writing.md:188-191`), the sentence says the university was worth the cost. Notably,
    W1's semicolon split is what pushed the wrong noun between pronoun and antecedent —
    the punctuation reform degraded the reference W6 exists to protect. Annotation 8 fixed
    the parallel case two sentences later and missed this one. `[dog]`
48. **[M]** Passage 6 ¶2 violates W3/W4 while its annotation claims compliance: the topic
    sentence states the concession ("The building beed expensive."), the paragraph's
    declared idea ("it was worth the cost", per annotation `samples.md:230`) arrives in
    sentence two behind "But" — point-last, the shape W3 abolishes
    (`writing.md:96,120-124`). `[dog]`
49. **[M]** "Many residents wait gooder health care for years." (`samples.md:31`) — three
    stacked reforms (transitive *wait*, present-for-still-true, kept duration *for*) make
    the corpus's least legible sentence: an English reader parses it as a habitual generic
    and stumbles on *wait* + bare NP. The "legible as English" constraint is under real
    strain here and the annotations don't record the cost. `[dog]`
50. **[M]** Passage 4's annotation misquotes its own gold text: the blockquote reads "Mes
    son sayed **that** it beed…" (`samples.md:134`), the annotation quotes it *without*
    "that" (`samples.md:147`) while simultaneously claiming "complementizer *that* kept".
    A misquoted gold sentence in a regression corpus is a hazard; the linter cannot see
    annotation quotes. `[dog ✕ trace ✕ tool]`
51. **[L]** Annotation noise: G5 is cited where no transformation occurred ("many
    residents"/"many books" were already standard English — `samples.md:46,224-225`); a G4
    transformation is claimed for a subject that was already "You all" in the SE original
    (`samples.md:164` vs `:175-176`); annotation 1 justifies past-tense *builded* with a
    time word (*yesterday*) that belongs to the matrix clause, not the content clause
    (`samples.md:35-37` vs G1 `grammar.md:19-20`). `[dog]`
52. **[L]** Fronted time adjuncts ("Last year I goed…", "Next time, plan…", "By next June,
    I finish…", mid-position "announced yesterday that") sit uneasily with S7's "time and
    place adjuncts keep their natural clause-final spot" (`style.md:163-165`). Whether S7
    licenses fronting or merely tolerates it needs a sentence. `[dog]`
53. **[L]** vocabulary.md's acceptance criterion cites "*listen music* / *wait the bus*
    agree with Passage 1" (`vocabulary.md:206-207`) — Passage 1 contains neither phrase,
    and *listen music* appears in no sample at all. `[dog]`

## Theme 7 — Forward translator: bugs and guarantee violations

The translator's core guarantee is "deterministic transforms only; flag, never guess"
(AGENTS.md, tools/README.md). Three issues break the guarantee outright.

54. **[H]** Unmarked homographs produce wrong translations of common words: `she leaves
    tomorrow` → `she leafs tomorrow`; `he used a saw to cut wood` → `he used seed to cut
    wood`; `wait a bit` → `wait a bited`; `a shot at goal` → `shooted at goal`. The dataset
    marks *felt/left/found/thought/rose/ground/wound/lie* as homographs but not
    *saw/shot/bit/spoke/bore* or plural *leaves* (`data/irregular-verbs.json:6,71,89,32`,
    `data/irregular-plurals.json:37`) — even though `allowlist.json`'s own comment names
    "*saw* the tool" as the canonical homograph example, and `translate.test.ts:63-64`
    enshrines the wrong behavior. `[tool]`
55. **[H]** The dropped-preposition transform emits abolished irregular forms verbatim and
    unflagged: `The manager spoke to the staff` → `The manager spoke the staff`, flags
    `[]` even under `--strict` (`src/core-lexicon.ts:227` uses the matched SE surface form
    as the replacement; `src/translate.ts:244` then assumes anything in the forward map
    was translated). *spoke* is abolished (M1 → *speaked*). Affects every irregular verb
    with a drop ruling. `[tool]`
56. **[H]** The inflection generator violates M1/O3's stress-doubling rule
    (`src/morphology.ts:31` gates doubling on monosyllables; the specs require it for
    stress-final polysyllables — `morphology.md:27-28`, `orthography.md:76-78`): `it began
    to rain` → `it begined to rain` (spec: *beginned*), and `she referred to the notes`
    passes through untouched because the phrase table was generated with the misspelled
    keys `refered to`/`refering to`. Consequences ripple into the reverse map and the
    linter's "expected" hints. `[tool]`
57. **[M]** The dropped-*that* restorer inserts *that* into direct quotations and across
    commas: `He said "I am here."` → `He sayed "that I be here."`; `As I said, he will
    come` → `As I sayed, that he will come` (`src/translate.ts:149-151`,
    `src/pos.ts:160-171` — no punctuation-gap check, unlike every other detector). `[tool]`
58. **[M]** `run out` → *exhaust* mangles the dominant intransitive use: `we ran out of
    milk` → `we exhausted of milk` (`data/lexicon.json:68` — the entry's own note admits
    the split; the transform fires anyway). `[tool]`
59. **[M]** Zero-past phrasal heads silently lose tense: `they set up a fund yesterday` →
    `they establish fund yesterday` (should be *established*) — `standardPast()` invents
    `setted`/`putted` forms that never occur in SE, so real past uses match the base pair
    (`src/core-lexicon.ts:235-241`). Affects *set up, put off, cut down, shut down, split
    up*. No flag. `[tool]`
60. **[M]** The G3 duration-guard's number list omits 13–19, sixty–ninety, thousand,
    million (`src/core-lexicon.ts:166-170`): `wait for fifteen minutes` → `wait fifteen
    minutes` — the duration *for* that G3's own closed test says to keep
    (`grammar.md:156-158`) is wrongly dropped. `[tool]`
61. **[M]** `handledPhrases` is global per call (`src/translate.ts:167,246`): once a form
    is handled anywhere in the input, later *unhandled* occurrences of the same surface
    form lose their flags (verified: a punctuation-blocked `give up` on line 2 is
    unflagged because line 1 handled the same string; same mechanism suppresses G2 article
    flags). Silent under-flagging violates "flag everything else". `[tool]`
62. **[M]** Article drop fires on non-articles: `Vitamin A deficiency` → `Vitamin
    deficiency`, `once a week` → `once week`, `a hundred dollars` → `hundred dollars`
    (`src/pos.ts:91-103`) — letter labels, distributive *a*, and *a hundred/thousand*
    (= "one") are not the indefinite article G2 targets. `[tool]`
63. **[L]** `translate()` honors `opts.dataset` for the word map but always uses the
    module-level default phrase transforms (`src/translate.ts:259` vs `:29-31`) — injected
    test datasets silently mix with production data. `[tool]`
64. **[L]** Curly apostrophes (standard in typeset prose) break tokenization in all four
    tools: `don’t` splits into `don`+`t` (`WORD` regex only admits ASCII `'` —
    `src/translate.ts:49`, `src/reverse.ts:76`, `src/pronounce.ts:40`, `src/scan.ts:44`). `[tool]`

## Theme 8 — Reverse translator

65. **[H]** G3 preposition restoration corrupts valid text: `The look beed cold.` → `The
    look at was cold.`; `She looks tired.` → `She looks at tired.`; `she talks a lot` →
    `she talks to a lot` (`src/reverse.ts:229-257` — fires on any token in the restoration
    map; *look, gaze, hope, wish, talk, focus, stare* all have common noun/copular
    readings the stoplist can't cover). Insertions are flagged, but the restored text is
    wrong. `[tool]`
66. **[H]** The reverse map collides with real words: `the seed grows in spring` → `the saw
    grows in spring` (WoE noun *seed* is valid and common); `hanged` → `hung` silently
    (*hanged* is correct SE in the execution sense); `persons` → `people` (valid SE legal
    register); `leafs` → `leaves` (breaks SE *leafs through*). No valid-word collision
    check when building keys (`src/reverse.ts:98-111`). `[tool]`
67. **[M]** WoE zero-past coinages don't round-trip: `she quitted yesterday`, `he putted it
    down` reverse unchanged — the dataset deliberately omits cost/put/hit/cut/set/shut/
    quit/split (`data/irregular-verbs.json:2`), yet the *forward* pipeline itself produces
    `quitted`/`putted` (via the phrasal map and `zeroPastConvert`), so forward→reverse
    leaves non-SE coinages in "standard English" output, unflagged — and
    `reverse.test.ts:115` enshrines it. `[tool]`
68. **[M]** tools/README.md:124-125 claims "Passage 4 round-trips to its exact
    Standard-English source" — programmatically false ("the people **was** very kind";
    "We ~~have~~ already booked"), and no test asserts passage-level equality. `[tool]`

## Theme 9 — Linter blind spots

The linter is the CI gate for the specs; two of these holes defeat its stated purpose.

69. **[H]** Contractions are invisible: planted WoE-column rows containing `wasn't`,
    `didn't`, `couldn't`, `don't` produce **zero findings** even under `--strict`
    (`src/scan.ts:44` tokenizes them whole; no dataset carries contracted forms).
    Contracted *be*-forms are the exact class of mistake the linter exists to catch. `[tool]`
70. **[H]** Inflected dropped-prep/phrasal forms are invisible: `she listened to the radio`
    in a WoE column produces no finding — `toAbolishedEntries()` emits base forms only
    (`src/core-lexicon.ts:134-157`); inflection generation exists only on the translator
    side. The linter checks a strictly smaller language than the translator handles. `[tool]`
71. **[M]** Possessives of irregular plurals are invisible: `the women's shoes` in a WoE
    column produces no finding, though G10 mandates *childs'*-style forms. `[tool]`
72. **[M]** The confidence gate conflates "safe to lint" with "safe to translate":
    `did/does/goes/has` have **no** valid WoE reading (M3/G6 abolish both readings) yet
    are low-confidence and never flagged by default — "she does work" passes the CI sweep.
    Bonus bug: the dataset has duplicate `did` keys and "first definition wins"
    (`src/dataset.ts:69-71`) silently shadows the high-confidence row. `[tool]`
73. **[L]** Phrase matching crosses sentence boundaries (`src/scan.ts:68-97`): "They give.
    Up the hill be the house." is flagged as phrasal `give up` — a false-positive class
    requiring allowlist entries. `[tool]`
74. **[L]** Missing dataset coverage for abolished forms the specs name: `whilst`, `till`
    (G15, `grammar.md:593-594`), determiner `much` (G5), `have to`/`need to` (G7 table).
    *whilst* is unambiguous and safe to flag high. `[tool]`
75. **[H]** The regression harness has a syntax-shaped hole: the linter checks abolished
    *surface forms* only, and the gold round-trip test asserts only handled closed-class
    tokens — so none of the hand-found violations in this review (G14 that-drops, G15/W1
    commas, S7 order, W6 antecedents — #44–#48) is within any tool's scope. The suite
    passes green over a gold corpus with hard rule violations. samples.md is the declared
    regression test, but nothing mechanical holds it to the syntax rules. `[dog ✕ tool]`

## Theme 10 — Stale claims and documentation drift

76. **[M]** G3's time/place defaults (*in July* → *on July*, *at the shop* → *in the shop*,
    *arrive at* → *arrive to*, `grammar.md:112-121`) are deterministic and closed-class,
    yet neither translated nor flagged by any tool — `it will open in September` passes
    through silently, and a WoE column containing `at the shop` passes the linter. The
    gold "on September" is human-only, and no doc lists this as a known limitation. `[tool ✕ dog]`
77. **[M]** docs/README.md:52 still calls the linter and reverse translator "the **planned**
    linter and reverse translator **will** read" — both are built, tested, and gating CI. `[trace]`
78. **[M]** tools/README.md:310-311 claims `--strict` "additionally reads bolded forms in
    `**Examples.**` prose" — no such code exists (`src/extract.ts` has no strict mode;
    `--strict` only toggles the confidence gate). `[tool]`
79. **[M]** The pronunciation seed lexicon contains no WoE coined forms: *be, beed, goed,
    mes, childs, gooder* are all absent — `bun run pronounce` flags "be", the language's
    most frequent word, as unknown, while P1 promises "**every** word carries a
    respelling" (`pronunciation.md:21-23`). PR #16 acknowledged the usability gap
    (issue #27) but created no backlog item; the gap has no owner. `[trace ✕ hist]`
80. **[M]** tools/README.md contradicts the dataset it documents: "Zero-past verbs
    (*cost*, *put*, *read*) are omitted" (~line 262) while `irregular-verbs.json` contains
    *read* (:36), *let* (:26), *beat* (:76) — the same contradiction class the previous
    review's issue #17 fixed in the JSON comment, reintroduced one file over. `[hist]`
81. **[L]** Stale preposition-ruling count "35" in two places (`to-do.md:66`,
    `tools/README.md:112-114`) vs 37 rows in `lexicon.json` (31 drop / 4 keep / 2 replace) —
    to-do.md is internally inconsistent (line 24 says 37). Found independently by four of
    the five audits. `[hist ✕ trace ✕ spec ✕ tool]`
82. **[L]** Stale "~40 gold words" for the pronunciation lexicon (`to-do.md:124`,
    `tools/README.md:334`) — `pronunciation.json` has 66 entries / 64 distinct words. `[hist ✕ trace ✕ tool]`
83. **[L]** tools/README.md contradicts itself on *wait for*: lines 79-82 document the live
    not-duration guard; lines 321-323 still call `wait for` "a deliberate exception". The
    latter is stale (the guard is live — verified). `[tool]`
84. **[L]** README's repository-layout tree omits `AGENTS.md`, `.github/workflows/ci.yml`,
    the root `.gitignore`, and `tools/test/` — the previous review fixed this exact defect
    class (issue #30) and then added these files in the same PR without updating the
    tree. `[hist ✕ trace]`
85. **[L]** docs/README.md:24's grammar.md coverage list stops at G13's topics — G14
    (content clauses) and G15 (subordinating conjunctions) are missing from the index. `[spec]`
86. **[L]** docs/README.md:9-15 claims every rule follows the four-part template including
    "**Divergence & trade-off**" — style.md and writing.md use bare "**Trade-off.**"
    throughout, and O4 doesn't follow the template at all. `[spec]`
87. **[M]** Four stale anchors sever the core rule→data links README.md:50-52 says the
    rules depend on: `grammar.md:205` → vocabulary Table A, `style.md:54` → Table B,
    `style.md:79` → Table C, `style.md:137` → Table D all 404 (the table headings were
    renamed with suffixes like "…-droppedpreps" / "…-doc-only"). Plus `vocabulary.md:56,109`
    link to a to-do.md item-16 anchor that cannot exist (list item, not a heading). `[spec]`
88. **[L]** British spellings in spec prose against the project's own O1 standard:
    *favour* (`grammar.md:600`), *signalling* (`style.md:195`, `writing.md:89`), *humour*
    (`style.md:197`). `[spec]`
89. **[L]** IPA inconsistencies: `grammar.md:456-457` uses /ɒ/, outside P2's rhotic-GA
    inventory (should be /ɑ/); orthography.md uses length-marked /θruː/ vs
    pronunciation.md's /θru/ — two conventions across the paired specs. `[spec]`
90. **[L]** G2's example silently deletes content: "I need informations for the report." →
    "I need informations." (`grammar.md:57`) — no rule licenses dropping the PP; a
    misleading example in the most-referenced rule. `[spec]`
91. **[L]** `pronounce.ts:16`'s usage comment describes a `--json` output shape
    (`[{word, respelling, ipa, found}]`) that doesn't match the actual output
    (`{file, text, flags}`). `[tool]`
92. **[L]** pronunciation.md retains the *read*-past (RED) homograph that M1 makes
    impossible in WoE text (past is *readed*), so `pronounce` flags a homograph where only
    REED can occur (`pronunciation.md:354-356`, `data/pronunciation.json:71-72`). `[tool]`

## Theme 11 — Data quality

93. **[M]** `data` and `media` are high-confidence abolished plurals with no homograph
    marking (`data/irregular-plurals.json:31-32`): `social media and the data` → `social
    mediums and the datums`. The lexicalized mass-noun senses are at least as common as
    *bases* (which **is** homograph-marked) — inconsistent with the dataset's own
    convention. `[tool]`
94. **[M]** Polysemous phrasals ship with unconditional single replacements despite the
    sweep methodology's own exclusion criterion (tools/README.md:176-179 says dangerously
    polysemous phrasals were excluded): `came across the room` → `encountered the room`,
    `worked out at the gym` → `solved at the gym` (`data/lexicon.json:59-91` — *work out,
    go on, come across, turn out, back up, break down, hang up*). The notes acknowledge
    the senses; the transforms fire anyway. `[tool]`
95. **[L]** *leant/leapt* are catalogued as M1 irregular pasts (`irregular-verbs.json:101-102`)
    but are really British spelling variants (American *leaned/leaped* are already
    regular) — taxonomically O1's department. `[tool]`
96. **[L]** False friends: flagged in PAIN-POINTS as a major hazard ("confident errors"),
    delivered as a 2-row stub (the two examples copied from PAIN-POINTS itself) under a
    **built** status, with no growth backlog item. `[trace]`

## Theme 12 — Tests, CI, engineering hygiene

97. **[M]** The "gold round-trip" regression test only asserts single-word substitutions
    (`test/translate.test.ts:219,231-239` filters expected tokens to forward-map
    *values*), so phrase-transform outputs, word order, and tense are never checked
    against samples.md — which is why #54–#56 survive a green board. tools/README.md's
    description ("asserts it produces every handled World-English form") overstates what
    it does. `[tool]`
98. **[M]** No tests exist for: contractions, curly quotes, inflected-phrasal linting,
    quote-adjacent dropped-*that*, reverse noun collisions — the exact classes where this
    review found bugs. And CI never installs `espeak-ng`, so the audio-synthesis path is
    permanently skipped in CI (only the "absent → exit 2" branch runs). `[tool]`
99. **[L]** AGENTS.md's "185 tests" claim: 185 exist, but 184 pass + 1 environment-
    conditional skip — worth a clarifying word where the number is quoted. `[tool]`
100. **[L]** CI triggers on pushes only for `dev`/`main` plus all PRs (`ci.yml:3-6`) —
     direct pushes to other branches are unchecked. Acceptable, but a known hole. `[tool]`
101. **[L]** Copy-paste duplication that will drift: `matchCase`/`tokenizeLine`/`WORD`
     duplicated across `src/translate.ts` and `src/reverse.ts`; the ~30-line
     `samplePairs()` samples.md parser duplicated in three test files;
     `VOWEL_GRAPHEMES` in `src/respell.ts` and `src/espeak.ts`. `[tool]`
102. **[L]** `pronounce --audio` silently ignores `--ipa`/`--json` (`pronounce.ts:136-143`
     returns early, no warning). `[tool]`
103. **[L]** `src/check.ts:31-39` compares IPA by codepoint count, not segments — a
     legitimate two-codepoint diphthong→schwa reduction would fail `--strict`; latent trap
     as the pronunciation lexicon grows. `[tool]`

## Theme 13 — Process and backlog gaps

104. **[M]** S4 idiom→literal support was declared out of scope in PR #8 ("S4 idioms and
     the full 2–3k build remain out of scope") — the lexicon half was later delivered, the
     idiom half never was and never entered the backlog. S4 remains pure advice while its
     siblings S2/S3/S6 all got lexicon backing. `[hist]`
105. **[M]** The listening/speaking pain point (PAIN-POINTS §5) was descoped *to* an "AI
     speaking-practice partner" tooling concern (to-do item 14) — but that tool exists in
     no backlog, so the pain point now has no live owner anywhere. `[hist]`
106. **[L]** The first review's 30-issue catalogue (`docs/review.md`) was deleted by the
     PR that link[ed] to it; the squash-merge erased it from mainline history, leaving it
     recoverable only via the orphaned PR-branch commit `39c6e25` on GitHub. This file
     restores the convention; recommend keeping review catalogues in-repo until every item
     is dispositioned in `to-do.md`. `[hist]`

---

## Cross-cutting observations for the planning pass

1. **The punctuation system needs one owner.** W1's closed inventory, G15's comma rule,
   S9's templates, G10's apostrophe, G6's `!` and tag questions, and the samples all
   disagree (#1–#6, #22). Fixing them piecemeal will re-create the drift; they should be
   reconciled in one pass with W1 as the single source of truth.
2. **A "syntax linter" is the missing tool.** Everything mechanical currently checks
   surface forms; every violation found by hand in this review (#44–#48) was syntactic.
   Even a small set of deterministic checks (trailing-clause comma, *that* after
   say/think/know/hope, adverb position) would have caught the gold-corpus bugs (#75).
3. **The translator's "never guess" guarantee needs a test that attacks it.** #54, #55,
   #59, #61 are all silent-wrong-output bugs in a tool whose one promise is to flag
   instead of guess. Property-style adversarial tests (homographs, tense, punctuation
   boundaries) matter more than more gold passages.
4. **The negation/question module is the biggest spec debt.** #13, #14, #19 mean the two
   constructions every beginner needs in week one are underivable. Nothing else in
   Theme 3 should be prioritized above them.
5. **The philosophy tensions (#38–#39) deserve a written position, not a rule change.**
   Either PRIOR-ART's claims get corrected and the coinage trade-off gets an honest
   paragraph (like the LFC treatment in item 18), or the O2/G4/G12 choices get revisited.
   Silence is the only wrong option — it contradicts design principle 5.
6. **samples.md is doing too many jobs.** It is simultaneously the showcase, the
   regression corpus, and the only dogfooding — and it exercises well under half the
   ruleset (#46). The plan should split "curated gold corpus (grows toward full rule
   coverage)" from "annotated showcase".
