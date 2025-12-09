# GitHub Pages Deployment Fix

## Issues Fixed

### 1. Missing Environment Configuration
**Problem**: The deployment job was missing the required `environment` configuration, causing the error:
```
Missing environment. Ensure your workflow's deployment job has an environment.
```

**Solution**: Added the `environment` block to the job configuration:

```yaml
jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
```

### 2. GitHub API 401 Authentication Errors
**Problem**: The workflow was using `secrets.GH_TOKEN` which doesn't exist by default.

**Solution**: Changed to use `secrets.GITHUB_TOKEN` which is automatically provided by GitHub Actions with appropriate permissions.

```yaml
# Before
GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}

# After
GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Static Generation Error (Dynamic Rendering)
**Problem**: Using `cache: 'no-store'` in fetch calls prevented Next.js from generating static pages, causing the error:
```
Route /projects with `dynamic = "error"` couldn't be rendered statically because it used `revalidate: 0`
```

**Solution**: Changed to use `next: { revalidate: false }` which tells Next.js to fetch once at build time and generate static pages.

```typescript
// Before
const response = await fetch(apiUrl, {
  headers,
  cache: 'no-store', // Don't cache during build
})

// After
const response = await fetch(apiUrl, {
  headers,
  next: { revalidate: false }, // Static generation - fetch once at build time
})
```

## How It Works Now

1. **Build Time**: GitHub Actions runs `npm run build`
   - Fetches all data from Google Sheets (CSV endpoints)
   - Fetches GitHub repository metadata using `GITHUB_TOKEN`
   - Generates static HTML pages
   - Outputs to `out/` directory

2. **Deployment**: Static files are deployed to GitHub Pages
   - No server-side rendering
   - No API calls at runtime
   - Fast, cached content delivery

3. **Updates**: Workflow runs hourly via cron schedule
   - Fetches fresh data from Google Sheets
   - Rebuilds and redeploys automatically

## Testing the Fix

To test locally:
```bash
npm run build
```

This should complete without errors and generate the `out/` directory.

## Deployment

Simply push to the `main` branch:
```bash
git add .
git commit -m "fix: resolve GitHub API auth and static generation issues"
git push origin main
```

**Note**: The workflow triggers on pushes to `main` branch, not `gh-pages`. The `gh-pages` branch is only used internally by GitHub Actions to store the deployed static files.

The GitHub Actions workflow will automatically build and deploy.

## Rate Limiting

The GitHub token provides:
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour

With the token, you can fetch data for many repositories without hitting rate limits.
