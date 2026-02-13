# Requirements Document

## Introduction

This document specifies the requirements for completing the migration of the interview questions system from Google Sheets to GitHub CSV repository integration. The GitHub CSV service is already partially implemented, and this migration will remove all remaining Google Sheets dependencies for interview questions while preserving the Jobs feature's Google Sheets integration.

## Glossary

- **GitHub_CSV_Service**: The service module (`src/services/github-csv.ts`) that fetches interview questions from GitHub repository CSV files
- **Google_Sheets_Service**: The legacy service module (`src/services/google-sheets.ts`) that fetches data from Google Sheets
- **Interview_Questions**: DevOps, Cloud, and DevSecOps interview questions including standard questions, scenario-based questions, live questions, and community-contributed questions
- **Data_Fetcher**: The module (`src/lib/data-fetcher.ts`) that aggregates data for the homepage
- **Static_Fallback_Data**: The hardcoded question data in `src/data/questions.ts` used as a fallback
- **Jobs_Integration**: The job board feature that uses Google Sheets and must remain unchanged

## Requirements

### Requirement 1: Remove Google Sheets Interview Question Functions

**User Story:** As a developer, I want to remove all Google Sheets functions related to interview questions, so that the codebase only uses GitHub CSV as the data source.

#### Acceptance Criteria

1. WHEN the Google_Sheets_Service is modified, THE System SHALL remove the `getInterviewQuestions()` function
2. WHEN the Google_Sheets_Service is modified, THE System SHALL remove the `getScenarioQuestions()` function
3. WHEN the Google_Sheets_Service is modified, THE System SHALL remove the `getLiveQuestions()` function
4. WHEN the Google_Sheets_Service is modified, THE System SHALL remove the `getCommunityQuestions()` function
5. WHEN the Google_Sheets_Service is modified, THE System SHALL preserve the `getJobs()` function and its dependencies
6. WHEN the Google_Sheets_Service is modified, THE System SHALL preserve the `fetchCSV()` helper function if used by `getJobs()`
7. WHEN the Google_Sheets_Service is modified, THE System SHALL preserve the `formatAnswerSection()` helper function if used by `getJobs()`

### Requirement 2: Update Data Fetcher to Use GitHub CSV

**User Story:** As a developer, I want the Data_Fetcher to use GitHub_CSV_Service instead of Google_Sheets_Service for interview questions, so that the homepage displays data from the correct source.

#### Acceptance Criteria

1. WHEN the Data_Fetcher imports are updated, THE System SHALL import from `@/services/github-csv` instead of `@/services/google-sheets` for interview question functions
2. WHEN the Data_Fetcher fetches interview questions, THE System SHALL call `getAllInterviewQuestions()` from GitHub_CSV_Service
3. WHEN the Data_Fetcher returns homepage data, THE System SHALL consolidate all interview question types into a single array from GitHub CSV
4. WHEN the Data_Fetcher encounters errors, THE System SHALL handle GitHub CSV fetch failures gracefully and return empty arrays
5. WHEN the Data_Fetcher is modified, THE System SHALL preserve the `getJobs()` call to Google_Sheets_Service

### Requirement 3: Clean Up Environment Configuration

**User Story:** As a developer, I want to remove unused Google Sheets environment variables for interview questions, so that the configuration only includes necessary variables.

#### Acceptance Criteria

1. WHEN the environment configuration is updated, THE System SHALL remove `SCENARIO_SHEET_URL` from the schema and defaults
2. WHEN the environment configuration is updated, THE System SHALL remove `INTERVIEW_SHEET_URL` from the schema and defaults
3. WHEN the environment configuration is updated, THE System SHALL remove `LIVE_SHEET_URL` from the schema and defaults
4. WHEN the environment configuration is updated, THE System SHALL remove `COMMUNITY_SHEET_URL` from the schema and defaults
5. WHEN the environment configuration is updated, THE System SHALL preserve `JOBS_SHEET_URL` in the schema and defaults
6. WHEN the `getSheetUrls()` helper is updated, THE System SHALL only return the jobs URL
7. WHEN environment validation runs, THE System SHALL not warn about missing interview question sheet URLs

### Requirement 4: Update or Remove Static Fallback Data

**User Story:** As a developer, I want to update the static fallback data to reflect the new data source, so that the codebase is consistent and maintainable.

#### Acceptance Criteria

1. WHEN the static fallback data is evaluated, THE System SHALL determine if `src/data/questions.ts` is still referenced by any active code
2. IF the static fallback data is not referenced, THEN THE System SHALL remove the `src/data/questions.ts` file
3. IF the static fallback data is still referenced, THEN THE System SHALL add a comment indicating it is deprecated and GitHub CSV is the primary source
4. WHEN the `Question` type is evaluated, THE System SHALL determine if it needs to be preserved or can be removed
5. IF the `Question` type is still needed, THEN THE System SHALL keep it in a shared types location

### Requirement 5: Remove Unused Imports and Dependencies

**User Story:** As a developer, I want to remove all unused imports related to Google Sheets interview questions, so that the codebase is clean and maintainable.

#### Acceptance Criteria

1. WHEN files are scanned for imports, THE System SHALL identify all imports of Google_Sheets_Service interview question functions
2. WHEN unused imports are found, THE System SHALL remove imports of `getInterviewQuestions`, `getScenarioQuestions`, `getLiveQuestions`, and `getCommunityQuestions` from all files
3. WHEN unused imports are found, THE System SHALL preserve imports of `getJobs` from Google_Sheets_Service
4. WHEN the `Question` type import is evaluated, THE System SHALL update import paths if the type location changes

### Requirement 6: Preserve Existing GitHub CSV Functionality

**User Story:** As a user, I want the interview questions page to continue working exactly as it does now, so that the migration is transparent to end users.

#### Acceptance Criteria

1. WHEN the interview questions page loads, THE System SHALL fetch data using `getAllInterviewQuestions()` from GitHub_CSV_Service
2. WHEN interview questions are displayed, THE System SHALL show all fields: company, year, role, experience, topic, question, and contributor
3. WHEN filters are applied, THE System SHALL use `getFilterOptions()` to provide filter values
4. WHEN the CSV export is triggered, THE System SHALL export data in the same format as before
5. WHEN the refresh functionality is used, THE System SHALL refetch data from GitHub CSV
6. WHEN errors occur during data fetching, THE System SHALL display appropriate error messages to users

### Requirement 7: Maintain Data Schema Compatibility

**User Story:** As a developer, I want to ensure the data schema remains consistent, so that no breaking changes are introduced.

#### Acceptance Criteria

1. WHEN interview questions are fetched from GitHub CSV, THE System SHALL return objects with the `InterviewQuestion` interface structure
2. WHEN the `InterviewQuestion` interface is defined, THE System SHALL include fields: company, year, contributor, role, experience, topic, and question
3. WHEN data is transformed for display, THE System SHALL maintain compatibility with existing UI components
4. WHEN the homepage displays interview questions, THE System SHALL handle the consolidated question array format

### Requirement 8: Update Documentation and Comments

**User Story:** As a developer, I want clear documentation about the data source, so that future maintainers understand the system architecture.

#### Acceptance Criteria

1. WHEN the GitHub_CSV_Service is reviewed, THE System SHALL ensure comments clearly indicate it is the primary data source for interview questions
2. WHEN the Google_Sheets_Service is reviewed, THE System SHALL ensure comments indicate it is only used for Jobs
3. WHEN the Data_Fetcher is reviewed, THE System SHALL include comments explaining the data source for each data type
4. WHEN environment variables are reviewed, THE System SHALL include comments indicating which features use which variables
