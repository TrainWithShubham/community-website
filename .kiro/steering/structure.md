# Project Structure

## Top-Level Organization

```
src/
  app/              # Next.js App Router (pages + API routes)
  components/       # Shared UI components
  features/         # Feature-specific modules
  lib/              # Core utilities and infrastructure
  services/         # External service wrappers
  contexts/         # React contexts
  hooks/            # Custom React hooks
  data/             # Static data files
  ai/               # Genkit AI flows
```

## App Router (`src/app/`)

- **Pages**: `page.tsx` files define routes
- **API Routes**: `route.ts` files in `api/` folders
- **Layouts**: `layout.tsx` for shared UI structure
- **Loading/Error**: `loading.tsx`, `error.tsx` for states

Key routes:
- `/` - Home page
- `/events` - Calendar events
- `/projects` - Project catalog
- `/projects/[id]` - Project detail
- `/interview-questions` - Q&A listing
- `/jobs` - Job board

## Components (`src/components/`)

- `ui/` - Shadcn components (buttons, cards, dialogs, etc.)
- `layout/` - Navbar, Footer, shared layout pieces
- Root level: Feature-specific shared components (terminal animations, theme toggle, etc.)

## Features (`src/features/`)

Feature-based organization for complex domains:

```
features/projects/
  components/
    pages/          # Page-level components
    ui/             # Feature-specific UI
  lib/
    hooks/          # Feature hooks
    services/       # Business logic
    types/          # TypeScript types/schemas
    utils.ts        # Feature utilities
```

## Libraries (`src/lib/`)

Core infrastructure:
- `cache.ts` - LRU caching
- `env.ts` - Environment variable validation
- `analytics.ts` - Tracking utilities
- `rate-limit.ts` - Rate limiting
- `monitoring.ts` - Performance monitoring
- `utils.ts` - Shared utilities (cn, date helpers)
- `firebase/` - Firebase configuration

## Services (`src/services/`)

External API wrappers:
- `google-sheets.ts` - Google Sheets integration
- `google-sheets-api.ts` - Sheets API client

## Conventions

- **Imports**: Use `@/` alias for src imports
- **Naming**: kebab-case for files, PascalCase for components
- **Types**: Zod schemas for runtime validation, export inferred types
- **Styling**: Tailwind classes, use `cn()` utility for conditional classes
- **Server/Client**: Mark client components with `'use client'` directive
- **Error Handling**: Use ErrorBoundary, handle errors intentionally
- **Accessibility**: Include ARIA labels, keyboard navigation, skip links
