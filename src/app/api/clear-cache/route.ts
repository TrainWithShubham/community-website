import { NextResponse } from 'next/server';
import { clearAllCache } from '@/lib/cache';

export async function GET() {
  try {
    // Clear all cache entries
    clearAllCache();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
