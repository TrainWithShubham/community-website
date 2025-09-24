import { Metadata } from 'next'
import { EventsList } from '@/components/events-list'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Community events and meetings calendar.',
  openGraph: { title: 'Events | TWS Community Hub', images: ['/og-image.svg'] },
  twitter: { title: 'Events | TWS Community Hub', images: ['/og-image.svg'] },
}

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Community Events</h1>
      <EventsList />
    </div>
  )
}


