import { Metadata } from 'next';
import { Trophy } from 'lucide-react';
import { HeroTierSection } from '@/components/heroes/hero-tier-section';
import { HeroesClient } from './heroes-client';
import { SectionDivider } from '@/components/section-divider';
import { tierInfo, heroes } from '@/data/heroes';

export const metadata: Metadata = {
  title: 'Community Heroes | TrainWithShubham',
  description: 'Meet our Community Heroes - exceptional members who actively contribute to the DevOps, Cloud, and DevSecOps community through doubt solving, content creation, and knowledge sharing.',
  keywords: ['community heroes', 'devops community', 'cloud computing', 'aws', 'kubernetes', 'trainwithshubham', 'recognition program'],
  openGraph: {
    title: 'Community Heroes | TrainWithShubham',
    description: 'Meet our Community Heroes - exceptional members who actively contribute to the DevOps, Cloud, and DevSecOps community.',
    type: 'website',
  },
};

export default function HeroesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-16 text-center">
        <div className="mb-4 flex justify-center">
          <Trophy className="h-16 w-16 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Community Heroes
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Recognizing exceptional community members who drive learning, solve doubts, 
          and inspire others in their DevOps and Cloud journey.
        </p>
      </div>

      {/* Recognition Tiers Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Recognition Tiers</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <HeroTierSection tier={tierInfo.automation} />
          <HeroTierSection tier={tierInfo.cloud} />
          <HeroTierSection tier={tierInfo.devops} />
        </div>
      </section>

      <SectionDivider />

      {/* Meet Our Heroes Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Meet Our Heroes</h2>
        <HeroesClient heroes={heroes} />
      </section>
    </div>
  );
}
