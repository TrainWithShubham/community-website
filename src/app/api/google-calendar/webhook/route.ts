import { NextRequest, NextResponse } from 'next/server';
import { clearCache } from '@/lib/cache';

export async function POST(req: NextRequest) {
  const channelId = req.headers.get('x-goog-channel-id');
  const resourceId = req.headers.get('x-goog-resource-id');
  const state = req.headers.get('x-goog-resource-state');

  if (!channelId || !resourceId) return new NextResponse(null, { status: 400 });

  // TODO: validate channelId/resourceId against stored values
  // For now, optimistically clear calendar cache to refresh on next request
  clearCache('calendar-events');

  return new NextResponse(null, { status: 200 });
}

export async function GET() {
  return new NextResponse('ok', { status: 200 });
}


