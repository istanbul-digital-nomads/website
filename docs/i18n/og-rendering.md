# OpenGraph image rendering

The site uses two parallel pipelines for OpenGraph (social share preview) image generation, picked per locale.

## Why two

`@vercel/og` (the Vercel-recommended library) wraps `satori`, which renders JSX to SVG and then to PNG. satori has a known limitation in its bundled `opentype.js` parser: it cannot handle GSUB `lookupType: 5 substFormat: 3`, the lookup table that modern Arabic-script fonts use for contextual shaping (the rules that make Arabic letters connect to their neighbors). The result is a hard crash with `lookupType: 5 - substFormat: 3 is not yet supported` on any fa/ar input.

This is tracked at [vercel/satori#74](https://github.com/vercel/satori/issues/74) and has been on the backlog since 2022 with no plan to fix.

The workaround is to render Arabic-script OG images through a different rasterizer. We use [`@resvg/resvg-js`](https://github.com/yisibl/resvg-js), a Rust-based SVG-to-PNG renderer with HarfBuzz under the hood (the same font shaping engine Chrome and Firefox use). HarfBuzz handles Arabic shaping correctly.

## The dispatch

```
en, tr, ru → satori    (Edge-runtime-friendly, ~100ms)
fa, ar     → resvg-js  (Node runtime, ~200-300ms cold, then cached)
```

Dispatch happens inside `renderOgImage` in `src/lib/og-image.tsx`:

```ts
if (isRtlOgLocale(locale)) {
  return renderOgImageRtl(props); // resvg-js path
}
return new ImageResponse(<JSX />, ...); // satori path
```

All 13 OG image routes call `renderOgImage({ ..., locale })` and stay agnostic about which renderer fires.

## What `renderOgImageRtl` does

Lives in `src/lib/og-image-rtl.tsx`. The function:

1. Builds an SVG string mirroring the satori card design - dark canvas with brand-red corner glow, brand wordmark, category eyebrow, title, optional description, footer.
2. Lays out the content RTL-style: brand wordmark top-right (not top-left), title and description right-anchored, footer URL on the left and tagline on the right.
3. Hand-wraps the title using `splitTitle()` since SVG `<text>` doesn't auto-wrap. Two-line cap, max 22 chars per line for fa/ar (Arabic-script glyphs are visually denser than Latin).
4. Passes the SVG to `new Resvg(svg, { font: { fontFiles, defaultFontFamily } })` and calls `.render().asPng()`.
5. Returns the PNG bytes as a `Response` with `image/png` content type and long-cache headers.

## Fonts

Shipped under `/public/fonts/og/` and read off disk via `fs.readFileSync` at first render (cached in memory after):

| File                          | Used for                              | Notes                                                                    |
| ----------------------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| `Vazirmatn-Regular.ttf`       | Primary for `fa`; Latin fallback `ar` | Vazirmatn covers Persian *and* Latin glyphs, so the brand wordmark works |
| `Vazirmatn-Bold.ttf`          | Bold weight for `fa` and `ar` Latin   |                                                                          |
| `NotoSansArabic-Regular.ttf`  | Primary for `ar`                      | Arabic-only; no Latin glyphs, hence the Vazirmatn fallback               |
| `NotoSansArabic-Bold.ttf`     | Bold weight for `ar`                  |                                                                          |

resvg-js's font fallback picks per-glyph: in the Arabic renderer, Arabic characters route to Noto Sans Arabic and the Latin brand wordmark routes to Vazirmatn's Latin glyphs.

## Webpack / runtime gotchas

`@resvg/resvg-js` ships a native `.node` binary per architecture. Webpack can't parse that, so `next.config.mjs` lists it under `experimental.serverComponentsExternalPackages` so Next.js resolves it at runtime instead of bundling it.

Edge runtime can't load native addons, so all 13 OG image routes use `export const runtime = "nodejs"`. en/tr/ru routes used to be Edge - the Node cold-start adds ~50-100ms versus Edge, which is acceptable given Vercel caches OG renders at the edge after the first hit per URL.

## Visual differences between the two pipelines

Both pipelines share the same dark canvas, gradient, brand colors, and content hierarchy. They differ on:

- **Direction**: en/tr/ru anchor content to the left, fa/ar mirror to the right (RTL design convention).
- **Title size**: satori renders at 72px with a 3-line clamp; resvg renders at 60px with a 2-line cap. Arabic-script glyphs are visually denser, so the smaller size keeps cards readable without overflow.
- **Tiny rasterization variance**: different rasterizers produce slightly different font hinting and anti-aliasing. Indistinguishable side-by-side; you'd need to diff pixels.

## Adding a new OG route

1. Create `src/app/[locale]/<path>/opengraph-image.tsx` following the existing pattern (any of the 13 are good templates).
2. Set `export const runtime = "nodejs"` so resvg-js can run for fa/ar requests.
3. Pass `locale` to `renderOgImage({ ..., locale })`.
4. Add the route's strings to the `og` namespace in all five `src/messages/*.json` files.

## When this can be deleted

If satori adds GSUB Contextual Substitution Format 3 support (resolves [opentype.js#415](https://github.com/opentypejs/opentype.js/issues/415) and [vercel/satori#74](https://github.com/vercel/satori/issues/74)):

1. Replace the dispatch in `renderOgImage` with a single satori call regardless of locale.
2. Delete `src/lib/og-image-rtl.tsx`.
3. Remove `@resvg/resvg-js` from dependencies.
4. Remove `/public/fonts/og/`.
5. Move all 13 OG image routes back to `runtime = "edge"`.
6. Remove `serverComponentsExternalPackages` from `next.config.mjs`.

Everything is named and isolated so the migration is mechanical when that day arrives.
