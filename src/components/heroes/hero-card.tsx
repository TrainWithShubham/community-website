'use client';

import { Hero, tierInfo, tierColorMap } from '@/data/heroes';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Youtube, Globe, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import { TierBadge } from './tier-badge';
import { cn } from '@/lib/utils';

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
    <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow border-l-4', tierColorMap[hero.tier].borderAccent)}>
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
              <a 
                href={hero.socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub profile"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {hero.socialLinks.linkedin && (
            <Button variant="outline" size="sm" asChild>
              <a 
                href={hero.socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {hero.socialLinks.youtube && (
            <Button variant="outline" size="sm" asChild>
              <a 
                href={hero.socialLinks.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube channel"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </Button>
          )}
          {hero.socialLinks.blog && (
            <Button variant="outline" size="sm" asChild>
              <a 
                href={hero.socialLinks.blog} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Blog website"
              >
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
