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
        <h1 className="mb-4 text-4xl font-bold font-headline tracking-tight sm:text-5xl flex items-center justify-center gap-4">
          <Trophy className="h-10 w-10 text-primary" />
          ./CommunityHeroes
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          <span className="text-primary">&gt;</span> Recognizing exceptional community members who drive learning, solve doubts,
          and inspire others in their DevOps and Cloud journey.
        </p>
        <p className="text-sm text-accent mt-1">// Honoring those who make our community stronger every day.</p>
      </div>

      {/* Recognition Tiers Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold font-headline">
          <span className="text-accent">#</span> Recognition Tiers
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <HeroTierSection tier={tierInfo.automation} />
          <HeroTierSection tier={tierInfo.cloud} />
          <HeroTierSection tier={tierInfo.devops} />
        </div>
      </section>

      <SectionDivider />

      {/* Meet Our Heroes Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold font-headline">
          <span className="text-accent">#</span> Meet Our Heroes
        </h2>
        <HeroesClient heroes={heroes} />
      </section>
    </div>
  );
}
