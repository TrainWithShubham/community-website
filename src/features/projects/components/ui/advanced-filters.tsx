'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface AdvancedFiltersProps {
  availableFilters: {
    difficulties: string[]
    categories: string[]
    technologies: string[]
  }
  selectedFilters: {
    difficulties: string[]
    categories: string[]
    technologies: string[]
  }
  onFiltersChange: (filters: {
    difficulties: string[]
    categories: string[]
    technologies: string[]
  }) => void
  onReset: () => void
}

export function AdvancedFilters({
  availableFilters,
  selectedFilters,
  onFiltersChange,
  onReset,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleFilter = (type: keyof typeof selectedFilters, value: string) => {
    const current = selectedFilters[type]
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]

    onFiltersChange({
      ...selectedFilters,
      [type]: updated,
    })
  }

  const hasActiveFilters = Object.values(selectedFilters).some(
    (arr) => arr.length > 0
  )
  const totalActiveFilters = Object.values(selectedFilters).reduce(
    (sum, arr) => sum + arr.length,
    0
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {totalActiveFilters} active
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Difficulty Filters */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Difficulty Level</h4>
          <div className="flex flex-wrap gap-2">
            {availableFilters.difficulties.map((difficulty) => (
              <Badge
                key={difficulty}
                variant={
                  selectedFilters.difficulties.includes(difficulty)
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer hover:bg-primary/80 text-xs"
                onClick={() => toggleFilter('difficulties', difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Category Filters */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {availableFilters.categories.map((category) => (
              <Badge
                key={category}
                variant={
                  selectedFilters.categories.includes(category)
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer hover:bg-primary/80 text-xs"
                onClick={() => toggleFilter('categories', category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Technology Filters - Expandable */}
        {isExpanded && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Technologies</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableFilters.technologies.slice(0, 20).map((tech) => (
                  <Badge
                    key={tech}
                    variant={
                      selectedFilters.technologies.includes(tech)
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer hover:bg-primary/80 text-xs"
                    onClick={() => toggleFilter('technologies', tech)}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              {availableFilters.technologies.length > 20 && (
                <p className="text-xs text-muted-foreground">
                  Showing top 20 technologies
                </p>
              )}
            </div>
          </>
        )}

        {/* Reset Button */}
        {hasActiveFilters && (
          <>
            <Separator className="my-4" />
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
