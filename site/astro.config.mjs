import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRewriteLinks from './src/plugins/rehype-rewrite-links.mjs';
import rehypeWrapTables from './src/plugins/rehype-wrap-tables.mjs';

// Repo root is one level up from this site/ directory.
const repoRoot = new URL('../', import.meta.url);

// The public source repo. Cross-links to files that have no page on the site
// (tools/, review.md, the Brehe textbook) point here.
const repo = { url: 'https://github.com/clacladev/world-english', branch: 'dev' };

// Canonical public URL — the site is served here via a reverse proxy in front of
// Vercel. Drives canonical <link>, Open Graph/Twitter image URLs, and the sitemap.
export default defineConfig({
  site: 'https://worldenglish.tugulab.org',
  trailingSlash: 'ignore',
  // English is the canonical default and keeps its bare URLs (/about); every
  // supported translation lives under a prefix (/es/about). Adding a language is
  // a matter of appending its code here and to src/i18n/ui.ts. See site/README.md.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'zh', 'pt', 'it'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          // `wrap` keeps the collected heading text clean (an appended "#" would
          // otherwise leak into the on-page table of contents).
          behavior: 'wrap',
          properties: { className: ['heading-anchor'] },
        },
      ],
      [rehypeRewriteLinks, { repoRoot, base: '/', repo }],
      rehypeWrapTables,
    ],
  },
  integrations: [
    sitemap({
      // Advertise the language alternates so search engines pair /about with
      // /es/about instead of treating them as duplicate content.
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', es: 'es-ES', zh: 'zh-CN', pt: 'pt-BR', it: 'it-IT' } },
    }),
  ],
  vite: {
    server: {
      // Allow importing the translator from ../tools during `astro dev`.
      fs: { allow: [repoRoot.pathname] },
    },
  },
});
