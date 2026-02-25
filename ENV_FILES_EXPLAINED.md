# 🔐 Environment Files Explained

## ❓ Why Do We Need Environment Files?

Yes, **environment files ARE required and ARE used in the code**! Here's why:

### 1. **Configuration Management**
Environment files store configuration values that change between environments (development, production, etc.) without modifying code.

### 2. **Security**
Sensitive data like API keys, database URLs, and secrets should NEVER be hardcoded in source code. Environment files keep them separate and secure.

### 3. **Flexibility**
Different developers can have different configurations without conflicts. Production can use different values than development.

---

## 📁 Environment Files in This Project

### `.env.local` (Your Local Configuration)
- **Purpose**: Your personal development environment settings
- **Git Status**: ✅ Gitignored (safe to put real values)
- **When to use**: Local development on your machine
- **Example**:
```bash
JOBS_SHEET_URL=https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?output=csv
NEXT_PUBLIC_INTERVIEW_REPO_OWNER=TrainWithShubham
```

### `.env.example` (Template for Others)
- **Purpose**: Shows what environment variables are needed
- **Git Status**: ✅ Committed to git (no real values)
- **When to use**: Reference for setting up `.env.local`
- **Example**:
```bash
# This is a template - copy to .env.local and fill in real values
JOBS_SHEET_URL=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv
```

### `.env` (Not Used in This Project)
- **Purpose**: Default environment file
- **Git Status**: ❌ Usually gitignored
- **Note**: We use `.env.local` instead for better Next.js compatibility

---

## 🔍 Where Are Environment Variables Used?

### 1. **`src/lib/env.ts`** ✅ ACTIVELY USED
```typescript
// This file reads and validates environment variables
const envSchema = z.object({
  JOBS_SHEET_URL: z.string().url().min(1).default(DEFAULT_JOBS_SHEET_URL),
  NEXT_PUBLIC_INTERVIEW_REPO_OWNER: z.string().default('TrainWithShubham'),
  // ... more variables
});

export const env = parseEnvironment(); // ← Reads from .env.local
```

**What it does**:
- Reads environment variables from `.env.local`
- Validates them with Zod schema
- Provides type-safe access throughout the app
- Falls back to defaults if variables are missing

### 2. **`src/services/google-sheets.ts`** ✅ ACTIVELY USED
```typescript
import { getSheetUrls } from "@/lib/env";

const sheetUrls = getSheetUrls(); // ← Uses JOBS_SHEET_URL from .env.local

export async function getJobs(): Promise<Job[]> {
  const csvText = await fetchCSV(sheetUrls.jobs); // ← Uses the URL
  // ...
}
```

**What it does**:
- Fetches jobs data from Google Sheets
- Uses `JOBS_SHEET_URL` from environment variables

### 3. **`src/services/github-csv.ts`** ✅ ACTIVELY USED
```typescript
const GITHUB_OWNER = process.env.NEXT_PUBLIC_INTERVIEW_REPO_OWNER || 'TrainWithShubham';
const GITHUB_REPO = process.env.NEXT_PUBLIC_INTERVIEW_REPO_NAME || 'interview-questions';
const GITHUB_BRANCH = process.env.NEXT_PUBLIC_INTERVIEW_REPO_BRANCH || 'main';
```

**What it does**:
- Fetches interview questions from GitHub CSV
- Uses `NEXT_PUBLIC_INTERVIEW_REPO_*` variables
- Falls back to defaults if not set

---

## 🎯 Current Environment Variables

### Required Variables

#### `JOBS_SHEET_URL` (Server-side)
- **Used by**: `src/services/google-sheets.ts`
- **Purpose**: URL to fetch jobs data from Google Sheets
- **Format**: `https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?output=csv`
- **Default**: Has a fallback URL in `src/lib/env.ts`

### Optional Variables (Have Defaults)

#### `NEXT_PUBLIC_INTERVIEW_REPO_OWNER` (Client-side)
- **Used by**: `src/services/github-csv.ts`
- **Purpose**: GitHub username/org that owns the interview questions repo
- **Default**: `TrainWithShubham`

#### `NEXT_PUBLIC_INTERVIEW_REPO_NAME` (Client-side)
- **Used by**: `src/services/github-csv.ts`
- **Purpose**: Name of the GitHub repository with interview questions
- **Default**: `interview-questions`

#### `NEXT_PUBLIC_INTERVIEW_REPO_BRANCH` (Client-side)
- **Used by**: `src/services/github-csv.ts`
- **Purpose**: Branch to fetch CSV files from
- **Default**: `main`

---

## 🔑 Why `NEXT_PUBLIC_` Prefix?

### Server-side Variables (No Prefix)
```bash
JOBS_SHEET_URL=...
```
- Only available on the server (Node.js)
- NOT exposed to the browser
- More secure for sensitive data

### Client-side Variables (`NEXT_PUBLIC_` Prefix)
```bash
NEXT_PUBLIC_INTERVIEW_REPO_OWNER=...
```
- Available in both server AND browser
- Exposed to the client (visible in browser)
- Use for non-sensitive, public configuration

---

## 📝 How to Set Up Environment Files

### Step 1: Create `.env.local`
```bash
# In your project root
touch .env.local
```

### Step 2: Copy from `.env.example`
```bash
cp .env.example .env.local
```

### Step 3: Fill in Real Values
Edit `.env.local` with your actual values:
```bash
# .env.local
JOBS_SHEET_URL=https://docs.google.com/spreadsheets/d/e/YOUR_ACTUAL_ID/pub?output=csv
NEXT_PUBLIC_INTERVIEW_REPO_OWNER=YourGitHubUsername
```

### Step 4: Restart Dev Server
```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

---

## 🚀 Production Deployment

### GitHub Pages
Environment variables are set in:
1. **GitHub Repository Settings** → **Secrets and variables** → **Actions**
2. Add secrets for sensitive values
3. Add variables for non-sensitive values

### Vercel
Environment variables are set in:
1. **Project Settings** → **Environment Variables**
2. Add variables for Production, Preview, and Development
3. Redeploy after adding variables

### Netlify
Environment variables are set in:
1. **Site Settings** → **Build & deploy** → **Environment**
2. Add variables
3. Trigger new deploy

---

## ❌ Common Mistakes

### Mistake 1: Not Creating `.env.local`
**Problem**: App uses default values or fails
**Solution**: Create `.env.local` from `.env.example`

### Mistake 2: Committing `.env.local` to Git
**Problem**: Exposes sensitive data
**Solution**: `.env.local` is already in `.gitignore` - never remove it!

### Mistake 3: Forgetting `NEXT_PUBLIC_` Prefix
**Problem**: Client-side code can't access the variable
**Solution**: Add `NEXT_PUBLIC_` prefix for client-side variables

### Mistake 4: Not Restarting Dev Server
**Problem**: Changes to `.env.local` not picked up
**Solution**: Always restart dev server after changing environment files

---

## 🔍 Debugging Environment Variables

### Check if Variables Are Loaded
```typescript
// In any file
console.log('JOBS_SHEET_URL:', process.env.JOBS_SHEET_URL);
console.log('INTERVIEW_REPO:', process.env.NEXT_PUBLIC_INTERVIEW_REPO_OWNER);
```

### Check Environment Validation
```bash
npm run env:check
```

### Check Build-Time Variables
```bash
npm run build
# Look for environment variable logs in output
```

---

## 📊 Summary

| File | Purpose | Git Status | Contains Real Values? |
|------|---------|------------|----------------------|
| `.env.local` | Your local config | Gitignored | ✅ Yes |
| `.env.example` | Template | Committed | ❌ No (placeholders) |
| `src/lib/env.ts` | Validation & defaults | Committed | ❌ No (code only) |

**Bottom Line**: 
- ✅ Environment files ARE required
- ✅ They ARE used in the code
- ✅ They provide configuration and security
- ✅ Always create `.env.local` for local development
- ✅ Never commit `.env.local` to git

---

## 🎉 You're All Set!

Your environment files are properly configured and actively used throughout the application for:
- ✅ Fetching jobs from Google Sheets
- ✅ Fetching interview questions from GitHub CSV
- ✅ Configuring repository settings
- ✅ Providing secure, flexible configuration

**Need Help?** Check the code in `src/lib/env.ts` to see exactly how environment variables are used!
