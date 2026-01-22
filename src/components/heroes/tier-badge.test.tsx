import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TierBadge } from './tier-badge';
import { HeroTier } from '@/data/heroes';

describe('TierBadge', () => {
  it('should render automation tier badge', () => {
    render(<TierBadge tier="automation" />);
    expect(screen.getByText('Automation Hero')).toBeInTheDocument();
    expect(screen.getByAltText('Automation Hero badge')).toBeInTheDocument();
  });

  it('should render cloud tier badge', () => {
    render(<TierBadge tier="cloud" />);
    expect(screen.getByText('Cloud Hero')).toBeInTheDocument();
    expect(screen.getByAltText('Cloud Hero badge')).toBeInTheDocument();
  });

  it('should render devops tier badge', () => {
    render(<TierBadge tier="devops" />);
    expect(screen.getByText('DevOps Hero')).toBeInTheDocument();
    expect(screen.getByAltText('DevOps Hero badge')).toBeInTheDocument();
  });

  it('should render with small size variant', () => {
    const { container } = render(<TierBadge tier="automation" size="sm" />);
    const imageContainer = container.querySelector('.h-6.w-6');
    expect(imageContainer).toBeInTheDocument();
  });

  it('should render with medium size variant (default)', () => {
    const { container } = render(<TierBadge tier="automation" />);
    const imageContainer = container.querySelector('.h-8.w-8');
    expect(imageContainer).toBeInTheDocument();
  });

  it('should render with large size variant', () => {
    const { container } = render(<TierBadge tier="automation" size="lg" />);
    const imageContainer = container.querySelector('.h-12.w-12');
    expect(imageContainer).toBeInTheDocument();
  });

  it('should display badge image with correct src', () => {
    render(<TierBadge tier="automation" />);
    const image = screen.getByAltText('Automation Hero badge');
    expect(image).toHaveAttribute('src', expect.stringContaining('automation-hero-badge.png'));
  });

  it('should render all three tier types correctly', () => {
    const tiers: HeroTier[] = ['automation', 'cloud', 'devops'];
    
    tiers.forEach(tier => {
      const { unmount } = render(<TierBadge tier={tier} />);
      const tierNames = {
        automation: 'Automation Hero',
        cloud: 'Cloud Hero',
        devops: 'DevOps Hero'
      };
      expect(screen.getByText(tierNames[tier])).toBeInTheDocument();
      unmount();
    });
  });
});
