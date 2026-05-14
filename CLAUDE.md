# Relier Website — Project Guide

## What this is
The Relier marketing website. Phase 1 ships the home; inner pages come next.

## Stack
Next.js 15 App Router · TypeScript · Tailwind v4 · CSS Modules · GSAP · embla-carousel-react.

## Design system
All tokens live in `app/globals.css` inside `@theme`. Never hardcode colors, spacing, or fonts in components — always reference the token. Add new tokens by editing `@theme` first, then use.

## Component conventions
- Sections in `components/sections/`, each with a `.tsx` + `.module.css` pair when visuals are custom.
- UI primitives in `components/ui/` (Button, Eyebrow, SectionHead, TextCTA, VirtuosoBadge).
- Icons in `components/icons/` — each icon is a typed React component with `width`, `height`, `className` props.
- All client components have `"use client"` at the top.

## CSS rules
- Tailwind utilities for layout, spacing, typography, simple states.
- CSS Modules for: gradients, pseudo-elements, glass effects, custom keyframes.
- No inline `style` except for `fontVariationSettings` (optical size) — those require runtime values.

## Animations
GSAP only. Use `<Reveal>` wrapper for fade-up reveals. Use `useGSAP` from `@gsap/react` for custom animations — never raw `useEffect`. Always respect `prefers-reduced-motion`.

## Copy rules
- Use "premium" instead of "luxury" in any new copy.
- Keep "luxury" only where it already exists as a signature phrase or official service name (see `relier-claude-code-prompt.md` Section 11 for the canonical list).
- Never add numeric stats anywhere.
- Position: "personal mobility concierge." Not "luxury chauffeur."

## Adding a new page
1. Create `app/{route}/page.tsx`.
2. Reuse section components from `components/sections/` or create new ones in the same pattern.
3. Update `Nav.tsx` and `Footer.tsx` links if it's a top-level page.

## Adding a new content item (testimonial, service, fleet vehicle)
Find the relevant `const` array at the top of the component file. Add the item there. No data files yet — this is intentional for MVP.

## Image domains
Configured in `next.config.ts`. Currently allow: `relier.com/wp-content/uploads/**`. Add new domains there.

## Open items waiting on the client
- Vector logo SVG (currently using PNG placeholder at `public/images/relier-logo.png`)
- Barcelona HQ address (currently `[VERIFY address]`)
- Editorial photos for fleet (currently using client product PNGs over cream gradient)
- Real booking API integration (form currently `preventDefault`)
- Final World Cup 2026 facts confirmation
- Whether to add Minibus + Motorcoach to the home (currently only Smaller Vehicles shown)

## Don't
- Don't install framer-motion, lottie, three.js, or any other animation/3D library — GSAP only.
- Don't install shadcn or any component library — all UI is custom.
- Don't replace fleet PNGs with stock photos unless explicitly approved — they're the real fleet.
- Don't translate copy. The site is English-first. i18n is a later phase.
- Don't use "luxury" in new copy. Use "premium."
