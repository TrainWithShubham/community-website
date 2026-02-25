# Design Document: GitHub CSV Migration

## Overview

This design document outlines the technical approach for completing the migration from Google Sheets to GitHub CSV for the interview questions system. The GitHub CSV service is already implemented and actively used by the interview questions page. This migration focuses on removing legacy Google Sheets code, updating the data fetcher for the homepage, and cleaning up environment configuration while preserving the Jobs feature's Google Sheets integration.

### Current State

- **GitHub CSV Service**: Fully implemented at `src/services/github-csv.ts` with `getAllInterviewQuestions()` and `getFilterOptions()`
- **Interview Questions Page**: Already using GitHub CSV service (`src/app/interview-questions/page.tsx`)
- **Google Sheets Service**: Contains legacy interview question functions that are no longer used by the main page but may be used by the homepage data fetcher
- **Data Fetcher**: Currently imports and calls Google Sheets functions for homepage data
- **Environment Config**: Contains sheet URLs for interview questions that are no longer needed

### Migration Goals

1. Remove all Google Sheets interview question functions from `src/services/google-sheets.ts`
2. Update `src/lib/data-fetcher.ts` to use GitHub CSV service
3. Clean up environment variables in `src/lib/env.ts`
4. Remove or update static fallback data in `src/data/questions.ts`
5. Preserve Jobs integration with Google Sheets (out of scope for this migration)

## Architecture

### Service Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │ Interview Questions  │      │     Homepage         │    │
│  │       Page           │      │   (Data Fetcher)     │    │
│  └──────────┬───────────┘      └──────────┬───────────┘    │
└─────────────┼──────────────────────────────┼────────────────┘
              │                              │
              │                              │
┌─────────────┼──────────────────────────────┼────────────────┐
│             │      Service Layer           │                │
│             ▼                              ▼                │
│  ┌─────────────────────┐      ┌─────────────────────┐      │
│  │  GitHub CSV Service │      │ Google Sheets       │      │
│  │                     │      │ Service (Jobs only) │      │
│  │ - getAllInterview   │      │                     │      │
│  │   Questions()       │      │ - getJobs()         │      │
│  │ - getFilterOptions()│      │                     │      │
│  └─────────┬───────────┘      └─────────┬───────────┘      │
└────────────┼──────────────────────────────┼─────────────────┘
             │                              │
             ▼                              ▼
┌────────────────────────────────────────────────────────────┐
│                    External Data Sources                    │
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │ GitHub Repository│          │  Google Sheets   │        │
│  │  (CSV Files)     │          │   (Jobs Data)    │        │
│  └──────────────────┘          └──────────────────┘        │
└────────────────────────────────────────────────────────────┘
```

### Data Flow

**Before Migration (Current State for Homepage):**
```
Homepage → Data Fetcher → Google Sheets Service → Google Sheets API
```

**After Migration:**
```
Homepage → Data Fetcher → GitHub CSV Service → GitHub Raw Content
```

**Jobs Flow (Unchanged):**
```
Jobs Page → Google Sheets Service → Google Sheets API
```

## Components and Interfaces

### 1. GitHub CSV Service (`src/services/github-csv.ts`)

**Status**: Already implemented, no changes needed

**Interface**:
```typescript
interface InterviewQuestion {
  company: string;
  year: string;
  contributor: string;
  role: string;
  experience: string;
  topic: string;
  question: string;
}

// Fetch all interview questions from GitHub CSV
function getAllInterviewQuestions(): Promise<InterviewQuestion[]>

// Extract unique filter values from questions
function getFilterOptions(questions: InterviewQuestion[]): {
  companies: string[];
  years: string[];
  roles: string[];
  experiences: string[];
  topics: string[];
  contributors: string[];
}
```

**Implementation Details**:
- Fetches CSV from GitHub raw URL: `https://raw.githubusercontent.com/{owner}/{repo}/{branch}/devops/interview-questions.csv`
- Uses Papa Parse library for CSV parsing
- Includes 15-second timeout for requests
- Returns empty array on errors (graceful degradation)
- Supports future expansion to multiple CSV files (cloud, AWS, etc.)

### 2. Google Sheets Service (`src/services/google-sheets.ts`)

**Changes Required**: Remove interview question functions, keep Jobs functionality

**Functions to Remove**:
- `getInterviewQuestions()` - Standard interview questions
- `getScenarioQuestions()` - Scenario-based questions
- `getLiveQuestions()` - Live interview questions
- `getCommunityQuestions()` - Community contributed questions

**Functions to Preserve**:
- `getJobs()` - Job listings (used by Jobs page)
- `fetchCSV()` - Helper function for fetching CSV from Google Sheets (if used by getJobs)
- `formatAnswerSection()` - Helper function for formatting (if used by getJobs)

**Updated Interface**:
```typescript
// Only Jobs-related functionality remains
function getJobs(): Promise<Job[]>

// Helper functions (only if used by getJobs)
function fetchCSV(url: string): Promise<string>
```

### 3. Data Fetcher (`src/lib/data-fetcher.ts`)

**Changes Required**: Replace Google Sheets imports with GitHub CSV imports

**Current Implementation**:
```typescript
import { 
  getInterviewQuestions, 
  getScenarioQuestions, 
  getLiveQuestions, 
  getCommunityQuestions,
  getJobs,
} from '@/services/google-sheets';

// Fetches all question types separately
const [interviewQuestions, scenarioQuestions, liveQuestions, communityQuestions, jobs] = 
  await Promise.allSettled([...]);
```

**New Implementation**:
```typescript
import { getAllInterviewQuestions } from '@/services/github-csv';
import { getJobs } from '@/services/google-sheets';

// Fetch consolidated interview questions from GitHub CSV
const [allInterviewQuestions, jobs] = await Promise.allSettled([
  retryFetch(() => getAllInterviewQuestions()),
  retryFetch(() => getJobs()),
]);
```

**Updated Interface**:
```typescript
interface HomePageData {
  interviewQuestions: InterviewQuestion[]; // Consolidated from GitHub CSV
  jobs: Job[];
}

function getHomePageData(): Promise<HomePageData>
```

**Key Changes**:
- Consolidate all interview question types into single `interviewQuestions` array
- Remove separate fields for scenario, live, and community questions
- Simplify Promise.allSettled to only fetch two data sources
- Update return type to reflect new structure

### 4. Environment Configuration (`src/lib/env.ts`)

**Changes Required**: Remove interview question sheet URLs, keep Jobs URL

**Environment Variables to Remove**:
- `SCENARIO_SHEET_URL`
- `INTERVIEW_SHEET_URL`
- `LIVE_SHEET_URL`
- `COMMUNITY_SHEET_URL`

**Environment Variables to Preserve**:
- `JOBS_SHEET_URL`

**New GitHub CSV Environment Variables** (already exist):
- `NEXT_PUBLIC_INTERVIEW_REPO_OWNER` (default: 'TrainWithShubham')
- `NEXT_PUBLIC_INTERVIEW_REPO_NAME` (default: 'interview-questions')
- `NEXT_PUBLIC_INTERVIEW_REPO_BRANCH` (default: 'main')

**Updated Schema**:
```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Google Sheets - Jobs only
  JOBS_SHEET_URL: z.string().url().min(1).default(DEFAULT_JOBS_SHEET_URL),
  
  // GitHub CSV - Interview Questions (public, no auth needed)
  NEXT_PUBLIC_INTERVIEW_REPO_OWNER: z.string().default('TrainWithShubham'),
  NEXT_PUBLIC_INTERVIEW_REPO_NAME: z.string().default('interview-questions'),
  NEXT_PUBLIC_INTERVIEW_REPO_BRANCH: z.string().default('main'),
});

function getSheetUrls() {
  return {
    jobs: env.JOBS_SHEET_URL,
  };
}
```

### 5. Static Fallback Data (`src/data/questions.ts`)

**Changes Required**: Evaluate usage and remove or deprecate

**Current State**:
- Contains hardcoded `Question` type
- Contains `allQuestions` array with 4 sample questions
- Contains empty `communityQuestions` array
- Imported by `google-sheets.ts` for the `Question` type

**Decision Logic**:
1. Check if `Question` type is used elsewhere
2. Check if `allQuestions` or `communityQuestions` arrays are referenced
3. If only type is used, move type to a shared location or inline it
4. If arrays are not used, remove the entire file
5. If arrays are used, add deprecation comment

**Recommended Action**:
- The `Question` type from `src/data/questions.ts` has a different structure than `InterviewQuestion` from GitHub CSV
- `Question` has: `question`, `answer?`, `author?`
- `InterviewQuestion` has: `company`, `year`, `contributor`, `role`, `experience`, `topic`, `question`
- These are incompatible types for different purposes
- If `Question` type is still needed for other features, keep it
- If not, remove the file entirely

## Data Models

### InterviewQuestion (GitHub CSV)

```typescript
interface InterviewQuestion {
  company: string;      // Company where question was asked (e.g., "Google", "Amazon")
  year: string;         // Year question was asked (e.g., "2024", "2023")
  contributor: string;  // Person who contributed the question (e.g., "John Doe", "Anonymous")
  role: string;         // Job role (e.g., "DevOps Engineer", "SRE")
  experience: string;   // Experience level (e.g., "Junior", "Senior", "Mid-level")
  topic: string;        // Technical topic (e.g., "Docker", "Kubernetes", "CI/CD")
  question: string;     // The actual interview question text
}
```

**Validation Rules**:
- All fields are required (enforced by CSV parsing)
- Empty or missing values default to sensible fallbacks:
  - `company`: "Unknown"
  - `year`: "N/A"
  - `contributor`: "Anonymous"
  - `role`: "N/A"
  - `experience`: "N/A"
  - `topic`: "General"
  - `question`: Must not be empty (filtered out if empty)

### Question (Legacy Type)

```typescript
type Question = {
  question: string;
  answer?: string;
  author?: string;
};
```

**Usage**: 
- Used by Google Sheets service for formatted Q&A with answers
- Different structure from `InterviewQuestion`
- May be used by components that display questions with answers
- Should be evaluated for continued necessity

### Job (Unchanged)

```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  type: string;
  postedDate: string;
  applyLink: string;
}
```

**Note**: Jobs data model remains unchanged as it continues using Google Sheets.

### HomePageData (Updated)

**Before**:
```typescript
interface HomePageData {
  interviewQuestions: Question[];
  scenarioQuestions: Question[];
  liveQuestions: Question[];
  communityQuestions: Question[];
  jobs: Job[];
}
```

**After**:
```typescript
interface HomePageData {
  interviewQuestions: InterviewQuestion[];  // Consolidated from GitHub CSV
  jobs: Job[];
}
```

**Migration Impact**:
- Homepage components must be updated to handle consolidated interview questions
- Components expecting separate question types need refactoring
- Filter and display logic should work with `InterviewQuestion` structure


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all acceptance criteria, I identified the following testable properties and examples:

**Testable Items**:
- 1.5, 2.5: Jobs functionality preservation (can be combined)
- 2.3: Data structure consolidation
- 2.4: Error handling
- 3.5, 3.6, 3.7: Environment configuration (can be combined)
- 6.1, 6.3, 6.4, 6.5, 6.6: Interview questions page functionality (integration tests)
- 6.2: Field display (property)
- 7.1: Data schema validation (property)
- 7.3, 7.4: UI compatibility (integration tests)

**Redundancy Analysis**:
- Properties 1.5 and 2.5 both test that Jobs functionality is preserved - these can be combined into one comprehensive test
- Properties 3.5, 3.6, and 3.7 all test environment configuration - these can be combined into one test
- Properties 6.1, 6.3, 6.4, 6.5, 6.6 are all integration tests for the interview questions page - these can be grouped
- Properties 7.3 and 7.4 both test UI compatibility - these can be combined

**Final Properties**:
After reflection, we have 2 universal properties and several integration test examples.

### Universal Properties

**Property 1: Interview Question Schema Completeness**

*For any* interview question returned by `getAllInterviewQuestions()`, the question object must contain all required fields: company, year, contributor, role, experience, topic, and question.

**Validates: Requirements 7.1**

**Rationale**: This property ensures data integrity across all interview questions fetched from GitHub CSV. Every question must have the complete set of fields to support filtering, display, and export functionality.

**Property 2: Displayed Questions Include All Fields**

*For any* interview question displayed in the UI, the rendered output must include visible representations of all fields: company, year, role, experience, topic, question, and contributor.

**Validates: Requirements 6.2**

**Rationale**: This property ensures that the UI correctly displays all available information for each question, providing users with complete context for interview preparation.

### Integration Test Examples

The following are specific integration tests that validate the migration was successful:

**Example 1: Jobs Functionality Preserved**

Given the migration is complete, when the Jobs page loads, then it should successfully fetch and display job listings from Google Sheets.

**Validates: Requirements 1.5, 2.5**

**Example 2: Data Structure Consolidation**

Given the data fetcher is updated, when `getHomePageData()` is called, then it should return an object with `interviewQuestions` as a single array (not separate scenario/live/community arrays) and `jobs` as an array.

**Validates: Requirements 2.3**

**Example 3: Error Handling**

Given the GitHub CSV service is unavailable, when the data fetcher attempts to fetch interview questions, then it should return an empty array without throwing an error.

**Validates: Requirements 2.4**

**Example 4: Environment Configuration**

Given the environment configuration is updated, when `getSheetUrls()` is called, then it should return an object containing only the `jobs` property, and environment validation should not produce warnings about missing interview question sheet URLs.

**Validates: Requirements 3.5, 3.6, 3.7**

**Example 5: Interview Questions Page Loads**

Given the migration is complete, when a user navigates to `/interview-questions`, then the page should successfully load and display interview questions from GitHub CSV.

**Validates: Requirements 6.1**

**Example 6: Filter Options Generated**

Given interview questions are loaded, when `getFilterOptions()` is called with the questions array, then it should return an object with arrays for companies, years, roles, experiences, topics, and contributors.

**Validates: Requirements 6.3**

**Example 7: CSV Export Functionality**

Given interview questions are displayed, when the user triggers CSV export, then a valid CSV file should be downloaded with columns for all InterviewQuestion fields.

**Validates: Requirements 6.4**

**Example 8: Refresh Functionality**

Given the interview questions page is loaded, when the user triggers refresh, then the system should fetch fresh data from GitHub CSV.

**Validates: Requirements 6.5**

**Example 9: Error Display**

Given an error occurs during data fetching, when the interview questions page loads, then an appropriate error message should be displayed to the user.

**Validates: Requirements 6.6**

**Example 10: UI Component Compatibility**

Given the migration is complete, when UI components receive InterviewQuestion data, then they should render correctly without errors.

**Validates: Requirements 7.3, 7.4**

## Error Handling

### GitHub CSV Service Errors

**Timeout Errors**:
- 15-second timeout on all GitHub raw content requests
- On timeout: Log error, return empty array
- User impact: Page loads with no questions, shows "No questions available" message

**Network Errors**:
- HTTP errors (404, 500, etc.) from GitHub
- On error: Log error with status code, return empty array
- User impact: Graceful degradation, no crash

**Parse Errors**:
- Invalid CSV format or structure
- On error: Log parsing errors, filter out invalid rows, return valid rows only
- User impact: Partial data displayed if some rows are valid

### Data Fetcher Errors

**Promise.allSettled Pattern**:
- Use `Promise.allSettled()` to handle multiple data sources independently
- Each data source failure is isolated
- Return empty arrays for failed sources
- Log all failures for monitoring

**Retry Logic**:
- Exponential backoff retry (3 attempts, starting at 1 second delay)
- Applies to both GitHub CSV and Google Sheets calls
- On final failure: Return empty array, log error

### Environment Configuration Errors

**Missing Environment Variables**:
- GitHub CSV variables have sensible defaults (TrainWithShubham/interview-questions/main)
- Jobs sheet URL has hardcoded fallback
- On missing vars: Use defaults, log warning

**Invalid Environment Variables**:
- Zod schema validation catches invalid URLs or formats
- On validation failure: Use defaults, log error
- Build continues with fallback values

### UI Error Handling

**Empty Data States**:
- Display "No questions available" message
- Show refresh button to retry
- Provide link to GitHub repository for contributions

**Loading States**:
- Show skeleton loaders while fetching
- Timeout after 20 seconds, show error message

**Filter Errors**:
- If filter options are empty, disable filter UI
- Show message: "Filters unavailable, showing all questions"

## Testing Strategy

### Dual Testing Approach

This migration requires both unit tests and property-based tests to ensure correctness:

- **Unit tests**: Verify specific examples, edge cases, and integration points
- **Property tests**: Verify universal properties across all inputs
- Both are complementary and necessary for comprehensive coverage

### Property-Based Testing

**Library**: Use `fast-check` for TypeScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number

**Property Tests**:

1. **Property 1: Interview Question Schema Completeness**
   - Generate random InterviewQuestion objects
   - Verify all required fields are present and non-empty
   - Tag: `Feature: github-csv-migration, Property 1: Interview Question Schema Completeness`

2. **Property 2: Displayed Questions Include All Fields**
   - Generate random InterviewQuestion objects
   - Render using display component
   - Verify rendered output contains all field values
   - Tag: `Feature: github-csv-migration, Property 2: Displayed Questions Include All Fields`

### Unit Testing

**Focus Areas**:
- Specific examples of data transformation
- Edge cases (empty arrays, malformed data)
- Error conditions (network failures, timeouts)
- Integration points between components

**Unit Tests**:

1. **Jobs Functionality Preserved** (Example 1)
   - Mock Google Sheets service
   - Call getJobs()
   - Verify jobs array is returned with correct structure

2. **Data Structure Consolidation** (Example 2)
   - Call getHomePageData()
   - Verify return type has interviewQuestions and jobs properties
   - Verify interviewQuestions is a single array

3. **Error Handling** (Example 3)
   - Mock GitHub CSV service to throw error
   - Call getHomePageData()
   - Verify empty array is returned, no exception thrown

4. **Environment Configuration** (Example 4)
   - Call getSheetUrls()
   - Verify only jobs property exists
   - Verify no warnings for missing interview sheet URLs

5. **Interview Questions Page Loads** (Example 5)
   - Render interview questions page component
   - Mock getAllInterviewQuestions() to return sample data
   - Verify page renders without errors

6. **Filter Options Generated** (Example 6)
   - Create sample InterviewQuestion array
   - Call getFilterOptions()
   - Verify all filter categories are present

7. **CSV Export Functionality** (Example 7)
   - Trigger CSV export with sample data
   - Verify CSV contains correct headers and data

8. **Refresh Functionality** (Example 8)
   - Mock getAllInterviewQuestions()
   - Trigger refresh
   - Verify function is called again

9. **Error Display** (Example 9)
   - Mock getAllInterviewQuestions() to throw error
   - Render page
   - Verify error message is displayed

10. **UI Component Compatibility** (Example 10)
    - Render UI components with InterviewQuestion data
    - Verify no console errors or warnings

### Testing Balance

- Avoid writing too many unit tests for scenarios covered by property tests
- Property tests handle comprehensive input coverage through randomization
- Unit tests focus on:
  - Specific examples that demonstrate correct behavior
  - Integration points between services and components
  - Edge cases and error conditions
  - UI rendering and user interactions

### Test Organization

```
tests/
  unit/
    services/
      github-csv.test.ts          # Unit tests for GitHub CSV service
      google-sheets.test.ts       # Unit tests for Jobs functionality
    lib/
      data-fetcher.test.ts        # Unit tests for data fetcher
      env.test.ts                 # Unit tests for environment config
    components/
      interview-questions.test.ts # UI component tests
  
  property/
    interview-questions.property.test.ts  # Property-based tests
```

### Continuous Integration

- Run all tests on every commit
- Fail build if any test fails
- Generate coverage reports (target: >80% coverage)
- Run property tests with 100 iterations in CI, 1000 in nightly builds
