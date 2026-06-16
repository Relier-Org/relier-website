# Relier — Visual Identity Tokens

> Design system extracted from the live Relier website. Use this as the single
> source of truth when building a brand book — every value below is exactly what
> the site (and the online-reservation form) renders.

---

## 1. Color

### Champagne — primary accent (gold)
The signature Relier accent. Used for CTAs, highlights, active states, prices,
selection and fine detail lines.

| Token | HEX | Use |
|---|---|---|
| Champagne 300 | `#D8BC78` | Hover / lighter accent on dark |
| Champagne 400 | `#D0B062` | Accent hover |
| **Champagne 500** | **`#C9A961`** | **Primary accent / buttons / links** |
| Champagne 600 | `#B0904A` | Gradient base, pressed |
| Champagne 700 | `#8A6F33` | Accent on light backgrounds |
| Champagne 800 | `#6B5224` | Deepest accent / on light, strong |

### Obsidian — dark canvas
The brand’s base. Near-black, warm-neutral.

| Token | HEX | Use |
|---|---|---|
| **Obsidian 900** | **`#0A0A0A`** | **Page background (canvas)** |
| Obsidian 800 | `#121212` | Cards / surfaces |
| Obsidian 700 | `#1A1A1A` | Elevated surfaces |
| Obsidian 600 | `#232323` | Hairline fills / dividers |

### Silver — neutrals & text on dark
Cool-grey scale for typography and borders over the dark canvas.

| Token | HEX | Use |
|---|---|---|
| **Silver 50** | **`#F5F7F9`** | **Primary text on dark** |
| Silver 100 | `#E5EAEF` | High-emphasis text |
| Silver 200 | `#C5CDD5` | Secondary text |
| Silver 300 | `#A0A8B0` | Tertiary text / labels |
| Silver 400 | `#7A8189` | Muted text / placeholders |
| Silver 500 | `#5C636A` | Disabled / faint |
| Silver 600 | `#424850` | — |
| Silver 700 | `#2A3038` | — |
| Silver 800 | `#181C20` | Text on light surfaces |

### Light surfaces (bone / cream)
Used for light sections and product tiles.

| Token | HEX | Use |
|---|---|---|
| Light background | `#F5F2EB` | Cream section background |
| Light tile | `#FFFFFF` | Inner tile / cards |
| Text on light | `#181C20` | Headlines on cream |
| Text on light · muted | `#5C636A` | Body on cream |
| Accent on light | `#8A6F33` | Champagne 700 — accent over cream |

### Core combinations (do/don’t)
- **Primary:** Champagne 500 `#C9A961` on Obsidian 900 `#0A0A0A`.
- **Text:** Silver 50 `#F5F7F9` on dark; Obsidian/Silver 800 `#181C20` on cream.
- **Selection highlight:** Champagne 500 background, Obsidian 900 text.
- Keep accent for emphasis only — Relier reads premium through restraint, not gold everywhere.

---

## 2. Typography

| Role | Typeface | Weights | Notes |
|---|---|---|---|
| **Display / headings** | **Fraunces** (variable, optical size) | 400 | Optical size ~144 for hero (H1), ~96 for section heads (H2). Tracking `-0.02em`. |
| **Body / UI** | **Manrope** | 400 · 500 · 600 | All running text, labels, buttons, forms. |

- **Fallbacks** — Display: `Fraunces → Cormorant Garamond → Georgia → serif`. Body: `Manrope → system-ui sans-serif`.
- **Labels / eyebrows:** Manrope, uppercase, ~10px, weight 500, letter-spacing `0.16em`.
- **Headlines:** tight tracking (`-0.02em`), balanced line-wrapping.
- Both fonts are available on Google Fonts.

---

## 3. Logo

- Registered format: **symbol on top, the word “Relier” below** (stacked).
- Renders in Silver 50 `#F5F7F9` (or pure white) over the dark canvas; Obsidian over light surfaces.
- *Pending: official vector (SVG) from the client — current site uses a provisional asset.*

---

## 4. Spacing, layout & radius

| Token | Value |
|---|---|
| Container max width | `1280px` |
| Page inset (gutter) | `clamp(1.25rem, 4vw, 4rem)` |
| Radius — XS | `2px` |
| Radius — SM | `4px` |
| Radius — MD | `6px` |
| Radius — LG | `8px` |
| Radius — Pill | `999px` |

---

## 5. Motion

| Token | Value | Use |
|---|---|---|
| **Signature easing** | `cubic-bezier(0.16, 1, 0.3, 1)` | All entrances / hovers (ease-out-expo) |
| Duration — fast | `180ms` | Micro-interactions, hovers |
| Duration — base | `280ms` | Standard transitions |
| Duration — slow | `480ms` | Reveals |
| Duration — cinematic | `1200ms` | Ambient / hero motion |

Motion is calm and decisive — expo ease-out, never bouncy. Elements fade up on scroll; the active item in a carousel gets the full treatment, neighbors stay quiet.

---

## 6. Borders & detail

| Token | Value | Use |
|---|---|---|
| Hairline | `rgba(197,205,213,0.06)` | Faint dividers on dark |
| Subtle | `rgba(197,205,213,0.10)` | Light separators |
| Default | `rgba(197,205,213,0.18)` | Card borders |
| Strong | `rgba(197,205,213,0.32)` | Emphasis borders |
| Glass (champagne) | `rgba(201,169,97,0.18)` | Accent borders / glass edges |
| Glass strong | `rgba(201,169,97,0.32)` | Accent borders, hover |

---

## 7. Voice (quick reference)

- Positioning: **premium / executive**, worldwide. New York & Barcelona are bases; the operation is global.
- Say “concierge on the road” / “concierge transport”. Avoid “luxury chauffeur”.
- No numeric stats (years in business, fleet size, trip counts).

---

*The online-reservation form (Limo Anywhere embed) uses the same tokens — Obsidian
canvas, Champagne 500 accent, Fraunces headings, Manrope body — so the booking
experience matches the brand 1:1.*
