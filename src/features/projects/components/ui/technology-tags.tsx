import { cn } from '@/lib/utils'

interface TechnologyTagsProps {
  technologies: string[]
  maxTags?: number
  size?: 'sm' | 'md'
  className?: string
}

export function TechnologyTags({
  technologies,
  maxTags = 5,
  size = 'sm',
  className,
}: TechnologyTagsProps) {
  const displayTags = technologies.slice(0, maxTags)
  const remainingCount = technologies.length - maxTags

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  // Simple technology color mapping
  const getTechnologyColor = (tech: string) => {
    const colors = [
      { bg: '#3B82F6', text: '#FFFFFF' }, // Blue
      { bg: '#10B981', text: '#FFFFFF' }, // Green
      { bg: '#F59E0B', text: '#000000' }, // Yellow
      { bg: '#EF4444', text: '#FFFFFF' }, // Red
      { bg: '#8B5CF6', text: '#FFFFFF' }, // Purple
      { bg: '#06B6D4', text: '#FFFFFF' }, // Cyan
      { bg: '#84CC16', text: '#000000' }, // Lime
      { bg: '#F97316', text: '#FFFFFF' }, // Orange
    ]
    
    // Use hash of tech name to get consistent color
    const hash = tech.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {displayTags.map((tech) => {
        const colors = getTechnologyColor(tech)

        return (
          <span
            key={tech}
            className={cn(
              'inline-flex items-center gap-1 rounded-md font-medium border border-transparent',
              sizeClasses[size]
            )}
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              borderColor: colors.text + '20',
            }}
          >
            {tech}
          </span>
        )
      })}
      {remainingCount > 0 && (
        <span
          className={cn(
            'inline-flex items-center rounded-md font-medium bg-gray-50 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
            sizeClasses[size]
          )}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  )
}
