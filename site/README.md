# World English — reference website

The public reference site for World English (WoE). A static [Astro](https://astro.build)
site that renders the canonical specs in [`../docs`](../docs) and research in
[`../resources`](../resources) **in place** — those markdown files stay the single source of
truth; nothing is copied here.

## Commands

Run from this `site/` directory (Bun):

```sh
bun install      # once
bun run dev      # local dev server with hot reload
bun run build    # static build into dist/ + Pagefind search index
bun run preview  # serve the built dist/ (search works here, not in dev)
```

## How it fits together

- **Content** — `src/content.config.ts` loads `../docs/*.md` (the `specs` collection) and
  `../resources/*.md` (the `research` collection) with Astro's `glob()` loader.
- **Cross-links** — the specs link each other with GitHub-style relative `.md` paths;
  `src/plugins/rehype-rewrite-links.mjs` rewrites those into site routes at build time.
  Anything not published (e.g. `tools/`, the Brehe textbook) falls back to a GitHub link.
- **Routes** — `/` (one-page explainer), `/about`, `/rules` + `/rules/[slug]`,
  `/research` + `/research/[slug]`. The published slugs live in `src/lib/nav.ts`.
- **Design** — brand tokens in `src/styles/tokens.css` (warm cream + maroon, serif; light and
  dark). Zero client JS by default; the only scripts are the theme toggle and search dialog.
- **Search** — [Pagefind](https://pagefind.app) indexes the built HTML (`bun run build`),
  so search is live under `preview`/production but not in `dev`.

## Hosting

Not yet configured. `astro.config.mjs` has a placeholder `site` URL — set it (and add `base`
if deploying to a sub-path) when hosting is chosen, then serve the static `dist/` output.
