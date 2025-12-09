## TrainWithShubham Community Website

A static Next.js site that powers community learning: events, projects, jobs, and interview prep. Deployed to GitHub Pages with automated hourly rebuilds to fetch fresh data.

### Key Features
- **Events**: Community calendar with Google Calendar integration
- **Projects**: GitHub-powered project catalog with README viewer and metadata (stars, forks, topics)
- **Interview Questions**: Client-side fuzzy search with Fuse.js for DevOps/Cloud interview prep
- **Jobs**: Community job board with latest opportunities
- **Static Site**: Fully static export deployed to GitHub Pages (zero hosting cost)
- **Automated Deployment**: GitHub Actions workflow rebuilds site hourly with fresh data

### Architecture
- **Static Site Generation**: All pages pre-rendered at build time
- **Client-Side Search**: Fuse.js for fuzzy search (no server required)
- **Build-Time Data Fetching**: Google Sheets CSV data fetched during build
- **GitHub API Integration**: Project metadata fetched at build time with Octokit
- **Automated Deployment**: GitHub Actions workflow handles everything

```
src/
  app/                    # Next.js App Router pages (static export)
  components/             # Shared components (ui, layout, animations)
  features/projects/      # Project listing with GitHub integration
  lib/                    # Core libs: client-search, env, data-fetcher
  services/               # External service wrappers (Google Sheets)
```

### Getting Started
```bash
npm i
npm run dev
# visit http://localhost:3000
```

### Deployment

**Live Site**: `https://community.trainwithshubham.com`

The site automatically deploys to GitHub Pages via GitHub Actions:
- Push to `main` branch triggers immediate deployment
- Hourly rebuilds fetch fresh data from Google Sheets
- Manual deployment available via GitHub Actions UI

**See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment guide including custom domain setup.**

### Environment Variables

**Required for Build** (GitHub Repository Secrets):
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions (for higher API rate limits)

**Optional**:
- Google Sheets URLs are configured with defaults in `src/lib/env.ts`
- Add custom URLs as repository secrets if needed

**Local Development**:
- Create `.env.local` for any custom configuration
- No authentication required (Firebase/Genkit removed)

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


### Documentation

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Complete deployment instructions, custom domain setup, troubleshooting
- **[Migration Report](docs/MIGRATION.md)** - Vercel to GitHub Pages migration details, cost savings, architecture changes

### Migration Summary

Migrated from Vercel to GitHub Pages (December 2024):
- ✅ $240/year cost savings (free hosting)
- ✅ 30%+ bundle size reduction
- ✅ Fully static site with automated hourly rebuilds
- ✅ Client-side search (Fuse.js)
- ✅ Build-time data fetching

**See [docs/MIGRATION.md](docs/MIGRATION.md) for complete migration report.**
