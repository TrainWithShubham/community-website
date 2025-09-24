'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Video } from 'lucide-react'
import React from 'react'
import { buildGoogleAddUrl } from '@/lib/utils'

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
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
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

              return (
                <Card key={evt.id || evt.summary} className="bg-card/80 backdrop-blur-sm card-neo-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {evt.summary || 'Community Event'}</CardTitle>
                    <CardDescription>{dateLabel}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {evt.location && (
                      <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {evt.location}</div>
                    )}
                    {evt.description && (
                      <div className="line-clamp-3 whitespace-pre-wrap text-muted-foreground">{evt.description}</div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {evt.hangoutLink && (
                      <Button variant="default" asChild>
                        <a href={evt.hangoutLink} target="_blank" rel="noopener noreferrer"><Video className="h-4 w-4 mr-2" /> Join</a>
                      </Button>
                    )}
                    {addUrl && (
                      <Button variant="outline" asChild>
                        <a href={addUrl} target="_blank" rel="noopener noreferrer">Add to Google Calendar</a>
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


