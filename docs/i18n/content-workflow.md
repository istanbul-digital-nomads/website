# Per-locale MDX content workflow

This is the canonical workflow for translating long-form MDX content (blog posts, city guides, country relocation playbooks) into the four non-default locales.

## Layout

MDX content lives under `src/content/{category}/{locale}/{slug}.mdx`. Every category uses the same per-locale folder convention:

```
src/content/
  blog/
    en/                    # canonical English source - the editorial truth
      ferry-commute-guide.mdx
      best-laptop-friendly-cafes-istanbul.mdx
      ...
    tr/                    # Turkish translations (one file per slug)
      ferry-commute-guide.mdx
      ...
    fa/                    # Persian
    ar/                    # Arabic
    ru/                    # Russian
  guides/
    en/
    tr/
    fa/
    ar/
    ru/
  path-to-istanbul/
    en/
    tr/
    fa/
    ar/
    ru/
```

The slug is identical across locales. A Persian visitor to `/fa/blog/ferry-commute-guide` resolves to `src/content/blog/fa/ferry-commute-guide.mdx`. If that file doesn't exist yet, the loader falls back to `src/content/blog/en/ferry-commute-guide.mdx` and the page surfaces a "translation in progress" banner.

A legacy `{slug}.{locale}.mdx` suffix is also accepted but is **not** the preferred layout; new translations should go in the locale folder.

## Frontmatter

Every translation keeps the same frontmatter shape as the English source. Translate the prose fields; do not touch the structural ones.

| Field            | Action                                                                          |
| ---------------- | ------------------------------------------------------------------------------- |
| `title`          | **Translate.** Native-language headline that matches the brand voice.           |
| `description`    | **Translate.** Meta description, 140-160 chars, keyword-aware.                  |
| `author`         | **Keep.** Author name stays as-is.                                              |
| `date`           | **Keep.** Same publish date as the source.                                      |
| `tags`           | **Keep slugs.** Tags are used for filtering and link to `/blog?tag=`. Keep them in English so the filter works across locales. |
| `keywords`       | **Translate.** Locale-specific SEO keywords go here.                            |
| `coverImage` etc | **Keep.** Image references and credit metadata don't translate.                 |
| `lastUpdated`    | **Keep or update.** Update only if the translation reflects newer content.      |

For `path-to-istanbul` posts, also preserve `country`, `countryCode`, `slug`, `flag`, `heroStats`, `relatedGuides`, `relatedPosts` (just translate the heroStats labels/values).

## Body translation rules

- Preserve every heading level, list, table, image embed, code block, and cross-link.
- Translate the body prose. Persian/Arabic switch to RTL via the page's `dir` attribute; markdown structure stays the same.
- Keep internal cross-links pointing at the same slug (`/blog/turkey-digital-nomad-visa-guide`). next-intl rewrites them per locale automatically.
- External links stay as-is.
- Place names: prefer the locale's preferred transliteration (Persian: کادیکوی, Arabic: كاديكوي, Turkish: Kadıköy, Russian: Кадыкёй). Document chosen spellings in `docs/i18n/{locale}-keywords.md`.
- Currencies: keep TL/USD figures unchanged; you may add the local currency in parentheses when relevant.
- Dates inside body prose: use the locale's conventional format.
- No fabrication: prices, statistics, quotes, and source citations must match the English source. If you can't verify a fact in the locale's context, leave the figure unchanged and add `{/* TODO {LOCALE} verify: ... */}` next to it. **Use the MDX comment syntax `{/* ... */}` - never HTML-comment syntax `<!-- ... -->`, which MDX rejects with a parse error.**

## Tooling

Two pnpm scripts make the workflow concrete:

### `pnpm i18n:status [category]`

Prints a translation coverage matrix for one or all content categories. Run this whenever you want to see what's missing.

```
[blog] 16 posts
slug                                 en   tr   fa   ar   ru
--------------------------------------------------------------
asian-vs-european-side               ✓    .    .    .    .
best-laptop-friendly-cafes-istanbul  ✓    .    .    .    .
...
coverage                             100% 0%   0%   0%   0%
```

`✓` means a per-locale file exists. `.` means it's missing (the page falls back to English).

### `pnpm i18n:stub <locale> [<category>] [<slug>]`

Seeds per-locale stub files by copying the English source into the locale folder and prepending a `<!-- TODO {LOCALE}: translate this file -->` comment. The agent then opens the stub, replaces the body with the translation, and removes the TODO.

Examples:

```
# Seed a single stub
pnpm i18n:stub tr blog ferry-commute-guide

# Seed every missing TR blog post (skips files that already exist)
pnpm i18n:stub tr blog

# Seed every missing FA file across all categories
pnpm i18n:stub fa
```

Stub seeding never overwrites an existing file. Re-running it after some files are translated only fills in the remaining gaps.

## Agent workflow

The four native-fluent editors under `.claude/agents/` (`nomad-tr-editor`, `nomad-fa-editor`, `nomad-ar-editor`, `nomad-ru-editor`) handle the actual translation. Their playbook:

1. Run `pnpm i18n:status` to see which files in the agent's locale are missing.
2. Pick a category and run `pnpm i18n:stub <locale> <category>` (or `<locale> <category> <slug>` for a single piece).
3. Open each stub. Read the English source. Translate the title, description, and body in place. Apply the brand voice rules from `CLAUDE.md` and the agent's own playbook.
4. Remove the `<!-- TODO {LOCALE}: ... -->` marker once the translation is complete.
5. Update `docs/i18n/{locale}-keywords.md` with any new keywords used.
6. Run `pnpm type-check` and `pnpm build` to confirm the page still compiles.
7. Commit with a focused message: "Translate {category}/{slug} to {locale}".

## Parallel work and merging

Multiple agents can work simultaneously: each touches a different MDX file, and the only shared resource is `docs/i18n/{locale}-keywords.md` per locale (and even that is rarely contended in the same locale).

When dispatching parallel agents:
- One agent per locale per category is the natural unit (e.g., one agent translates the 16 blog posts to Turkish; another does Persian in parallel).
- Use `Agent` tool with `isolation: "worktree"` if you want them on separate branches.
- After each agent finishes, merge its branch into `develop`. Conflicts are rare because each agent owns its locale's folder.
