// Shared route/slug map — the single place that knows how the repo's markdown
// files map to site URLs. Imported by both the rehype link-rewriter (build time)
// and the .astro pages, so loader ids, route params, and rewritten links agree.

// docs/*.md basenames (lowercased, no extension) published under /rules/<slug>/
export const SPEC_SLUGS = [
  'orthography',
  'pronunciation',
  'morphology',
  'grammar',
  'style',
  'writing',
  'vocabulary',
  'samples',
  'to-do',
];

// resources/*.md basenames published under /research/<slug>/
export const RESEARCH_SLUGS = ['irregularities', 'pain-points', 'prior-art'];

/** filename (with or without .md, any case) -> lowercased slug */
export function toSlug(filename) {
  return filename.replace(/\.md$/i, '').toLowerCase();
}

/** normalise a base path so it starts with '/' and has no trailing slash ('' for root) */
export function normBase(base = '/') {
  const b = ('/' + base + '/').replace(/\/+/g, '/');
  return b === '/' ? '' : b.replace(/\/$/, '');
}
