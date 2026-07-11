import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Lowercase the file's basename into a stable slug: PAIN-POINTS.md -> pain-points.
const generateId = ({ entry }: { entry: string }) =>
  entry.replace(/\.md$/i, '').toLowerCase();

// Read the canonical markdown in place — docs/ and resources/ stay the source of
// truth; nothing is copied into the site.
const specs = defineCollection({
  loader: glob({ pattern: '*.md', base: '../docs', generateId }),
});

const research = defineCollection({
  loader: glob({ pattern: '*.md', base: '../resources', generateId }),
});

export const collections = { specs, research };
