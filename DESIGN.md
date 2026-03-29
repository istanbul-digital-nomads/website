# Design System

The visual identity and design guidelines for the Istanbul Digital Nomads website. Modern, minimal, and welcoming.

## Design Principles

1. **Clean over cluttered** — Every element earns its place. Generous whitespace. No decoration for decoration's sake.
2. **Content first** — The design serves the content, not the other way around.
3. **Accessible by default** — High contrast, readable fonts, keyboard navigable, screen reader friendly.
4. **Consistently warm** — Minimal doesn't mean cold. Subtle warmth through color accents and friendly copy.
5. **Fast and light** — No heavy animations or large assets. Performance is a feature.

## Color Palette

### Primary Colors
```
--color-primary-50:   #f0f7ff    (lightest blue tint)
--color-primary-100:  #dbeafe
--color-primary-200:  #bfdbfe
--color-primary-300:  #93c5fd
--color-primary-400:  #60a5fa
--color-primary-500:  #3b82f6    (primary blue)
--color-primary-600:  #2563eb    (primary hover)
--color-primary-700:  #1d4ed8
--color-primary-800:  #1e40af
--color-primary-900:  #1e3a8a    (darkest blue)
```

### Accent Colors
```
--color-accent-warm:  #f59e0b    (amber — Istanbul-inspired warmth)
--color-accent-coral: #f43f5e    (coral — for highlights and badges)
--color-accent-green: #10b981    (emerald — success states)
```

### Neutrals
```
--color-neutral-50:   #fafafa
--color-neutral-100:  #f5f5f5
--color-neutral-200:  #e5e5e5
--color-neutral-300:  #d4d4d4
--color-neutral-400:  #a3a3a3
--color-neutral-500:  #737373
--color-neutral-600:  #525252
--color-neutral-700:  #404040
--color-neutral-800:  #262626
--color-neutral-900:  #171717    (text on light backgrounds)
--color-neutral-950:  #0a0a0a    (darkest)
```

### Dark Mode
```
Background:    #0a0a0a (neutral-950)
Surface:       #171717 (neutral-900)
Surface hover: #262626 (neutral-800)
Border:        #404040 (neutral-700)
Text primary:  #fafafa (neutral-50)
Text secondary:#a3a3a3 (neutral-400)
```

### Light Mode
```
Background:    #ffffff
Surface:       #fafafa (neutral-50)
Surface hover: #f5f5f5 (neutral-100)
Border:        #e5e5e5 (neutral-200)
Text primary:  #171717 (neutral-900)
Text secondary:#737373 (neutral-500)
```

## Typography

### Font Stack
```
--font-sans:  "Inter", system-ui, -apple-system, sans-serif
--font-mono:  "JetBrains Mono", "Fira Code", monospace
```

**Inter** is our primary typeface. Clean, modern, excellent readability at all sizes. Load weights 400, 500, 600, and 700 from Google Fonts.

### Type Scale
```
text-xs:    0.75rem  / 1rem      (12px — captions, badges)
text-sm:    0.875rem / 1.25rem   (14px — secondary text, metadata)
text-base:  1rem     / 1.5rem    (16px — body text)
text-lg:    1.125rem / 1.75rem   (18px — lead paragraphs)
text-xl:    1.25rem  / 1.75rem   (20px — card titles)
text-2xl:   1.5rem   / 2rem      (24px — section headers)
text-3xl:   1.875rem / 2.25rem   (30px — page titles)
text-4xl:   2.25rem  / 2.5rem    (36px — hero subheading)
text-5xl:   3rem     / 1          (48px — hero heading)
text-6xl:   3.75rem  / 1          (60px — hero heading large screens)
```

### Usage Guidelines
- **Headings**: font-semibold (600) or font-bold (700)
- **Body text**: font-normal (400)
- **Labels/UI**: font-medium (500)
- **Max line length**: 65–75 characters for body text (max-w-prose)
- **Paragraph spacing**: 1.5rem between paragraphs

## Spacing

Use Tailwind's default spacing scale. Key values:

```
4px   (1)   — Tight spacing (between icon and label)
8px   (2)   — Compact spacing (between related items)
12px  (3)   — Default inner padding
16px  (4)   — Standard padding
24px  (6)   — Section inner padding
32px  (8)   — Card padding
48px  (12)  — Between sections (mobile)
64px  (16)  — Between sections (desktop)
96px  (24)  — Page top/bottom padding
128px (32)  — Hero section padding
```

## Border Radius

```
rounded-sm:   0.125rem  (2px)   — Badges, tags
rounded:      0.25rem   (4px)   — Inputs, small buttons
rounded-md:   0.375rem  (6px)   — Default for most elements
rounded-lg:   0.5rem    (8px)   — Cards
rounded-xl:   0.75rem   (12px)  — Modals, large cards
rounded-2xl:  1rem      (16px)  — Hero cards, feature blocks
rounded-full: 9999px             — Avatars, pills
```

## Shadows

Minimal shadow usage. Only for elevated elements:

```
shadow-sm:    0 1px 2px rgba(0,0,0,0.05)       — Subtle lift (cards on hover)
shadow:       0 1px 3px rgba(0,0,0,0.1)         — Cards
shadow-lg:    0 10px 15px rgba(0,0,0,0.1)       — Modals, dropdowns
```

In dark mode, use border outlines instead of shadows.

## Components

### Button Variants
```
Primary:     bg-primary-600 text-white hover:bg-primary-700
Secondary:   bg-neutral-100 text-neutral-900 hover:bg-neutral-200
Ghost:       text-neutral-600 hover:bg-neutral-100
Danger:      bg-red-600 text-white hover:bg-red-700
```

Sizes: `sm` (h-8 px-3 text-sm), `md` (h-10 px-4 text-sm), `lg` (h-12 px-6 text-base)

### Card Pattern
```
bg-white dark:bg-neutral-900
border border-neutral-200 dark:border-neutral-800
rounded-lg
p-6
hover:shadow-sm transition-shadow
```

### Input Pattern
```
bg-white dark:bg-neutral-900
border border-neutral-300 dark:border-neutral-700
rounded-md
px-3 py-2
text-sm
focus:ring-2 focus:ring-primary-500 focus:border-transparent
placeholder:text-neutral-400
```

### Badge Pattern
```
Types:
  meetup     → bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400
  coworking  → bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400
  workshop   → bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400
  social     → bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400
```

## Layout

### Container
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Grid
```
Homepage:    Single column, full-width sections
Events:      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
Resources:   grid grid-cols-1 md:grid-cols-2 gap-6
Blog:        grid grid-cols-1 lg:grid-cols-3 gap-8 (main + sidebar)
```

### Breakpoints (Tailwind defaults)
```
sm:   640px    (large phones)
md:   768px    (tablets)
lg:   1024px   (laptops)
xl:   1280px   (desktops)
2xl:  1536px   (large screens)
```

## Animation

Keep animations subtle and purposeful:

```
transition-colors duration-150   — Color changes (hover states)
transition-shadow duration-200   — Shadow changes (card hover)
transition-transform duration-200 — Scale changes
transition-opacity duration-300   — Fade in/out
```

No scroll-triggered animations. No parallax. No bouncing elements.

Entry animations for page content: simple fade-up with 200ms duration and staggered delays.

## Iconography

Use **Lucide React** icons throughout. Consistent sizing:
- Inline with text: 16px (w-4 h-4)
- Buttons: 20px (w-5 h-5)
- Feature blocks: 24px (w-6 h-6)
- Hero/empty states: 48px (w-12 h-12)

Stroke width: 1.5 (Lucide default) for a lighter, modern feel.

## Image Guidelines

- Hero images: 1920×1080, WebP format, compressed
- Event covers: 800×450 (16:9 ratio), WebP
- Avatars: 256×256, circular crop
- Guide thumbnails: 600×400, WebP
- Always provide alt text
- Use next/image for automatic optimization
- Lazy load all images below the fold
