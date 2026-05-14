# Relier — Personal Mobility Concierge

Production-grade marketing site for Relier. Phase 1 ships the home page; inner pages follow.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Verify

```bash
npx tsc --noEmit  # type check
npm run lint      # lint
npm run build     # production build
```

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · CSS Modules · GSAP 3.13+ with ScrollTrigger · embla-carousel-react.

See `CLAUDE.md` for the working agreement and design-system rules.
