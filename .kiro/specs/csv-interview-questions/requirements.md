# CSV-Based Interview Questions - Requirements

## Functional Requirements

1. **Interview Questions Data Source**
   - Store all questions in CSV files in the `interview-questions` repository.
   - Each category (e.g., devops, cloud, aws) has its own CSV file.
   - CSV schema: company, year, contributor, role, experience, topic, question.

2. **Community Website Integration**
   - Community website fetches CSV data from GitHub raw URLs.
   - Display questions in a searchable, filterable UI.
   - Support filters for company, year, role, experience, topic.
   - Enable fuzzy search for question text and metadata.
   - Allow users to export filtered questions as CSV.

3. **Automated Updates**
   - When a PR is merged in `interview-questions`, trigger a rebuild/deploy of the community website.
   - Use GitHub Actions and repository_dispatch for automation.
   - New questions should appear on the site within 3-5 minutes after merge.

4. **Manual Refresh**
   - Provide a "Refresh" button for users to fetch the latest questions without reloading the page.
   - Show loading spinner during refresh.

5. **Error Handling & Empty States**
   - Display clear error messages if CSV fetch fails.
   - Show empty state alerts when no questions match filters/search.

6. **Security & Privacy**
   - No sensitive data in CSV files.
   - All data is public and accessible via GitHub raw URLs.
   - GitHub token (PAT) used only for workflow automation, never exposed to client.

7. **Testing & Maintenance**
   - Manual testing checklist for adding questions, triggering deploy, and verifying updates.
   - Easy process for adding new categories or updating schema.

## Non-Functional Requirements

1. **Performance**
   - Initial page load should complete within 2 seconds on a fast connection.
   - Client-side filtering/search should be instant for up to 1000 questions.
   - Minimum refresh spinner duration: 1 second (UX).

2. **Reliability**
   - Automated deploys must succeed >99% of the time.
   - Site must always show the latest questions after a successful deploy.

3. **Usability**
   - UI must be clear, modern, and mobile-friendly.
   - Filters and search should be easy to use.
   - Export CSV feature must be accessible and reliable.

4. **Maintainability**
   - Code and workflows must be documented in `.kiro/specs` and `CONTRIBUTING.md`.
   - Adding new categories or updating schema should require minimal code changes.

5. **Scalability**
   - System should handle growth to 1000+ questions and multiple categories.
   - Performance optimizations (memoization, efficient parsing) must be in place.

6. **Observability**
   - GitHub Actions workflow failures must be visible in the Actions tab.
   - Client-side errors should be logged to the console for debugging.

## User Stories

- As a contributor, I want to add new questions via CSV and see them live on the site after my PR is merged.
- As a user, I want to search and filter questions easily.
- As a maintainer, I want automated deploys and clear error handling.
- As a developer, I want clear documentation for adding new categories or updating schema.

## Acceptance Criteria

- [ ] Questions are fetched from CSV files in `interview-questions` repo.
- [ ] UI supports search, filter, and CSV export.
- [ ] Automated deploy triggers on PR merge.
- [ ] Manual refresh works and shows spinner.
- [ ] Error and empty states are handled gracefully.
- [ ] No sensitive data is exposed.
- [ ] Documentation is complete and up to date.
- [ ] System performs well with 1000+ questions.
- [ ] Adding new categories is straightforward.
