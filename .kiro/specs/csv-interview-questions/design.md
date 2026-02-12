# CSV-Based Interview Questions - Technical Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Repositories                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  interview-questions Repository (CSV Source)                    │
│  ├── devops/interview-questions.csv (5 questions)               │
│  ├── .github/workflows/trigger-deploy.yml                       │
│  └── README.md                                                  │
│                                                                 │
│                           │                                     │
│                           │ PR Merge                            │
│                           ▼                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐            │
│  │ GitHub Actions: trigger-deploy.yml              │            │
│  │ - Triggered on CSV file changes                 │            │
│  │ - Sends repository_dispatch webhook             │            │
│  │ - Event type: interview-questions-updated       │            │
│  └─────────────────────────────────────────────────┘            │
│                           │                                     │
│                           │ Webhook                             │
│                           ▼                                     │
│                                                                 │
│  community-website Repository (Next.js App)                     │
│  ├── src/app/interview-questions/page.tsx                       │
│  ├── src/components/interview/                                  │
│  │   ├── interview-questions-new-client.tsx                     │
│  │   ├── interview-question-card.tsx                            │
│  │   └── question-filters.tsx                                   │
│  ├── src/services/github-csv.ts                                 │
│  └── .github/workflows/deploy.yml                               │
│                                                                 │
│                           │                                     │
│                           │ Rebuild & Deploy                    │
│                           ▼                                     │
│                                                                 |
│  ┌─────────────────────────────────────────────────┐            │
│  │ GitHub Actions: deploy.yml                      │            │
│  │ - Build Next.js (static export)                 │            │
│  │ - Deploy to GitHub Pages                        │            │
│  │ - Time: ~2-3 minutes                            │            │
│  └─────────────────────────────────────────────────┘            │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│          GitHub Pages (Production)                               │
│  https://<username>.github.io/community-website/                │
│                                                                   │
│  User visits → Static HTML loads → Client-side fetch            │
│                                                                   │
│  fetch(https://raw.githubusercontent.com/<username>/            │
│        interview-questions/main/devops/                          │
│         interview-questions.csv)                           │
│                           │                                       │
│                           ▼                                       │
│  Parse CSV → Display questions → Enable search/filter           │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Page Component
**File**: `src/app/interview-questions/page.tsx`
- **Type**: Server Component (static export)
- **Purpose**: Layout and metadata
- **Data**: Passes empty initial state to client component
- **Rendering**: Static HTML at build time

### Client Component
**File**: `src/components/interview/interview-questions-new-client.tsx`
- **Type**: Client Component (`'use client'`)
- **State Management**:
  - `questions`: Array of InterviewQuestion objects
  - `filterOptions`: Available filter values (companies, years, etc.)
  - `isLoading`: Initial load state
  - `isRefreshing`: Manual refresh state
  - `searchQuery`: Search input value
  - `filters`: Active filter selections
- **Effects**:
  - `useEffect`: Fetch questions on mount if not provided
- **Computed Values**:
  - `fuse`: Memoized Fuse.js instance for search
  - `filteredQuestions`: Memoized filtered and searched results

### Service Layer
**File**: `src/services/github-csv.ts`
```typescript
export interface InterviewQuestion {
  company: string;
  year: string;
  contributor: string;
  role: string;
  experience: string;
  topic: string;
  question: string;
}

// Fetch and parse CSV
export async function getAllInterviewQuestions(): Promise<InterviewQuestion[]>

// Extract unique filter options
export function getFilterOptions(questions: InterviewQuestion[]): FilterOptions
```

## Data Flow

### Initial Page Load
```
1. User visits /interview-questions
2. Static HTML loads (from build time)
3. Client component mounts with empty questions array
4. useEffect triggers → loadQuestions()
5. Fetch CSV from GitHub raw URL
6. Parse CSV with Papa Parse
7. Update state → questions, filterOptions
8. Loading state → false
9. Render question cards
```

### Manual Refresh
```
1. User clicks "Refresh" button
2. isRefreshing → true (spinner starts)
3. Fetch CSV from GitHub raw URL
4. Wait minimum 1 second (UX delay)
5. Parse CSV with Papa Parse
6. Update state → questions, filterOptions
7. isRefreshing → false (spinner stops)
8. Re-render with new data
```

### Search/Filter
```
1. User types in search box OR selects filter
2. State updates (searchQuery or filters)
3. useMemo recalculates filteredQuestions
4. Apply filters first (company, year, role, etc.)
5. Apply fuzzy search if query exists
6. Re-render filtered results
```

### Export CSV
```
1. User clicks "Export CSV" button
2. Convert filteredQuestions to CSV string
3. Create Blob with text/csv MIME type
4. Create download link
5. Trigger download
6. Clean up URL object
```

## GitHub Actions Workflows

### trigger-deploy.yml (interview-questions repo)
```yaml
name: Trigger Community Website Rebuild

on:
  push:
    branches:
      - main
    paths:
      - 'devops/**'
      - '**.csv'

jobs:
  trigger-rebuild:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Community Website Rebuild
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.TRIGGER_TOKEN }}
          repository: <username>/community-website
          event-type: interview-questions-updated
          client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'
```

**Secrets Required**:
- `TRIGGER_TOKEN`: Personal Access Token with `repo` and `workflow` scopes

### deploy.yml (community-website repo)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:
  repository_dispatch:
    types: [interview-questions-updated]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout repository
      - Setup Node.js 20
      - Install dependencies (npm ci)
      - Build Next.js (npm run build)
      - Upload artifact
      - Deploy to GitHub Pages
```

**Configuration**:
- GitHub Pages enabled
- Source: GitHub Actions
- Branch: Not applicable (Actions)

## CSS Customizations

### Slow Spin Animation
**File**: `src/app/globals.css`
```css
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
```

**Usage**: Applied to RefreshCw icon when `isRefreshing` is true

## Environment Configuration

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  output: 'export',                    // Static export for GitHub Pages
//   basePath: '/community-website',      // GitHub Pages repo path
//   assetPrefix: '/community-website',   // Asset URL prefix
  images: {
    unoptimized: true,                 // Required for static export
  },
};
```

### Metadata Updates
All favicon and manifest URLs prefixed with `/community-website/` for GitHub Pages compatibility.

## Performance Optimizations

### Client-Side Fetching
- **Why**: Static export doesn't support ISR (revalidate)
- **Benefit**: No build-time network dependency
- **Trade-off**: Initial load requires client-side fetch

### Memoization
- **fuse**: Recreated only when questions array changes
- **filteredQuestions**: Recalculated only when questions, filters, or search changes
- **Benefit**: Prevents unnecessary re-computation

### Minimum Refresh Delay
- **Duration**: 1 second
- **Why**: Ensures spinner is visible even on fast connections
- **Implementation**: `Promise.all([fetch, setTimeout])`

## Error Handling

### Fetch Errors
```typescript
try {
  const fetchedQuestions = await getAllInterviewQuestions();
  setQuestions(fetchedQuestions);
} catch (error) {
  console.error('Failed to load questions:', error);
  // Questions remain empty, user sees "No Results Found" alert
}
```

### Empty State
- **Condition**: `filteredQuestions.length === 0`
- **Display**: Alert with message (search vs. filter)
- **Action**: Suggests clearing filters or trying different search

## Security Considerations

### Public Data
- CSV files are public (GitHub raw URLs)
- No sensitive data in questions
- No authentication required

### GitHub Token
- PAT stored as GitHub Secret
- Scopes: `repo`, `workflow`
- Only accessible to GitHub Actions
- Never exposed in client code

### CORS
- GitHub raw URLs allow cross-origin requests
- No CORS proxy needed
- Works from any domain

## Testing Strategy

### Manual Testing
1. Add 15 test questions
2. Create PR in interview-questions repo
3. Merge PR
4. Watch GitHub Actions (both repos)
5. Verify deploy completes (2-3 minutes)
6. Visit production site
7. Click "Refresh" button
8. Verify new questions appear

### Expected Results
- ✅ Questions increase from 20
- ✅ trigger-deploy.yml runs successfully (~30 seconds)
- ✅ deploy.yml runs successfully (~2-3 minutes)
- ✅ Site updates within 5 minutes total
- ✅ Manual refresh shows new questions immediately

## Deployment Process

### Initial Setup
1. Create `interview-questions` repo with CSV files
2. Create `.github/workflows/trigger-deploy.yml`
3. Generate PAT with repo + workflow scopes
4. Add `TRIGGER_TOKEN` secret to interview-questions repo
5. Update `community-website` with GitHub Actions listener
6. Enable GitHub Pages (Source: GitHub Actions)
7. Update service code with correct repository URLs

### Ongoing Workflow
1. Contributor submits PR with new questions
2. Maintainer reviews and merges PR
3. GitHub Actions automatically:
   - Triggers rebuild
   - Deploys to GitHub Pages
   - New questions live in 3-5 minutes
4. No manual intervention required

## Monitoring & Observability

### GitHub Actions
- Monitor Actions tab for failures
- Email notifications on workflow failure
- Workflow run history available

### Client-Side
- Console logs for fetch errors
- Browser DevTools Network tab shows CSV fetch
- Loading states visible to users

### Analytics (Future)
- Page views
- Search queries
- Popular filters
- Export usage

## Maintenance

### Adding New Categories
1. Create new CSV file (e.g., `cloud/interview-questions.csv`)
2. Update `CSV_FILES` object in `github-csv.ts`
3. Update trigger-deploy.yml paths if needed
4. Deploy changes

### Schema Changes
1. Update CSV header row
2. Update `InterviewQuestion` interface
3. Update card display components
4. Update filter logic if needed
5. Test thoroughly before merging

### Performance Monitoring
- Track question count growth
- Monitor fetch times
- Check filter performance at scale
- Optimize if > 1000 questions
