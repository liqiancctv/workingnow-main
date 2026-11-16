# WorkingNow

WorkingNow is an everyday workday companion: quick meeting and time-zone utilities, practical office tools, short breaks, and lightweight original Discover content.

## Product areas

- **Meetings:** world clock, time-zone converter, meeting planner, countdown, timer, working-days calculator, and date/time calculator.
- **Tools:** percentage and growth-rate calculators, word counter, text case converter, text comparison, random team generator, and random picker.
- **Break:** 2048, Sudoku, Minesweeper, and a five-minute break timer.
- **Discover:** daily trivia, interesting facts, office humor, and a quick quiz.

The product is English-first, works without an account or backend, and keeps tool input in the browser. Favorites, recent tools, preferences, and game records use versioned browser storage. Analytics is only loaded after consent; event payloads are restricted to allowlisted product metadata and never contain user-entered content. Ad placements are disabled by default and are placeholders only.

## Getting started

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Validate changes with:

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
node --experimental-strip-types --test features/meetings/calculations.test.mjs features/work-tools/calculations.test.mjs features/break/logic.test.mjs features/discover/content.test.mjs
```

## Architecture

- Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS.
- `app/` contains routes, layouts, metadata, `robots.txt`, and sitemap generation.
- `components/product/` contains shared navigation, page layouts, search, favorites, consent, and reusable product UI.
- `data/` contains tool metadata; `features/` contains isolated tool, game, and Discover logic.
- `lib/storage/` contains the SSR-safe, versioned browser-storage layer; `lib/analytics/` contains consent-aware event handling.
- `docs/PROJECT_AUDIT.md`, `docs/REFACTORING_PLAN.md`, and `docs/SEO_CHECKLIST.md` document the audit, delivery scope, and launch checks.

## Existing URL compatibility

The legacy localized workspace routes (`/{lng}`, `/{lng}/ai-workspace`, `/{lng}/excel`, `/{lng}/outlook`, and `/{lng}/vscode`), `/vscode`, and `/MSOutlookit/index.html` remain available. They have not been redirected to unrelated product pages. New product routes use the `/meetings`, `/tools`, `/break`, and `/discover` sections.

## Deployment and external setup

The project is configured for a Vercel-style Next.js deployment. Before launch, configure the production domain and verify deployment, Search Console ownership/indexing, and production Core Web Vitals. Add an accurate privacy contact channel before publishing the policy. GA4 and a live ad network are not configured; neither is required for local development.
