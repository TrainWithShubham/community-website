import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearAllCache } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, path } = body;
    
    // Verify the secret to prevent unauthorized access
    if (secret !== process.env.REVALIDATE_SECRET) {
      console.log('Invalid secret provided:', secret);
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    console.log('Valid secret received, clearing cache and revalidating...');

    // Clear memory cache
    clearAllCache();
    
    // Revalidate specific paths
    if (path) {
      revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
    } else {
      // Revalidate all job-related paths
      revalidatePath('/');
      revalidatePath('/jobs');
      console.log('Revalidated home page and jobs page');
    }

    return NextResponse.json({ 
      revalidated: true, 
      timestamp: new Date().toISOString(),
      message: 'Cache cleared and paths revalidated successfully',
      path: path || 'home and jobs pages'
    });
  } catch (err) {
    console.error('Error in revalidation:', err);
    return NextResponse.json({ 
      message: 'Error revalidating', 
      error: err instanceof Error ? err.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Handle GET requests for testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  return NextResponse.json({ 
    message: 'Revalidation API is working',
    timestamp: new Date().toISOString()
  });
}
