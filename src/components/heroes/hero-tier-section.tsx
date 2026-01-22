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
