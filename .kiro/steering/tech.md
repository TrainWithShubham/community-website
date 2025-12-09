# Tech Stack

## Framework & Runtime

- **Next.js 15** (App Router) with React 18
- **TypeScript 5** (strict mode enabled)
- **Node.js** (ES2017 target)

## UI & Styling

- **Tailwind CSS** with custom design tokens (HSL-based color system)
- **Shadcn/ui** components (Radix UI primitives)
- **Lucide React** for icons
- **next-themes** for dark mode
- Monospace font: Source Code Pro

## State & Data

- **SWR** for client-side data fetching
- **React Hook Form** + Zod for forms and validation
- **LRU Cache** for server-side caching
- **Firebase** for authentication

## External Services

- **Google Sheets API** (data source)
- **Google Calendar API** (events)
- **GitHub API** (Octokit for project metadata)
- **Genkit** (Google AI integration)

## Dev Tools

- **Turbopack** for fast dev builds
- **Husky** + **Commitizen** for commit conventions
- **Commitlint** for enforcing Conventional Commits
- **tsx** for running TypeScript scripts

## Common Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint check
npm run typecheck        # TypeScript validation

# Commits
npm run commit           # Interactive Commitizen prompt
npm run lint:commits     # Validate commit messages

# AI/Genkit
npm run genkit:dev       # Start Genkit dev UI
npm run genkit:watch     # Genkit with auto-reload

# Utilities
npm run env:check        # Validate environment variables
npm run test:sheets      # Test Google Sheets connection
```

## Build Configuration

- Path alias: `@/*` maps to `./src/*`
- Bundle splitting: vendors, UI components separated
- Image optimization: WebP/AVIF formats
- Security headers configured in next.config.ts
- Server-side packages: Genkit, Google AI externalized
