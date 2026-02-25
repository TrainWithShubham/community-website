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

  const tierFilters: Array<{ value: HeroTier | 'all'; label: string; ariaLabel: string }> = [
    { value: 'all', label: 'ls -a ./heroes', ariaLabel: 'All Heroes' },
    { value: 'automation', label: 'grep automation', ariaLabel: 'Automation' },
    { value: 'cloud', label: 'grep cloud', ariaLabel: 'Cloud' },
    { value: 'devops', label: 'grep devops', ariaLabel: 'DevOps' }
  ];

  return (
    <div>
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {tierFilters.map(filter => (
          <Button
            key={filter.value}
            variant={selectedTier === filter.value ? 'default' : 'outline'}
            onClick={() => setSelectedTier(filter.value)}
            className="min-h-[44px] font-mono text-sm"
            aria-label={filter.ariaLabel}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mb-8 font-mono">
        {'// '}{filteredHeroes.length} heroes found
      </p>

      {/* Heroes Grid */}
      {filteredHeroes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHeroes.map(hero => (
            <HeroCard key={hero.id} hero={hero} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg font-mono">
            {'// No results found. Be the first hero in this tier!'}
          </p>
        </div>
      )}
    </div>
  );
}
