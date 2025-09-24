'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Video } from 'lucide-react'
import React from 'react'
import { buildGoogleAddUrl } from '@/lib/utils'

// Discord Icon Component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

type EventItem = {
  id?: string
  summary?: string
  description?: string | null
  location?: string | null
  start?: { dateTime?: string; date?: string; timeZone?: string }
  end?: { dateTime?: string; date?: string; timeZone?: string }
  htmlLink?: string | null
  hangoutLink?: string | null
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Discord detection logic
const discordKeywords = [
  'discord', 'session', 'workshop', 'community call', 
  'live coding', 'study group', 'mentoring', 'discord session',
  'discord call', 'discord workshop', 'discord study'
]

const isDiscordEvent = (event: EventItem): boolean => {
  const summary = event.summary?.toLowerCase() || ''
  const description = event.description?.toLowerCase() || ''
  const location = event.location?.toLowerCase() || ''
  
  return discordKeywords.some(keyword => 
    summary.includes(keyword) || 
    description.includes(keyword) || 
    location.includes('discord')
  )
}

// Extract Discord invite link from event description
const extractDiscordLink = (description: string | null): string | null => {
  if (!description) return null
  
  // Look for Discord invite links
  const discordInviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/[a-zA-Z0-9]+/g
  const matches = description.match(discordInviteRegex)
  
  if (matches && matches.length > 0) {
    // Return the first valid Discord invite link
    let link = matches[0]
    if (!link.startsWith('http')) {
      link = 'https://' + link
    }
    return link
  }
  
  return null
}

// Clean description by removing Discord links (since we show them as buttons)
const cleanDescription = (description: string | null): string | null => {
  if (!description) return null
  
  // Remove Discord invite links from description
  const discordInviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/[a-zA-Z0-9]+/g
  let cleanedDescription = description.replace(discordInviteRegex, '').trim()
  
  // Clean up any leftover HTML tags or formatting
  cleanedDescription = cleanedDescription
    .replace(/<a[^>]*>.*?<\/a>/gi, '') // Remove anchor tags
    .replace(/https?:\/\/[^\s]+/g, '') // Remove any remaining URLs
    .replace(/\s+/g, ' ') // Clean up multiple spaces
    .trim()
  
  return cleanedDescription || null
}

function parseDate(value?: { dateTime?: string; date?: string }) {
  if (!value) return null
  if (value.dateTime) return new Date(value.dateTime)
  if (value.date) return new Date(value.date + 'T00:00:00Z')
  return null
}

export function EventsList() {
  const { data, isLoading } = useSWR<{ events: EventItem[] }>(
    '/api/google-calendar/events',
    fetcher,
    { refreshInterval: 60000 }
  )

  if (isLoading) {
    return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Card><CardHeader><CardTitle>Loading events…</CardTitle></CardHeader></Card></div>
  }

  const events = data?.events || []

  // Build a set of event dates (YYYY-MM-DD) to highlight in calendar
  const eventDates = new Set(
    events
      .map(e => e.start?.dateTime || e.start?.date)
      .filter(Boolean)
      .map(d => {
        const dt = (d as string).length > 10 ? new Date(d as string) : new Date((d as string) + 'T00:00:00Z')
        const y = dt.getUTCFullYear();
        const m = String(dt.getUTCMonth() + 1).padStart(2, '0')
        const day = String(dt.getUTCDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
      })
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {events.map(evt => {
              const start = parseDate(evt.start)
              const end = parseDate(evt.end)
              const addUrl = start && end ? buildGoogleAddUrl({
                title: evt.summary || 'Community Event',
                start,
                end,
                description: evt.description || undefined,
                location: evt.location || undefined,
              }) : undefined

              const dateLabel = start ? start.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'TBA'
              
              // Discord detection and link extraction
              const isDiscord = isDiscordEvent(evt)
              const discordLink = extractDiscordLink(evt.description || null)
              const cleanedDescription = cleanDescription(evt.description || null)

              return (
                <Card key={evt.id || evt.summary} className="bg-card/80 backdrop-blur-sm card-neo-border h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {isDiscord ? (
                        <DiscordIcon className="h-4 w-4 text-[#5865F2]" />
                      ) : (
                        <Calendar className="h-4 w-4 text-primary" />
                      )}
                      {evt.summary || 'Community Event'}
                    </CardTitle>
                    <CardDescription>{dateLabel}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm pb-2">
                    {evt.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" /> 
                        {evt.location}
                      </div>
                    )}
                    
                    {isDiscord && (
                      <div className="flex items-center gap-2 text-[#5865F2] font-medium bg-[#5865F2]/10 px-2 py-1 rounded-md">
                        <DiscordIcon className="h-4 w-4" />
                        <span className="text-sm">Discord Session</span>
                      </div>
                    )}
                    
                    {cleanedDescription && (
                      <div className="line-clamp-3 whitespace-pre-wrap text-muted-foreground">{cleanedDescription}</div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                    {/* Primary Action Button */}
                    {isDiscord && discordLink ? (
                      <Button 
                        variant="default" 
                        asChild 
                        className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium h-10"
                      >
                        <a href={discordLink} target="_blank" rel="noopener noreferrer">
                          <DiscordIcon className="h-4 w-4 mr-2" />
                          Join Discord
                        </a>
                      </Button>
                    ) : evt.hangoutLink ? (
                      <Button 
                        variant="default" 
                        asChild 
                        className="flex-1 font-medium h-10"
                      >
                        <a href={evt.hangoutLink} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4 mr-2" /> Join Meeting
                        </a>
                      </Button>
                    ) : null}
                    
                    {/* Secondary Action Button */}
                    {addUrl && (
                      <Button 
                        variant="outline" 
                        asChild 
                        className="flex-1 sm:flex-none sm:min-w-[140px] h-10 text-sm"
                      >
                        <a href={addUrl} target="_blank" rel="noopener noreferrer">
                          Add to Calendar
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <MiniCalendar eventDates={eventDates} />
      </div>
    </div>
  )
}

function MiniCalendar({ eventDates }: { eventDates: Set<string> }) {
  const [current, setCurrent] = React.useState(() => {
    const d = new Date()
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
  })

  function addMonths(base: Date, delta: number) {
    return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + delta, 1))
  }

  function getWeeks(monthStart: Date) {
    const firstDay = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth(), 1))
    const startWeekDay = (firstDay.getUTCDay() + 6) % 7
    const gridStart = new Date(firstDay)
    gridStart.setUTCDate(1 - startWeekDay)
    const weeks: Date[][] = []
    let cursor = new Date(gridStart)
    for (let w = 0; w < 6; w++) {
      const row: Date[] = []
      for (let d = 0; d < 7; d++) {
        row.push(new Date(cursor))
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      }
      weeks.push(row)
    }
    return weeks
  }

  const weeks = getWeeks(current)
  const month = current.toLocaleString(undefined, { month: 'long', year: 'numeric' })

  function iso(d: Date) {
    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm card-neo-border">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base">{month}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrent(c => addMonths(c, -1))}>{'<'}</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrent(c => addMonths(c, 1))}>{'>'}</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="text-center">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((d, idx) => {
            const inMonth = d.getUTCMonth() === current.getUTCMonth()
            const hasEvent = eventDates.has(iso(d))
            return (
              <div key={idx} className={`h-9 rounded-md flex items-center justify-center border ${inMonth ? 'bg-background' : 'bg-muted/40 text-muted-foreground'} ${hasEvent ? 'border-primary text-primary font-medium' : 'border-border'}`}>
                {d.getUTCDate()}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}


