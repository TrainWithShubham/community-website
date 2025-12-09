# Design Document

## Overview

This design document outlines the technical approach for migrating the TrainWithShubham Community Hub from Vercel to GitHub Pages. The migration transforms the application from a server-rendered Next.js site to a fully static site, eliminating hosting costs while maintaining all core functionality.

### Key Changes

1. **Static Site Generation**: Convert from ISR (Incremental Static Regeneration) to pure SSG (Static Site Generation)
2. **Dependency Removal**: Remove Firebase Authentication and Genkit AI dependencies
3. **Client-Side Search**: Replace server-side AI search with client-side fuzzy search using Fuse.js
4. **Build-Time Data Fetching**: Move all Google Sheets data fetching to build time
5. **GitHub API Integration**: Preserve Projects feature with Octokit for GitHub data fetching at build time
6. **Automated Deployment**: Implement GitHub Actions workflow for continuous deployment and scheduled rebuilds
7. **Feature Cleanup**: Remove Volunteer Leaderboard and Community Stats features

### Benefits

- **Cost Savings**: $240/year (from $20/month to $0)
- **Reduced Complexity**: Fewer dependencies and simpler architecture
- **Improved Performance**: Pre-rendered static pages with no server-side processing
- **Better Reliability**: No server-side failures, all content served from CDN
- **Simplified Maintenance**: No server infrastructure to manage

## Architecture

### Current Architecture (Vercel)

```
┌─────────────────────────────────────────────────────────────┐
│                         Vercel Edge                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js App Router (SSR/ISR)              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │ │
│  │  │   Pages      │  │  API Routes  │  │ Middleware  │  │ │
│  │  │  (Dynamic)   │  │  (Server)    │  │   (CORS)    │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    Firebase     │  │   Genkit AI     │  │  Google Sheets  │
│ Authentication  │  │  (Gemini API)   │  │   CSV Export    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │   GitHub API    │
                     │    (Octokit)    │
                     └─────────────────┘
```

### Target Architecture (GitHub Pages)

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Actions                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Build Workflow                        │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  1. Fetch Google Sheets Data (CSV)              │  │ │
│  │  │  2. Fetch GitHub API Data (Octokit)             │  │ │
│  │  │  3. Generate Static Pages (next build)          │  │ │
│  │  │  4. Deploy to gh-pages branch                   │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  Triggers: Push to main, Hourly cron schedule         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       GitHub Pages                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Static HTML/CSS/JS Files                  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │ │
│  │  │   Pages      │  │ Client-Side  │  │   Assets    │  │ │
│  │  │  (Static)    │  │    Search    │  │ (Images/CSS)│  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Google Form    │
│ (Contributions) │
└─────────────────┘
```

### Data Flow

#### Build Time (GitHub Actions)
1. Workflow triggers (push or cron schedule)
2. Install dependencies (npm install)
3. Fetch data from Google Sheets CSV endpoints
4. Fetch project metadata from GitHub API using Octokit
5. Generate static pages with embedded data (next build)
6. Deploy static files to gh-pages branch
7. GitHub Pages serves updated content

#### Runtime (User Browser)
1. User requests page from GitHub Pages
2. Static HTML/CSS/JS served from CDN
3. Client-side JavaScript hydrates interactive components
4. Search functionality runs entirely in browser using Fuse.js
5. No server-side processing or API calls

## Components and Interfaces

### 1. Next.js Configuration

**File**: `next.config.ts`

**Changes**:
- Set `output: 'export'` for static site generation
- Remove `async headers()` (not supported in static export)
- Update image configuration for unoptimized images or use compatible loader
- Remove server-side specific webpack configurations

**Interface**:
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // Remove: async headers(), ISR revalidate, etc.
}
```

### 2. Data Fetching Service

**File**: `src/lib/data-fetcher.ts` (to be modified)

**Purpose**: Fetch data from Google Sheets CSV at build time

**Interface**:
```typescript
interface DataFetcherOptions {
  url: string;
  cache?: RequestCache;
}

async function fetchSheetData<T>(options: DataFetcherOptions): Promise<T[]>
```

**Changes**:
- Remove runtime caching (LRU cache)
- Fetch data during `getStaticProps` equivalent (page component level)
- Handle build-time errors with clear messages

### 3. Client-Side Search

**New File**: `src/lib/client-search.ts`

**Purpose**: Replace Genkit AI search with Fuse.js fuzzy search

**Interface**:
```typescript
interface SearchOptions {
  keys: string[];
  threshold?: number;
  includeScore?: boolean;
}

class ClientSearch<T> {
  constructor(data: T[], options: SearchOptions);
  search(query: string): T[];
}
```

**Implementation**:
- Use Fuse.js for fuzzy string matching
- Configure search keys (question, answer, author, etc.)
- Return filtered results based on relevance score

### 4. Projects Service

**File**: `src/features/projects/lib/services/simple-project-service.ts` (to be modified)

**Purpose**: Fetch GitHub data at build time instead of runtime

**Changes**:
- Remove in-memory caching (not needed for static site)
- Fetch all GitHub data during build
- Generate static props for each project page
- Handle GitHub API rate limits with retries and delays

**Interface** (remains similar):
```typescript
class SimpleProjectService {
  async getProjects(): Promise<Project[]>
  async getProjectById(id: string): Promise<Project | null>
}
```

### 5. GitHub Actions Workflow

**New File**: `.github/workflows/deploy.yml`

**Purpose**: Automate build and deployment to GitHub Pages

**Structure**:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:  # Manual trigger

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Build static site
      - Deploy to gh-pages
```

**Environment Variables**:
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- Repository secrets for Google Sheets URLs (if not public)
- GitHub API token for higher rate limits (optional)

### 6. Page Components

**Files**: All page components in `src/app/`

**Changes**:
- Remove `'use server'` directives
- Remove server actions
- Fetch data at build time using static generation
- Embed data directly in page props
- Use client components for interactivity

**Pattern**:
```typescript
// Before (ISR)
export const revalidate = 900;
export default async function Page() {
  const data = await fetchData(); // Runtime
  return <Component data={data} />;
}

// After (SSG)
export default async function Page() {
  const data = await fetchData(); // Build time
  return <Component data={data} />;
}
```

### 7. Authentication Replacement

**Changes**:
- Remove `src/lib/firebase/config.ts`
- Remove `src/contexts/auth-context.tsx`
- Remove Firebase dependencies from `package.json`
- Replace "Add Question" form with Google Form link

**New Component**: `src/components/google-form-link.tsx`
```typescript
export function GoogleFormLink() {
  return (
    <Button asChild>
      <a href="https://forms.google.com/..." target="_blank">
        Contribute a Question
      </a>
    </Button>
  );
}
```

### 8. Removed Components

**Files to Delete**:
- `src/ai/genkit.ts`
- `src/ai/flows/intelligent-question-search.ts`
- `src/ai/dev.ts`
- `src/app/interview-questions/actions.ts` (server actions)
- `middleware.ts` (not supported in static export)
- `vercel.json` (Vercel-specific configuration)
- Leaderboard-related components
- Community Stats components

## Data Models

### Project Data Model

**File**: `src/features/projects/lib/types/project.ts`

**No changes required** - existing model is compatible:

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  technologies: string[];
  category: string;
  url: string;
  lastUpdated: string;
  stars: number;
  forks: number;
  featured: boolean;
}
```

### Question Data Model

**File**: `src/data/questions.ts`

**No changes required** - existing model is compatible:

```typescript
interface Question {
  question: string;
  answer?: string;
  author?: string;
  category?: string;
}
```

### Build-Time Data Structure

**New Pattern**: Data embedded in static pages

```typescript
// Page props contain pre-fetched data
interface PageProps {
  projects: Project[];
  questions: Question[];
  jobs: Job[];
  events: Event[];
}
```

## Corr
ectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, most of the acceptance criteria are specific examples or configuration checks rather than universal properties. However, we can identify a few key properties that should hold across all builds and deployments:

### Property 1: Bundle Exclusion - Firebase

*For any* build of the Application, the generated JavaScript bundles should not contain any Firebase-related code or imports.

**Validates: Requirements 2.1**

**Rationale**: This ensures that Firebase dependencies are completely removed from the application, not just unused. We can verify this by analyzing the bundle output and checking for Firebase module references.

### Property 2: Bundle Exclusion - Genkit/Google AI

*For any* build of the Application, the generated JavaScript bundles should not contain any Genkit or Google AI related code or imports.

**Validates: Requirements 3.1**

**Rationale**: This ensures that Genkit and Google AI dependencies are completely removed, reducing bundle size and eliminating API key requirements.

### Property 3: Project Data Completeness

*For any* project fetched from GitHub API, the project data should include all required fields: stars, forks, description, and topics (when available).

**Validates: Requirements 5.4**

**Rationale**: This ensures data consistency across all projects. Every project should have complete metadata for proper display and filtering.

### Property 4: Static Output Only

*For any* successful build, the output directory should contain only static assets (HTML, CSS, JS, images) and no server-side code or API route handlers.

**Validates: Requirements 1.1, 4.3**

**Rationale**: This is the fundamental property of a static site. We verify that the build produces only files that can be served by a static file server.

### Property 5: Client-Side Search Execution

*For any* search query on interview questions, the search execution should not generate any network requests to external APIs or servers.

**Validates: Requirements 3.4**

**Rationale**: This ensures search is truly client-side and doesn't rely on server-side processing, which is critical for a static site.

## Error Handling

### Build-Time Errors

**Google Sheets Data Fetching**:
- **Error**: Google Sheets CSV endpoint is unreachable
- **Handling**: Fail the build with clear error message indicating which sheet failed
- **Recovery**: Retry with exponential backoff (3 attempts)
- **Fallback**: None - build must fail to prevent deploying stale data

**GitHub API Rate Limiting**:
- **Error**: GitHub API rate limit exceeded
- **Handling**: Implement delays between requests (1 second minimum)
- **Recovery**: Use authenticated requests with GitHub token for higher limits (5000/hour vs 60/hour)
- **Fallback**: Cache previously fetched data temporarily, but warn in build logs

**GitHub API Failures**:
- **Error**: Individual repository fetch fails (404, network error)
- **Handling**: Log warning and continue with other projects
- **Recovery**: Retry failed requests up to 3 times
- **Fallback**: Use cached data from previous build if available, or skip project

**Build Configuration Errors**:
- **Error**: Invalid Next.js configuration for static export
- **Handling**: Fail build immediately with configuration error details
- **Recovery**: None - requires code fix
- **Fallback**: None

### Runtime Errors (Client-Side)

**Search Functionality**:
- **Error**: Fuse.js initialization fails
- **Handling**: Fall back to simple string matching
- **User Feedback**: Display warning message about reduced search quality
- **Recovery**: Automatic fallback, no user action required

**Missing Data**:
- **Error**: Expected data not embedded in page
- **Handling**: Display empty state with helpful message
- **User Feedback**: "No data available. Please try refreshing the page."
- **Recovery**: User can refresh to get latest deployed version

**Navigation Errors**:
- **Error**: 404 for non-existent routes
- **Handling**: Display custom 404 page with navigation links
- **User Feedback**: "Page not found" with links to main sections
- **Recovery**: User navigates to valid page

**Image Loading Failures**:
- **Error**: Image fails to load
- **Handling**: Display placeholder or alt text
- **User Feedback**: Graceful degradation with alt text
- **Recovery**: Automatic retry on next page load

### GitHub Actions Workflow Errors

**Workflow Failures**:
- **Error**: Build step fails
- **Handling**: Stop workflow and report failure in GitHub Actions UI
- **Notification**: GitHub sends notification to repository maintainers
- **Recovery**: Fix code and push again, or manually trigger workflow

**Deployment Failures**:
- **Error**: Deployment to gh-pages branch fails
- **Handling**: Workflow fails but build artifacts are preserved
- **Recovery**: Retry deployment step manually or re-run workflow
- **Fallback**: Previous deployment remains active

**Secret Access Errors**:
- **Error**: Required secrets not configured
- **Handling**: Workflow fails with clear error about missing secrets
- **Recovery**: Configure secrets in repository settings and re-run
- **Fallback**: None - secrets are required

## Testing Strategy

### Unit Testing

**Data Fetching Functions**:
- Test Google Sheets CSV parsing with sample data
- Test error handling for network failures
- Test data transformation and validation
- Mock HTTP requests to avoid external dependencies

**Client-Side Search**:
- Test Fuse.js configuration and initialization
- Test search with various queries (exact match, fuzzy match, no results)
- Test search performance with large datasets
- Test fallback to simple string matching

**Project Service**:
- Test GitHub data fetching with mocked Octokit responses
- Test project data transformation
- Test error handling for missing repositories
- Test rate limit handling logic

**Configuration Validation**:
- Test Next.js config has correct static export settings
- Test environment variable validation
- Test that removed features are not imported

### Integration Testing

**Build Process**:
- Test full build completes successfully
- Test output directory structure matches GitHub Pages requirements
- Test all expected pages are generated
- Test data is correctly embedded in static pages

**GitHub Actions Workflow**:
- Test workflow syntax is valid (using `act` or GitHub's workflow validator)
- Test workflow triggers are configured correctly
- Test all steps execute in correct order
- Test secrets are accessed correctly

**Page Rendering**:
- Test all pages render without JavaScript errors
- Test pages contain expected content before hydration
- Test client-side interactivity works after hydration
- Test navigation between pages works correctly

### End-to-End Testing

**User Flows**:
- Test browsing projects and viewing README
- Test searching interview questions
- Test filtering and sorting projects
- Test viewing job listings and events
- Test navigation across all pages

**Performance Testing**:
- Test page load times meet acceptable thresholds
- Test bundle sizes are within reasonable limits
- Test Time to Interactive (TTI) is acceptable
- Test Lighthouse scores for performance, accessibility, SEO

### Property-Based Testing

**Bundle Analysis**:
- Property 1: Verify no Firebase code in any bundle chunk
- Property 2: Verify no Genkit/Google AI code in any bundle chunk
- Test by analyzing webpack bundle output and searching for module names

**Project Data**:
- Property 3: Verify all projects have required fields
- Generate test with various project configurations
- Verify data completeness for each project

**Static Output**:
- Property 4: Verify output directory contains only static files
- Test by scanning output directory recursively
- Verify no .js files contain server-side code patterns

**Search Behavior**:
- Property 5: Verify search generates no network requests
- Test by monitoring network activity during search
- Verify search works offline

### Manual Testing Checklist

**Pre-Deployment**:
- [ ] Build completes without errors
- [ ] All pages accessible in local preview
- [ ] Search functionality works
- [ ] Projects display with GitHub data
- [ ] No console errors in browser
- [ ] Bundle size is acceptable

**Post-Deployment**:
- [ ] Site accessible on GitHub Pages URL
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Search works
- [ ] Projects README viewer works
- [ ] Custom domain works (if configured)
- [ ] HTTPS works correctly

**Scheduled Rebuild Verification**:
- [ ] Workflow runs on schedule
- [ ] Fresh data is fetched
- [ ] Site updates automatically
- [ ] No build failures

## Implementation Phases

### Phase 1: Configuration and Cleanup (Foundation)

**Goal**: Prepare the application for static export by updating configuration and removing incompatible features.

**Tasks**:
1. Update `next.config.ts` for static export
2. Remove `middleware.ts`
3. Remove `vercel.json`
4. Update `package.json` to remove Firebase and Genkit dependencies
5. Remove Firebase configuration files
6. Remove Genkit AI files
7. Remove authentication context and components
8. Update environment variable validation

**Success Criteria**:
- Application builds without Firebase/Genkit dependencies
- No middleware or Vercel-specific configuration
- Environment validation doesn't require removed services

### Phase 2: Data Fetching Migration (Core Functionality)

**Goal**: Move all data fetching from runtime to build time.

**Tasks**:
1. Update data fetching functions to work at build time
2. Modify page components to fetch data during static generation
3. Remove API routes
4. Remove server actions
5. Update Projects service for build-time GitHub API calls
6. Implement error handling for build-time data fetching

**Success Criteria**:
- All data fetched during build
- No API routes in output
- Pages contain embedded data
- Build fails gracefully when data unavailable

### Phase 3: Client-Side Search Implementation (Feature Replacement)

**Goal**: Replace Genkit AI search with client-side fuzzy search.

**Tasks**:
1. Install Fuse.js dependency
2. Create client-side search utility
3. Update interview questions page to use client-side search
4. Remove server action for search
5. Implement search UI feedback
6. Test search performance

**Success Criteria**:
- Search works entirely in browser
- No network requests during search
- Fuzzy matching provides good results
- Search performance is acceptable

### Phase 4: Feature Removal (Cleanup)

**Goal**: Remove unused features to reduce complexity and bundle size.

**Tasks**:
1. Remove Volunteer Leaderboard components
2. Remove Community Stats components
3. Update homepage to remove sections for deleted features
4. Remove data fetching for removed features
5. Update environment configuration
6. Clean up unused imports and dependencies

**Success Criteria**:
- Leaderboard and stats features completely removed
- Homepage doesn't show removed sections
- Bundle size reduced
- No unused dependencies

### Phase 5: GitHub Actions Workflow (Automation)

**Goal**: Implement fully automated deployment pipeline.

**Tasks**:
1. Create `.github/workflows/deploy.yml`
2. Configure workflow triggers (push, schedule, manual)
3. Add build steps (checkout, setup Node, install, build)
4. Add deployment step (deploy to gh-pages)
5. Configure secrets and environment variables
6. Test workflow execution
7. Configure GitHub Pages settings

**Success Criteria**:
- Workflow runs on push to main
- Workflow runs hourly on schedule
- Build and deployment succeed
- Site updates automatically
- Secrets are properly configured

### Phase 6: Documentation and Testing (Finalization)

**Goal**: Ensure the migration is complete, tested, and documented.

**Tasks**:
1. Update README with new deployment instructions
2. Document GitHub Pages setup process
3. Document required repository secrets
4. Add migration notes
5. Run full test suite
6. Perform manual testing checklist
7. Verify all pages work correctly
8. Check bundle sizes and performance

**Success Criteria**:
- Documentation is complete and accurate
- All tests pass
- Manual testing checklist complete
- Performance metrics acceptable
- Site fully functional on GitHub Pages

## Dependencies

### Dependencies to Remove

```json
{
  "firebase": "^11.9.1",
  "@genkit-ai/googleai": "^1.14.1",
  "@genkit-ai/next": "^1.14.1",
  "genkit": "^1.14.1",
  "googleapis": "^156.0.0",
  "lru-cache": "^10.2.0"
}
```

### Dependencies to Add

```json
{
  "fuse.js": "^7.0.0"
}
```

### Dependencies to Keep

- `@octokit/rest`: Required for GitHub API integration
- `marked`: Required for README rendering
- `papaparse`: Required for CSV parsing
- `swr`: Can be kept for client-side data fetching if needed
- All UI dependencies (Radix UI, Tailwind, etc.)
- All Next.js and React dependencies

### Dev Dependencies

- Add `gh-pages` deployment action (handled by GitHub Actions, not npm package)
- Keep all existing dev dependencies for linting, TypeScript, etc.

## Performance Considerations

### Build Time

**Expected Build Time**: 3-5 minutes
- Data fetching: 1-2 minutes (Google Sheets + GitHub API)
- Static generation: 1-2 minutes (all pages)
- Asset optimization: 30-60 seconds

**Optimization Strategies**:
- Parallel data fetching where possible
- Cache GitHub API responses during build
- Use authenticated GitHub requests for higher rate limits
- Implement request delays to avoid rate limiting

### Bundle Size

**Current Bundle Size**: ~500KB (estimated with Firebase + Genkit)
**Target Bundle Size**: ~300KB (30% reduction)

**Size Reductions**:
- Remove Firebase: ~100KB
- Remove Genkit: ~80KB
- Remove googleapis: ~20KB
- Remove unused features: ~20KB

**Remaining Size**:
- Next.js runtime: ~80KB
- React: ~40KB
- UI components: ~100KB
- Application code: ~80KB
- Fuse.js: ~20KB

### Runtime Performance

**Page Load Time**: < 2 seconds (target)
- Static HTML served from CDN: ~200ms
- JavaScript download and parse: ~500ms
- Hydration: ~300ms
- Time to Interactive: ~1000ms

**Search Performance**:
- Fuse.js initialization: ~50ms
- Search execution: ~10-50ms (depending on dataset size)
- UI update: ~10ms

**Optimization Strategies**:
- Code splitting for routes
- Lazy load non-critical components
- Optimize images (WebP/AVIF)
- Minimize JavaScript bundle
- Use CDN for static assets (GitHub Pages provides this)

## Security Considerations

### Removed Attack Vectors

- **No Server-Side Code**: Eliminates server-side vulnerabilities
- **No Authentication**: Removes authentication-related security concerns
- **No API Keys in Client**: No Firebase or Google AI keys exposed
- **No Database**: No database injection or data breach risks

### Remaining Considerations

**GitHub API Token**:
- Store as GitHub repository secret
- Only accessible during workflow execution
- Not exposed in client-side code
- Use with minimal required permissions (read-only for public repos)

**Google Sheets Data**:
- Use public CSV export URLs (no authentication required)
- Data is public anyway (displayed on site)
- No sensitive information in sheets

**Content Security**:
- Maintain CSP headers if possible (limited in GitHub Pages)
- Ensure no XSS vulnerabilities in rendered content
- Sanitize markdown rendering from GitHub READMEs
- Validate data from external sources

**GitHub Pages Security**:
- HTTPS enforced by default
- No server-side code execution
- Static files only
- DDoS protection by GitHub

### Best Practices

1. **Secrets Management**: Use GitHub repository secrets for any sensitive data
2. **Dependency Updates**: Regularly update dependencies to patch vulnerabilities
3. **Content Sanitization**: Sanitize all external content (READMEs, user-contributed data)
4. **HTTPS Only**: Ensure custom domain uses HTTPS
5. **Minimal Permissions**: Use minimal GitHub token permissions

## Rollback Strategy

### Rollback Scenarios

**Scenario 1: Build Failures**
- **Trigger**: Build fails after migration
- **Action**: Revert to previous commit
- **Recovery Time**: Immediate (previous deployment still active)

**Scenario 2: Functionality Issues**
- **Trigger**: Features not working correctly after deployment
- **Action**: Revert gh-pages branch to previous commit
- **Recovery Time**: ~5 minutes (manual revert + GitHub Pages update)

**Scenario 3: Performance Issues**
- **Trigger**: Site is too slow or unresponsive
- **Action**: Revert to previous deployment, investigate and fix
- **Recovery Time**: ~5 minutes (revert) + fix time

**Scenario 4: Data Issues**
- **Trigger**: Data not displaying correctly
- **Action**: Fix data fetching code and re-deploy
- **Recovery Time**: ~10 minutes (fix + build + deploy)

### Rollback Procedure

1. **Identify Issue**: Determine what's broken
2. **Assess Severity**: Critical (immediate rollback) vs. Minor (can fix forward)
3. **Execute Rollback**:
   - Option A: Revert commit and push (triggers new deployment)
   - Option B: Manually revert gh-pages branch
   - Option C: Re-run previous successful workflow
4. **Verify**: Confirm site is working with previous version
5. **Fix**: Address issue in development
6. **Re-deploy**: Deploy fixed version

### Monitoring

**Build Monitoring**:
- GitHub Actions provides build status
- Email notifications on workflow failures
- Build logs available in GitHub Actions UI

**Site Monitoring**:
- Manual checks after deployment
- User reports for issues
- Browser console for client-side errors
- Optional: Add external monitoring service (UptimeRobot, etc.)

**Data Freshness**:
- Verify hourly rebuilds are running
- Check last deployment time in GitHub Pages settings
- Monitor for stale data issues

## Migration Checklist

### Pre-Migration

- [ ] Backup current Vercel deployment
- [ ] Document current environment variables
- [ ] Test current site functionality
- [ ] Create migration branch
- [ ] Review all requirements and design

### During Migration

- [ ] Complete Phase 1: Configuration and Cleanup
- [ ] Complete Phase 2: Data Fetching Migration
- [ ] Complete Phase 3: Client-Side Search Implementation
- [ ] Complete Phase 4: Feature Removal
- [ ] Complete Phase 5: GitHub Actions Workflow
- [ ] Complete Phase 6: Documentation and Testing

### Post-Migration

- [ ] Verify all pages work on GitHub Pages
- [ ] Test all functionality
- [ ] Verify scheduled rebuilds work
- [ ] Update DNS if using custom domain
- [ ] Monitor for issues
- [ ] Decommission Vercel deployment
- [ ] Celebrate $240/year savings! 🎉

## Success Metrics

### Cost Savings
- **Target**: $0/month hosting (from $20/month)
- **Annual Savings**: $240/year

### Performance
- **Page Load Time**: < 2 seconds
- **Time to Interactive**: < 1 second
- **Lighthouse Score**: > 90

### Bundle Size
- **Target**: < 350KB (30% reduction)
- **Current**: ~500KB

### Build Time
- **Target**: < 5 minutes
- **Acceptable**: < 10 minutes

### Reliability
- **Uptime**: 99.9% (GitHub Pages SLA)
- **Build Success Rate**: > 95%
- **Scheduled Rebuild Success**: > 95%

### Functionality
- **All Pages Working**: 100%
- **Search Functionality**: Working
- **Projects Feature**: Fully functional
- **GitHub Integration**: Working
