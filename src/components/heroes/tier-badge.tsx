import { HeroTier, tierInfo, tierColorMap } from '@/data/heroes';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type TierBadgeProps = {
  tier: HeroTier;
  size?: 'sm' | 'md' | 'lg';
};

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const info = tierInfo[tier];
  const colors = tierColorMap[tier];
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
      <Badge variant="secondary" className={cn('text-xs', colors.text, colors.bg)}>
        {info.name}
      </Badge>
    </div>
  );
}
