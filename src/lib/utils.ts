import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calendar helpers
export function formatDateForGoogle(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = d.getUTCFullYear();
  const m = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const h = pad(d.getUTCHours());
  const min = pad(d.getUTCMinutes());
  const s = pad(d.getUTCSeconds());
  return `${y}${m}${day}T${h}${min}${s}Z`;
}

export function buildGoogleAddUrl(params: {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}): string {
  const qs = new URLSearchParams({
    action: 'TEMPLATE',
    text: params.title || '',
    dates: `${formatDateForGoogle(params.start)}/${formatDateForGoogle(params.end)}`,
    details: params.description || '',
    location: params.location || '',
  });
  return `https://calendar.google.com/calendar/render?${qs.toString()}`;
}
