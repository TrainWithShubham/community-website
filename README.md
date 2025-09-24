## TrainWithShubham Community Website

A Next.js app that powers community learning: events, projects, jobs, and interview prep. Built for contributors to learn by shipping real features with clean engineering practices.

### Key Features
- Events: Google Calendar-backed events with server routes (`src/app/api/google-calendar/*`) and UI (`src/app/events`)
- Projects: Advanced search, filters, README viewer (`src/features/projects`)
- Interview Questions: Pagination and actions (`src/app/interview-questions`)
- Shared UI: Shadcn-based components (`src/components/ui`)
- Infra/Utils: Caching, rate-limiting, analytics (`src/lib`), external services (`src/services`)
- AI: Genkit flows (`src/ai`)

### Architecture Map
```
src/
  app/                    # Next.js App Router pages & API routes
  components/             # Shared components (ui, layout, animations)
  features/projects/      # Project listing feature modules
  lib/                    # Core libs: cache, env, analytics, sheets
  services/               # External service wrappers
  ai/                     # Genkit integration & flows
```

### Getting Started
```bash
npm i
npm run dev
# visit http://localhost:3000
```

### Environment Variables
- Server: `GOOGLE_SHEETS_*`, `GOOGLE_SA_*`, `GOOGLE_CALENDAR_ID`, `APP_BASE_URL`, `REVALIDATE_SECRET`, `GOOGLE_AI_API_KEY`
- Client: `NEXT_PUBLIC_FIREBASE_*`
- Add them in Vercel Project (Production/Preview) and locally in `.env.local`.

### Contributing (Quickstart)
- Create a branch from `main`
- Stage changes and run `npm run commit` (guided Conventional Commit)
- Open a PR with a semantic title; body auto-fills from template
- CI checks enforce PR title and commit message formats
- Code Owners are auto-requested for review

### Conventional Commits
- Format: `type(scope): summary` where types are:
  `feat, fix, docs, chore, build, ci, test, refactor, perf, style`
- Common scopes: `events, calendar-api, projects, interview-questions, ui, seo, assets, build, genkit, perf, docs, ci, infra, analytics, sheets-api, cache, repo`

Examples
```text
feat(events): integrate Google Calendar events feed
fix(assets): correct favicon formats and manifest
ci(repo): enforce semantic PR titles and commit messages
```

### Scripts
- `npm run commit` → interactive Commitizen prompt
- `npm run lint:commits` → lint commits in your branch
- `npm run build` → Next.js production build

### Governance & Security
- Branch protection: code owner review + CI checks required
- PR merge strategy: squash, using PR title as final commit
- No secrets required for CI; set runtime secrets/vars in Vercel

### How to Contribute
- Pick an issue labeled `good first issue` or `help wanted`
- Propose enhancements (docs, tests, a11y, performance) via issues
- Include screenshots for UI changes; explain Why/What/How in PR body

### Roadmap (high level)
- Events pagination & webhook resilience
- Project discoverability and tags
- Tests (unit/E2E) and a11y
- Performance budgets in CI

See `CONTRIBUTING.md` for the full guide.
