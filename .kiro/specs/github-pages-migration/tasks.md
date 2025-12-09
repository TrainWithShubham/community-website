# Implementation Plan

This implementation plan provides a series of incremental tasks to migrate the TrainWithShubham Community Hub from Vercel to GitHub Pages. Each task builds on previous tasks and focuses on specific code changes.

## Task List

- [x] 1. Update Next.js configuration for static export
  - Update `next.config.ts` to set `output: 'export'`
  - Configure image optimization for static hosting (set `unoptimized: true`)
  - Remove `async headers()` function (not supported in static export)
  - Remove server-side specific webpack configurations
  - Test that build runs with new configuration
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 2. Remove incompatible files and configurations
  - Delete `middleware.ts` file (incompatible with static export)
  - Delete `vercel.json` file (Vercel-specific configuration)
  - Update `.gitignore` to include `out/` directory (static export output)
  - Create `.nojekyll` file in public directory (for GitHub Pages)
  - _Requirements: 9.5, 1.5_

- [x] 3. Remove Firebase dependencies and configuration
  - Remove Firebase packages from `package.json`: `firebase`
  - Delete `src/lib/firebase/config.ts`
  - Delete `src/contexts/auth-context.tsx`
  - Remove Firebase environment variables from `src/lib/env.ts`
  - Update environment validation to not require Firebase variables
  - Run `npm install` to update dependencies
  - _Requirements: 2.1, 2.3, 2.4_

- [x] 4. Remove Genkit AI dependencies and files
  - Remove Genkit packages from `package.json`: `@genkit-ai/googleai`, `@genkit-ai/next`, `genkit`, `googleapis`
  - Delete `src/ai/genkit.ts`
  - Delete `src/ai/flows/intelligent-question-search.ts`
  - Delete `src/ai/dev.ts`
  - Remove Genkit scripts from `package.json` (`genkit:dev`, `genkit:watch`)
  - Remove Google AI API key from environment validation
  - Run `npm install` to update dependencies
  - _Requirements: 3.1, 3.3_

- [x] 5. Remove unused caching dependencies
  - Remove `lru-cache` from `package.json`
  - Update `src/lib/cache.ts` or remove if only used for server-side caching
  - Remove cache-related imports from components
  - Run `npm install` to update dependencies
  - _Requirements: 1.1_

- [x] 6. Install client-side search dependency
  - Add `fuse.js` to `package.json` dependencies
  - Run `npm install` to install Fuse.js
  - _Requirements: 3.5_

- [x] 7. Create client-side search utility
  - Create `src/lib/client-search.ts` with Fuse.js wrapper
  - Implement `ClientSearch` class with configuration for fuzzy matching
  - Configure search keys for questions (question, answer, author)
  - Set appropriate threshold for fuzzy matching (0.3-0.4)
  - Export search utility for use in components
  - _Requirements: 3.2, 3.5_

- [ ]* 7.1 Write unit tests for client-side search
  - Test search initialization with various configurations
  - Test exact match searches
  - Test fuzzy match searches with typos
  - Test empty query handling
  - Test no results scenario
  - _Requirements: 3.2, 3.5_

- [x] 8. Update interview questions page for client-side search
  - Remove server action import from `src/app/interview-questions/page.tsx`
  - Delete `src/app/interview-questions/actions.ts` (server actions file)
  - Update interview questions client component to use Fuse.js search
  - Implement search state management in client component
  - Remove any server action calls
  - Ensure search executes entirely in browser
  - _Requirements: 3.2, 3.4_

- [ ]* 8.1 Write property test for client-side search execution
  - **Property 5: Client-Side Search Execution**
  - **Validates: Requirements 3.4**
  - Test that search generates no network requests
  - Monitor network activity during search operations
  - Verify search works without server communication
  - _Requirements: 3.4_

- [x] 9. Replace authentication with Google Form link
  - Create `src/components/google-form-link.tsx` component
  - Add Google Form URL for community question contributions
  - Update pages that had "Add Question" forms to use Google Form link
  - Remove authentication-related UI components (login buttons, user menus)
  - Update layout to remove authentication context provider
  - _Requirements: 2.2, 2.5_

- [x] 10. Update data fetching for build-time execution
  - Update `src/lib/data-fetcher.ts` to work at build time
  - Remove runtime caching logic (LRU cache)
  - Add error handling for build-time fetch failures
  - Implement retry logic with exponential backoff (3 attempts)
  - Add clear error messages for failed fetches
  - _Requirements: 4.1, 4.4_

- [ ]* 10.1 Write unit tests for data fetching
  - Test successful data fetch and parsing
  - Test error handling for network failures
  - Test retry logic with exponential backoff
  - Test error messages are clear and actionable
  - Mock HTTP requests to avoid external dependencies
  - _Requirements: 4.1, 4.4_

- [x] 11. Update pages to fetch data at build time
  - Update `src/app/interview-questions/page.tsx` to fetch data during static generation
  - Update `src/app/jobs/page.tsx` to fetch data during static generation
  - Update `src/app/events/page.tsx` to fetch data during static generation
  - Update homepage to fetch data during static generation
  - Remove `revalidate` exports (ISR not supported in static export)
  - Ensure data is embedded in static HTML
  - _Requirements: 4.2, 11.1, 11.2, 11.3, 11.4_

- [x] 12. Remove API routes
  - Delete `src/app/api/community-questions/route.ts`
  - Delete `src/app/api/clear-cache/route.ts`
  - Delete `src/app/api/revalidate/route.ts`
  - Delete `src/app/api/readme/route.ts`
  - Delete `src/app/api/google-calendar/` directory and all files
  - Verify no API routes remain in `src/app/api/` directory
  - _Requirements: 4.3_

- [x] 13. Update Projects service for build-time GitHub API calls
  - Update `src/features/projects/lib/services/simple-project-service.ts`
  - Remove in-memory caching (not needed for static site)
  - Fetch all GitHub data during build instead of runtime
  - Implement rate limit handling with delays between requests (1 second minimum)
  - Add retry logic for failed GitHub API requests (3 attempts)
  - Use authenticated GitHub requests if token available (for higher rate limits)
  - Add error handling for individual project fetch failures
  - _Requirements: 5.1, 5.5_

- [ ]* 13.1 Write property test for project data completeness
  - **Property 3: Project Data Completeness**
  - **Validates: Requirements 5.4**
  - Test that all projects have required fields: stars, forks, description, topics
  - Generate test with various project configurations
  - Verify data completeness for each project
  - _Requirements: 5.4_

- [x] 14. Update projects pages for static generation
  - Update `src/app/projects/page.tsx` to generate static page
  - Update `src/app/projects/[id]/page.tsx` to use `generateStaticParams`
  - Generate static pages for all projects at build time
  - Remove `revalidate` exports
  - Ensure project data is embedded in static HTML
  - Verify README viewer works with static pages
  - _Requirements: 5.2, 5.3, 5.6_

- [x] 15. Remove Volunteer Leaderboard feature
  - Delete leaderboard-related components from `src/components/`
  - Remove leaderboard data fetching from homepage
  - Remove leaderboard section from homepage layout
  - Remove `LEADERBOARD_SHEET_URL` from environment configuration
  - Update environment validation to not require leaderboard URL
  - _Requirements: 6.1, 6.3, 6.4, 6.5_

- [x] 16. Remove Community Stats feature
  - Delete community stats components from `src/components/`
  - Remove community stats data fetching from homepage
  - Remove community stats section from homepage layout
  - Remove `COMMUNITY_STATS_URL` from environment configuration
  - Update environment validation to not require community stats URL
  - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [x] 17. Test static build locally
  - Run `npm run build` to generate static site
  - Verify build completes without errors
  - Check `out/` directory contains expected static files
  - Verify all pages have corresponding HTML files
  - Check that data is embedded in HTML files
  - Test local preview with `npx serve out`
  - _Requirements: 1.1, 1.5, 4.2, 4.5_

- [ ]* 17.1 Write property test for static output verification
  - **Property 4: Static Output Only**
  - **Validates: Requirements 1.1, 4.3**
  - Test that output directory contains only static assets
  - Scan output directory recursively for file types
  - Verify no server-side code or API route handlers present
  - _Requirements: 1.1, 4.3_

- [ ]* 17.2 Write property test for bundle exclusion - Firebase
  - **Property 1: Bundle Exclusion - Firebase**
  - **Validates: Requirements 2.1**
  - Analyze webpack bundle output
  - Search for Firebase module references
  - Verify no Firebase code in any bundle chunk
  - _Requirements: 2.1_

- [ ]* 17.3 Write property test for bundle exclusion - Genkit
  - **Property 2: Bundle Exclusion - Genkit/Google AI**
  - **Validates: Requirements 3.1**
  - Analyze webpack bundle output
  - Search for Genkit and Google AI module references
  - Verify no Genkit/Google AI code in any bundle chunk
  - _Requirements: 3.1_

- [x] 18. Create GitHub Actions workflow file
  - Create `.github/workflows/deploy.yml`
  - Configure workflow name and description
  - Define triggers: push to main, hourly cron schedule, manual dispatch
  - Add permissions for GitHub Pages deployment
  - _Requirements: 7.1, 7.2, 8.1_

- [x] 19. Add build steps to GitHub Actions workflow
  - Add checkout step to get repository code
  - Add Node.js setup step (use Node 20)
  - Add dependency installation step (`npm ci`)
  - Add build step (`npm run build`)
  - Configure environment variables from secrets
  - Add step to create `.nojekyll` file if not in public directory
  - _Requirements: 7.6, 7.7, 8.2_

- [x] 20. Add deployment step to GitHub Actions workflow
  - Add GitHub Pages deployment action (e.g., `peaceiris/actions-gh-pages`)
  - Configure deployment to `gh-pages` branch
  - Set publish directory to `out/`
  - Configure to use `GITHUB_TOKEN` for authentication
  - Add commit message for deployment
  - _Requirements: 7.3, 7.5, 8.3, 8.4_

- [x] 21. Configure GitHub repository secrets
  - Document required secrets in workflow comments
  - Add `GITHUB_TOKEN` usage (automatically provided)
  - Add any Google Sheets URLs as secrets if needed
  - Add GitHub API token as secret for higher rate limits (optional)
  - _Requirements: 7.5, 8.5_

- [x] 22. Enable GitHub Pages in repository settings
  - Go to repository Settings > Pages
  - Set source to `gh-pages` branch
  - Set directory to root (`/`)
  - Save settings
  - Note the GitHub Pages URL
  - _Requirements: 7.4_

- [x] 23. Test GitHub Actions workflow
  - Push changes to main branch
  - Monitor workflow execution in GitHub Actions tab
  - Verify all steps complete successfully
  - Check that `gh-pages` branch is created/updated
  - Verify site is accessible on GitHub Pages URL
  - _Requirements: 7.1, 7.3, 7.6_

- [x] 24. Verify scheduled rebuilds
  - Wait for hourly cron trigger to run
  - Check workflow execution in GitHub Actions tab
  - Verify fresh data is fetched from Google Sheets
  - Verify site updates automatically
  - Check for any build failures
  - _Requirements: 7.2_

- [x] 25. Update README documentation
  - Add section on GitHub Pages deployment
  - Document one-time setup steps for GitHub Pages
  - List required repository secrets
  - Explain automated deployment process
  - Add migration notes explaining differences from Vercel
  - Clarify that no manual build or deployment steps are needed
  - Add troubleshooting section
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 26. Add deployment documentation
  - Document GitHub Actions workflow structure
  - Explain workflow triggers (push, schedule, manual)
  - Document environment variables and secrets
  - Add instructions for manual workflow dispatch
  - Document GitHub API rate limiting considerations
  - Add rollback procedures
  - _Requirements: 10.2, 10.3, 10.4_

- [x] 27. Final testing and verification
  - Test all pages on GitHub Pages URL
  - Verify homepage displays correctly
  - Test interview questions page with search functionality
  - Test jobs page displays job listings
  - Test events page displays calendar events
  - Test projects page with search and filters
  - Test project detail pages with README viewer
  - Verify navigation and routing work correctly
  - Check browser console for errors
  - Test on multiple browsers (Chrome, Firefox, Safari)
  - Test on mobile devices
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 28. Performance verification
  - Run Lighthouse audit on GitHub Pages site
  - Verify page load times are under 2 seconds
  - Check Time to Interactive is under 1 second
  - Verify bundle size is reduced by at least 30%
  - Check that all performance metrics are acceptable
  - _Requirements: 1.1_

- [x] 29. Configure custom domain (if needed)
  - Add CNAME file to public directory with custom domain
  - Update DNS records to point to GitHub Pages
  - Enable HTTPS in GitHub Pages settings
  - Verify custom domain works correctly
  - Test HTTPS certificate
  - _Requirements: 1.2_

- [x] 30. Decommission Vercel deployment
  - Verify GitHub Pages site is fully functional
  - Update any external links to point to new URL
  - Delete Vercel project or disable deployment
  - Cancel Vercel subscription
  - Celebrate $240/year savings! 🎉
  - _Requirements: All_

## Notes

- Tasks marked with `*` are optional testing tasks that can be skipped for faster MVP delivery
- Each task should be completed and verified before moving to the next
- If a task fails, address the issue before proceeding
- The GitHub Actions workflow will handle all deployment automatically after initial setup
- No manual build or deployment steps are required after the workflow is configured
- The site will rebuild hourly to fetch fresh data from Google Sheets
