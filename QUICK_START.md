# 🚀 Quick Start Guide - GitHub CSV Integration

## 📍 Where Are My Environment Files?

Your environment files are in the **project root** (same level as `package.json`):

```
community-website/
├── .env.local          ← Your local config (gitignored)
├── .env.example        ← Template for others
├── package.json
├── src/
└── ...
```

## 🔑 Environment Variables Explained

### `.env.local` (Your actual values)
```bash
# This file is gitignored - safe to put real values here

# Jobs data from Google Sheets
JOBS_SHEET_URL=https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?output=csv

# Interview questions from GitHub (has defaults)
NEXT_PUBLIC_INTERVIEW_REPO_OWNER=TrainWithShubham
NEXT_PUBLIC_INTERVIEW_REPO_NAME=interview-questions
NEXT_PUBLIC_INTERVIEW_REPO_BRANCH=main
```

### How to Get Your Google Sheets URL:
1. Open your Google Sheet
2. Click **File** → **Share** → **Publish to web**
3. Choose **Entire Document** or specific sheet
4. Select **Comma-separated values (.csv)**
5. Click **Publish**
6. Copy the URL and paste it in `.env.local`

## 🏃 Running the Project

### Development
```bash
npm run dev
```
Visit: http://localhost:3000

### Production Build
```bash
npm run build
npm run start
```

### Type Check
```bash
npm run typecheck
```

## 📁 Key Files Modified

### Services
- `src/services/github-csv.ts` - Fetches interview questions from GitHub
- `src/services/google-sheets.ts` - Fetches jobs from Google Sheets (only)

### Configuration
- `src/lib/env.ts` - Environment variable validation
- `src/lib/data-fetcher.ts` - Aggregates data for homepage

### Pages
- `src/app/interview-questions/page.tsx` - Interview questions page
- `src/app/page.tsx` - Homepage

### Components
- `src/app/interview-questions/interview-questions-client.tsx` - Client component with search/filters

### Other
- `public/sw.js` - Service worker with smart caching
- `.env.local` - Your environment variables
- `.env.example` - Template for others

## 🎯 What Each Priority Does

### Priority 1: Core Migration ✅
- Removed Google Sheets for interview questions
- Now uses GitHub CSV repository
- Cleaner, more maintainable code

### Priority 2: Performance ✅
- Optimized search with Fuse.js
- Faster filtering and searching
- Better user experience

### Priority 3: Error Boundary ✅
- Catches runtime errors
- Shows friendly error message
- Prevents app crash

### Priority 4: Rate Limiting ✅
- Tracks GitHub API requests
- Prevents hitting rate limits (60/hour)
- Shows clear error messages

### Priority 5: Service Worker ✅
- Smart caching strategy
- Better offline support
- Network-first for data, cache-first for assets

## 🔍 Testing Your Changes

### 1. Check Interview Questions Page
```bash
npm run dev
```
Visit: http://localhost:3000/interview-questions

**Test**:
- ✅ Page loads
- ✅ Search works
- ✅ Filters work
- ✅ Export CSV works
- ✅ Refresh works

### 2. Check Homepage
Visit: http://localhost:3000

**Test**:
- ✅ Questions appear in terminal animation
- ✅ Jobs appear in terminal animation
- ✅ No console errors

### 3. Check Jobs Page
Visit: http://localhost:3000/jobs

**Test**:
- ✅ Jobs load from Google Sheets
- ✅ Terminal animation works

## 🐛 Common Issues & Fixes

### Issue: "No questions available"
**Cause**: GitHub repository doesn't exist or CSV file not found

**Fix**:
1. Check if repo exists: https://github.com/TrainWithShubham/interview-questions
2. Verify CSV file path: `/devops/interview-questions.csv`
3. Make sure repo is public

**Temporary**: App works fine, just shows empty state

### Issue: "Rate limit exceeded"
**Cause**: Too many requests to GitHub

**Fix**:
1. Wait for rate limit to reset (shown in error)
2. Don't click refresh too many times
3. Cache should prevent this (1-hour revalidation)

### Issue: Environment variables not loading
**Cause**: `.env.local` not found or dev server not restarted

**Fix**:
1. Make sure `.env.local` exists in project root
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Check file is not named `.env.local.txt` (Windows issue)

### Issue: Build fails
**Cause**: TypeScript errors or missing dependencies

**Fix**:
```bash
# Check types
npm run typecheck

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

## 📊 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Interview Questions | ✅ Working | GitHub CSV |
| Jobs | ✅ Working | Google Sheets |
| Homepage | ✅ Working | Both sources |
| Search | ✅ Optimized | Fuse.js |
| Filters | ✅ Working | All 6 filters |
| Export | ✅ Working | CSV download |
| Refresh | ✅ Working | Manual refresh |
| Error Handling | ✅ Added | Error Boundary |
| Rate Limiting | ✅ Added | 60 req/hour |
| Caching | ✅ Optimized | 1-hour revalidation |
| Service Worker | ✅ Updated | Smart caching |
| Build | ✅ Passing | TypeScript OK |

## 🎉 You're All Set!

Your GitHub CSV integration is complete and production-ready!

### Next Steps:
1. ✅ Test locally: `npm run dev`
2. ✅ Build for production: `npm run build`
3. ✅ Deploy to your hosting platform
4. ✅ Monitor for errors and performance

### Need Help?
- Check `MIGRATION_COMPLETE.md` for detailed documentation
- Review code comments in modified files
- Check console for error messages

---

**Happy Coding! 🚀**
