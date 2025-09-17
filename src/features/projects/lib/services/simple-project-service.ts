import { Project } from '@/features/projects/lib/types/project'
import { readFileSync } from 'fs'
import { join } from 'path'

interface SimpleProjectData {
  id: string
  name: string
  url: string
  category: string
  difficulty: string
  estimatedTime: string
  featured: boolean
}

interface ProjectsConfig {
  version: string
  lastUpdated: string
  projects: SimpleProjectData[]
}

interface GitHubRepoData {
  description: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  language: string | null
  topics: string[]
}

class SimpleProjectService {
  private projectsCache: Project[] | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

  private loadProjectsData(): ProjectsConfig {
    try {
      const filePath = join(process.cwd(), 'config', 'projects.json')
      const fileContent = readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent) as ProjectsConfig
    } catch (error) {
      console.error('Error loading projects.json:', error)
      return { version: '1.0', lastUpdated: new Date().toISOString(), projects: [] }
    }
  }

  private async fetchGitHubRepoData(repoUrl: string): Promise<GitHubRepoData | null> {
    try {
      // Extract owner and repo from GitHub URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!match) return null

      const [, owner, repo] = match
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`

      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'TWS-Community/1.0',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (!response.ok) {
        console.warn(`Failed to fetch GitHub data for ${repoUrl}: ${response.status}`)
        return null
      }

      const data = await response.json()
      return {
        description: data.description,
        stargazers_count: data.stargazers_count,
        forks_count: data.forks_count,
        updated_at: data.updated_at,
        language: data.language,
        topics: data.topics || [],
      }
    } catch (error) {
      console.warn(`Error fetching GitHub data for ${repoUrl}:`, error)
      return null
    }
  }

  private async convertToProject(data: SimpleProjectData): Promise<Project> {
    const githubData = await this.fetchGitHubRepoData(data.url)
    
    // Extract technologies from GitHub topics and language
    const technologies: string[] = []
    if (githubData?.language) {
      technologies.push(githubData.language)
    }
    if (githubData?.topics) {
      technologies.push(...githubData.topics.slice(0, 5)) // Limit to 5 topics
    }

    return {
      id: data.id,
      name: data.name,
      description: githubData?.description || 'No description available',
      difficulty: data.difficulty as 'beginner' | 'intermediate' | 'advanced',
      estimatedTime: data.estimatedTime,
      technologies: technologies,
      category: data.category as any,
      url: data.url,
      lastUpdated: githubData?.updated_at || new Date().toISOString(),
      stars: githubData?.stargazers_count || 0,
      forks: githubData?.forks_count || 0,
      featured: data.featured,
    }
  }

  async getProjects(): Promise<Project[]> {
    const now = Date.now()

    // Return cached data if still valid
    if (this.projectsCache && now - this.lastFetch < this.CACHE_DURATION) {
      return this.projectsCache
    }

    try {
      const config = this.loadProjectsData()
      const projects = await Promise.all(
        config.projects.map(project => this.convertToProject(project))
      )
      
      this.projectsCache = projects
      this.lastFetch = now
      return projects
    } catch (error) {
      console.error('Error loading projects:', error)
      return []
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    // Try to get from projects cache first
    if (this.projectsCache) {
      const cached = this.projectsCache.find((p) => p.id === id)
      if (cached) return cached
    }

    const projects = await this.getProjects()
    return projects.find(p => p.id === id) || null
  }

  async searchProjects(query: string): Promise<Project[]> {
    const projects = await this.getProjects()

    if (!query.trim()) {
      return projects
    }

    const searchTerm = query.toLowerCase()

    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(searchTerm)
        ) ||
        project.category.toLowerCase().includes(searchTerm)
    )
  }

  // Preload projects for better performance
  async preloadProjects(): Promise<void> {
    if (!this.projectsCache) {
      await this.getProjects()
    }
  }

  // Clear cache when needed
  clearCache(): void {
    this.projectsCache = null
    this.lastFetch = 0
  }
}

export const simpleProjectService = new SimpleProjectService()