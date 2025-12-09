# Project Structure

Complete overview of the TrainWithShubham Community Hub codebase.

## Root Directory

```
community-website/
├── .github/              # GitHub Actions workflows
│   └── workflows/
│       └── deploy.yml    # Automated deployment to GitHub Pages
├── .husky/               # Git hooks for commit linting
├── .kiro/                # Kiro IDE configuration
│   ├── specs/            # Feature specifications
│   └── steering/         # AI guidance rules
├── config/               # Configuration files
│   ├── projects.json     # Project catalog data
│   └── project-registry.json
├── docs/                 # Documentation
│   ├── DEPLOYMENT.md     # Deployment guide
│   ├── MIGRATION.md      # Migration report
│   └── PROJECT_STRUCTURE.md  # This file
├── public/               # Static assets
│   ├── favicon files
│   ├── manifest.json
│   └── .nojekyll         # GitHub Pages config
├── src/                  # Source code
└── out/                  # Build output (generated)
```

## Source Code Structure

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout with theme provider
│   ├── page.tsx          # Homepage
│   ├── events/           # Events page
│   ├── interview-questions/  # Q&A pages
│   ├── jobs/             # Jobs board
│   └── projects/         # Projects catalog
│       ├── page.tsx      # Projects listing
│       └── [id]/         # Dynamic project detail pages
│           └── page.tsx
├── components/           # Shared components
│   ├── ui/               # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/           # Layout components
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── google-form-link.tsx
│   └── terminal-animation.tsx
├── features/             # Feature modules
│   └── projects/
│       ├── components/   # Project-specific components
│       │   ├── pages/
│       │   └── ui/
│       └── lib/
│           ├── services/
│           │   └── simple-project-service.ts
│           ├── types/
│           └── utils.ts
├── lib/                  # Core utilities
│   ├── client-search.ts  # Fuse.js search wrapper
│   ├── data-fetcher.ts   # Build-time data fetching
│   ├── env.ts            # Environment variable validation
│   ├── monitoring.ts     # Performance tracking
│   └── utils.ts          # Shared utilities
├── services/             # External service wrappers
│   └── google-sheets.ts  # Google Sheets CSV fetching
├── data/                 # Type definitions
│   ├── questions.ts
│   └── jobs.ts
└── hooks/                # Custom React hooks
    └── use-mobile.tsx
```

## Key Files

### Configuration

- **next.config.ts** - Next.js configuration (static export, webpack, optimization)
- **tailwind.config.ts** - Tailwind CSS configuration with custom theme
- **tsconfig.json** - TypeScript configuration
- **package.json** - Dependencies and scripts
- **components.json** - Shadcn/ui configuration

### Build & Deploy

- **.github/workflows/deploy.yml** - GitHub Actions workflow
- **public/.nojekyll** - Disables Jekyll processing on GitHub Pages
- **out/** - Generated static site (created by `npm run build`)

### Development

- **.eslintrc.json** - ESLint configuration
- **commitlint.config.cjs** - Commit message linting
- **.gitmessage.txt** - Commit message template

## Data Flow

### Build Time

```
GitHub Actions Trigger
  ↓
npm run build
  ↓
Next.js Static Export
  ↓
├─ Fetch Google Sheets CSV data
│  └─ src/services/google-sheets.ts
├─ Fetch GitHub API data
│  └─ src/features/projects/lib/services/simple-project-service.ts
└─ Generate static HTML pages
   └─ out/ directory
  ↓
Deploy to GitHub Pages
```

### Runtime (Browser)

```
User visits page
  ↓
Static HTML/CSS/JS loaded from CDN
  ↓
Client-side JavaScript executes
  ↓
├─ Search (Fuse.js)
│  └─ src/lib/client-search.ts
├─ Theme toggle
│  └─ next-themes
└─ Navigation
   └─ Next.js App Router
```

## Component Patterns

### Page Components

Located in `src/app/*/page.tsx`:
- Server components by default
- Fetch data at build time
- Export `generateStaticParams` for dynamic routes
- No `revalidate` or `dynamic` exports (static only)

### Client Components

Marked with `'use client'` directive:
- Interactive components (search, forms, theme toggle)
- Use React hooks
- Located in `src/components/` or feature directories

### Feature Modules

Organized by domain in `src/features/`:
- Self-contained feature logic
- Own components, services, types, utils
- Example: `src/features/projects/`

## Styling

### Tailwind CSS

- Utility-first CSS framework
- Custom theme in `tailwind.config.ts`
- HSL-based color system
- Dark mode support via `next-themes`

### Component Library

- Shadcn/ui components in `src/components/ui/`
- Built on Radix UI primitives
- Customizable with Tailwind
- Accessible by default

## Type Safety

### TypeScript

- Strict mode enabled
- Path alias: `@/*` → `src/*`
- Type definitions in feature directories
- Zod schemas for runtime validation

### Data Types

```typescript
// src/data/questions.ts
export interface Question {
  question: string;
  answer: string;
  author?: string;
}

// src/data/jobs.ts
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  // ...
}
```

## Testing

Currently no automated tests. Planned:
- Unit tests for utilities
- Component tests for UI
- E2E tests for critical flows
- Property-based tests for search

## Performance

### Bundle Optimization

- Code splitting by route
- Vendor chunk separation
- UI components in separate chunk
- Tree shaking enabled

### Build Optimization

- Static generation (no runtime overhead)
- Image optimization disabled (static export)
- Compression enabled
- Minimal JavaScript

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Skip links for screen readers
- Color contrast compliance

## Environment Variables

### Build Time

Configured in `src/lib/env.ts`:
- Google Sheets CSV URLs (with defaults)
- Validated with Zod schemas

### GitHub Actions

- `GITHUB_TOKEN` - Automatically provided
- Custom secrets can be added in repository settings

## Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build (static export)
npm run start            # Start production server (not used)
npm run lint             # ESLint check
npm run typecheck        # TypeScript validation

# Commits
npm run commit           # Interactive Commitizen prompt
npm run lint:commits     # Validate commit messages

# Utilities
npm run env:check        # Validate environment variables
npm run test:sheets      # Test Google Sheets connection
```

## Git Workflow

### Branches

- `main` - Production branch (auto-deploys)
- Feature branches - Named descriptively

### Commits

- Conventional Commits format
- Enforced by commitlint
- Interactive prompt via `npm run commit`

### Pull Requests

- Squash merge strategy
- PR title becomes commit message
- Code owner review required
- CI checks must pass

## Deployment

### GitHub Actions

Workflow triggers:
- Push to `main` branch
- Hourly cron schedule
- Manual dispatch

Workflow steps:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Build static site
5. Create .nojekyll and CNAME files
6. Upload artifact
7. Deploy to GitHub Pages

### GitHub Pages

- Source: GitHub Actions
- Custom domain: `community.trainwithshubham.com`
- HTTPS enforced
- CDN delivery

## Monitoring

- GitHub Actions logs for build status
- No runtime monitoring (static site)
- Performance tracked at build time
- Error tracking in build logs

## Future Improvements

- Add automated testing
- Implement analytics
- Add performance budgets
- Create component documentation
- Add API documentation
- Implement error boundaries
- Add loading states
- Improve accessibility
