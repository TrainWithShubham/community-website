import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  try {
    // Validate that it's a GitHub raw URL
    if (!url.includes('raw.githubusercontent.com')) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Try multiple branch names and file paths
    const branches = ['main', 'master', 'develop', 'DevOps']
    const readmePaths = ['README.md', 'readme.md', 'Readme.md']
    
    let content = null
    let successfulUrl = null

    // First, try the original URL
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TWS-Community/1.0',
        },
        next: { revalidate: 3600 },
      })

      if (response.ok) {
        content = await response.text()
        successfulUrl = url
      }
    } catch (error) {
      console.log('Original URL failed, trying alternatives...')
    }

    // If original URL failed, try different branches and paths
    if (!content) {
      const urlParts = url.split('/')
      const owner = urlParts[3]
      const repo = urlParts[4]
      
      for (const branch of branches) {
        for (const readmePath of readmePaths) {
          const alternativeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${readmePath}`
          
          try {
            const response = await fetch(alternativeUrl, {
              headers: {
                'User-Agent': 'TWS-Community/1.0',
              },
              next: { revalidate: 3600 },
            })

            if (response.ok) {
              content = await response.text()
              successfulUrl = alternativeUrl
              break
            }
          } catch (error) {
            // Continue to next option
          }
        }
        if (content) break
      }
    }

    if (!content) {
      // Return a helpful message instead of an error
      return NextResponse.json({
        content: `# Project README Not Available

The README file for this project could not be found. This could be because:

- The repository doesn't have a README.md file
- The README is in a different branch
- The repository is private or has restricted access

Please visit the [GitHub repository](${url.replace('raw.githubusercontent.com', 'github.com').replace(/\/[^\/]+\/[^\/]+\/[^\/]+\//, '/').replace(/\/[^\/]+$/, '')}) to view the project documentation.`,
        url: successfulUrl || url,
        lastFetched: new Date().toISOString(),
        fallback: true
      })
    }

    return NextResponse.json({
      content,
      url: successfulUrl || url,
      lastFetched: new Date().toISOString(),
    })
  } catch (error) {
    console.error('README fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch README content' },
      { status: 500 }
    )
  }
}
