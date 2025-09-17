'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Project, SearchQuery } from '@/features/projects/lib/types/project'
import { searchService } from '@/features/projects/lib/services/search'
// Type guard functions defined inline
const isValidDifficultyArray = (arr: string[]): arr is ('beginner' | 'intermediate' | 'advanced')[] => {
  return arr.every(item => ['beginner', 'intermediate', 'advanced'].includes(item))
}

const isValidCategoryArray = (arr: string[]): arr is ('Container' | 'Cloud' | 'CICD' | 'IaC' | 'Monitoring' | 'Security' | 'Database' | 'Programming')[] => {
  return arr.every(item => ['Container', 'Cloud', 'CICD', 'IaC', 'Monitoring', 'Security', 'Database', 'Programming'].includes(item))
}

interface UseAdvancedSearchProps {
  projects: Project[]
  initialQuery?: string
  initialFilters?: {
    difficulty?: string
    category?: string
  }
}

export function useAdvancedSearch({
  projects,
  initialQuery = '',
  initialFilters = {},
}: UseAdvancedSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [selectedFilters, setSelectedFilters] = useState({
    difficulties: initialFilters.difficulty
      ? [initialFilters.difficulty]
      : ([] as string[]),
    categories: initialFilters.category
      ? [initialFilters.category]
      : ([] as string[]),
    technologies: [] as string[],
  })
  const [results, setResults] = useState<Project[]>(projects)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<
    'title' | 'difficulty' | 'lastUpdated' | 'stars'
  >('title')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [debouncedQuery] = useDebounce(query, 300)

  useEffect(() => {
    searchService.setProjects(projects)
  }, [projects])

  useEffect(() => {
    setIsLoading(true)

    const searchQuery: SearchQuery = {
      query: debouncedQuery,
      filters: {
        difficulty:
          selectedFilters.difficulties.length > 0 &&
          isValidDifficultyArray(selectedFilters.difficulties)
            ? (selectedFilters.difficulties as ('beginner' | 'intermediate' | 'advanced')[])
            : undefined,
        category:
          selectedFilters.categories.length > 0 &&
          isValidCategoryArray(selectedFilters.categories)
            ? (selectedFilters.categories as ('Container' | 'Cloud' | 'CICD' | 'IaC' | 'Monitoring' | 'Security' | 'Database' | 'Programming')[])
            : undefined,
        technologies:
          selectedFilters.technologies.length > 0
            ? selectedFilters.technologies
            : undefined,
      },
      sortBy,
      sortOrder,
    }

    const searchResults = searchService.search(searchQuery)
    setResults(searchResults)
    setIsLoading(false)
  }, [debouncedQuery, selectedFilters, sortBy, sortOrder])

  const resetFilters = () => {
    setSelectedFilters({
      difficulties: [],
      categories: [],
      technologies: [],
    })
  }

  const resetAll = () => {
    setQuery('')
    resetFilters()
  }

  const availableFilters = searchService.getAvailableFilters(projects)

  return {
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
    totalResults: results.length,
  }
}
