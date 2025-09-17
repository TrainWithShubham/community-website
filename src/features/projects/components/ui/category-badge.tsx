import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export function CategoryBadge({
  category,
  size = 'md',
  className,
  onClick,
}: CategoryBadgeProps) {
  // Define category data directly
  const getCategoryData = (cat: string) => {
    const categories = {
      'Container': { name: 'Container Technologies', color: '#2496ED', textColor: '#FFFFFF', icon: '🐳' },
      'Cloud': { name: 'Cloud Platforms', color: '#FF9900', textColor: '#000000', icon: '☁️' },
      'CICD': { name: 'CI/CD', color: '#22C55E', textColor: '#000000', icon: '🔄' },
      'IaC': { name: 'Infrastructure as Code', color: '#8B5CF6', textColor: '#FFFFFF', icon: '🏗️' },
      'Monitoring': { name: 'Monitoring & Observability', color: '#F59E0B', textColor: '#000000', icon: '📊' },
      'Security': { name: 'Security & Compliance', color: '#EF4444', textColor: '#FFFFFF', icon: '🔒' },
      'Database': { name: 'Database & Storage', color: '#06B6D4', textColor: '#000000', icon: '🗄️' },
      'Programming': { name: 'Programming & Development', color: '#6366F1', textColor: '#FFFFFF', icon: '💻' },
    }
    
    return categories[cat as keyof typeof categories] || {
      name: cat,
      color: '#6B7280',
      textColor: '#FFFFFF',
      icon: '📁'
    }
  }

  const categoryData = getCategoryData(category)

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-medium transition-all',
        sizeClasses[size],
        onClick && 'cursor-pointer hover:scale-105',
        className
      )}
      style={{
        backgroundColor: categoryData.color,
        color: categoryData.textColor,
      }}
      onClick={onClick}
    >
      <span className="text-xs opacity-70">{categoryData.icon}</span>
      {categoryData.name}
    </span>
  )
}
