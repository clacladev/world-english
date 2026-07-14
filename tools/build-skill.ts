#!/usr/bin/env bun
// Regenerates the World English Agent Skill's bundled data snapshot.
//
// The skill (skills/world-english-translator/) is self-contained — it carries a copy of the
// closed-list decision tables instead of depending on this repo at runtime — so when a spec
// change updates data/, this script re-syncs the copy before release.
//
//   bun build-skill.ts

import { resolve } from "node:path";

const FILES = ["abolished-forms.json", "irregular-verbs.json", "irregular-plurals.json", "lexicon.json"];

const srcDir = resolve(import.meta.dir, "data");
const destDir = resolve(import.meta.dir, "../skills/world-english-translator/reference/data");

for (const name of FILES) {
  await Bun.write(resolve(destDir, name), Bun.file(resolve(srcDir, name)));
  console.log(`build-skill: synced ${name}`);
}
