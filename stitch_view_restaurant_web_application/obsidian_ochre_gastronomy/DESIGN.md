---
name: Obsidian & Ochre Gastronomy
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#444748'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ed'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#a23f0f'
  on-secondary: '#ffffff'
  secondary-container: '#fe8450'
  on-secondary-container: '#6c2400'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f1400'
  on-tertiary-container: '#bb7336'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb598'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb780'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6f3800'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-tablet: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system crafts a sensory, high-end hospitality presence for an upscale casual dining destination and specialty café. The atmosphere bridges artisanal culinary precision with architectural warmth. The experience must feel deliberate, welcoming, and discerning—avoiding cold minimalism in favor of rich, tactile, and editorial presentation.

The aesthetic fuses **Warm Contemporary Minimalism** with **Refined Glassmorphism**:
- Generous breathing room and structured rhythm highlight culinary imagery, ingredient provenance, and specialty roast profiles.
- Layered translucent panels evoke smoked glass, sunlit cafe windows, and burnished bar counters.
- Precision bilingual typography (English and Arabic) ensures seamless visual dignity across both scripts without awkward structural mismatch.

## Colors
The color palette translates the warmth of specialty espresso crema, baked ceramic tableware, and dark volcanic stoneware into a balanced digital interface.

- **Primary (`#1A1A1A` - Deep Charcoal / Roasted Espresso):** Used for authoritative typography, high-priority navigation frames, crisp borders, and dark structural accents.
- **Secondary (`#E06D3B` - Warm Terracotta / Burnt Orange):** Grounding earth tone representing wood-fired elements and artisanal ceramics; applied to active navigation states, section tags, key interaction headers, and curated category highlights.
- **Tertiary (`#F4A261` - Golden Amber):** Warm golden accent designated for interactive call-to-actions, reserve badges, tasting flight indicators, and luminous states.
- **Neutral (`#FAF8F5` - Creamy Off-White):** The foundational canvas hue, radiating warmth and soft luxury over sterile digital white.

For surfaces requiring layered contrast:
- `surface-subtle`: `#F3EFEA` for inset panels, table cards, and subtle dividers.
- `surface-elevated`: `#FFFFFF` with varying alpha for frosted glass overlays.
- `text-muted`: `#66615C` for tasting notes, preparation times, and dual-language subtitles.

## Typography
The typographical structure pairs modern geometric clarity with bilingual elegance:
- **Headlines & Accents (Plus Jakarta Sans):** Delivers clean geometry, crisp modern kerning, and architectural confidence. Pairs fluidly with modern Arabic geometric typefaces (such as Cairo or Tajawal) sharing aligned x-heights and stroke widths.
- **Body & Editorial Content (Inter):** Maximizes readability for descriptions of complex tasting notes, ingredient origins, and reservation details across compact and expansive interfaces alike.

Rules:
- For Arabic localized views, pair standard weights with matched geometric Arabic typefaces (e.g., Cairo for display/labels, Tajawal for body copy) maintaining the same line-height ratios (+4px line-height for Arabic scripts to support diacritics).
- Maintain optical rhythm by balancing Latin capital tracking against natural Arabic continuous baseline connections.

## Layout & Spacing
The layout adheres to a 12-column responsive fluid grid designed around airy editorial margins:

- **Desktop (>= 1200px):** 12-column layout, `3rem` (48px) exterior margins, and `1.5rem` (24px) gutters. Menus and culinary collections span balanced asymmetric splits (e.g., 5 columns photography, 7 columns menu items).
- **Tablet (768px - 1199px):** 8-column layout, `2rem` (32px) margins, and `1.5rem` gutters. Wine lists and multi-course menus convert into clean 2-column cards.
- **Mobile (< 768px):** 4-column layout, `1.25rem` (20px) margins, and `1rem` gutters. Actionable floating bars and single-column sensory cards stack vertically.

Content layouts honor generous vertical whitespace to convey an unhurried, fine-dining rhythm.

## Elevation & Depth
Elevation is realized through warm **Polished Glassmorphism** and subtle amber-tinted ambient occlusion rather than heavy drop shadows:

- **Base Layer (Flat):** Neutral Creamy Off-White `#FAF8F5` surface with hairline dividers in `#EBE6DF`.
- **Level 1 (Card & Inset Glass):** `#FFFFFF` with 80% opacity, `backdrop-filter: blur(16px)`, bound by a 1px border in `rgba(26, 26, 26, 0.06)`. Shadow: `0 4px 20px -2px rgba(26, 26, 26, 0.04)`.
- **Level 2 (Hovered Dishes & Dropdown Navigation):** `#FFFFFF` with 92% opacity, `backdrop-filter: blur(24px)`. Shadow: `0 12px 32px -4px rgba(224, 109, 59, 0.08), 0 4px 12px -2px rgba(26, 26, 26, 0.04)`.
- **Level 3 (Modals, Reservation Sheets & Overlays):** `#FFFFFF` with 96% opacity, frosted edge sheen `inset 0 1px 0 rgba(255, 255, 255, 0.8)`. Shadow: `0 24px 48px -8px rgba(26, 26, 26, 0.12), 0 8px 16px -4px rgba(244, 162, 97, 0.06)`.

## Shapes
A roundedness level of `2` (8px base, 16px `rounded-lg`, 24px `rounded-xl`) delivers tailored architectural balance:
- Base components (inputs, list items, subtle tags) use `0.5rem` (8px) corners.
- Food & beverage cards, wine detail drawers, and floating panels use `1rem` (16px) corners.
- Featured hero media masks, degustation menus, and modal dialogs adopt `1.5rem` (24px) corners.
- Circular pills (`9999px`) are reserved strictly for dietary labels (GF, VG, Halal), active table status badges, and tasting note tags.

## Components

### Buttons
- **Primary (Reserve & Order):** Golden Amber `#F4A261` solid background with Deep Charcoal `#1A1A1A` text. Hover transitions to Warm Terracotta `#E06D3B` with off-white text. Height 48px, radius `rounded` (8px), font `label-lg`.
- **Secondary (Explore Menu, Details):** Transparent background, 1.5px border in Charcoal `#1A1A1A`, text `#1A1A1A`. Hover shifts to `#1A1A1A` fill with `#FAF8F5` text.
- **Tertiary / Glass Action:** Frosted glass panel (`rgba(255, 255, 255, 0.65)`), border `rgba(26, 26, 26, 0.08)`, text `#1A1A1A`.

### Chips & Filter Tags
- **Filter Chips:** Height 36px, `rounded-full`, off-white/light warm gray background `#F3EFEA`. Active state fills with Terracotta `#E06D3B` and `#FAF8F5` text.
- **Dietary & Tasting Badges:** Delicate micro-chips (`label-sm`), uppercase with subtle letter spacing, tinted background at 12% opacity of Terracotta or Charcoal.

### Input Fields & Selectors
- **Input Containers:** 48px height, creamy background `#FFFFFF`, bordered by 1px `rgba(26, 26, 26, 0.12)`. Focus triggers Golden Amber outline ring `rgba(244, 162, 97, 0.4)` and a crisp Charcoal border.
- **Date/Time & Party Size Selectors:** Frosted modal sheet with tactile stepper counters and warm amber selection highlights.

### Cards
- **Gastronomy Item Card:** High-contrast product imagery paired with Level 1 glass card base. Title in Charcoal `title-lg`, price rendered in Terracotta `#E06D3B` with `Plus Jakarta Sans` semi-bold. Subtle bottom border on hover with smooth 200ms cubic-bezier transition.
- **Specialty Coffee Card:** Includes metadata row (origin, elevation, process, flavor notes) formatted with `body-sm` in `#66615C`.

### Bilingual Adaptation
- All component layouts flex bidirectionally (LTR for English, RTL for Arabic) with mirror-adjusted icon placements, preserving consistent visual hierarchy and typographic baseline alignment.