import { Project, SearchQuery, FilterOptions } from '@/features/projects/lib/types/project'

export class SearchService {
  private projects: Project[] = []

  setProjects(projects: Project[]) {
    this.projects = projects
  }

  search(searchQuery: SearchQuery): Project[] {
    let results = [...this.projects]

    // Text search
    if (searchQuery.query?.trim()) {
      results = this.filterByText(results, searchQuery.query)
    }

    // Apply filters
    if (searchQuery.filters) {
      results = this.applyFilters(results, searchQuery.filters)
    }

    // Sort results
    if (searchQuery.sortBy) {
      results = this.sortResults(
        results,
        searchQuery.sortBy,
        searchQuery.sortOrder || 'asc'
      )
    }

    // Pagination
    if (searchQuery.page && searchQuery.limit) {
      const start = (searchQuery.page - 1) * searchQuery.limit
      const end = start + searchQuery.limit
      results = results.slice(start, end)
    }

    return results
  }

  private filterByText(projects: Project[], query: string): Project[] {
    const searchTerm = query.toLowerCase()

    return projects.filter(
      (project) =>
        (project.name || '').toLowerCase().includes(searchTerm) ||
        (project.description || '').toLowerCase().includes(searchTerm) ||
        (project.technologies || []).some((tech) =>
          tech.toLowerCase().includes(searchTerm)
        ) ||
        (project.category || '').toLowerCase().includes(searchTerm)
    )
  }

  private applyFilters(projects: Project[], filters: FilterOptions): Project[] {
    let results = projects

    if (filters.difficulty?.length) {
      results = results.filter((p) =>
        filters.difficulty!.includes(p.difficulty)
      )
    }

    if (filters.category?.length) {
      results = results.filter((p) => filters.category!.includes(p.category))
    }

    if (filters.technologies?.length) {
      results = results.filter((p) =>
        filters.technologies!.some((tech) =>
          p.technologies.some((pTech) =>
            pTech.toLowerCase().includes(tech.toLowerCase())
          )
        )
      )
    }

    if (filters.estimatedTime) {
      results = results.filter((p) => {
        const hours = this.parseEstimatedTime(p.estimatedTime)
        const min = filters.estimatedTime!.min
        const max = filters.estimatedTime!.max

        return (!min || hours >= min) && (!max || hours <= max)
      })
    }

    return results
  }

  private sortResults(
    projects: Project[],
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Project[] {
    return projects.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = (a.name || '').localeCompare(b.name || '')
          break
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
          comparison =
            (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0)
          break
        case 'lastUpdated':
          comparison =
            new Date(a.lastUpdated || 0).getTime() -
            new Date(b.lastUpdated || 0).getTime()
          break
        case 'stars':
          comparison = (a.stars || 0) - (b.stars || 0)
          break
        default:
          return 0
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })
  }

  private parseEstimatedTime(timeStr: string): number {
    const match = timeStr.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  getAvailableFilters(projects: Project[] = this.projects) {
    const difficultySet = new Set(projects.map((p) => p.difficulty))
    const categorySet = new Set(projects.map((p) => p.category))
    const technologySet = new Set(projects.flatMap((p) => p.technologies))

    return {
      difficulties: Array.from(difficultySet),
      categories: Array.from(categorySet),
      technologies: Array.from(technologySet),
    }
  }
}

export const searchService = new SearchService()
