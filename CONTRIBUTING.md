### Contributing Guide

Welcome! This repo is designed to help developers and DevOps engineers learn by shipping real features with high-quality practices.

#### Workflow
1) Find/claim an issue or open a proposal
2) Create a feature branch from `main`
3) Make focused changes; add tests/screenshots where relevant
4) Commit with Conventional Commits via `npm run commit`
5) Open a PR with a semantic title; fill the auto template; request review

#### Conventional Commits
- Format: `type(scope): short imperative summary`
- Types: `feat, fix, docs, chore, build, ci, test, refactor, perf, style`
- Scopes: `events, calendar-api, projects, interview-questions, jobs, ui, seo, assets, build, genkit, perf, docs, ci, infra, analytics, github-csv, cache, repo`
- Subject ≤ 72 chars; body explains why/how; reference issues (e.g., Closes #123)

Examples
```text
feat(projects): add filters and README viewer
fix(interview-questions): stabilize pagination auto-refresh
feat(github-csv): migrate interview questions to GitHub repository
build(genkit): defer prompt/flow creation to runtime
```

#### Local Commands
- `npm i` → install
- `npm run dev` → start dev server
- `npm run commit` → guided commit (Commitizen)
- `npm run lint:commits` → validate commit messages
- `npm run build` → production build

#### PR Checklist
- One logical change per PR; small, focused changes merge faster
- Semantic title and filled template (Why/What/How)
- Screenshots or recordings for UI changes
- Docs updated if behavior changes
- All checks green (semantic-pr, commitlint)

#### Code Style
- TypeScript strictness; meaningful names; shallow nesting; early returns
- Handle errors intentionally; avoid silent catches
- Accessibility: keyboard focus, ARIA where relevant

#### Governance & Reviews
- Code Owners auto-requested for relevant paths
- Branch protection requires CI checks and code owner review
- Be kind and constructive in reviews; ask for clarification as needed

#### Environments & Secrets
- Server: `JOBS_SHEET_URL` (Google Sheets for jobs)
- Client: `NEXT_PUBLIC_INTERVIEW_REPO_OWNER`, `NEXT_PUBLIC_INTERVIEW_REPO_NAME`, `NEXT_PUBLIC_INTERVIEW_REPO_BRANCH` (GitHub CSV for interview questions)
- Client: `NEXT_PUBLIC_FIREBASE_*` (Firebase authentication)
- Configure variables on your hosting platform (Vercel/GitHub Pages) and locally in `.env.local`

#### Contributing Interview Questions
To add interview questions to the community:
1. Fork the [interview-questions repository](https://github.com/TrainWithShubham/interview-questions)
2. Add your questions to the appropriate CSV file (e.g., `devops/interview-questions.csv`)
3. Follow the CSV format: `company,year,contributor,role,experience,topic,question`
4. Submit a Pull Request with your additions
5. Questions will appear on the site after the next build

#### Where to Start
- Good first issues: docs, tests, accessibility, small UI polish
- Feature ideas: events pagination/resilience, projects discoverability, performance budgets

Happy shipping! 🚀
