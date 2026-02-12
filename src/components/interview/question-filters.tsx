'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface FilterState {
  company: string;
  year: string;
  role: string;
  experience: string;
  topic: string;
  contributor: string;
}

interface QuestionFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  filterOptions: {
    companies: string[];
    years: string[];
    roles: string[];
    experiences: string[];
    topics: string[];
    contributors: string[];
  };
}

export function QuestionFilters({ filters, onFilterChange, filterOptions }: QuestionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value === 'all' ? '' : value,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      company: '',
      year: '',
      role: '',
      experience: '',
      topic: '',
      contributor: '',
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border">
          {/* Company Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Company</label>
            <Select value={filters.company || 'all'} onValueChange={(v) => handleFilterChange('company', v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {filterOptions.companies.map(company => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Year</label>
            <Select value={filters.year || 'all'} onValueChange={(v) => handleFilterChange('year', v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {filterOptions.years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Experience Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Experience</label>
            <Select value={filters.experience || 'all'} onValueChange={(v) => handleFilterChange('experience', v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {filterOptions.experiences.map(exp => (
                  <SelectItem key={exp} value={exp}>
                    {exp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <Select value={filters.role || 'all'} onValueChange={(v) => handleFilterChange('role', v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {filterOptions.roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Topic</label>
            <Select value={filters.topic || 'all'} onValueChange={(v) => handleFilterChange('topic', v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {filterOptions.topics.map(topic => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contributor Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Contributor</label>
            <Select value={filters.contributor || 'all'} onValueChange={(v) => handleFilterChange('contributor', v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Contributors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contributors</SelectItem>
                {filterOptions.contributors.map(contributor => (
                  <SelectItem key={contributor} value={contributor}>
                    {contributor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.company && (
            <Badge variant="secondary" className="gap-1">
              Company: {filters.company}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('company', '')}
              />
            </Badge>
          )}
          {filters.year && (
            <Badge variant="secondary" className="gap-1">
              Year: {filters.year}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('year', '')}
              />
            </Badge>
          )}
          {filters.experience && (
            <Badge variant="secondary" className="gap-1">
              Experience: {filters.experience}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('experience', '')}
              />
            </Badge>
          )}
          {filters.role && (
            <Badge variant="secondary" className="gap-1">
              Role: {filters.role}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('role', '')}
              />
            </Badge>
          )}
          {filters.topic && (
            <Badge variant="secondary" className="gap-1">
              Topic: {filters.topic}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('topic', '')}
              />
            </Badge>
          )}
          {filters.contributor && (
            <Badge variant="secondary" className="gap-1">
              Contributor: {filters.contributor}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('contributor', '')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
