import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getCachedData, clearCache } from '@/lib/cache';
import { trackError, trackPerformance } from '@/lib/monitoring';

function normalizePrivateKey(raw: string): string {
  if (!raw) return raw;
  // If the key contains literal \n sequences, convert them to real newlines
  if (raw.includes('\\n')) raw = raw.replace(/\\n/g, '\n');
  // Remove any carriage returns
  raw = raw.replace(/\r/g, '');
  // Remove surrounding quotes if present
  raw = raw.replace(/^"|"$/g, '');
  // Otherwise, return as-is (already multiline). Ensure trailing newline
  return raw.endsWith('\n') ? raw : raw + '\n';
}

async function getServiceAccountAuth() {
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
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: key },
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
  return await auth.getClient();
}

async function fetchEvents() {
  const start = Date.now();
  try {
    const auth = await getServiceAccountAuth();
    const calendar = google.calendar({ version: 'v3', auth: auth as any });
    const calendarId = process.env.GOOGLE_CALENDAR_ID as string;
    if (!calendarId) throw new Error('GOOGLE_CALENDAR_ID is not set');

    const res = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 25,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const items = res.data.items || [];
    const events = items.map((e) => ({
      id: e.id,
      status: e.status,
      summary: e.summary,
      description: e.description,
      location: e.location,
      start: e.start,
      end: e.end,
      htmlLink: e.htmlLink,
      hangoutLink: e.hangoutLink,
      organizer: e.organizer,
      updated: e.updated,
    }));

    trackPerformance('calendar-events-fetch', Date.now() - start);
    return events;
  } catch (err: any) {
    trackError(err, 'calendar-events-fetch');
    const email = process.env.GOOGLE_SA_CLIENT_EMAIL || process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const rawKey = process.env.GOOGLE_SA_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY || '';
    const diag = {
      emailPresent: !!email,
      keyChars: rawKey ? rawKey.length : 0,
      keyStartsWith: rawKey ? rawKey.slice(0, 30) : '',
      keyEndsWith: rawKey ? rawKey.slice(-30) : '',
      calendarIdPresent: !!process.env.GOOGLE_CALENDAR_ID,
    };
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`${err?.message || 'Calendar error'} | diag: ${JSON.stringify(diag)}`);
    }
    throw err;
  }
}

export async function GET() {
  try {
    const events = await getCachedData('calendar-events', fetchEvents, 60);
    return NextResponse.json({ events }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Calendar error' }, { status: 500 });
  }
}


