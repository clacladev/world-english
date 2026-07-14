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

## Translations (i18n)

The site UI is available in more than one language. English (`en`) is the canonical default
and keeps its bare URLs (`/about`); each translation lives under a prefix (`/es/about`). Astro's
i18n is configured in `astro.config.mjs` with `prefixDefaultLocale: false`.

**Scope (phase 1).** Only the UI *chrome* (header, footer, nav, buttons, generic labels) plus a
few marketing pages are translated. The full spec docs render Spanish chrome over their English
body, with an "available in English only" note. Brand and linguistic tokens — "World English",
the "WERLD ING-glish" wordmark, the `/wɝld ˈɪŋɡlɪʃ/` IPA, and all WoE example forms (`goed`,
`childs`, …) — are **never** translated, in any language.

- **Shared chrome strings** live in `src/i18n/ui.ts` (a typed dictionary). Any missing key falls
  back to English, so a partial translation never renders blank. `useTranslations(locale)` returns
  a `t(key)` bound to a locale; `localePath(path, locale)` prefixes internal links.
- **Long page prose** (home, about, translator labels) lives in a per-locale `COPY` object inside
  that page's body component under `src/components/pages/*Body.astro` — kept next to the markup so
  it is easy to review, rather than in the global dictionary.
- **Routes** — every page has an English route and a mirror under `src/pages/es/`. The mirror is a
  thin `<Base><XBody /></Base>` wrapper; `Astro.currentLocale` (from the `/es` URL) drives the
  chrome. `<EnglishOnlyNote />` renders the English-only banner on non-default locales only.
- **Detection** — a pre-paint inline script in `src/layouts/Base.astro` honors an explicit saved
  choice (`localStorage['woe-lang']`, set by the header language switcher), else auto-detects from
  `navigator.languages` and redirects once from a bare URL to a supported translation, else stays
  English. `<html lang>`, `hreflang` alternates, and the sitemap's `i18n` option are wired for SEO.
- **Search** — phase 1 keeps Pagefind English-only; `/es/` bodies are excluded via a
  `data-pagefind-ignore` on `<main>` for non-default locales (set in `Base.astro`).

**Adding a language** (e.g. `it`): add its code to `locales` in `astro.config.mjs` **and**
`src/i18n/ui.ts`; add its column to the `ui` dictionary and to `localeNames`; add its `COPY`
column to each `*Body.astro` you want fully translated; create the `src/pages/it/` route mirrors
(copy the `es/` ones). Anything you skip falls back to English. Run `bun run build` to confirm.

## Hosting

Deployed on **Vercel** (static build) and served at **https://worldenglish.tugulab.org**
through a reverse proxy. The canonical URL lives in `astro.config.mjs` (`site`).

### Vercel

`vercel.json` pins the build so search is included:

```json
{ "framework": "astro", "buildCommand": "bun run build", "outputDirectory": "dist" }
```

`bun run build` runs `astro build` **and** Pagefind — Vercel's default Astro preset would run
only `astro build` and ship a broken search, so the override matters. One-time dashboard
settings that a file can't express:

- **Root Directory = `site`** — the Astro app is a subdirectory of the repo.
- **Deployment Protection / Vercel Authentication = off** for production, or the proxy hits an
  auth wall instead of the site.

After the first deploy, note the assigned origin `<project>.vercel.app`; the proxy targets it.

### Reverse proxy → Vercel

Vercel routes by `Host`, so forwarding `Host: worldenglish.tugulab.org` unchanged yields a
Vercel `404 DEPLOYMENT_NOT_FOUND`. Two ways to solve it:

**Pattern A (default) — rewrite the upstream Host to the `.vercel.app` origin.** Terminate TLS
for the public domain at the proxy and forward to Vercel over HTTPS. Absolute URLs in the HTML
still read `worldenglish.tugulab.org` (from Astro `site`), so canonical/OG/sitemap stay
correct. Every internal link ends in `/` and pages are directory-index, so Vercel issues
essentially no host-based redirects.

nginx:

```nginx
server {
  server_name worldenglish.tugulab.org;
  # ... your TLS certs for the public domain ...

  location / {
    proxy_pass               https://<project>.vercel.app;
    proxy_set_header Host     <project>.vercel.app;   # the key line
    proxy_ssl_server_name     on;                     # SNI for the upstream TLS
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

Caddy:

```caddy
worldenglish.tugulab.org {
  reverse_proxy https://<project>.vercel.app {
    header_up Host <project>.vercel.app
  }
}
```

**Pattern B (cleaner redirects) — add `worldenglish.tugulab.org` as a custom domain in Vercel**
(TXT verification, no A/CNAME change needed). Then the proxy forwards the original `Host`
unchanged and Vercel serves that domain natively — no Host rewrite, and nothing ever redirects
to `*.vercel.app`.

Replace `<project>.vercel.app` with the real deployment origin in either pattern.

## License

This `site/` package is part of the World English project's **code** and is licensed
under the [MIT License](../LICENSE-MIT). The documentation it renders (in
[`../docs`](../docs) and [`../resources`](../resources)) is separately licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See [`../LICENSE`](../LICENSE)
for the project-wide split.
