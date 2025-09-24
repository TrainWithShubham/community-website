import { NextResponse } from 'next/server';
import { google } from 'googleapis';

function normalizePrivateKey(raw: string): string {
  if (!raw) return raw;
  if (raw.includes('\\n')) return raw.replace(/\\n/g, '\n');
  return raw.endsWith('\n') ? raw : raw + '\n';
}

function getServiceAccountAuth() {
  const email = process.env.GOOGLE_SA_CLIENT_EMAIL || process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  let rawKey = process.env.GOOGLE_SA_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY || '';
  const b64 = process.env.GOOGLE_SA_PRIVATE_KEY_BASE64 || process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64;
  if (!rawKey && b64) {
    try { rawKey = Buffer.from(b64, 'base64').toString('utf8'); } catch {}
  }
  const key = normalizePrivateKey(rawKey).trim();
  if (!email || !key) {
    throw new Error('Missing Google Service Account credentials');
  }
  return new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
}

export async function POST() {
  try {
    const auth = getServiceAccountAuth();
    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID as string;
    const baseUrl = process.env.APP_BASE_URL as string;
    if (!calendarId) throw new Error('GOOGLE_CALENDAR_ID is not set');
    if (!baseUrl) throw new Error('APP_BASE_URL is not set');

    const address = `${baseUrl}/api/google-calendar/webhook`;
    const channelId = crypto.randomUUID();

    const watch = await calendar.events.watch({
      calendarId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address,
      },
    });

    // NOTE: Persist watch.data.id (channel), watch.data.resourceId, watch.data.expiration in durable storage

    return NextResponse.json({
      channelId: watch.data.id,
      resourceId: watch.data.resourceId,
      expiration: watch.data.expiration,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Watch error' }, { status: 500 });
  }
}


