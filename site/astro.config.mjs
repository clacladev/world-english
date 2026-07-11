import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRewriteLinks from './src/plugins/rehype-rewrite-links.mjs';
import rehypeWrapTables from './src/plugins/rehype-wrap-tables.mjs';

// Repo root is one level up from this site/ directory.
const repoRoot = new URL('../', import.meta.url);

// Placeholder canonical URL — hosting is chosen later (see plan follow-ups).
// Change `site` (and add `base` if deploying to a sub-path) when hosting is decided.
export default defineConfig({
  site: 'https://world-english.example',
  trailingSlash: 'ignore',
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
      [rehypeRewriteLinks, { repoRoot, base: '/' }],
      rehypeWrapTables,
    ],
  },
  integrations: [sitemap()],
});
