import { z } from 'zod'

export const DifficultySchema = z.enum(['beginner', 'intermediate', 'advanced'])
export const CategorySchema = z.enum([
  'Container',
  'Cloud',
  'CICD',
  'IaC',
  'Monitoring',
  'Security',
  'Database',
  'Programming',
])

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  difficulty: DifficultySchema,
  estimatedTime: z.string(),
  technologies: z.array(z.string()),
  category: CategorySchema,
  url: z.string().url(),
  lastUpdated: z.string(),
  stars: z.number(),
  forks: z.number(),
  featured: z.boolean().optional(),
  priority: z.number().optional(),
})

export const ProjectMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: DifficultySchema,
  estimatedTime: z.string(),
  technologies: z.array(z.string()),
  category: CategorySchema,
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
})

export const ProjectStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  commands: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
  expectedOutput: z.string().optional(),
})

export const ProjectProgressSchema = z.object({
  projectId: z.string(),
  userId: z.string().optional(),
  completedSteps: z.array(z.string()),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  status: z.enum(['not-started', 'in-progress', 'completed']),
})

export const FilterOptionsSchema = z.object({
  difficulty: z.array(DifficultySchema).optional(),
  category: z.array(CategorySchema).optional(),
  technologies: z.array(z.string()).optional(),
  estimatedTime: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
})

export const SearchQuerySchema = z.object({
  query: z.string().optional(),
  filters: FilterOptionsSchema.optional(),
  sortBy: z.enum(['title', 'difficulty', 'lastUpdated', 'stars']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
})

export type Difficulty = z.infer<typeof DifficultySchema>
export type Category = z.infer<typeof CategorySchema>
export type Project = z.infer<typeof ProjectSchema>
export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>
export type ProjectStep = z.infer<typeof ProjectStepSchema>
export type ProjectProgress = z.infer<typeof ProjectProgressSchema>
export type FilterOptions = z.infer<typeof FilterOptionsSchema>
export type SearchQuery = z.infer<typeof SearchQuerySchema>
