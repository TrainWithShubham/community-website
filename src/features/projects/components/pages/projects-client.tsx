'use client'

import { Project } from '@/features/projects/lib/types/project'
import { ProjectCard } from '@/features/projects/components/ui/project-card'
import { InteractiveSearch } from '@/features/projects/components/ui/interactive-search'
import { AdvancedFilters } from '@/features/projects/components/ui/advanced-filters'
import { SortControls } from '@/features/projects/components/ui/sort-controls'
import { ProjectGridSkeleton } from '@/features/projects/components/ui/project-skeleton'
import { useAdvancedSearch } from '@/features/projects/lib/hooks/use-advanced-search'

interface ProjectsClientProps {
  projects: Project[]
  initialQuery?: string
  initialFilters?: {
    difficulty?: string
    category?: string
  }
}

export function ProjectsClient({
  projects,
  initialQuery,
  initialFilters,
}: ProjectsClientProps) {
  const {
    query,
    setQuery,
    selectedFilters,
    setSelectedFilters,
    results,
    isLoading,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
    resetAll,
    availableFilters,
    totalResults,
  } = useAdvancedSearch({ projects, initialQuery, initialFilters })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1">
        <AdvancedFilters
          availableFilters={availableFilters}
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
          onReset={resetFilters}
        />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Search Bar */}
        <div className="mb-6">
          <InteractiveSearch
            query={query}
            setQuery={setQuery}
            difficulty={selectedFilters.difficulties[0] || ''}
            setDifficulty={(diff) =>
              setSelectedFilters((prev) => ({
                ...prev,
                difficulties: diff ? [diff] : [],
              }))
            }
            category={selectedFilters.categories[0] || ''}
            setCategory={(cat) =>
              setSelectedFilters((prev) => ({
                ...prev,
                categories: cat ? [cat] : [],
              }))
            }
            availableFilters={availableFilters}
            totalResults={totalResults}
            isLoading={isLoading}
            onReset={resetAll}
          />
        </div>

        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            {totalResults} project{totalResults !== 1 ? 's' : ''} found
          </div>
          <SortControls
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <ProjectGridSkeleton count={6} />
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {results.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground text-sm md:text-base mb-4">
              {query ||
              Object.values(selectedFilters).some((arr) => arr.length > 0)
                ? 'Try adjusting your search criteria or browse all projects.'
                : 'No projects are currently available.'}
            </p>
            {(query ||
              Object.values(selectedFilters).some((arr) => arr.length > 0)) && (
              <button
                onClick={resetAll}
                className="text-primary hover:underline font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
