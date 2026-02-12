# CSV-Based Interview Questions - Tasks Checklist

## Initial Setup
- [x] Create `interview-questions` repo with CSV files for each category
- [x] Add `.github/workflows/trigger-deploy.yml` to interview-questions repo
- [x] Generate PAT with `repo` and `workflow` scopes
- [x] Add `TRIGGER_TOKEN` secret to interview-questions repo
- [x] Set up `community-website` repo with interview questions UI and service
- [x] Add `.github/workflows/deploy.yml` to community-website repo
- [x] Enable GitHub Pages (Source: GitHub Actions)
- [x] Update service code with correct repository URLs

## UI Implementation
- [x] Create `/interview-questions` route and page
- [x] Implement client component for fetching, searching, filtering questions
- [x] Add filter UI for company, year, role, experience, topic
- [x] Add fuzzy search (Fuse.js) for question text and metadata
- [x] Add export CSV button for filtered results
- [x] Add manual refresh button with spinner
- [x] Show empty state and error messages
- [x] Responsive design for mobile/desktop

## Service Layer
- [x] Implement `getAllInterviewQuestions` to fetch and parse CSV from GitHub
- [x] Implement `getFilterOptions` to extract unique filter values
- [x] Handle fetch errors and empty CSV gracefully

## GitHub Actions Automation
- [x] `trigger-deploy.yml` triggers on CSV changes in interview-questions repo
- [x] `deploy.yml` in community-website listens for `repository_dispatch` event
- [x] Automated deploy runs and updates site within 3-5 minutes of PR merge

## Testing
- [x] Add 10+ test questions to CSV and verify UI updates after PR merge
- [x] Test manual refresh, search, filter, and export features
- [x] Test error and empty states
- [x] Test on mobile and desktop

## Documentation
- [x] Document requirements, design, and tasks in `.kiro/specs/csv-interview-questions/`
- [x] Update `CONTRIBUTING.md` with instructions for adding questions and categories
- [x] Ensure all documentation is generic (no personal account names)

## Maintenance & Handoff
- [x] Checklist for sir:
  - [x] Transfer `interview-questions` repo to TrainWithShubham org
  - [x] Add `TRIGGER_TOKEN` secret in new org
  - [x] Merge feature branch in community-website if needed
  - [x] Verify deploy and refresh work after transfer
- [x] Instructions for adding new categories and updating schema
- [x] Monitor GitHub Actions for failures

## Final Verification
- [x] All code, workflows, and docs are production-ready and generic
- [x] All features tested and verified
- [x] Ready for handoff to sir
