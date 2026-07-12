# Design Reference — causehouse.co

Extracted as visual/UX inspiration for the komoditas (tri-agri-web) site. This is a
reference, not a literal clone — pull patterns that fit a commodities/traceability
company profile, don't copy the nonprofit-specific copy or illustrations.

## Overall Direction

CauseHouse is a nonprofit marketing agency site built around a "build a house for your
mission" metaphor. Warm, hand-illustrated, editorial-serif headlines over a light cream
canvas, punctuated by full-bleed dark-green "proof" sections. It reads as friendly and
crafted rather than corporate-SaaS — a good reference for softening an otherwise
data-heavy/traceability product.

## Color Palette (exact, via getComputedStyle)

| Role | Value | Hex |
|---|---|---|
| Page background (light) | `rgb(247, 240, 230)` | `#F7F0E6` (warm cream) |
| Section background (light, alt) | `rgb(243, 235, 221)` | `#F3EBDD` (slightly deeper cream, used for cards/inputs) |
| Dark section background | `rgb(29, 43, 31)` | `#1D2B1F` (deep forest green, near-black) |
| Primary text (on cream) | `rgb(29, 43, 31)` | `#1D2B1F` |
| Secondary/muted text (on cream) | `rgb(107, 122, 109)` | `#6B7A6D` (desaturated sage) |
| Accent / lime | `rgb(191, 234, 75)` | `#BFEA4B` (bright yellow-green, used for CTAs, highlighted words, stat numbers) |
| Text on dark sections | cream `#F7F0E6` (headings), muted sage-gray (body) |

Only ~6 colors total. Cream + dark forest green do almost all the work; lime is used
sparingly and deliberately (primary CTA, one highlighted word per headline, big stat
numbers) so it stays punchy instead of overused.

## Typography

- **Display/headings:** `Fraunces` (serif, high-contrast, wonky/old-style details) —
  weight 700. H1 ≈ 92px / line-height 84.6px / letter-spacing **-2.3px** (very tight,
  almost overlapping ascenders/descenders — deliberate stylistic choice). H2 ≈ 60px.
  This serif is what gives the site its "crafted, editorial" feel rather than generic
  SaaS — a slab or humanist serif with personality would serve the same role.
- **Body/UI:** `Inter` — weight 400 for paragraphs (19px / line-height 30.4px /
  letter-spacing -0.095px), weight 700 uppercase for nav links, badges, and buttons.
- **Nav / buttons / eyebrow labels:** Inter 700, uppercase, small size (~12-13px),
  letter-spacing ~+1px (wide tracking) — this uppercase-tracked-out label style is used
  everywhere: nav items, pill badges ("ABOUT CAUSEHOUSE", "CASE STUDIES"), button text.
- Only two font families total. Serif for headlines/emotion, grotesque sans for
  everything functional.

## Component Patterns

### Buttons
- Fully pill-shaped: `border-radius: 9999px`.
- Primary: lime background `#BFEA4B`, 2px solid dark-green border, dark-green text,
  **hard offset shadow** `4px 4px 0px 0px #1D2B1F` (no blur — a flat "sticker/pop-art"
  drop shadow, not a soft SaaS shadow). Padding `10px 24px`.
- Secondary (outline): transparent background, same 2px dark border + same hard offset
  shadow, dark text.
- This hard-shadow-plus-thick-border treatment is the site's signature "hand-drawn/
  sticker" identity — it appears on buttons, badges/pills, and card containers.

### Pill badges / eyebrows
- Small uppercase label pills above every section headline (e.g. "ABOUT CAUSEHOUSE",
  "WHO WE SERVE", "CASE STUDIES", "HOW WE WORK", "GET IN TOUCH") — outlined, rounded-full,
  no fill, thin border. Used consistently to tag every section before its H2.

### Cards
- Light cream cards on dark sections (numbered "01/02/03" process/differentiator cards)
  and cream-on-cream cards with a thin dark border on light sections (service cards,
  "who we serve" cards). Consistent thin 1-2px border, generous internal padding,
  rounded corners (not pill — moderate radius, ~16-24px).

### Stat callouts
- Giant lime numerals (e.g. "$10M+") paired with a shorter serif headline and muted
  caption to the right — used as a trust/proof interrupt between hero and about section.

### Illustrations
- Whimsical flat-vector hand-drawn style: fluffy clouds, a small house-on-a-hill scene
  with a chicken, a sprout icon, a simple character illustration near the contact form.
  All linework uses the same thick dark-green stroke as the buttons/cards, tying
  illustration and UI chrome together visually.

## Layout Rhythm

- Full-bleed section backgrounds alternate cream → dark-green → cream → dark-green →
  lime (final CTA) → dark-green (footer). This alternation is the main structural device
  that breaks a long single-page scroll into distinct "chapters" without needing dividers.
- Generous vertical section padding; two-column splits (headline+copy on left, stat/
  visual on right) are the dominant grid inside each section on desktop.
- Final CTA section flips to a solid lime-green full-bleed band right before the dark
  footer — the one place lime is used as a background rather than an accent.

## Motion / Interaction (light touch, not deeply audited — reference scope)
- Hero elements fade/settle in on load (badge → headline → subhead → buttons →
  illustration staggered in).
- Testimonial block is a carousel with dot pagination and prev/next arrow buttons.
- Nothing else scroll-triggered was obviously apparent in a light pass; standard hover
  states on buttons/links.

## Suggested Translation for the Komoditas Site

- Swap cream/forest-green/lime for a palette that fits agriculture/traceability (e.g.
  earthy cream + deep agrarian green is actually very on-theme already for
  pig/coffee/fishery — could reuse the warm-cream + forest-green pairing almost as-is,
  with a different accent than lime if you want to differentiate).
- Keep: serif display headline + sans body pairing, uppercase tracked-out eyebrow pills
  per section, alternating light/dark full-bleed section rhythm, thin-border cards.
- Skip: the lime "sticker shadow" button treatment is very distinctly "nonprofit agency
  playful" — consider a more restrained shadow/border treatment if the komoditas site
  wants to read as credible/B2B for investors and premium buyers (per PRD-1's stated
  audience: catering IMIP Morowali, Toraja buyers, investors).
- The numbered "how we build/how it works" 4-step section maps well conceptually to a
  traceability narrative (seed/origin → process → verify → deliver).
