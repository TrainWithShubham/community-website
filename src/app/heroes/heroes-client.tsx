'use client';

import { useState } from 'react';
import { Hero, HeroTier } from '@/data/heroes';
import { HeroCard } from '@/components/heroes/hero-card';
import { Button } from '@/components/ui/button';

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
