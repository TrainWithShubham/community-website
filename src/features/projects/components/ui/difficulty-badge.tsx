import { cn } from '@/lib/utils'

interface DifficultyBadgeProps {
  difficulty: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DifficultyBadge({
  difficulty,
  size = 'md',
  className,
}: DifficultyBadgeProps) {
  // Define difficulty colors directly
  const getDifficultyColors = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return { bg: '#22C55E', text: '#000000' }
      case 'intermediate':
        return { bg: '#F59E0B', text: '#000000' }
      case 'advanced':
        return { bg: '#EF4444', text: '#FFFFFF' }
      default:
        return { bg: '#6B7280', text: '#FFFFFF' }
    }
  }
  
  const colors = getDifficultyColors(difficulty)

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }

  const difficultyIcons = {
    beginner: '🟢',
    intermediate: '🟡',
    advanced: '🔴',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-medium capitalize border border-transparent',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.text + '20',
      }}
    >
      <span className="text-xs opacity-70">
        {difficultyIcons[difficulty as keyof typeof difficultyIcons] || '⚪'}
      </span>
      {difficulty}
    </span>
  )
}
