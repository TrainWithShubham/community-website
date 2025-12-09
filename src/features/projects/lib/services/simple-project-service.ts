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

  private async fetchGitHubRepoData(repoUrl: string, retries: number = 3): Promise<GitHubRepoData | null> {
    try {
      // Extract owner and repo from GitHub URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!match) return null

      const [, owner, repo] = match
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`

      // Add delay to avoid rate limiting (1 second between requests)
      await new Promise(resolve => setTimeout(resolve, 1000))

      const headers: HeadersInit = {
        'User-Agent': 'TWS-Community/1.0',
      }

      // Use GitHub token if available for higher rate limits
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
      }

      const response = await fetch(apiUrl, {
        headers,
        next: { revalidate: false }, // Static generation - fetch once at build time
      })

      if (!response.ok) {
        if (response.status === 403 && retries > 0) {
          // Rate limited, wait and retry
          console.warn(`[Build] Rate limited for ${repoUrl}, retrying in 5 seconds...`)
          await new Promise(resolve => setTimeout(resolve, 5000))
          return this.fetchGitHubRepoData(repoUrl, retries - 1)
        }
        console.warn(`[Build] Failed to fetch GitHub data for ${repoUrl}: ${response.status}`)
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
      if (retries > 0) {
        console.warn(`[Build] Error fetching GitHub data for ${repoUrl}, retrying...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        return this.fetchGitHubRepoData(repoUrl, retries - 1)
      }
      console.warn(`[Build] Error fetching GitHub data for ${repoUrl}:`, error)
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
    // Return cached data if already fetched (for build-time)
    if (this.projectsCache) {
      return this.projectsCache
    }

    try {
      console.log('[Build] Fetching projects from GitHub API...')
      const config = this.loadProjectsData()
      
      // Fetch projects sequentially to avoid rate limiting
      const projects: Project[] = []
      for (const projectData of config.projects) {
        const project = await this.convertToProject(projectData)
        projects.push(project)
      }
      
      this.projectsCache = projects
      console.log(`[Build] Successfully fetched ${projects.length} projects`)
      return projects
    } catch (error) {
      console.error('[Build] Error loading projects:', error)
      throw new Error(`Failed to load projects: ${error}`)
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

  // Preload projects for build-time generation
  async preloadProjects(): Promise<void> {
    if (!this.projectsCache) {
      await this.getProjects()
    }
  }
}

export const simpleProjectService = new SimpleProjectService()