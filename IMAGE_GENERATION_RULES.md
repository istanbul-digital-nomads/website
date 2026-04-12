# Image Generation Rules - Istanbul Digital Nomads

These rules apply to ALL image generation for the Istanbul Digital Nomads brand - blog hero images, guide covers, social media graphics, OG images, event banners, promotional materials, and any visual content.

Every AI agent, designer, or contributor creating images for this brand MUST follow these rules exactly.

---

## 1. Color Palette

### Primary Colors (Turkey Red)

Use these as the dominant brand accent in every image.

| Token | Hex | Usage |
|---|---|---|
| primary-500 | #e34b32 | Core brand red - headlines, accents, icons |
| primary-600 | #c8351f | Darker red - gradients, overlays |
| primary-700 | #a42818 | Deep red - gradient stops |
| primary-800 | #87241a | Rich red - shadows, depth |
| primary-900 | #6f241c | Darkest red - dark gradient stops |
| primary-400 | #f56d57 | Bright red - highlights, callouts |
| primary-300 | #ff9a80 | Light red - subtle tints |
| primary-100 | #ffe1d7 | Very light red - backgrounds |

### Accent Colors

| Token | Hex | Usage |
|---|---|---|
| accent-warm | #d49a45 | Golden amber - secondary accent, warmth, Istanbul sunlight |
| accent-coral | #ff7b61 | Coral highlight - energy, attention |
| accent-green | #2f8f7b | Teal emerald - success, nature, Bosphorus water |

### Background Colors

| Context | Hex | Usage |
|---|---|---|
| Light background | #f5efe4 | Warm parchment - main surface |
| Dark background | #151010 | Warm near-black - dark mode surface |
| Deep dark | #140b09 | Rich dark - OG images, hero overlays |
| Card dark | #1c1614 | Warm dark brown - dark mode cards |
| Card light | #ffffff | White - light mode cards |

### Text Colors

| Context | Hex | Usage |
|---|---|---|
| Heading (light) | #111827 | Near-black on light backgrounds |
| Heading (dark) | #f7f2ea | Off-white on dark backgrounds |
| Body (light) | #6b6257 | Warm brown-gray |
| Body (dark) | #b8a898 | Warm taupe |
| Muted (light) | #6b6257 | De-emphasized text |
| Muted (dark) | #8a7a6a | De-emphasized text, dark mode |
| Eyebrow/label (OG) | #ffb3a4 | Soft pink-red for brand name on dark |
| Description (OG) | #d1c6be | Warm gray for body text on dark |
| Domain/footer (OG) | #c6b7ad | Muted warm for URLs on dark |

### Colors to NEVER Use

- Pure black (#000000) - always use warm near-blacks (#151010, #140b09, #1c1614)
- Cold blue-grays (#374151, #6b7280, #9ca3af, #d1d5db) - always use warm browns
- Neon/electric colors - no bright cyan, magenta, or lime
- Pastel rainbow colors - stay within the warm palette

---

## 2. Gradients

### Hero/Featured Gradient (primary dark panels)

```
Light: linear-gradient(135deg, #8a2a1a 0%, #5c1a12 50%, #3d1410 100%)
Dark:  linear-gradient(135deg, #5c1a12 0%, #3d1410 50%, #231a14 100%)
```

Use for: blog hero images, guide covers, featured content backgrounds.

### OG Image Background

```
Background: #140b09
Overlay: radial-gradient(circle at 24% 24%, #c8351f 0%, transparent 48%),
         radial-gradient(circle at 80% 20%, #d49a45 0%, transparent 36%),
         radial-gradient(circle at 78% 78%, rgba(47,143,123,0.72) 0%, transparent 34%)
```

Use for: OpenGraph cards, social media share images.

### Brand Accent Gradient (progress bars, decorative stripes)

```
linear-gradient(90deg, #e34b32, #d49a45)
```

Use for: decorative lines, progress indicators, small accent elements.

### Warm Ambient Gradient (page backgrounds)

```
radial-gradient(circle at top left, rgba(227, 75, 50, 0.14), transparent 30%),
radial-gradient(circle at top right, rgba(212, 154, 69, 0.16), transparent 32%),
radial-gradient(circle at bottom right, rgba(47, 143, 123, 0.08), transparent 26%)
```

Use for: subtle background atmosphere, image overlays that need warmth.

### Icon/Logo Gradient

```
Favicon: linear-gradient(135deg, #e34b32 0%, #a42818 74%)
Apple:   linear-gradient(135deg, #f56d57 0%, #c8351f 55%, #7f231a 100%)
```

---

## 3. Typography

### Font Families

| Role | Font | Fallback |
|---|---|---|
| **Primary (headings + body)** | Manrope | system-ui, -apple-system, sans-serif |
| **Mono (labels, code, eyebrows)** | IBM Plex Mono | ui-monospace, monospace |

**IMPORTANT:** Always use Manrope for headlines and body text. Never use serif fonts, decorative fonts, or handwriting fonts. The brand voice is modern, clean, and approachable.

### Font Weights

| Weight | Usage |
|---|---|
| 400 (Regular) | Body text, descriptions |
| 500 (Medium) | Labels, UI elements, subtle emphasis |
| 600 (Semibold) | Section headings, card titles |
| 700 (Bold) | Hero titles, strong emphasis |

### Text Sizing for Images

| Element | Size (OG 1200x630) | Size (Social 1080x1080) | Size (Blog 1200x800) |
|---|---|---|---|
| Brand eyebrow | 24px | 20px | 22px |
| Main headline | 56px | 48px | 52px |
| Subheading | 22px | 18px | 20px |
| Footer/URL | 18px | 16px | 16px |

### Letter Spacing

| Context | Value |
|---|---|
| Eyebrow/brand name | 0.08em - 0.35em (uppercase, mono) |
| Headlines | -0.02em (tracking-tight) |
| Body text | Normal (0) |

### Text Styling Rules

- Eyebrows/labels: UPPERCASE, IBM Plex Mono, weight 500-600, wide tracking
- Headlines: Title Case or Sentence case, Manrope, weight 700
- Body text: Sentence case, Manrope, weight 400
- NEVER use ALL CAPS for headlines (only for eyebrows/labels)

---

## 4. Image Composition Rules

### Layout Hierarchy

Every image follows this stack (top to bottom):

1. **Brand eyebrow** - "ISTANBUL DIGITAL NOMADS" in uppercase mono, soft pink-red (#ffb3a4) on dark or muted brown on light
2. **Main headline** - The content title, largest text, white (#fafafa) on dark or near-black (#111827) on light
3. **Description** (optional) - One line of context, warm gray (#d1c6be on dark, #6b6257 on light)
4. **Footer** - Domain "istanbulnomads.com" at bottom, most muted color

### Spacing

- Generous padding: at least 40px on all sides for OG images, 60-80px horizontal
- Headline has the most visual weight and space around it
- Vertical rhythm between elements: 16-24px gaps
- Content centered both horizontally and vertically

### Alignment

- Center-aligned for OG images and social cards
- Left-aligned for blog hero images and guide covers
- Brand eyebrow always above the headline, never below

---

## 5. Image Dimensions

| Type | Dimensions | Aspect Ratio |
|---|---|---|
| **OG Image** | 1200 x 630 px | 1.91:1 |
| **Blog hero** | 1200 x 800 px | 3:2 |
| **Guide cover** | 1200 x 800 px | 3:2 |
| **Instagram post** | 1080 x 1080 px | 1:1 |
| **Instagram story** | 1080 x 1920 px | 9:16 |
| **Twitter/X header** | 1500 x 500 px | 3:1 |
| **Event banner** | 1200 x 628 px | 1.91:1 |
| **Favicon** | 32 x 32 px | 1:1 |
| **Apple icon** | 180 x 180 px | 1:1 |

---

## 6. Visual Style

### Photography Style (when using photos)

- **Warm color grading** - push toward golden hour warmth, never cold/blue
- **Istanbul-specific landmarks** - Bosphorus, mosques, ferries, bazaars, cats, tea glasses, simit
- **Nomad lifestyle** - laptops in cafes, rooftop terraces, ferry commutes, coworking spaces
- **People** - diverse, casual, working on devices in beautiful locations
- **NEVER** stock-photo-generic. Every image should feel like it was taken by someone who actually lives in Istanbul.

### Photo Overlay Treatment

When placing text over photos, always use:

```
Background overlay: linear-gradient(135deg, rgba(138,42,26,0.85) 0%, rgba(92,26,18,0.9) 50%, rgba(61,20,16,0.92) 100%)
```

This ensures text readability while keeping the warm brand palette.

### Illustration Style (when using illustrations/graphics)

- Flat or semi-flat design, no 3D renders
- Warm color palette only (reds, ambers, teals from the brand)
- Geometric shapes with generous rounded corners (matching border-radius: 8-16px)
- Subtle grain texture is OK (adds warmth), but no heavy noise
- Lucide icon style: 1.5px stroke weight, rounded caps and joins

### Decorative Elements

- **Radial gradient blobs** - Soft, large, blurred color circles (red, amber, teal) placed asymmetrically
- **Subtle grain** - Light noise texture for depth (opacity 0.03-0.08)
- **Line accents** - Thin (1-2px) lines in brand colors, can be dashed
- **NO:** drop shadows on text, bevels, emboss effects, star bursts, lens flares

---

## 7. Logo Usage

### The Mark

The Istanbul Digital Nomads logo is a text monogram: **IN**

| Context | Style |
|---|---|
| On dark backgrounds | White "IN" on gradient (#e34b32 to #a42818), rounded corners |
| On light backgrounds | Primary-600 (#c8351f) "IN" or full gradient version |
| Minimum size | 24px height |
| Clear space | At least 50% of logo height on all sides |

### Brand Name Typography

When the full name appears:

- **Short form:** "Istanbul Nomads"
- **Full form:** "ISTANBUL DIGITAL NOMADS" (uppercase, mono font, wide tracking)
- **NEVER abbreviate** to "IDN" in public-facing content
- **Domain:** istanbulnomads.com (lowercase, no "www")

---

## 8. Do's and Don'ts

### DO

- Use the warm palette consistently - every image should feel like golden hour in Istanbul
- Maintain generous whitespace/negative space
- Keep text minimal - one headline, one subtitle max
- Use the gradient overlays for text readability over photos
- Include the brand eyebrow ("ISTANBUL DIGITAL NOMADS") on shareable images
- Include "istanbulnomads.com" as a footer on social/OG images
- Test images at small sizes (timeline thumbnails) for headline legibility

### DON'T

- Use cold blue or gray tones anywhere
- Place text without sufficient contrast (minimum WCAG AA)
- Overcrowd images with multiple text blocks
- Use generic travel stock photography (no "woman with suitcase at airport")
- Add watermarks beyond the brand name/URL
- Use effects: lens flare, HDR look, heavy vignette, neon glow
- Mix fonts - stick to Manrope + IBM Plex Mono only
- Use em dashes in any text on images - use regular dashes only
- Use formal language - contractions required (don't, isn't, you'll)

---

## 9. AI Image Generation Prompts

When generating images with AI tools (Midjourney, DALL-E, Flux, etc.), always include these style modifiers:

### Base prompt modifiers

```
warm golden hour lighting, Istanbul Turkey, terracotta and amber color palette,
modern clean design, Manrope font style, cozy and inviting atmosphere,
digital nomad lifestyle, professional but casual
```

### For blog/guide hero images

```
[subject description], warm golden hour, Istanbul cityscape background,
Bosphorus water visible, terracotta red and amber tones, soft bokeh,
editorial photography style, shot on 35mm, warm color grade
```

### For abstract/graphic backgrounds

```
abstract warm gradient, deep red (#c8351f) to amber (#d49a45) to teal (#2f8f7b),
soft radial gradients, subtle grain texture, dark background (#140b09),
modern minimal design, no text
```

### Style keywords to always include
- warm, golden, terracotta, amber, Istanbul, Bosphorus
- clean, modern, minimal, inviting

### Style keywords to NEVER include
- cold, blue, neon, cyberpunk, futuristic, corporate
- clipart, cartoon (unless specifically requested), stock photo

---

## 10. File Naming Convention

```
[type]-[slug].[ext]

Examples:
og-turkey-digital-nomad-visa.png
hero-best-laptop-cafes.jpg
social-istanbul-vs-lisbon.png
guide-entertainment-leisure.jpg
event-april-coworking-meetup.png
```

- Use lowercase, kebab-case
- Prefix with image type (og, hero, social, guide, event, icon)
- Optimize for web: JPEG for photos (quality 85), PNG for graphics with text, WebP preferred when supported

---

## Quick Reference Card

```
PRIMARY RED:    #e34b32 (brand core)
ACCENT AMBER:  #d49a45 (warmth)
ACCENT TEAL:   #2f8f7b (contrast)
DARK BG:       #140b09 (images) / #151010 (UI)
LIGHT BG:      #f5efe4 (parchment)
HEADING DARK:  #fafafa / #f7f2ea
HEADING LIGHT: #111827
BODY DARK:     #d1c6be / #b8a898
BODY LIGHT:    #6b6257

FONT MAIN:     Manrope (400/500/600/700)
FONT MONO:     IBM Plex Mono (400/500)

OG SIZE:       1200 x 630
HERO SIZE:     1200 x 800
SOCIAL SIZE:   1080 x 1080
```
