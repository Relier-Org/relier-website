# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 15 App Router site in strict TypeScript. Pages, layouts, and API handlers live in `app/`. Reusable UI is organized under `components/` (`ui/`, `layout/`, `sections/`, `booking/`, and `icons/`). Shared data, hooks, utilities, and integrations belong in `lib/`. Store articles in `content/news/`, assets in `public/`, and implementation notes in `docs/`.

Keep route styles beside their page as `page.module.css` and component styles beside the matching component. Import project modules through `@/`.

## Build, Test, and Development Commands

- `npm ci` installs the exact dependency versions from `package-lock.json`.
- `npm run dev` starts the local development server at `http://localhost:3000`.
- `npx tsc --noEmit` checks strict TypeScript without producing files.
- `npm run lint` runs the Next.js ESLint rules, including Core Web Vitals.
- `npm run build` creates and validates the production build.
- `npm run start` serves that production build locally.

## Coding Style & Naming Conventions

Follow the existing two-space indentation, double quotes, and semicolon style. Use PascalCase for components (`ServiceCard.tsx`), camelCase for hooks and utilities (`useNavScroll.ts`), and kebab-case for route folders and MDX slugs. Prefer typed props and focused components; add `"use client"` only when browser state or effects require it. Use CSS Modules for components and `app/globals.css` for shared tokens. Keep lint suppressions narrow and documented.

## Testing Guidelines

No automated test framework or coverage requirement is currently configured. Before submitting changes, run the type check, lint, and production build. Manually verify affected routes at desktop and mobile widths; for booking changes, exercise validation, loading, success, and failure states. If tests are introduced, colocate them as `*.test.ts` or `*.test.tsx` near the code they cover.

## Commit & Pull Request Guidelines

Recent history uses concise, scoped summaries such as `feat(booking): ...`, `fix(booking): ...`, and `docs(booking): ...`; `copy(...)` and `copy+ui(...)` are also established. Keep each commit focused and write the subject in imperative, outcome-oriented language.

Pull requests should explain the user-visible change, list affected routes, note verification commands, and link the relevant issue or client request. Include before/after screenshots or recordings for visual or motion changes, with desktop and mobile views when responsive behavior changes.

## Security & Configuration

Never commit `.env*`, API keys, or customer data. Keep booking credentials server-side and access them through environment variables; do not expose secrets with `NEXT_PUBLIC_` names.
