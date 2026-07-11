// Rewrites the repo's GitHub-oriented markdown cross-links into site routes.
//
// The specs link each other with relative paths written for GitHub's markdown
// viewer, e.g.  [morphology](morphology.md#rule-m1--all-verbs-are-regular)
// or  [PAIN-POINTS](../resources/PAIN-POINTS.md#3-grammar). On the website those
// must point at /rules/... and /research/... instead. Anything we do not publish
// (tools/, review.md, the Brehe textbook) falls back to an absolute GitHub link so
// no link ever dead-ends.
//
// Resolution is done against the *source file's* directory (via file.path), so a
// bare `foo.md` resolves correctly whether the source lives in docs/ or resources/.

import { visit } from 'unist-util-visit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GITHUB_BLOB,
  SPEC_SLUGS,
  RESEARCH_SLUGS,
  toSlug,
  normBase,
} from '../lib/routes.mjs';

const EXTERNAL = /^(https?:|mailto:|tel:|\/\/|#)/i;

export default function rehypeRewriteLinks(options = {}) {
  const repoRoot = fileURLToPath(options.repoRoot); // absolute path to repo root
  const base = normBase(options.base);

  return function transformer(tree, file) {
    const srcDir = file?.path ? path.dirname(file.path) : repoRoot;

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string' || EXTERNAL.test(href)) return;

      const hashIndex = href.indexOf('#');
      const rawPath = hashIndex === -1 ? href : href.slice(0, hashIndex);
      const hash = hashIndex === -1 ? '' : href.slice(hashIndex);
      if (!/\.md$/i.test(rawPath)) return; // only rewrite links to markdown files

      const abs = path.resolve(srcDir, rawPath);
      const rel = path.relative(repoRoot, abs).split(path.sep).join('/');
      node.properties.href = mapTarget(rel, hash, base);
    });
  };
}

function mapTarget(rel, hash, base) {
  const name = toSlug(path.posix.basename(rel));

  if (rel.startsWith('docs/')) {
    if (SPEC_SLUGS.includes(name)) return `${base}/rules/${name}/${hash}`;
    if (name === 'readme') return `${base}/rules/${hash}`;
    return `${GITHUB_BLOB}/${rel}${hash}`; // e.g. review.md — not published
  }
  if (rel.startsWith('resources/')) {
    if (RESEARCH_SLUGS.includes(name)) return `${base}/research/${name}/${hash}`;
    return `${GITHUB_BLOB}/${rel}${hash}`;
  }
  if (rel === 'README.md') return `${base}/about/${hash}`;
  return `${GITHUB_BLOB}/${rel}${hash}`; // tools/README.md and anything else
}
