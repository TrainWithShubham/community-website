# GitHub Pages Deployment Guide

## Issue: Missing CSS/JS on GitHub Pages

When deploying Next.js to GitHub Pages at a subdirectory (e.g., `username.github.io/repo-name`), assets fail to load because they're looking for files at the root instead of the subdirectory.

## Solution

Added `basePath` and `assetPrefix` to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/community-website',
  assetPrefix: '/community-website/',
  // ... rest of config
}
```

## What This Does

- **basePath**: Tells Next.js that the app is served from `/community-website` instead of `/`
- **assetPrefix**: Ensures all CSS, JS, and image files load from `/community-website/_next/...`

## Deploy the Fix

```bash
git add next.config.ts
git commit -m "fix: add basePath for GitHub Pages subdirectory deployment"
git push origin main
```

Wait 2-3 minutes for GitHub Actions to rebuild and redeploy.

## Verify

After deployment, visit:
- `https://trainwithshubham.github.io/community-website/`

All CSS, JavaScript, and images should now load correctly!

## Local Development

When running locally with `npm run dev`, the site will be available at:
- `http://localhost:3000/community-website/`

Note the `/community-website` path - this matches production.

## Alternative: Custom Domain

If you set up a custom domain (like `community.trainwithshubham.com`), you can remove the `basePath` and `assetPrefix` since the site will be at the root of that domain.
