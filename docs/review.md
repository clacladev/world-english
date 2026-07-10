# Full Project Review — All Issues Found

> A comprehensive review of goals, research, priorities, rules, and tooling — collecting every
> issue, problem, and gap so a fix plan can be built from it. Conducted after the main specs and
> tooling were implemented (post-PR #15).

**Status at review time:** 185 tests pass, `bun run lint` clean, `bun run typecheck` clean,
0 open GitHub issues. The issues below are things the automated checks **cannot** catch —
semantic bugs the linter is blind to, stale documentation, data gaps, and project hygiene.

---

## Tier 1 — Spec correctness bugs (the wrong form is shown)

These are semantic errors the linter cannot catch (it only flags *abolished standard forms*
in WoE columns, not *wrong rule application* or *cross-rule contradictions*).

| # | File:location | Issue | Fix |
|---|---------------|-------|-----|
| 1 | `grammar.md` G9:412, G11:474,485 | **`broked` should be `breaked`** — M1 says break→breaked (two-letter vowel, no doubling). `writing.md` already uses `breaked`. | Replace `broked`→`breaked` (3 locations) |
| 2 | `samples.md` Passage 6:210,236 | **`gaved` should be `gived`** — M1 explicitly states give→gived (silent -e→add -d). Other files use `gived`. | Replace `gaved`→`gived` in passage + annotation |
| 3 | `pronunciation.md`:351 | **`through` listed as "retained/not respelled"** — O5 respells it to `thru`. | Change to a word O5 actually leaves alone (e.g. `thought`) |
| 4 | `style.md` S7:163 | **`It maybe will rain` violates S7's own slot** — S7 says adverbs go after the modal; `I will always help` (line 160) is the model. | Change to `It will maybe rain` |
| 5 | `grammar.md` G3:171-175 | **Prose uses `look at` as the "replace" example, but tables DROP it** — `look at` is a drop verb per line 140 and vocabulary.md Table A. | Rewrite the test prose to use only `look for` as the replace example |
| 6 | `samples.md` Passage 8:317,338 | **"have not seen…yet" misclassified as "finished"** — it's an ongoing negative state → should be present (`I not see`), not past (`I not seed`). | Fix the WoE form + annotation to use present tense |
| 7 | `samples.md` Passage 7:271 | **Refusal missing mandatory `No.`** — S9's refusal template requires `No. + reason`. Passage writes `Sorry, I can not come…` (no `No.`, comma not period). | Change to `No. Sorry, I can not come…` or reclassify as apology |
| 8 | `samples.md` Passage 1:36 | **Annotation says "no time word needed"** but G1's finished-PP rule requires past + a time word. | Add a relevance marker (`already`) or soften the annotation |
| 9 | `to-do.md`:206,403 | **"53 phrasal verbs" is stale** — vocabulary.md and to-do.md:55 both say 56. | Update 53→56 (2 locations) |

---

## Tier 2 — High-frequency data gaps (learners hit these constantly)

| # | File | Issue |
|---|------|-------|
| 10 | `irregular-verbs.json` | **`have`/`had` entirely absent** — `had` is one of the most common past forms in English; should regularize to `haved` |
| 11 | `irregular-verbs.json` | **`done` (pp of `do`) unhandled** — `did` is flagged but `done` is in no data file; passive "be done" needs `doed` |
| 12 | `irregular-verbs.json` | **Missing common irregulars:** show/shown, prove/proven, shrink/shrunk, spring/sprung, breed/bred, slide/slid, plus lower-freq (strive, stink, string, speed, swell, forsake, mow/sow/sew) |
| 13 | `irregular-plurals.json` | **Missing:** die→dice, calf→calves, elf→elves |
| 14 | `abolished-forms.json` | **BrE spelling coverage thin** — common learner-encountered pairs missing: tyre/plough/judgement/draught/pyjamas/mould/moustache/sulphur/aluminium/manoeuvre/practise(v)/gaol/cosy/omelette/sceptic/storey/tonne |

---

## Tier 3 — Latent data errors (tests don't catch these)

| # | File | Issue |
|---|------|-------|
| 15 | `irregular-verbs.json` | **`become` and `run` missing `pp` field** — pp=base≠past, so per the file's own rule it must be listed. Without it, the reverse translator fails to flag the past/participle collapse (come gets the flag; become/run silently don't) |
| 16 | `irregular-verbs.json` | **Duplicate entries:** `sit` (2× at lines 31,100), `speak` (2× at lines 32,70). No test catches it. |
| 17 | `irregular-verbs.json` | **`let` and `read` present as zero-past entries** — contradict the file's own `_comment` which lists them among "deliberately omitted" zero-past verbs |
| 18 | `lexicon.json` | **`wait` missing `forward: "flag"`** — vocabulary.md explicitly claims it has this field; the data doesn't. A `reverse.test.ts` test ("forward:'flag' entries pass forward unchanged") passes vacuously. Data and spec disagree. |
| 19 | `abolished-forms.json` | **`farer`/`farest` should be `farrer`/`farrest`** — `far` is monosyllabic CVC, so O3's doubling rule requires doubling before vowel-initial -er/-est |
| 20 | `abolished-forms.json` | **M6 adverb gap** — M6 names 3 suppletive adverbs (good→goodly, fast→fastly, hard→hardly). Only `well→goodly` is in the data. `fast`/`hard` need `homograph:true`+`confidence:"low"`. |
| 21 | `allowlist.json` | **Cites "Passage 2" but "health care for years" is in Passage 1** |

---

## Tier 4 — Stale documentation (internal contradictions)

| # | File:location | Issue |
|---|---------------|-------|
| 22 | `README.md`:89-92 | **Says "five specifications" and "tooling has not started"** — there are 7 specs and all tools are built. Contradicts line 163 ("The linter, both translators, and the respelling/IPA renderer are built"). |
| 23 | `README.md`:122-133 | **"Planned tooling" section says "goals, not yet implementations"** — tools are built and documented in tools/README.md |
| 24 | `tools/README.md`:85 | **Says "four samples.md passages"** — there are now 8 passages |

---

## Tier 5 — Tooling gaps & project hygiene

| # | Issue | Detail |
|---|-------|--------|
| 25 | **No CI configured** | README/to-do.md say linter "gates CI" but no `.github/workflows` exists. The gate is aspirational. |
| 26 | **No AGENTS.md** | Lint/typecheck/test commands are in tools/README.md but not at repo root for agent context. |
| 27 | **Pronunciation lexicon is ~40 words** | Documented as "seed" by design, but a real usability gap — any word outside pronunciation.md's gold set is flagged. |
| 28 | **Forward translator flags common cases** | Generic `the`→bare plural, separated phrasals, non-coordinated zero-past, S3/S6 — all documented limitations but limit practical usefulness. |
| 29 | **No root `.gitignore`** | Only `tools/.gitignore` exists. |
| 30 | **`resources/index.html` + `style.css` undocumented** | Not mentioned in README repository layout. |

---

## Recommended execution order

1. **Tier 1 first** (9 spec bugs) — these are wrong information in the specs, the project's core
   deliverable. Low effort, high correctness impact. Most are single-word fixes.
2. **Tier 3 next** (7 latent data errors) — these silently produce wrong tool output (reverse
   translator ambiguity flags, vacuous tests). Fixing them may surface new test failures that
   need resolution.
3. **Tier 2 then** (5 high-frequency data gaps) — adding missing verbs/plurals/spellings. Each
   addition needs the collision-check workflow described in tools/README.md.
4. **Tier 4** (3 stale docs) — straightforward text updates, but should be done after Tiers 1–3
   so the docs reflect the final state.
5. **Tier 5** (6 hygiene items) — CI setup and AGENTS.md are the most impactful; the rest are
   minor.

---

**Total: 30 issues across 5 tiers.** Tiers 1–3 (21 issues) are real bugs/gaps; Tiers 4–5
(9 issues) are documentation and hygiene.
