import { NextResponse } from 'next/server';
import { clearAllCache } from '@/lib/cache';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET() {
  try {
    // Clear all cache entries
    clearAllCache();
    
    // Revalidate specific paths to clear Next.js cache
    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/interview-questions');
    
    // Revalidate tags if you're using them
    revalidateTag('interview-questions');
    revalidateTag('jobs');
    revalidateTag('leaderboard');
    revalidateTag('community-questions');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully. Pages will be regenerated on next request.' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Clear all cache entries
    clearAllCache();
    
    // Revalidate specific paths to clear Next.js cache
    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/interview-questions');
    
    // Revalidate tags if you're using them
    revalidateTag('interview-questions');
    revalidateTag('jobs');
    revalidateTag('leaderboard');
    revalidateTag('community-questions');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully. Pages will be regenerated on next request.' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
