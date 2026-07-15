// Site internationalization. English is the canonical default; each supported
// language keeps its UI chrome (header, footer, nav, buttons, generic labels)
// here. Long page prose (home, about, translate) lives in a local `copy` object
// inside its own component — only shared chrome belongs in this dictionary.
//
// Adding a language: add its code to `locales` below and to astro.config's i18n,
// then add its column to `ui`. Any key you leave out falls back to English, so a
// partial translation never renders blank. See site/README.md → "Translations".

export const defaultLocale = 'en' as const;
export const locales = ['en', 'es', 'zh', 'pt', 'it'] as const;
export type Locale = (typeof locales)[number];

// Each language's own name — what its speakers recognize (no flags: a flag is a
// country, not a language).
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  pt: 'Português',
  it: 'Italiano',
};

// Shared UI strings, keyed by a stable dotted id. `en` is the source of truth;
// every other locale is a (possibly partial) override of it.
const ui = {
  en: {
    'nav.rules': 'The rules',
    'nav.translate': 'Translate',
    'nav.showcase': 'Read it',
    'nav.research': 'Research',
    'nav.skills': 'Skills',
    'nav.about': 'About',
    'nav.primary': 'Primary',
    'search.label': 'Search',
    'search.close': 'Esc',
    'search.title': 'Search',
    'search.note': 'Search is generated at build time. Run <code>bun run build &amp;&amp; bun run preview</code> to try it locally.',
    'lang.label': 'Language',
    'skip': 'Skip to content',
    'footer.status': 'An open design &amp; research project — everything here is provisional.',
    'footer.reference': 'Reference',
    'footer.aboutProject': 'About the project',
    'footer.project': 'Project',
    'footer.repo': 'GitHub repository',
    'footer.feedback': 'Send feedback',
    'footer.rights': 'World English contributors · Code: MIT · Docs:',
    // Shown on pages whose chrome is translated but whose body is still English.
    'englishOnly.page': 'This page is available in English only.',
    'englishOnly.spec': 'This specification is available in English only.',
  },
  es: {
    'nav.rules': 'Las reglas',
    'nav.translate': 'Traducir',
    'nav.showcase': 'Léelo',
    'nav.research': 'Investigación',
    'nav.skills': 'Skills',
    'nav.about': 'Acerca de',
    'nav.primary': 'Principal',
    'search.label': 'Buscar',
    'search.close': 'Esc',
    'search.title': 'Buscar',
    'search.note': 'La búsqueda se genera al compilar. Ejecuta <code>bun run build &amp;&amp; bun run preview</code> para probarla localmente.',
    'lang.label': 'Idioma',
    'skip': 'Saltar al contenido',
    'footer.status': 'Un proyecto abierto de diseño e investigación: todo aquí es provisional.',
    'footer.reference': 'Referencia',
    'footer.aboutProject': 'Acerca del proyecto',
    'footer.project': 'Proyecto',
    'footer.repo': 'Repositorio de GitHub',
    'footer.feedback': 'Enviar comentarios',
    'footer.rights': 'Colaboradores de World English · Código: MIT · Docs:',
    'englishOnly.page': 'Esta página solo está disponible en inglés.',
    'englishOnly.spec': 'Esta especificación solo está disponible en inglés.',
  },
  zh: {
    'nav.rules': '规则',
    'nav.translate': '翻译',
    'nav.showcase': '阅读',
    'nav.research': '研究',
    'nav.skills': 'Skills',
    'nav.about': '关于',
    'nav.primary': '主导航',
    'search.label': '搜索',
    'search.close': 'Esc',
    'search.title': '搜索',
    'search.note': '搜索索引在构建时生成。运行 <code>bun run build &amp;&amp; bun run preview</code> 即可在本地体验。',
    'lang.label': '语言',
    'skip': '跳到内容',
    'footer.status': '一个开放的设计与研究项目——这里的一切都还是暂定的。',
    'footer.reference': '参考',
    'footer.aboutProject': '关于本项目',
    'footer.project': '项目',
    'footer.repo': 'GitHub 仓库',
    'footer.feedback': '发送反馈',
    'footer.rights': 'World English 贡献者 · 代码：MIT · 文档：',
    'englishOnly.page': '本页面仅提供英文版本。',
    'englishOnly.spec': '本规范仅提供英文版本。',
  },
  pt: {
    'nav.rules': 'As regras',
    'nav.translate': 'Traduzir',
    'nav.showcase': 'Leia',
    'nav.research': 'Pesquisa',
    'nav.skills': 'Skills',
    'nav.about': 'Sobre',
    'nav.primary': 'Principal',
    'search.label': 'Buscar',
    'search.close': 'Esc',
    'search.title': 'Buscar',
    'search.note': 'A busca é gerada na compilação. Rode <code>bun run build &amp;&amp; bun run preview</code> para testá-la localmente.',
    'lang.label': 'Idioma',
    'skip': 'Pular para o conteúdo',
    'footer.status': 'Um projeto aberto de design e pesquisa — tudo aqui é provisório.',
    'footer.reference': 'Referência',
    'footer.aboutProject': 'Sobre o projeto',
    'footer.project': 'Projeto',
    'footer.repo': 'Repositório no GitHub',
    'footer.feedback': 'Enviar feedback',
    'footer.rights': 'Colaboradores do World English · Código: MIT · Docs:',
    'englishOnly.page': 'Esta página está disponível apenas em inglês.',
    'englishOnly.spec': 'Esta especificação está disponível apenas em inglês.',
  },
  it: {
    'nav.rules': 'Le regole',
    'nav.translate': 'Traduci',
    'nav.showcase': 'Leggilo',
    'nav.research': 'Ricerca',
    'nav.skills': 'Skills',
    'nav.about': 'Informazioni',
    'nav.primary': 'Principale',
    'search.label': 'Cerca',
    'search.close': 'Esc',
    'search.title': 'Cerca',
    'search.note': 'La ricerca viene generata in fase di compilazione. Esegui <code>bun run build &amp;&amp; bun run preview</code> per provarla in locale.',
    'lang.label': 'Lingua',
    'skip': 'Vai al contenuto',
    'footer.status': 'Un progetto aperto di design e ricerca — qui tutto è provvisorio.',
    'footer.reference': 'Riferimento',
    'footer.aboutProject': 'Informazioni sul progetto',
    'footer.project': 'Progetto',
    'footer.repo': 'Repository GitHub',
    'footer.feedback': 'Invia un feedback',
    'footer.rights': 'Collaboratori di World English · Codice: MIT · Docs:',
    'englishOnly.page': 'Questa pagina è disponibile solo in inglese.',
    'englishOnly.spec': 'Questa specifica è disponibile solo in inglese.',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

// Resolve the active locale from Astro. `Astro.currentLocale` is set from the URL
// prefix when a route lives under one (e.g. /es/…); it is undefined on the bare
// English routes, which resolve to the default.
export function getLocale(currentLocale: string | undefined): Locale {
  return (locales as readonly string[]).includes(currentLocale ?? '')
    ? (currentLocale as Locale)
    : defaultLocale;
}

// A translator bound to one locale. Missing keys fall back to English so an
// incomplete translation degrades to English rather than to a blank.
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key];
  };
}

// Prefix an absolute site path with the locale (/about → /es/about) for every
// non-default language, so navigation stays inside the chosen language. The bare
// English default is returned unchanged.
export function localePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

// Inverse of localePath: strip a leading non-default locale segment, returning
// the bare (default-locale) path. /es/about → /about, /zh → /, /about → /about.
const nonDefaultLocales = locales.filter((l) => l !== defaultLocale);
const localePrefix = new RegExp(`^/(${nonDefaultLocales.join('|')})(?=/|$)`);
export function stripLocale(pathname: string): string {
  return pathname.replace(localePrefix, '') || '/';
}
