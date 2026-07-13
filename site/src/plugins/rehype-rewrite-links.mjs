// Rewrites the repo's GitHub-oriented markdown cross-links into site routes.
//
// The specs link each other with relative paths written for GitHub's markdown
// viewer, e.g.  [morphology](morphology.md#rule-m1--all-verbs-are-regular)
// or  [PAIN-POINTS](../resources/PAIN-POINTS.md#3-grammar). On the website those
// must point at /rules/... and /research/... instead. Anything we do not publish
// as a page (tools/, review.md, the Brehe textbook) now links to its source on
// the public GitHub repo, so readers land on the real file instead of a dead end.
//
// Resolution is done against the *source file's* directory (via file.path), so a
// bare `foo.md` resolves correctly whether the source lives in docs/ or resources/.

import { visit } from 'unist-util-visit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SPEC_SLUGS, RESEARCH_SLUGS, toSlug, normBase } from '../lib/routes.mjs';

const EXTERNAL = /^(https?:|mailto:|tel:|\/\/|#)/i;

export default function rehypeRewriteLinks(options = {}) {
  const repoRoot = fileURLToPath(options.repoRoot); // absolute path to repo root
  const base = normBase(options.base);
  const repo = options.repo; // { url, branch } of the public GitHub repo

  return function transformer(tree, file) {
    const srcDir = file?.path ? path.dirname(file.path) : repoRoot;

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string' || EXTERNAL.test(href)) return;

      const hashIndex = href.indexOf('#');
      const rawPath = hashIndex === -1 ? href : href.slice(0, hashIndex);
      const hash = hashIndex === -1 ? '' : href.slice(hashIndex);
      if (!rawPath) return; // pure in-page anchor (already skipped) or empty

      // Resolve any repo-relative link. Published .md targets become site routes;
      // everything else (unpublished .md, and source files like tools/*.json|ts)
      // points at its source on the public GitHub repo.
      const abs = path.resolve(srcDir, rawPath);
      const rel = path.relative(repoRoot, abs).split(path.sep).join('/');
      const target = mapTarget(rel, hash, base);
      if (target !== null) {
        node.properties.href = target;
      } else if (repo) {
        node.properties.href = githubUrl(rel, hash, abs, repo);
      } else {
        // No repo configured — drop the link, keep the text.
        node.tagName = 'span';
        delete node.properties.href;
      }

      // Never expose the ".md" extension in the visible link text — a reader
      // should see "pronunciation", not "pronunciation.md".
      stripMdExtension(node);
    });
  };
}

// Drops a trailing ".md" from the link's visible text (its last text node,
// even inside a wrapping <code>), so filenames read as plain page names.
function stripMdExtension(node) {
  const last = lastTextNode(node);
  if (last) last.value = last.value.replace(/\.md$/i, '');
}

function lastTextNode(node) {
  const children = node.children;
  if (!children) return null;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    if (child.type === 'text') return child;
    const deeper = lastTextNode(child);
    if (deeper) return deeper;
  }
  return null;
}

// Builds a link to a repo file/dir on the public GitHub repo. Directories use
// /tree/, files use /blob/; a #heading hash still resolves on GitHub for .md
// targets and is harmless on the rest.
function githubUrl(rel, hash, abs, repo) {
  let isDir = false;
  try {
    isDir = fs.statSync(abs).isDirectory();
  } catch {}
  return `${repo.url}/${isDir ? 'tree' : 'blob'}/${repo.branch}/${rel}${hash}`;
}

// Returns a site path, or null when the target is not published (→ unlink).
function mapTarget(rel, hash, base) {
  const name = toSlug(path.posix.basename(rel));

  if (rel.startsWith('docs/')) {
    if (SPEC_SLUGS.includes(name)) return `${base}/rules/${name}/${hash}`;
    if (name === 'readme') return `${base}/rules/${hash}`;
    return null; // e.g. review.md — not published
  }
  if (rel.startsWith('resources/')) {
    if (RESEARCH_SLUGS.includes(name)) return `${base}/research/${name}/${hash}`;
    return null; // e.g. the Brehe textbook — not published
  }
  if (rel === 'README.md') return `${base}/about/${hash}`;
  return null; // tools/README.md and anything else
}
