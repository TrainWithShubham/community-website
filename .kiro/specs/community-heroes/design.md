# Design Document: Community Heroes Recognition Program

## Overview

The Community Heroes recognition program is a new feature that creates a dedicated `/heroes` page to showcase a three-tier recognition system for community members. The system recognizes achievements in course completion, community engagement (doubt solving), and LinkedIn brand visibility. The design follows Next.js 15 App Router patterns with static data management, TypeScript type safety, and responsive UI components using Shadcn/ui.

The page will display:
1. Program overview with tier requirements and perks
2. Hero profiles showcase with filtering capabilities
3. Visual badges for each tier
4. Social media links and hero information

## Architecture

### High-Level Structure

```
src/
  app/
    heroes/
      page.tsx              # Main heroes page (Server Component)
      heroes-client.tsx     # Client component for filtering
  data/
    heroes.ts               # Hero profiles data and types
  components/
    heroes/
      hero-card.tsx         # Individual hero profile card
      hero-tier-section.tsx # Tier requirements and perks display
      tier-badge.tsx        # Badge component for tiers
public/
  heroes/                   # Hero profile photos directory
    amitabh-soni.jpg
    [other-hero-photos].jpg
```

### Component Hierarchy

```
HeroesPage (Server Component)
├── Hero Tier Sections (Server Component)
│   ├── Automation Hero Section
│   ├── Cloud Hero Section
│   └── DevOps Hero Section
└── Heroes Showcase (Client Component)
    ├── Filter Controls
    └── Hero Cards Grid
        └── Hero Card (per hero)
            ├── Hero Image
            ├── Hero Info
            ├── Tier Badge
            └── Social Links
```

## Components and Interfaces

### 1. Data Layer (`src/data/heroes.ts`)

**Type Definitions:**

```typescript
export type HeroTier = 'automation' | 'cloud' | 'devops';

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
};

export type Hero = {
  id: string;
  name: string;
  title: string;
  photo: string;
  location: string;
  heroSince: string; // ISO date string
  about: string;
  tier: HeroTier;
  socialLinks: SocialLinks;
};

export type TierRequirement = {
  description: string;
  metric?: string;
};

export type TierPerk = {
  description: string;
  exclusive?: boolean; // true if only for this tier and above
};

export type TierInfo = {
  id: HeroTier;
  name: string;
  badgeImage: string;
  requirements: TierRequirement[];
  perks: TierPerk[];
  color: string; // Tailwind color class
};
```

**Data Structure:**

```typescript
export const tierInfo: Record<HeroTier, TierInfo> = {
  automation: {
    id: 'automation',
    name: 'Automation Hero',
    badgeImage: '/automation-hero-badge.png',
    requirements: [
      { description: 'Complete Python For DevOps course' },
      { description: 'Solve community doubts', metric: '10+ per month' },
      { description: 'LinkedIn posts with #TrainWithShubham', metric: '2+ per week' }
    ],
    perks: [
      { description: 'Special Discord role and channel access' },
      { description: 'Featured in monthly newsletter' },
      { description: 'Resume review session' }
    ],
    color: 'orange'
  },
  cloud: {
    id: 'cloud',
    name: 'Cloud Hero',
    badgeImage: '/cloud-hero-badge.png',
    requirements: [
      { description: 'Achieve Automation Hero status first' },
      { description: 'Complete AWS Zero To Hero (CCP & SAA) courses' },
      { description: 'Solve community doubts', metric: '15+ per month' },
      { description: 'LinkedIn posts with #TrainWithShubham', metric: '3+ per week' }
    ],
    perks: [
      { description: 'All Automation Hero perks' },
      { description: 'Priority access to community meetups', exclusive: true },
      { description: 'Job referral opportunities', exclusive: true },
      { description: '1-on-1 mentorship session', exclusive: true }
    ],
    color: 'blue'
  },
  devops: {
    id: 'devops',
    name: 'DevOps Hero',
    badgeImage: '/devops-hero-badge.png',
    requirements: [
      { description: 'Complete DevOps - Zero To Hero course' },
      { description: 'Solve community doubts', metric: '20+ per month' },
      { description: 'LinkedIn posts with #TrainWithShubham', metric: '4+ per week' }
    ],
    perks: [
      { description: 'All Cloud Hero perks' },
      { description: 'Exclusive meetup invitations', exclusive: true },
      { description: 'Featured on community website heroes page', exclusive: true },
      { description: 'Direct job referrals to partner companies', exclusive: true },
      { description: 'Guest speaker opportunities in community events', exclusive: true }
    ],
    color: 'purple'
  }
};

export const heroes: Hero[] = [
  // Example hero
  {
    id: 'amitabh-soni',
    name: 'Amitabh Soni',
    title: 'Senior DevOps Engineer',
    photo: '/heroes/amitabh-soni.jpg',
    location: 'Bangalore, India',
    heroSince: '2024-01-15',
    about: 'Passionate DevOps engineer with expertise in Kubernetes, AWS, and CI/CD pipelines. Active community contributor helping members solve complex infrastructure challenges.',
    tier: 'devops',
    socialLinks: {
      github: 'https://github.com/amitabhsoni',
      linkedin: 'https://linkedin.com/in/amitabhsoni',
      youtube: 'https://youtube.com/@amitabhsoni',
      blog: 'https://amitabhsoni.dev'
    }
  }
  // More heroes can be added here
];
```

### 2. Main Page Component (`src/app/heroes/page.tsx`)

**Server Component** - Handles metadata and initial data loading:

```typescript
import { Metadata } from 'next';
import { HeroesClient } from './heroes-client';
import { heroes, tierInfo } from '@/data/heroes';
import { HeroTierSection } from '@/components/heroes/hero-tier-section';
import { Trophy, Sparkles } from 'lucide-react';
import { SectionDivider } from '@/components/section-divider';

export const metadata: Metadata = {
  title: 'Community Heroes | TWS Community Hub',
  description: 'Recognizing outstanding community members who excel in course completion, doubt solving, and LinkedIn engagement.',
  keywords: ['Community Heroes', 'Recognition Program', 'DevOps Community', 'TrainWithShubham'],
  openGraph: {
    title: 'Community Heroes | TWS Community Hub',
    description: 'Recognizing outstanding community members who excel in course completion, doubt solving, and LinkedIn engagement.',
    images: ['/og-image.svg'],
  },
};

export default function HeroesPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline flex items-center justify-center gap-4">
          <Trophy className="h-10 w-10 text-primary" />
          ./Community-Heroes
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Recognizing excellence in learning, community engagement, and brand advocacy
        </p>
        <p className="text-sm text-accent mt-1">
          // Three tiers of recognition based on measurable achievements
        </p>
      </div>

      <SectionDivider />

      {/* Program Overview */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <Sparkles className="inline-block mr-2 h-8 w-8 text-primary" />
          Recognition Tiers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <HeroTierSection tier={tierInfo.automation} />
          <HeroTierSection tier={tierInfo.cloud} />
          <HeroTierSection tier={tierInfo.devops} />
        </div>
      </section>

      <SectionDivider />

      {/* Heroes Showcase */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">
          Meet Our Heroes
        </h2>
        <HeroesClient heroes={heroes} />
      </section>
    </div>
  );
}
```

### 3. Client Component for Filtering (`src/app/heroes/heroes-client.tsx`)

**Client Component** - Handles interactive filtering:

```typescript
'use client';

import { useState } from 'react';
import { Hero, HeroTier } from '@/data/heroes';
import { HeroCard } from '@/components/heroes/hero-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type HeroesClientProps = {
  heroes: Hero[];
};

export function HeroesClient({ heroes }: HeroesClientProps) {
  const [selectedTier, setSelectedTier] = useState<HeroTier | 'all'>('all');

  const filteredHeroes = selectedTier === 'all' 
    ? heroes 
    : heroes.filter(hero => hero.tier === selectedTier);

  const tierFilters: Array<{ value: HeroTier | 'all'; label: string }> = [
    { value: 'all', label: 'All Heroes' },
    { value: 'automation', label: 'Automation' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'devops', label: 'DevOps' }
  ];

  return (
    <div>
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {tierFilters.map(filter => (
          <Button
            key={filter.value}
            variant={selectedTier === filter.value ? 'default' : 'outline'}
            onClick={() => setSelectedTier(filter.value)}
            className="min-h-[44px]"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Heroes Grid */}
      {filteredHeroes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHeroes.map(hero => (
            <HeroCard key={hero.id} hero={hero} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No heroes in this tier yet. Be the first!
          </p>
        </div>
      )}
    </div>
  );
}
```

### 4. Hero Card Component (`src/components/heroes/hero-card.tsx`)

```typescript
'use client';

import { Hero, tierInfo } from '@/data/heroes';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Youtube, Globe, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import { TierBadge } from './tier-badge';

type HeroCardProps = {
  hero: Hero;
};

export function HeroCard({ hero }: HeroCardProps) {
  const tier = tierInfo[hero.tier];
  const heroSinceDate = new Date(hero.heroSince).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={hero.photo}
              alt={`${hero.name} profile photo`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">{hero.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{hero.title}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{hero.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <TierBadge tier={hero.tier} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Since {heroSinceDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {hero.about}
        </p>
        <div className="flex flex-wrap gap-2">
          {hero.socialLinks.github && (
            <Button variant="outline" size="sm" asChild>
              <a href={hero.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {hero.socialLinks.linkedin && (
            <Button variant="outline" size="sm" asChild>
              <a href={hero.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {hero.socialLinks.youtube && (
            <Button variant="outline" size="sm" asChild>
              <a href={hero.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                <Youtube className="h-4 w-4" />
              </a>
            </Button>
          )}
          {hero.socialLinks.blog && (
            <Button variant="outline" size="sm" asChild>
              <a href={hero.socialLinks.blog} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5. Hero Tier Section Component (`src/components/heroes/hero-tier-section.tsx`)

```typescript
import { TierInfo } from '@/data/heroes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Gift } from 'lucide-react';
import Image from 'next/image';

type HeroTierSectionProps = {
  tier: TierInfo;
};

export function HeroTierSection({ tier }: HeroTierSectionProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 relative w-24 h-24">
          <Image
            src={tier.badgeImage}
            alt={`${tier.name} badge`}
            fill
            className="object-contain"
            sizes="96px"
          />
        </div>
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {/* Requirements */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Requirements
          </h4>
          <ul className="space-y-2">
            {tier.requirements.map((req, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  {req.description}
                  {req.metric && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {req.metric}
                    </Badge>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Perks */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            Perks
          </h4>
          <ul className="space-y-2">
            {tier.perks.map((perk, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  {perk.description}
                  {perk.exclusive && (
                    <Badge variant="default" className="ml-2 text-xs">
                      New
                    </Badge>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 6. Tier Badge Component (`src/components/heroes/tier-badge.tsx`)

```typescript
import { HeroTier, tierInfo } from '@/data/heroes';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type TierBadgeProps = {
  tier: HeroTier;
  size?: 'sm' | 'md' | 'lg';
};

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const info = tierInfo[tier];
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        <Image
          src={info.badgeImage}
          alt={`${info.name} badge`}
          fill
          className="object-contain"
          sizes={size === 'sm' ? '24px' : size === 'md' ? '32px' : '48px'}
        />
      </div>
      <Badge variant="secondary" className="text-xs">
        {info.name}
      </Badge>
    </div>
  );
}
```

## Data Models

### Hero Profile Schema

```typescript
{
  id: string;              // Unique identifier (kebab-case)
  name: string;            // Full name
  title: string;           // Professional title
  photo: string;           // Path to photo in /public (e.g., '/heroes/name.jpg')
  location: string;        // City, Country
  heroSince: string;       // ISO date string
  about: string;           // Brief bio (2-3 sentences)
  tier: HeroTier;          // 'automation' | 'cloud' | 'devops'
  socialLinks: {
    github?: string;       // Full URL
    linkedin?: string;     // Full URL
    youtube?: string;      // Full URL
    blog?: string;         // Full URL
  }
}
```

**Note on Profile Photos:**
- All hero photos should be stored locally in `/public/heroes/` directory
- Use format: `/heroes/{hero-id}.jpg` or `/heroes/{hero-id}.png`
- Recommended size: 400x400px minimum for quality display
- Images will be optimized by Next.js Image component automatically

### Tier Information Schema

```typescript
{
  id: HeroTier;
  name: string;
  badgeImage: string;
  requirements: Array<{
    description: string;
    metric?: string;
  }>;
  perks: Array<{
    description: string;
    exclusive?: boolean;
  }>;
  color: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Hero data validation
*For any* hero object in the heroes array, it must contain all required fields (id, name, title, photo, location, heroSince, about, tier) and the tier value must be one of the valid HeroTier values.
**Validates: Requirements 5.3, 9.2**

### Property 2: Tier filter correctness
*For any* selected tier filter, all displayed heroes must have a tier property matching the selected filter, or all heroes must be displayed when "all" is selected.
**Validates: Requirements 10.2, 10.3**

### Property 3: Social links rendering
*For any* hero with social links, only the links that are defined (not undefined) should be rendered as clickable buttons.
**Validates: Requirements 4.9, 5.4**

### Property 4: Image path validity
*For any* hero photo or badge image path, the path must start with "/" and point to a file in the public directory.
**Validates: Requirements 6.1, 6.3**

### Property 5: Hero since date formatting
*For any* valid ISO date string in the heroSince field, the formatted display must show the month name and year in "Month YYYY" format.
**Validates: Requirements 4.6**

### Property 6: Empty state display
*For any* tier filter selection that results in zero matching heroes, the system must display the "No heroes in this tier yet" message.
**Validates: Requirements 10.4**

### Property 7: Navigation link presence
*For any* page render, the main navigation must include a "Heroes" link that navigates to "/heroes".
**Validates: Requirements 7.1, 7.2**

### Property 8: Responsive layout adaptation
*For any* viewport width, the heroes grid must adapt to display 1 column on mobile, 2 columns on tablet, and 3 columns on desktop.
**Validates: Requirements 1.5**

### Property 9: Tier requirements completeness
*For any* tier in tierInfo, the requirements array must contain at least one requirement with a description.
**Validates: Requirements 2.1-2.10**

### Property 10: Tier perks completeness
*For any* tier in tierInfo, the perks array must contain at least one perk with a description.
**Validates: Requirements 3.1-3.10**

## Error Handling

### Image Loading Failures
- Use Next.js Image component with fallback placeholder
- Implement onError handler to display default avatar
- Log errors to console for debugging
- All images stored locally in `/public/heroes/` directory
- Use consistent naming: `/heroes/{hero-id}.jpg`

### Invalid Hero Data
- TypeScript compile-time validation for required fields
- Runtime validation for tier values using type guards
- Graceful degradation for missing optional fields

### Navigation Errors
- Use Next.js Link component for client-side navigation
- Fallback to standard anchor tags if needed
- Handle 404 errors with Next.js error boundaries

### Filter State Management
- Initialize with safe default ('all')
- Validate filter values before applying
- Maintain filter state in client component

## Testing Strategy

### Unit Tests
- Test hero data structure validation
- Test date formatting functions
- Test filter logic with various inputs
- Test social link rendering with different combinations
- Test empty state rendering
- Test tier badge component with all tier types

### Property-Based Tests
- Property tests will use **fast-check** library for TypeScript
- Each test will run a minimum of **100 iterations**
- Tests will be tagged with format: **Feature: community-heroes, Property {number}: {property_text}**

**Property Test 1: Hero data validation**
- Generate random hero objects with various field combinations
- Verify all required fields are present
- Verify tier is a valid HeroTier value
- Tag: **Feature: community-heroes, Property 1: Hero data validation**

**Property Test 2: Tier filter correctness**
- Generate random arrays of heroes with different tiers
- Apply each possible filter value
- Verify filtered results match the filter criteria
- Tag: **Feature: community-heroes, Property 2: Tier filter correctness**

**Property Test 3: Social links rendering**
- Generate heroes with random combinations of social links
- Verify only defined links are rendered
- Verify undefined links are not rendered
- Tag: **Feature: community-heroes, Property 3: Social links rendering**

**Property Test 4: Image path validity**
- Generate random hero and badge image paths
- Verify all paths start with "/"
- Verify paths are valid strings
- Tag: **Feature: community-heroes, Property 4: Image path validity**

**Property Test 5: Hero since date formatting**
- Generate random valid ISO date strings
- Format each date
- Verify output matches "Month YYYY" pattern
- Tag: **Feature: community-heroes, Property 5: Hero since date formatting**

**Property Test 6: Empty state display**
- Generate hero arrays with various tier distributions
- Apply filters that result in empty results
- Verify empty state message is displayed
- Tag: **Feature: community-heroes, Property 6: Empty state display**

### Integration Tests
- Test full page rendering with sample data
- Test navigation from navbar to heroes page
- Test filter interaction and state updates
- Test responsive layout at different breakpoints
- Test dark mode compatibility

### Accessibility Tests
- Verify ARIA labels on interactive elements
- Test keyboard navigation through filters and links
- Verify image alt text is present and descriptive
- Test screen reader compatibility
- Verify minimum touch target sizes (44x44px)

### Visual Regression Tests
- Capture screenshots of heroes page in different states
- Test with 0 heroes, 1 hero, multiple heroes
- Test each filter state
- Test mobile, tablet, and desktop layouts
- Test light and dark themes
