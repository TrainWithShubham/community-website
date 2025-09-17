'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface SortControlsProps {
  sortBy: 'title' | 'difficulty' | 'lastUpdated' | 'stars'
  setSortBy: (sortBy: 'title' | 'difficulty' | 'lastUpdated' | 'stars') => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (sortOrder: 'asc' | 'desc') => void
}

export function SortControls({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: SortControlsProps) {
  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'lastUpdated', label: 'Last Updated' },
    { value: 'stars', label: 'Popularity' },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="px-3"
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </Button>
    </div>
  )
}
