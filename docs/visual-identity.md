# Visual Identity - Istanbul Digital Nomads

Single source of truth for every AI-generated image (LinkedIn posts, carousels, blog covers, OG cards). If a prompt or image contradicts this doc, the doc wins. Update this file first, then regenerate.

Referenced by:

- `docs/linkedin-content-calendar.md` Section 11
- `docs/blog-content-calendar.md` cover-image sections
- Any future Instagram / newsletter / ad asset work

---

## 1. Brand visual tenets

Five rules the system enforces on every frame.

1. **One accent color per image.** Terracotta red appears exactly once - on a cup, a door, a tram, a jacket sleeve. Why: forces the eye to land where we want, and keeps the feed visually coherent when nine tiles sit in a row.
2. **Natural light only, golden hour or soft overcast.** No studio strobes, no ring light, no midday sun flare, no neon blue hour. Why: Istanbul's amber light is the brand. Cold light reads as stock photography and breaks the local-friend voice.
3. **No text baked into the image.** Headlines, eyebrows, CTAs, and the wordmark go on in Canva or Figma after generation. Why: typos don't cost a regeneration, text stays crisp at thumbnail size, LinkedIn's 2026 in-image-text detection no longer suppresses text-heavy frames.
4. **Lived-in, not staged.** A pulled-back chair, a half-full glass, a cat on a step, a closed laptop. Never influencer-pose, never hero-shot tourist. Why: the brand voice is "helpful friend who's been here a while," and the images must match.
5. **Humans are anonymous.** Backs, silhouettes, waist-down, hands only. No recognizable faces, no invented named people. Why: we don't fabricate testimonials or pretend real community members are in every cafe.

---

## 2. Palette lock

Two layers. The **site layer** is canonical for any asset that lives on istanbulnomads.com (OG cards, favicon, UI). The **photography layer** is the lived-in, slightly desaturated translation of those tokens into documentary 35mm color - use it for every AI-generated scene.

### Site layer (from `tailwind.config.ts` and `src/styles/globals.css`)

| Token | Hex | Role |
|---|---|---|
| `primary-500` | `#c0392b` | Brand red. Wordmark, CTA, one accent per frame. |
| `primary-400` / `accent-coral` | `#e74c3c` | Brighter coral. Hover states only, not photography. |
| `secondary-500` | `#2c3e50` | Deep slate. Secondary text, footer chrome. |
| `accent-warm` | `#f39c12` | Amber. Warm highlights, tags. |
| `accent-green` | `#27ae60` | Verified / success only. Never decorative. |
| `surface-light` | `#ffffff` | Light surface. |
| `surface-dark` | `#1a1d27` | Dark surface, OG card base. |
| `--background` light | `#fafafa` | Site body. |
| `--foreground` light | `#1a1a2e` | Site text. |
| `--muted` light | `#5d6d7e` | Warm-gray muted text. |

### Photography layer (derived, use in every AI prompt)

```
Accent red      #c0392b  (Tailwind primary-500, matches OG wordmark exactly)
Warm amber      #f39c12  (Tailwind accent-warm, Istanbul sunlight)
Muted teal      #2f8f7b  (derived from secondary, reserved for water/sky)
Warm parchment  #f5efe4  (light background for flatlays)
Deep warm black #140b09  (dark background, never pure #000)
Warm brown-gray #6b6257  (mid tones, shadows)
Warm taupe      #b8a898  (soft texture, linen, stone)
```

### ASCII swatch

```
ACCENT   WARM     WATER    GROUND-L   GROUND-D   MID       TAUPE
[#c0392b][#f39c12][#2f8f7b][#f5efe4 ][#140b09 ][#6b6257][#b8a898]
 ####     ####     ####     ....      ::::      ~~~~     ....
 ####     ####     ####     ....      ::::      ~~~~     ....
```

### Usage rules

- Accent red: **exactly one object per frame**, small to medium in area. Never the dominant color.
- Warm amber: fills the scene as light (window spill, pendant glow, sunset). Never a solid shape.
- Muted teal: **reserved for Bosphorus water, sky, and one counterpoint accent** (a water bottle, a tile, a door frame). Never a wall, never clothing on the main subject.
- Warm parchment: flatlay surfaces only. Not a wall color.
- Deep warm black: dark-mode backgrounds, night scenes. Never pure `#000000`.

### Forbidden colors

- Pure black `#000000`
- Pure white `#ffffff` as a large area in photography (ok as page background only)
- Cold blue-gray `#4a90e2` family and all corporate-SaaS blues
- Neon saturation above ~80% (no electric pink, no cyber yellow)
- Pastel rainbow gradients
- Silicon-Valley-startup purple

---

## 3. Master style card

Paste this once at the start of a generation session, then send scene-only prompts per image. Three tool variants. Each produces output that sits next to the others in a feed without clashing.

### Nano Banana / Gemini 2.5 Flash Image (default)

```
STYLE: Istanbul Digital Nomads brand system. Warm documentary photo realism,
shot on 35mm, editorial travel-magazine feel. Golden hour or soft overcast
light only. Shallow depth of field, natural grain, no HDR, no lens flare,
no vignette, no tilt-shift.

PALETTE: Terracotta red #c0392b as the single accent color, used once per
frame. Warm amber #f39c12 for sunlight and interior lamp glow. Muted teal
#2f8f7b reserved for Bosphorus water, sky, and one small counterpoint
object. Warm parchment #f5efe4 for flatlay grounds. Deep warm near-black
#140b09 for dark backgrounds. Mid tones warm brown-gray #6b6257 and warm
taupe #b8a898. No pure black, no cold blue-gray, no neon, no pastel.

MOOD: Slow, lived-in, quiet competence. A city someone actually lives in,
not a tourism brochure. Early-morning ferries, late-afternoon cafe windows,
olive-toned skin tones, Turkish interior textures (warm wood, brass, old
tile, natural linen, terracotta pots).

COMPOSITION: Rule-of-thirds, subject off-center, generous negative space.
Environmental context visible but uncluttered. Humans anonymous: backs,
silhouettes, waist-down, or hands only.

NEVERS: no stock-photo poses, no suitcase-at-airport cliche, no hallucinated
hands, no invented street signs, shop names, map labels, or logos, no text
baked into the image, no Comic Sans or script fonts, no lens flare, no HDR,
no drone skyline cliche, no mosque as generic "Istanbul" decoration, no
influencer-selfie angle, no tank-top Western nomad trope.

ASPECT: specified per scene.
```

### Midjourney v7

```
/imagine prompt: [SCENE HERE], warm documentary photo, 35mm film, editorial
travel magazine, golden hour light, shallow depth of field, natural grain,
terracotta red #c0392b single accent, warm amber #f39c12 light, muted teal
#2f8f7b water, warm parchment #f5efe4 ground, deep warm near-black #140b09,
Istanbul lived-in atmosphere, anonymous figures only
--ar [RATIO] --style raw --stylize 150 --chaos 8
--no text, logos, signs, maps, neon, HDR, lens flare, tilt-shift,
stock pose, suitcase, airplane window, passport closeup, tourist pose,
influencer selfie, tank top, Comic Sans, pure black, cold blue gray,
pastel rainbow, midday harsh sun
```

Notes: `--style raw` kills the default MJ painterly bias. `--stylize 150` keeps editorial feel without going illustrative. `--chaos 8` gives slight variation between runs without breaking the palette.

### Flux 1.1 Pro

```
Prompt:
[SCENE HERE]. Warm documentary 35mm photograph, editorial travel magazine
style, golden hour or soft overcast. Terracotta red #c0392b as the single
accent color used once. Warm amber #f39c12 light. Muted teal #2f8f7b for
water and one counterpoint. Warm parchment #f5efe4 ground. Deep warm
near-black #140b09 shadows. Shallow depth of field, natural film grain,
lived-in Istanbul atmosphere, anonymous figures.

Negative prompt:
text, watermark, logos, street signs, shop names, map labels, readable
characters, AI hands, HDR, neon, tilt-shift, lens flare, stock photo pose,
cold blue-gray color cast, pure black, saturation above 80, influencer
pose, tank top, airplane window, suitcase at airport, tourist selfie,
mosque skyline cliche, drone shot, pastel gradient, Comic Sans.

Aspect ratio: [RATIO]
Guidance: 3.5
Steps: 28
```

---

## 4. Scene archetypes

Eight reusable scenes that cover ~80% of what we generate. Each has: when to use, base scene prompt (plug into any of the three tools above after the master style card), composition rules, accent placement, aspect variants.

### A1 - Kadikoy cafe window seat

- **Use for:** coworking vs cafe posts, morning routine posts, "I wrote this from" anchors.
- **Scene prompt:** `Interior of a specialty coffee shop in Kadikoy mid-afternoon, warm wood counter in soft focus, a single cortado in sharp focus on a linen napkin, the edge of a closed laptop blurred in the foreground, a quiet tree-lined street visible through the window, soft amber light spilling across the table.`
- **Composition:** subject lower-third, window upper-two-thirds, shallow DOF.
- **Accent placement:** the cortado cup, or a single terracotta-glazed saucer.
- **Aspects:** 1.91:1 (1200x630 blog / OG), 1:1 (1080x1080 LI square), 4:5 (1080x1350 carousel).

### A2 - Bosphorus ferry at golden hour

- **Use for:** mood pieces, commute posts, "why Istanbul" narrative openers.
- **Scene prompt:** `A Bosphorus commuter ferry mid-crossing at golden hour, low sun hitting the deck, silhouette of a single passenger (back only) leaning on the rail looking toward the European shore, seagulls blurred in motion, muted amber sky, muted teal water with faint terracotta reflections, distant minaret silhouettes hazed into the background not front-and-center.`
- **Composition:** horizon on the upper third, figure off-center left, open water right.
- **Accent placement:** a small red life-ring, or the terracotta reflection on water.
- **Aspects:** 1.91:1 (best), 4:5 (crop figure tight).

### A3 - Laptop-on-cafe-table flatlay

- **Use for:** remote-work tactical posts, tool recommendations, cost breakdowns.
- **Scene prompt:** `Overhead flatlay on a warm wood cafe table: a closed matte-silver laptop, a ceramic cup of black coffee, a small open notebook with an illegible pencil scribble, a Turkish tulip tea glass half-full, a brass pen, soft morning window light from the left.`
- **Composition:** objects form a loose diagonal, 30-40% negative space upper-right.
- **Accent placement:** the tea glass amber liquid glowing, or a single terracotta coaster.
- **Aspects:** 4:5 and 1:1. Avoid 1.91:1 for flatlays (awkward).

### A4 - Tram on Istiklal at dusk

- **Use for:** transport posts, "getting around" guides, European-side content.
- **Scene prompt:** `A nostalgic red tram on Istiklal Avenue at dusk, warm amber streetlamp glow on wet cobblestones after light rain, blurred motion of pedestrians in the background, the tram itself in sharp focus but not centered, historic facades softened into bokeh.`
- **Composition:** tram entering frame from right, leading line down the street, amber spill on the ground.
- **Accent placement:** the red tram itself IS the accent, no second red object in frame.
- **Aspects:** 1.91:1 (cinematic), 4:5 (vertical for carousel).

### A5 - Neighborhood street (Besiktas / Moda / Balat)

- **Use for:** neighborhood guides, "where to live" posts, quiet-moment anchors.
- **Scene prompt (Moda/Kadikoy variant):** `A quiet residential Kadikoy side street mid-morning, warm terracotta apartment facades, a narrow strip of sky above, a street cat napping on a low stone step in the foreground, a single bicycle leaning against a wall mid-frame, soft diffuse light, no readable signage.`
- **Scene prompt (Balat variant):** `Narrow Balat street at golden hour, warm amber light on colorful old Balat house facades softened by shallow depth of field, a single figure walking away from camera in the middle distance, warm cafe-window glow spilling onto cobblestones from the left.`
- **Composition:** vanishing-point perspective down the street, foreground detail in focus.
- **Accent placement:** one red shutter, one red flowerpot, one red bicycle.
- **Aspects:** 1.91:1, 4:5.

### A6 - Coworking interior

- **Use for:** space spotlights, coworking vs cafe posts, community posts.
- **Scene prompt:** `Wide interior of a quiet coworking space mid-morning, long communal wood table, one closed laptop out of focus, an empty chair pulled back as if someone just stepped out for coffee, terracotta pots with plants along the window sill, warm amber pendant light overhead, a single teal water bottle on the table, no people, no readable signage, no brand logos.`
- **Composition:** table as leading line, window light left, negative space right for Canva overlay.
- **Accent placement:** a red chair, a red ceramic mug, a red notebook cover.
- **Aspects:** 4:5 (best for carousel), 1.91:1 (wide hero).

### A7 - Paperwork / passport flatlay

- **Use for:** visa, ikamet, residence permit, tax, banking posts.
- **Scene prompt:** `Flatlay on warm parchment of a manila folder with unmarked document edges sticking out, a generic dark red passport (no national emblem, blurred cover), a brass paperclip, a black ballpoint pen, a small Turkish tea glass half-full, soft morning window light from the left. All text illegible, no readable seals, no national flags.`
- **Composition:** objects in a loose triangle, 40% negative space, pen as diagonal line.
- **Accent placement:** the passport cover is the accent red, everything else muted.
- **Aspects:** 4:5 (strongest), 1:1.

### A8 - Rooftop with minaret skyline

- **Use for:** mood-heavy narrative posts, "Istanbul belongs to you" moments. Use sparingly - easy to slide into cliche.
- **Scene prompt:** `A private rooftop terrace in Galata at golden hour, foreground a wooden table with a single Turkish tea glass in focus and a closed notebook, middle ground a low wall, background the Istanbul skyline with minaret silhouettes hazed into amber light, muted teal Bosphorus sliver visible on the right, soft natural grain.`
- **Composition:** foreground-mid-background layering, horizon on lower third.
- **Accent placement:** a single red geranium in a terracotta pot on the wall, or the tea glass.
- **Aspects:** 1.91:1, 4:5 (vertical crop drops the sliver of water).

---

## 5. Carousel consistency protocol

Slides 2-N must look like they came from the same photographer, same day, same lens. Tool-specific recipes:

### Nano Banana (preferred for carousels)

1. Generate slide 1 from the scene prompt with the master style card prepended. This is your **reference anchor**.
2. Save locally as `anchor.png`.
3. For each subsequent slide, upload `anchor.png` as a reference image and prompt: `[new scene]. Match the reference image's color palette, grain, light direction, and lens character exactly. Same time of day, same atmosphere, same warm cast.`
4. If a slide drifts, regenerate with the added phrase `match the warmth and muted contrast of the reference`.
5. Batch-export, hand to Canva.

### Midjourney v7

1. Generate slide 1 with the master style card. Note the job ID.
2. Get the style reference: `/prefer option set style-in mode:sref [URL of slide 1]`.
3. For slides 2-N, prompt: `[new scene] --sref [URL of slide 1] --sw 400 --cref [URL of slide 1] --cw 40 --ar [ratio] --style raw --stylize 150`.
4. `--sw 400` locks style tight. `--cw 40` keeps character continuity loose enough to change subjects. If a slide changes subject type entirely (flatlay after a portrait), drop `--cref` but keep `--sref`.

### Flux 1.1 Pro

1. Generate slide 1. Record the seed.
2. For slides 2-N, reuse the seed with a small offset (seed + 1, seed + 2, ...) and prepend the same style block verbatim. Flux is more literal than MJ so the palette holds if the prompt holds.
3. If palette drifts, bump guidance from 3.5 to 4.0 and re-roll.

---

## 6. Typography direction

For text added in Canva or Figma **after** generation. Never asked of the AI.

- **Headline / title card:** Manrope 800, tracking -1.5 at 72pt, line height 1.05. Site's `h1` scale.
- **Eyebrow / category label:** IBM Plex Mono (or the site's `--font-mono`), uppercase, tracking 0.35em, 11-14pt, color `#5d6d7e` light / `#99a3ad` dark. Site's `.eyebrow` utility.
- **Body on slides:** Manrope 500, 22-28pt, line height 1.35.
- **Wordmark block:** Manrope 700, uppercase, tracking 0.5, with the red `IN` badge at 40x40 radius 12, exactly like `src/lib/og-image.tsx`.
- **Footer slug:** `istanbulnomads.com` left, `Remote life, local rhythm` right in `#c0392b`.

Font stack reference: `tailwind.config.ts` → `fontFamily.sans` → `var(--font-sans)` which resolves to Manrope site-wide, fallback Inter then system-ui.

---

## 7. Hard nevers

Expanded from Section 1. If any of these appear in output, regenerate.

- No fabricated named people. No "Ahmet, 32, from Istanbul" captions on faces the AI invented.
- No AI-rendered text anywhere in the image. Not on signs, not on laptop screens, not on book spines, not on phone screens. If a sign must exist, it's blurred beyond legibility.
- No cold blue-gray corporate tech vibe. No "startup office stock photo" aesthetic.
- No stock poses. No arms-crossed-confident, no pointing-at-laptop, no high-five, no group huddle.
- No invented street signs, shop names, restaurant signage, or map labels. A real Istanbul shop name that isn't a partner is worse than a made-up one.
- No pure black `#000000` anywhere. Shadows are deep warm near-black `#140b09`.
- No neon saturation above ~80%. No electric pink, no cyber yellow, no radioactive green.
- No influencer-selfie angles. No arm-out phone-in-frame shot. No mirror selfie.
- No multiple accent colors in one frame. One red object per image. If there are two, regenerate or edit one out.
- No mosques used as generic Istanbul wallpaper when the post isn't about religion, architecture, or Sultanahmet specifically.
- No drone skyline cliche. The Bosphorus-from-above shot is in every Istanbul tourism video; we don't do it.
- No suitcase-at-airport cliche, no airplane window shot, no passport close-up with the page visible.
- No tank-top-Western-nomad trope. No coconut drink, no beach hammock, no "working from paradise" visual.
- No baby blue, powder pink, or Silicon Valley purple gradients.
- No AI hallucinated hands. If hands appear, they must be natural positions at the edge of frame or holding a single object, never gesturing.

---

## 8. Negative prompt snippets

Ready to paste.

### Midjourney v7 `--no` tail

```
--no text, logos, signs, maps, readable characters, neon, HDR, lens flare,
tilt-shift, stock pose, suitcase, airplane window, passport closeup,
tourist pose, influencer selfie, tank top, Comic Sans, pure black,
cold blue gray, pastel rainbow, midday harsh sun, drone shot,
mosque skyline cliche, hallucinated hands, multiple red objects
```

### Flux / Nano Banana negatives

```
text, watermark, logos, street signs, shop names, map labels,
readable characters, AI hands, HDR, neon, tilt-shift, lens flare,
stock photo pose, cold blue-gray color cast, pure black, saturation
above 80, influencer pose, tank top, airplane window, suitcase at
airport, tourist selfie, mosque skyline cliche, drone shot, pastel
gradient, Comic Sans, multiple accent colors, midday flat light
```

---

## 9. QA checklist

Six questions. Ask all six before publishing. Any "no" means regenerate or edit.

1. **Accent present exactly once?** Count red objects. If zero or two+, fix.
2. **Natural light, golden hour or soft overcast?** No harsh shadows, no flat midday, no blue hour neon.
3. **Palette compliant?** Eyedropper three points. If any hit cold blue-gray, pure black, or neon saturation, fix.
4. **Zero fake text?** No readable signs, no laptop-screen text, no invented shop names. If text exists, is it blurred to illegibility?
5. **Aspect correct for destination?** LinkedIn square 1:1, carousel 4:5, blog cover and OG 1.91:1 at 1200x630.
6. **Feels like an Istanbul Nomads piece?** Pull up the last 3 posts in the feed. Does this image sit next to them without clashing? If it would look more at home on a SaaS landing page, fix.

---

## 10. Reference anchors

Three north-star references. Every generation should feel like it could sit in this set.

1. **`src/app/opengraph-image.tsx` (live on the site).** Dark canvas `#0f1117` with a top-left terracotta glow, red `IN` badge, Manrope wordmark. The chrome, wordmark color, and accent-red usage here are canonical. Open it in a browser at `/opengraph-image` to eyedropper the exact tones. Any photograph we generate should be able to live inside the frame this card establishes.
2. **`src/lib/og-image.tsx` render logic.** Defines `BRAND = #c0392b`, `BG = #0f1117`, `FG = #f2f3f4`, `MUTED = #99a3ad`. These are the locked hex values for any site-adjacent asset. Photography warms `#0f1117` to `#140b09` and `#c0392b` stays identical.
3. **Kadikoy waterfront at golden hour (real reference).** Shoot direction: Kadikoy pier looking west toward the European side, 18:30-19:15 local time in April or October. Amber sky, muted teal water, minaret silhouettes hazed, a single ferry mid-crossing. This is the target mood for every A2 (Bosphorus) and A8 (rooftop) scene. If you can't physically shoot it, the AI prompt should describe it exactly.

Secondary anchors (use when relevant):

- **Coffee Department in Balat** for A1 cafe-window mood: warm wood, terracotta tile, morning window light.
- **Kolektif House Kadikoy** for A6 coworking mood: long communal wood tables, warm pendants, terracotta pots.
- **Moda side streets at 10:00** for A5 neighborhood mood: warm facades, cats, bicycles, no crowds.

---

## Quick reference for collaborators

**Elevator pitch:** Warm documentary 35mm photography of a lived-in Istanbul, one terracotta-red accent per frame, anonymous figures only, text added later in Canva. Think editorial travel magazine at golden hour, not tourism brochure or SaaS landing page.

**Before every generation session:**

1. Paste the master style card (Section 3) into your tool of choice.
2. Pick a scene archetype from Section 4.
3. Append the negative prompt snippet (Section 8).
4. Run the QA checklist (Section 9) before publishing.
