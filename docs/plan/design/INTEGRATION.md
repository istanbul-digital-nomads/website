# Istanbul Nomads — Hero Section Implementation Guide

A live-map hero section for istanbulnomads.com. Real Leaflet basemap of Istanbul on a custom dark theme, with photo avatars of nomads and category-coded venue dots that stay glued to their geographic coordinates while the camera tours through Beyoğlu → Kadıköy → Karaköy → Sultanahmet → Ortaköy on a slow `flyTo` loop.

---

## Files

| File | Purpose |
|---|---|
| `Istanbul Nomads Hero.html` | Entry point. Loads dependencies and mounts `<App>`. |
| `map-data.jsx` | Palette, categories, neighborhoods, venues, nomads. Edit this to change the data. |
| `istanbul-map.jsx` | SVG primitives: `<NomadAvatar>` (photo + ring) and `<VenueDot>` (category-colored dot with line-icon glyph). |
| `istanbul-real-map.jsx` | Leaflet wrapper + `<MapMarker lat lng>`. Owns the imperative marker tracker that keeps SVG content glued to lat/lng during camera moves. |
| `hero-frame.jsx` | Page chrome: top brand bar, headline, paragraph, CTA, legend, lat/lng readout. The left gradient mask sits at z-index 1050; chrome above at 1100. |
| `hero-cinematic.jsx` | The hero itself. Owns the tour stop list, advances every 11s, drives the camera, renders the spotlit hood + nomad cluster + the floating "Now Live" callout. |
| `tweaks-panel.jsx` | Optional in-page Tweaks panel (animation speed, nomad count, venue category filters). Remove the `<TweaksPanel>` block in the HTML if you don't want it in production. |

---

## Dependencies (all from CDN, no build step)

```html
<!-- React 18 + Babel for in-browser JSX -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>

<!-- Leaflet -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
```

Map tiles come from **CartoDB Dark Matter** (`{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png` + `dark_only_labels`). It's free and doesn't require an API key. Labels load as a separate layer at 0.7 opacity so we can tone them down independently.

Avatar photos come from **randomuser.me** (`/api/portraits/women/N.jpg` and `/men/N.jpg`). Swap these for your own photos when you have real members — see the "Customize the nomads" section below.

---

## How to integrate into istanbulnomads.com

### Option A — drop in as a standalone page

Copy all seven files to the same directory on your web server and link to `Istanbul Nomads Hero.html`. Works immediately, no build.

### Option B — embed in an existing page

Add the dependency tags above to your `<head>`, then copy the `<style>` block, the `<div id="root">`, and the seven `<script>` tags (six `text/babel` files + the inline `<App>` script) into your page body where you want the hero to render. Wrap the hero in a positioned container — `<HeroFrame>` expects to fill its parent.

The hero's outer wrapper is `position: fixed, inset: 0`. If you want the hero in flow instead of full-viewport, change it to `position: relative; width: 100%; aspect-ratio: 16/9;` (or whatever ratio you need) and the rest will reflow correctly.

### Option C — port to your React build

The components are plain React; the in-browser Babel pipeline is for ease of edit. To move into a Vite/Next/CRA project:

1. Remove the `window.X = X` exports at the bottom of each file.
2. Convert each file to ES modules — `import { IN_PALETTE, IN_VENUES } from './map-data'`, `export function HeroCinematic(...)`, etc.
3. Replace the `<script type="text/babel">` tags with normal `import` statements.
4. Install Leaflet: `npm i leaflet` then `import L from 'leaflet'; import 'leaflet/dist/leaflet.css';`. The component code references `window.L` — replace those with the import.
5. Move the `@keyframes in-blink` block from the HTML's `<style>` into your global CSS.
6. The Tweaks panel uses a `window.parent.postMessage` protocol that's specific to the prototyping environment — drop `<TweaksPanel>` and inline the tweak values, OR replace with your preferred control surface.

---

## Customize the data

### Change the venue list

`map-data.jsx` → `IN_VENUES`. Each entry:

```js
{
  id: 'v1',                    // unique within the array
  hood: 'beyoglu',             // must match an id in IN_NEIGHBORHOODS
  name: 'Kronotrop',           // shown on hover (not used in the current visuals)
  cat: 'cafe',                 // must match a key in IN_CATEGORIES
  lat: 41.0339, lng: 28.9787,  // real Istanbul coordinates
}
```

Add/remove freely. Dots automatically draw at their lat/lng using the category color and icon. Venues with categories that the user has toggled off (or that aren't in `IN_CATEGORIES`) won't render.

### Change the nomad list

`map-data.jsx` → `IN_NOMADS`:

```js
{
  id: 'n1',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',  // any 160px+ JPG
  name: 'Maya Lindqvist',
  country: '🇸🇪',
  g: ['#ff7e5f', '#feb47b'],   // gradient fallback colors (if image fails to load)
  v: 'v1',                     // home venue id (avatar appears at this venue)
}
```

To use your real community photos: host them yourself (or any service that allows hotlinking + CORS) and replace the `avatar` URLs. Square photos look best; the renderer clips to a circle and uses `xMidYMid slice` so off-center crops still work.

To balance the gender mix differently: just change the avatar URLs and names. The renderer doesn't know or care about gender — it's just URLs.

### Change the tour stops

`hero-cinematic.jsx` → `TOUR`:

```js
{
  id: 'beyoglu',                 // matches IN_NEIGHBORHOODS.id (drives spotlight + dim)
  center: [41.0339, 28.9510],    // Leaflet flyTo center
  zoom: 12.8,                    // Leaflet zoom level
  label: 'Beyoğlu',              // shown in the floating callout
  sub: 'Late-night coworking…',  // shown in the floating callout
}
```

**Important: offset `center.lng` ~0.03° west of the hood's actual lat/lng** so — combined with the HeroFrame's left-side gradient — the focused neighborhood lands in the clear right portion of the artboard. The actual hood lat/lng lives in `IN_NEIGHBORHOODS`; the `center` is a *camera target*, not a neighborhood centroid.

Stops cycle every `11000 / animSpeed` ms; tweak the interval in the `useEffect` near the top of `HeroCinematic`.

### Change the headline / brand

`hero-frame.jsx`:

- Top bar — search for "iN" (the gradient monogram) and "istanbulnomads" (the wordmark).
- Headline — search for "What are nomads" and edit the H1 and paragraph.
- CTA — search for "Let's connect nomads"; replace text + add an `onClick` or wrap in `<a href>`.
- Lat/lng readout (bottom-right) — search for "41.0082° N".

### Change the colors

`map-data.jsx` → `IN_PALETTE`. The map tile filter (`saturate(0.85) brightness(0.95)`) lives in the HTML's `<style>` block and tints the basemap toward the palette.

---

## Architecture notes (for whoever maintains this)

### Marker tracking — why so much custom code

Leaflet's CircleMarker / Marker work great for static icons but don't fit a setup where each marker is a clipped photo + ring + initials fallback rendered as SVG. The straightforward approach — projecting `lat/lng → containerPoint` on every map event and re-rendering the SVG via React state — produced visible 24px jumps during `flyTo` because React 18 auto-batches the 60 fps event stream into ~4 commits per fly. `flushSync` helped (12px jumps) but cut framerate in half and spammed warnings.

The shipping fix mimics what `L.SVG.Renderer` does internally:

1. **Custom Leaflet pane** — `map.createPane('inOverlay')` creates a `<div class="leaflet-inOverlay-pane">` inside the map pane. Z-index 600 sits between tiles (200) and popups (650).
2. **SVG portal** — our marker SVG is rendered into that pane via `ReactDOM.createPortal`. The pane's transform handles any leftover layout positioning.
3. **MapMarker component** — each `<MapMarker lat lng>` renders a `<g data-lat data-lng>` with **no `transform` attribute in JSX**. Initial position is set once in a layout effect.
4. **Imperative tracker** — a single `useEffect` in `IstanbulRealMap` attaches a handler to Leaflet's `move zoom viewreset zoomend moveend resize` events that iterates `svgEl.querySelectorAll('[data-lat]')` and writes `setAttribute('transform', \`translate(${x} ${y})\`)` directly. No React reconciliation, no batching — just a tight DOM-write loop. Measured frame-by-frame deltas: 1.78 px max during an active flyTo (was 24 px before).

### Why `zoomAnimation: false`

Leaflet's CSS-based zoom animation transitions the tile pane via `transform: translate3d(...) scale(...)` with `transition: transform 0.25s cubic-bezier(...)`. Our SVG overlay can't easily share that exact CSS transition. With `zoomAnimation: false`, every view change goes through Leaflet's JS-driven `flyTo` interpolation loop, which emits `move` and `zoom` events on every requestAnimationFrame tick — exactly what our imperative tracker listens to. Tiles AND markers stay in sync.

### React state bumps — only on settled events

The map effect also fires a normal React `setVersion` on `zoomend moveend resize` (NOT on `move` or `zoom`). This drives the few pieces of content that still go through React: the connection lines inside the focused hood, and the spotlight ring radius. During a flyTo these are briefly out of date — markers move, lines stay pointing at where the venues were before the move started — but it's invisible because the markers themselves are the visual focus, and the lines re-draw with their stroke-dashoffset animation as soon as the camera settles.

### Nomad drift

Each avatar's container `<g>` carries an `<animateTransform attributeName="transform" type="translate" calcMode="spline">` with unique drift values per nomad index, so the cluster doesn't pulse in sync. This is SVG SMIL animation — runs entirely in the renderer's compositor with no JS cost. Lives *inside* the imperatively-positioned `<MapMarker>` group, so the drift and the lat/lng position compose cleanly.

### Z-index ordering inside an artboard

```
  6   leaflet-tile-pane (z 200, leaks from inside leaflet-container)
 300  color tint overlay 1 (gold radial, screen blend)
 301  color tint overlay 2 (gold gradient, overlay blend)
 600  inOverlay pane (our SVG markers + ring + label)
1050  HeroFrame left gradient mask
1100  HeroFrame chrome (brand bar, headline, CTA, legend, coords)
1200  Cinematic "Now Live" callout
```

Anything above 200 must be explicit because Leaflet's inner panes leak their z-indexes into the ancestor stacking context (the container has `z-index: auto`).

---

## Known caveats

- **Tile loading** — first load fetches ~100 tiles per map instance. Subsequent loads come from browser cache. If you self-host or proxy tiles for performance, swap the URLs in `istanbul-real-map.jsx` → `IN_TILE_URL` and `IN_TILE_LABELS_URL`.
- **External image dependency** — avatars are URLs on randomuser.me. Replace with your own host before launch (the gradient fallback covers individual failures, but a full outage would show all initials).
- **Map drag is disabled** by design — the cinematic camera is the only thing that moves the map. To allow user interaction, set `dragging: true`, `scrollWheelZoom: true`, etc. on the `L.map` options in `istanbul-real-map.jsx` and the imperative tracker will still keep markers glued through user-initiated pans/zooms.
- **Babel in-browser transformer** — adds ~200 KB and a noticeable first-paint penalty. Fine for staging; for production, precompile the JSX (Vite / esbuild / babel-cli) and ship plain JS.

---

## Performance budget at a glance

| Workload | Cost |
|---|---|
| Initial paint (3 leaflet maps when in design canvas) | ~300 tile requests, ~1.2 MB |
| Single hero (this final build) | ~120 tile requests, ~400 KB |
| Active flyTo (8 s) | 0 React renders (markers imperative), 1 React render at zoomend |
| SVG node count | ~75 (29 venue dots + 21 avatar groups + 1 spotlight + ~4 connection lines + chrome) |
| Marker tracking | one `setAttribute` per marker per frame — sub-millisecond at this count |
