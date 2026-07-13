// Ordered navigation metadata for the two documentation sections. Titles and
// blurbs are the only curated copy about the specs; the rule content itself is
// rendered from the canonical markdown in docs/ and resources/.

export interface NavItem {
  slug: string;
  title: string;
  blurb: string;
}

export const SPEC_NAV: NavItem[] = [
  { slug: 'orthography', title: 'Orthography', blurb: 'Light, legibility-preserving spelling changes.' },
  { slug: 'pronunciation', title: 'Pronunciation', blurb: 'A respelling key so spelling predicts sound.' },
  { slug: 'morphology', title: 'Morphology', blurb: 'Regular verbs, plurals, comparatives, adverbs.' },
  { slug: 'grammar', title: 'Grammar', blurb: 'Tense, articles, prepositions, pronouns, questions.' },
  { slug: 'style', title: 'Style', blurb: 'Plain, unambiguous phrasing at sentence level.' },
  { slug: 'writing', title: 'Writing', blurb: 'Document-level conventions and cohesion.' },
  { slug: 'vocabulary', title: 'Vocabulary', blurb: 'The core lexicon four rules look words up in.' },
  { slug: 'samples', title: 'Samples', blurb: 'Real passages translated and annotated rule-by-rule.' },
];

export const RESEARCH_NAV: NavItem[] = [
  { slug: 'pain-points', title: 'Pain Points', blurb: 'A research-backed survey of what makes English hard to learn.' },
  { slug: 'irregularities', title: 'Irregularities', blurb: 'A catalogue of what English forces you to memorize.' },
  { slug: 'prior-art', title: 'Prior Art', blurb: 'A century of reforms and subsets — what survived, what failed.' },
];

export const SPEC_SLUGS = SPEC_NAV.map((n) => n.slug);
export const RESEARCH_SLUGS = RESEARCH_NAV.map((n) => n.slug);
