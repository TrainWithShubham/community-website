import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Project } from '@/features/projects/lib/types/project'
import { DifficultyBadge } from '@/features/projects/components/ui/difficulty-badge'
import { TechnologyTags } from '@/features/projects/components/ui/technology-tags'
import { Star, Clock } from 'lucide-react'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${encodeURIComponent(project.id)}`}>
      <Card
        className="h-full hover:shadow-lg transition-colors duration-200 cursor-pointer group border-secondary hover:border-primary"
        data-testid="project-card"
      >
        <CardHeader className="pb-4">
          {/* Featured indicator */}
          {project.featured && (
            <div className="absolute top-3 right-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
            </div>
          )}

          {/* Project Title */}
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {project.name}
          </h3>

          {/* Project Description */}
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {project.description}
          </p>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Difficulty Badge */}
          <div className="flex items-center justify-between">
            <DifficultyBadge difficulty={project.difficulty} size="sm" />
            {project.priority && (
              <div className="text-xs font-medium text-primary/70">
                #{project.priority}
              </div>
            )}
          </div>

          {/* Technology Tags */}
          <TechnologyTags
            technologies={project.technologies}
            maxTags={3}
            size="sm"
          />

          {/* Project Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-border/30 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {project.estimatedTime}
              </div>
              {project.stars > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {project.stars}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
