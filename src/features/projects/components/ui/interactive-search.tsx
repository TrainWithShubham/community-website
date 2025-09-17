'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface InteractiveSearchProps {
  query: string
  setQuery: (query: string) => void
  difficulty: string
  setDifficulty: (difficulty: string) => void
  category: string
  setCategory: (category: string) => void
  availableFilters: {
    difficulties: string[]
    categories: string[]
  }
  totalResults: number
  isLoading: boolean
  onReset: () => void
}

export function InteractiveSearch({
  query,
  setQuery,
  difficulty,
  setDifficulty,
  category,
  setCategory,
  availableFilters,
  totalResults,
  isLoading,
  onReset,
}: InteractiveSearchProps) {
  const hasActiveFilters = query || difficulty || category

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="Search projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pr-10"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {availableFilters.difficulties.map((diff) => (
                  <SelectItem key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableFilters.categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {totalResults} result{totalResults !== 1 ? 's' : ''}
              </Badge>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={onReset}>
                  Clear filters
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {query && (
                  <Badge variant="outline" className="text-xs">
                    Search: &quot;{query}&quot;
                  </Badge>
                )}
                {difficulty && difficulty !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    Level: {difficulty}
                  </Badge>
                )}
                {category && category !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    Category: {category}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
