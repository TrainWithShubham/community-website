# Deployment Guide

Complete guide for deploying the TrainWithShubham Community Hub to GitHub Pages.

## Quick Start

The site automatically deploys to GitHub Pages when you push to the `main` branch.

**Live URL:** `https://community.trainwithshubham.com`

## Automatic Deployment

### Triggers
- **Push to main**: Deploys immediately
- **Hourly schedule**: Rebuilds every hour to fetch fresh data from Google Sheets
- **Manual**: Can be triggered from GitHub Actions tab

### Workflow
1. GitHub Actions runs `npm run build`
2. Fetches data from Google Sheets (CSV endpoints)
3. Fetches GitHub repository metadata
4. Generates static HTML pages
5. Deploys to GitHub Pages

## Custom Domain Setup

### DNS Configuration

Add a CNAME record to your DNS provider:

| Type  | Name      | Value                      | TTL  |
|-------|-----------|----------------------------|------|
| CNAME | community | trainwithshubham.github.io | 3600 |

### GitHub Pages Configuration

1. Go to **Settings** → **Pages**
2. Enter custom domain: `community.trainwithshubham.com`
3. Click **Save**
4. Wait for DNS verification (5-15 minutes)
5. Enable **Enforce HTTPS**

### CNAME File

The workflow automatically creates a CNAME file during deployment:
```yaml
- name: Create .nojekyll and CNAME files
  run: |
    touch out/.nojekyll
    echo "community.trainwithshubham.com" > out/CNAME
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npx serve out
```

**Local URL:** `http://localhost:3000`

## Environment Variables

### Required for Build

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- Google Sheets CSV URLs are configured in `src/lib/env.ts`

### Optional

- Custom environment variables can be added to the workflow file

## Troubleshooting

### Build Fails

Check GitHub Actions logs:
1. Go to **Actions** tab
2. Click on the failed workflow
3. Review build logs

Common issues:
- Google Sheets CSV endpoints unreachable
- GitHub API rate limiting (rare with token)
- TypeScript errors

### CSS Not Loading

If CSS doesn't load after deployment:
1. Verify custom domain is configured correctly
2. Check that CNAME file exists in deployment
3. Clear browser cache
4. Wait for DNS propagation (up to 48 hours)

### HTTPS Certificate Issues

- Wait 30 minutes after DNS verification
- Uncheck and re-check "Enforce HTTPS" in GitHub settings
- Verify DNS CNAME points to `trainwithshubham.github.io`

## Cost Savings

- **Before (Vercel):** $20/month
- **After (GitHub Pages):** $0/month
- **Annual Savings:** $240/year

## Architecture

- **Static Site Generation**: All pages pre-rendered at build time
- **Client-Side Search**: Fuse.js for fuzzy search (no API calls)
- **Build-Time Data**: Fetches from Google Sheets during build
- **GitHub API**: Fetches repository metadata with retry logic
- **Zero Server Cost**: Pure static hosting

## Monitoring

- Check **Actions** tab for deployment status
- Hourly rebuilds ensure data freshness
- Build logs show data fetch status
- Failed builds send notifications (if configured)
