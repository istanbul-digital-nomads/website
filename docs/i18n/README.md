# Istanbul Nomads i18n Playbook

The site supports 5 locales: `en` (default, no URL prefix), `tr`, `fa`, `ar`, `ru`.

## URL structure

- English stays at root: `/spaces`, `/blog/...`
- Other locales prefixed: `/tr/spaces`, `/fa/blog/...`
- BCP 47 codes (`tr-TR`, `fa-IR`, `ar-SA`, `ru-RU`, `en-US`) are used in `hreflang` and `og:locale` only - URLs stay language-only.

## Content layout

```
src/content/
  blog/
    en/<slug>.mdx       # source of truth
    tr/<slug>.mdx       # localized (when ready)
    fa/<slug>.mdx
    ar/<slug>.mdx
    ru/<slug>.mdx
  guides/
    en/...
    tr/...
  path-to-istanbul/
    en/...
    tr/...
```

Slugs match across locales. If a localized file is missing, `getLocalizedMdx()` in `src/lib/i18n/content.ts` falls back to the English version and sets `translated: false` so the page can show a translation-in-progress notice.

## UI strings

`src/messages/<locale>.json`. The shape mirrors `en.json`. Keys are stable across locales; values are translated.

## Agents

Four native-fluent editors live in `.claude/agents/`:
- `nomad-tr-editor` - Turkish
- `nomad-fa-editor` - Persian (Farsi), RTL
- `nomad-ar-editor` - Arabic (MSA), RTL
- `nomad-ru-editor` - Russian

They follow a shared mandate (grammar, vocabulary, brand voice, SEO, AIO) with language-specific rules baked in. Each agent reads `CLAUDE.md` at session start and refuses to fabricate facts.

## Translation workflow

1. Author the English MDX under `src/content/<category>/en/<slug>.mdx`.
2. AI-draft the locale version under `src/content/<category>/<locale>/<slug>.mdx` (slug identical).
3. Invoke the matching editor agent (`nomad-tr-editor`, etc.) for an audit pass.
4. Agent edits in place, leaves `<!-- TODO -->` markers for any facts that need human verification.
5. Human review, then merge.

Same flow for `src/messages/<locale>.json` UI strings.

## Per-locale tracking files

- `docs/i18n/<locale>-keywords.md` - SEO keyword tracker (each agent maintains its own)
- `docs/i18n/<locale>-editor-playbook.md` - audit checklist (lives next to the agent definition)

## RTL

- Arabic (`ar`) and Farsi (`fa`) are RTL.
- The `<html dir>` attribute is set in `src/app/[locale]/layout.tsx` based on `isRtl(locale)` in `src/lib/i18n/config.ts`.
- The full Tailwind sweep from `ml-*/mr-*` to logical `ms-*/me-*` is deferred until AR/FA actually ship. Use Tailwind's built-in `rtl:` variant where needed.
