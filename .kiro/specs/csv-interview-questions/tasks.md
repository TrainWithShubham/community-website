# Implementation Plan: GitHub CSV Migration

## Overview

This implementation plan breaks down the migration from Google Sheets to GitHub CSV for interview questions into discrete, incremental coding tasks. Each task builds on previous work and includes testing to validate correctness. The GitHub CSV service is already implemented, so this migration focuses on removing legacy code, updating the data fetcher, and cleaning up configuration.

## Tasks

- [ ] 1. Update Data Fetcher to use GitHub CSV Service
  - Modify `src/lib/data-fetcher.ts` to import from `@/services/github-csv` instead of `@/services/google-sheets` for interview questions
  - Replace separate interview question fetches with single `getAllInterviewQuestions()` call
  - Update `HomePageData` interface to have single `interviewQuestions` array
  - Preserve `getJobs()` call to Google Sheets service
  - Update error handling to work with new data structure
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ]* 1.1 Write unit test for data fetcher consolidation
  - Test that `getHomePageData()` returns correct structure with `interviewQuestions` and `jobs`
  - Test that `interviewQuestions` is a single array, not multiple separate arrays
  - _Requirements: 2.3_

- [ ]* 1.2 Write unit test for error handling
  - Mock GitHub CSV service to throw error
  - Verify data fetcher returns empty array without throwing exception
  - _Requirements: 2.4_

- [ ] 2. Remove Google Sheets interview question functions
  - Open `src/services/google-sheets.ts`
  - Remove `getInterviewQuestions()` function and its implementation
  - Remove `getScenarioQuestions()` function and its implementation
  - Remove `getLiveQuestions()` function and its implementation
  - Remove `getCommunityQuestions()` function and its implementation
  - Preserve `getJobs()` function
  - Preserve `fetchCSV()` helper if used by `getJobs()`
  - Preserve `formatAnswerSection()` helper if used by `getJobs()`
  - Update file comments to indicate service is now Jobs-only
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 8.2_

- [ ]* 2.1 Write unit test for Jobs functionality preservation
  - Mock Google Sheets service
  - Call `getJobs()`
  - Verify jobs array is returned with correct Job structure
  - _Requirements: 1.5, 2.5_

- [ ] 3. Clean up environment configuration
  - Open `src/lib/env.ts`
  - Remove `SCENARIO_SHEET_URL` from schema and defaults
  - Remove `INTERVIEW_SHEET_URL` from schema and defaults
  - Remove `LIVE_SHEET_URL` from schema and defaults
  - Remove `COMMUNITY_SHEET_URL` from schema and defaults
  - Preserve `JOBS_SHEET_URL` in schema and defaults
  - Update `getSheetUrls()` to only return `jobs` property
  - Update validation function to not warn about missing interview sheet URLs
  - Add comments indicating which features use which environment variables
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 8.4_

- [ ]* 3.1 Write unit test for environment configuration
  - Call `getSheetUrls()`
  - Verify only `jobs` property exists in returned object
  - Verify environment validation doesn't produce warnings for missing interview sheet URLs
  - _Requirements: 3.5, 3.6, 3.7_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Run all unit tests and verify they pass
  - Run TypeScript type checking
  - Ask the user if questions arise

- [ ] 5. Evaluate and clean up static fallback data
  - Check if `src/data/questions.ts` is imported by any files (search codebase)
  - Check if `Question` type is used elsewhere in the codebase
  - If file is not referenced, delete `src/data/questions.ts`
  - If `Question` type is still needed, keep the file and add deprecation comment
  - If arrays are referenced, add comment: "Deprecated: GitHub CSV is the primary source for interview questions"
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 6. Remove unused imports across codebase
  - Search for imports of `getInterviewQuestions` from `@/services/google-sheets`
  - Search for imports of `getScenarioQuestions` from `@/services/google-sheets`
  - Search for imports of `getLiveQuestions` from `@/services/google-sheets`
  - Search for imports of `getCommunityQuestions` from `@/services/google-sheets`
  - Remove all found imports of these functions
  - Preserve any imports of `getJobs` from `@/services/google-sheets`
  - Update `Question` type imports if the type location changed
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 7. Update documentation and comments
  - Add/update comments in `src/services/github-csv.ts` indicating it's the primary data source for interview questions
  - Verify comments in `src/services/google-sheets.ts` indicate Jobs-only usage
  - Add comments in `src/lib/data-fetcher.ts` explaining data sources for each data type
  - _Requirements: 8.1, 8.2, 8.3_

- [ ]* 8. Write property test for interview question schema
  - **Property 1: Interview Question Schema Completeness**
  - Generate random InterviewQuestion objects using fast-check
  - Verify all required fields are present: company, year, contributor, role, experience, topic, question
  - Run with minimum 100 iterations
  - **Validates: Requirements 7.1**

- [ ]* 9. Write property test for displayed fields
  - **Property 2: Displayed Questions Include All Fields**
  - Generate random InterviewQuestion objects
  - Render using display component or formatting function
  - Verify rendered output contains all field values
  - Run with minimum 100 iterations
  - **Validates: Requirements 6.2**

- [ ]* 10. Write integration tests for interview questions page
  - Test that page loads successfully with mocked GitHub CSV data
  - Test that filter options are generated correctly
  - Test that CSV export produces valid output
  - Test that refresh functionality triggers new data fetch
  - Test that error states display appropriate messages
  - _Requirements: 6.1, 6.3, 6.4, 6.5, 6.6_

- [ ]* 11. Write integration test for UI compatibility
  - Render UI components with InterviewQuestion data
  - Verify no console errors or warnings
  - Verify homepage renders correctly with consolidated data structure
  - _Requirements: 7.3, 7.4_

- [ ] 12. Final checkpoint - Verify migration completeness
  - Run all tests (unit, property, integration)
  - Run TypeScript type checking
  - Run linter
  - Manually test interview questions page in browser
  - Manually test Jobs page to ensure it still works
  - Verify no console errors
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The GitHub CSV service is already implemented and working, so no changes needed there
- Focus is on removing legacy code and updating integration points
- Jobs functionality must remain unchanged throughout migration
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests ensure end-to-end functionality works correctly
