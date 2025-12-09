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

**GitHub Pages (Automated)**

The site automatically deploys to GitHub Pages via GitHub Actions:

1. **One-Time Setup**:
   - Go to repository Settings > Pages
   - Set Source to "GitHub Actions"
   - Site will be available at `https://<username>.github.io/<repo-name>`

2. **Automatic Deployment**:
   - Push to `main` branch triggers immediate deployment
   - Hourly cron job rebuilds site with fresh Google Sheets data
   - Manual deployment available via GitHub Actions UI

3. **Optional: Custom Domain**:
   - Add CNAME file to `public/` directory with your domain
   - Configure DNS records to point to GitHub Pages
   - Enable HTTPS in repository settings

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


### Migration Notes

**From Vercel to GitHub Pages**:
- ✅ Hosting cost reduced from $20/month to $0/month ($240/year savings)
- ✅ Fully static site (no server-side rendering)
- ✅ Client-side search with Fuse.js (replaced Genkit AI)
- ✅ Build-time data fetching (replaced ISR)
- ✅ GitHub Actions automation (replaced Vercel deployments)
- ✅ Removed Firebase Authentication (replaced with Google Form links)
- ✅ Bundle size reduced by 30%+

**Key Changes**:
- All data fetched at build time from Google Sheets CSV endpoints
- Projects metadata fetched from GitHub API during build
- Search runs entirely in browser (no API calls)
- Site rebuilds hourly to fetch fresh data
- No manual deployment steps required

### GitHub API Rate Limiting

The build process fetches project metadata from GitHub API:
- **Unauthenticated**: 60 requests/hour
- **Authenticated** (with GITHUB_TOKEN): 5000 requests/hour
- The workflow automatically uses GITHUB_TOKEN for higher limits
- Projects are fetched sequentially with 1-second delays to avoid rate limiting
