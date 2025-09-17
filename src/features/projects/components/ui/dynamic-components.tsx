import dynamic from 'next/dynamic'
import { ProjectGridSkeleton } from '@/features/projects/components/ui/project-skeleton'

// Dynamically import heavy components without ssr: false
export const DynamicAdvancedFilters = dynamic(
  () =>
    import('@/features/projects/components/ui/advanced-filters').then((mod) => ({
      default: mod.AdvancedFilters,
    })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
            <div className="h-6 w-14 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    ),
  }
)

export const DynamicProjectsClient = dynamic(
  () =>
    import('@/features/projects/components/pages/projects-client').then((mod) => ({
      default: mod.ProjectsClient,
    })),
  {
    loading: () => <ProjectGridSkeleton count={8} />,
  }
)

export const DynamicInteractiveSearch = dynamic(
  () =>
    import('@/features/projects/components/ui/interactive-search').then((mod) => ({
      default: mod.InteractiveSearch,
    })),
  {
    loading: () => (
      <div className="p-6 space-y-4">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
      </div>
    ),
  }
)
