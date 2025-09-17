'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Github, FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { marked } from 'marked'

interface ReadmeViewerProps {
  readmeUrl: string
  projectTitle: string
}

interface CopyButtonProps {
  code: string
  blockId: string
}

function CopyButton({ code, blockId }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md border transition-colors"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  )
}

export function ReadmeViewer({ readmeUrl, projectTitle }: ReadmeViewerProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [showViewer, setShowViewer] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedBlocks, setCopiedBlocks] = useState<Set<string>>(new Set())

  const copyToClipboard = async (text: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedBlocks(prev => new Set([...prev, blockId]))
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev)
          newSet.delete(blockId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const fetchReadme = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `/api/readme?url=${encodeURIComponent(readmeUrl)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch README')
      }

      setContent(data.content)
      setShowViewer(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load README')
    } finally {
      setLoading(false)
    }
  }

  const formatMarkdown = (markdown: string) => {
    // Extract repository info from readmeUrl for image path resolution
    const urlMatch = readmeUrl.match(/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)/)
    const repoOwner = urlMatch?.[1]
    const repoName = urlMatch?.[2]
    const branch = urlMatch?.[3] || 'main'
    const baseImageUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}`

    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true
    })

    // Use marked to parse markdown
    let html = marked.parse(markdown) as string

    // Apply custom styling to the parsed HTML
    html = html
      // Headers with custom styling
      .replace(/<h1>/g, '<h1 class="text-3xl font-bold mb-6 mt-8 text-foreground border-b border-border pb-2">')
      .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mb-4 mt-6 text-foreground">')
      .replace(/<h3>/g, '<h3 class="text-xl font-medium mb-3 mt-5 text-foreground">')
      .replace(/<h4>/g, '<h4 class="text-lg font-medium mb-2 mt-4 text-foreground">')
      .replace(/<h5>/g, '<h5 class="text-base font-medium mb-2 mt-3 text-foreground">')
      .replace(/<h6>/g, '<h6 class="text-sm font-medium mb-2 mt-3 text-foreground">')
      
      // Paragraphs
      .replace(/<p>/g, '<p class="mb-4 text-foreground leading-relaxed">')
      
      // Lists
      .replace(/<ul>/g, '<ul class="space-y-2 mb-4">')
      .replace(/<ol>/g, '<ol class="space-y-2 mb-4">')
      .replace(/<li>/g, '<li class="flex items-start"><span class="text-brand-purple mr-2 mt-1">•</span><span class="text-foreground">')
      .replace(/<\/li>/g, '</span></li>')
      
      // Code blocks with copy functionality
      .replace(/<pre><code class="text-sm font-mono text-foreground">([\s\S]*?)<\/code><\/pre>/g, (match, codeContent) => {
        const blockId = `code-${Math.random().toString(36).substr(2, 9)}`
        const cleanCode = codeContent.replace(/<[^>]*>/g, '').trim()
        console.log('Processing code block:', cleanCode) // Debug log
        return `
          <div class="my-6 relative group" data-code-block="${blockId}">
            <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 sm:opacity-100 sm:opacity-0 group-hover:sm:opacity-100">
              <button 
                class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-background/95 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-border rounded-md shadow-sm hover:shadow-md transition-all duration-200 copy-code-btn active:scale-95"
                data-code="${encodeURIComponent(cleanCode)}"
                type="button"
              >
                <svg class="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <span class="copy-text text-muted-foreground">Copy</span>
              </button>
            </div>
            <pre class="bg-muted p-4 rounded-lg overflow-x-auto border"><code class="text-sm font-mono text-foreground">${codeContent}</code></pre>
          </div>
        `
      })
      .replace(/<pre>/g, '<div class="my-6 relative group"><div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 sm:opacity-100 sm:opacity-0 group-hover:sm:opacity-100"><button class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-background/95 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-border rounded-md shadow-sm hover:shadow-md transition-all duration-200 copy-code-btn active:scale-95" data-code="" type="button"><svg class="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span class="copy-text text-muted-foreground">Copy</span></button></div><pre class="bg-muted p-4 rounded-lg overflow-x-auto border">')
      .replace(/<\/pre>/g, '</pre></div>')
      .replace(/<code>/g, '<code class="text-sm font-mono text-foreground">')
      
      // Inline code
      .replace(/<code class="text-sm font-mono text-foreground">([^<]+)<\/code>/g, '<code class="bg-muted px-2 py-1 rounded-md text-sm font-mono text-foreground border">$1</code>')
      
      // Links
      .replace(/<a href="/g, '<a href="')
      .replace(/<a href="([^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-brand-purple hover:text-brand-purple/80 underline underline-offset-2 transition-colors"')
      
      // Blockquotes
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-brand-purple pl-4 py-2 my-4 bg-muted/50 italic text-muted-foreground">')
      
      // Horizontal rules
      .replace(/<hr>/g, '<hr class="my-8 border-border">')
      
      // Tables
      .replace(/<table>/g, '<div class="overflow-x-auto my-6"><table class="min-w-full border border-border rounded-lg">')
      .replace(/<\/table>/g, '</table></div>')
      .replace(/<thead>/g, '<thead class="bg-muted">')
      .replace(/<th>/g, '<th class="px-4 py-2 text-left font-semibold text-foreground border-b border-border">')
      .replace(/<td>/g, '<td class="px-4 py-2 text-foreground border-b border-border">')

    // Fix relative image paths
    if (repoOwner && repoName) {
      html = html
        .replace(
          /!\[([^\]]*)\]\(\.\/([^)]+)\)/g,
          `<img src="${baseImageUrl}/$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-lg my-6 border border-border" loading="lazy" onerror="this.style.display='none'">`
        )
        .replace(
          /!\[([^\]]*)\]\(\.\.\/([^)]+)\)/g,
          `<img src="${baseImageUrl}/$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-lg my-6 border border-border" loading="lazy" onerror="this.style.display='none'">`
        )
        .replace(
          /!\[([^\]]*)\]\(([^http][^)]+)\)/g,
          `<img src="${baseImageUrl}/$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-lg my-6 border border-border" loading="lazy" onerror="this.style.display='none'">`
        )
        .replace(
          /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g,
          '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-lg my-6 border border-border" loading="lazy" onerror="this.style.display=\'none\'">'
        )
    }

    // Post-process to ensure all code blocks have copy buttons
    html = html.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (match, preContent) => {
      // Check if this pre already has a copy button
      if (match.includes('copy-code-btn')) {
        return match
      }
      
      // Extract code content
      const codeMatch = preContent.match(/<code[^>]*>([\s\S]*?)<\/code>/)
      if (codeMatch) {
        const codeContent = codeMatch[1]
        const cleanCode = codeContent.replace(/<[^>]*>/g, '').trim()
        const blockId = `code-${Math.random().toString(36).substr(2, 9)}`
        
        return `
          <div class="my-6 relative group" data-code-block="${blockId}">
            <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 sm:opacity-100 sm:opacity-0 group-hover:sm:opacity-100">
              <button 
                class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-background/95 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-border rounded-md shadow-sm hover:shadow-md transition-all duration-200 copy-code-btn active:scale-95"
                data-code="${encodeURIComponent(cleanCode)}"
                type="button"
              >
                <svg class="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <span class="copy-text text-muted-foreground">Copy</span>
              </button>
            </div>
            <pre class="bg-muted p-4 rounded-lg overflow-x-auto border">${preContent}</pre>
          </div>
        `
      }
      
      return match
    })

    return `<div class="prose prose-sm max-w-none text-foreground">${html}</div>`
  }

  // Set up copy functionality for code blocks
  useEffect(() => {
    const handleCopyClick = async (event: Event) => {
      const target = event.target as HTMLElement
      const button = target.closest('.copy-code-btn') as HTMLButtonElement
      
      if (button) {
        event.preventDefault()
        event.stopPropagation()
        
        // Try to get code from data-code attribute first
        let code = button.getAttribute('data-code')
        
        // If no data-code, try to extract from the code block
        if (!code || code === '') {
          const codeBlock = button.closest('[data-code-block]')
          if (codeBlock) {
            const codeElement = codeBlock.querySelector('code')
            if (codeElement) {
              code = codeElement.textContent || ''
            }
          }
        }
        
        if (code) {
          try {
            const decodedCode = decodeURIComponent(code)
            console.log('Copying code:', decodedCode) // Debug log
            
            await navigator.clipboard.writeText(decodedCode)
            
            // Update button state
            const copyIcon = button.querySelector('svg')
            const copyText = button.querySelector('.copy-text')
            
            if (copyIcon && copyText) {
              // Change to checkmark icon
              copyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
              copyText.textContent = 'Copied!'
              
              setTimeout(() => {
                // Restore copy icon
                copyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>'
                copyText.textContent = 'Copy'
              }, 2000)
            }
            
            console.log('Code copied successfully!') // Debug log
          } catch (err) {
            console.error('Failed to copy text: ', err)
            
            // Fallback: try to select and copy
            try {
              const codeElement = button.closest('[data-code-block]')?.querySelector('code')
              if (codeElement) {
                const range = document.createRange()
                range.selectNodeContents(codeElement)
                const selection = window.getSelection()
                selection?.removeAllRanges()
                selection?.addRange(range)
                document.execCommand('copy')
                selection?.removeAllRanges()
                
                // Update button state
                const copyIcon = button.querySelector('svg')
                const copyText = button.querySelector('.copy-text')
                
                if (copyIcon && copyText) {
                  // Change to checkmark icon
                  copyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
                  copyText.textContent = 'Copied!'
                  
                  setTimeout(() => {
                    // Restore copy icon
                    copyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>'
                    copyText.textContent = 'Copy'
                  }, 2000)
                }
              }
            } catch (fallbackErr) {
              console.error('Fallback copy also failed: ', fallbackErr)
            }
          }
        } else {
          console.warn('No code found to copy')
        }
      }
    }

    // Add event listener to the document
    document.addEventListener('click', handleCopyClick)

    return () => {
      document.removeEventListener('click', handleCopyClick)
    }
  }, [content])

  if (!showViewer) {
    return (
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-brand-purple" />
            Project Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6 text-sm md:text-base leading-relaxed">
            Follow the detailed instructions in the GitHub repository to complete this project. 
            The repository contains step-by-step guides, code examples, and all necessary resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={fetchReadme}
              disabled={loading}
              className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple/90 text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                'View Instructions'
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-brand-purple" />
            Project Instructions
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand
                </>
              )}
            </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowViewer(false)}
              className="text-muted-foreground hover:text-foreground"
          >
              Close
          </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : (
          <div className={`transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}>
            <div
              dangerouslySetInnerHTML={{
                __html: formatMarkdown(content),
              }}
              className="space-y-4"
            />
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
            )}
          </div>
        )}
        
        {!isExpanded && !loading && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(true)}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Show More
            </Button>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-border/50">
          <Button variant="outline" asChild size="sm" className="text-muted-foreground hover:text-foreground">
            <a
              href={readmeUrl.replace('raw.githubusercontent.com', 'github.com').replace(/\/[^\/]+\/[^\/]+\/[^\/]+\//, '/').replace(/\/[^\/]+$/, '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}