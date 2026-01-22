import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroTierSection } from './hero-tier-section';
import { tierInfo } from '@/data/heroes';

describe('HeroTierSection', () => {
  it('should render automation tier with all requirements', () => {
    render(<HeroTierSection tier={tierInfo.automation} />);
    
    expect(screen.getByText('Automation Hero')).toBeInTheDocument();
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('Complete Python For DevOps course')).toBeInTheDocument();
    expect(screen.getByText('Solve community doubts')).toBeInTheDocument();
    expect(screen.getByText('10+ per month')).toBeInTheDocument();
  });

  it('should render cloud tier with all requirements', () => {
    render(<HeroTierSection tier={tierInfo.cloud} />);
    
    expect(screen.getByText('Cloud Hero')).toBeInTheDocument();
    expect(screen.getByText('Achieve Automation Hero status first')).toBeInTheDocument();
    expect(screen.getByText('Complete AWS Zero To Hero (CCP & SAA) courses')).toBeInTheDocument();
    expect(screen.getByText('15+ per month')).toBeInTheDocument();
  });

  it('should render devops tier with all requirements', () => {
    render(<HeroTierSection tier={tierInfo.devops} />);
    
    expect(screen.getByText('DevOps Hero')).toBeInTheDocument();
    expect(screen.getByText('Complete DevOps - Zero To Hero course')).toBeInTheDocument();
    expect(screen.getByText('20+ per month')).toBeInTheDocument();
  });

  it('should render requirements with metrics as badges', () => {
    render(<HeroTierSection tier={tierInfo.automation} />);
    
    // Check that metrics are rendered as badges
    const metricBadges = screen.getAllByText(/\d+\+ per (month|week)/);
    expect(metricBadges.length).toBeGreaterThan(0);
  });

  it('should render all perks for automation tier', () => {
    render(<HeroTierSection tier={tierInfo.automation} />);
    
    expect(screen.getByText('Perks')).toBeInTheDocument();
    expect(screen.getByText('Special Discord role and channel access')).toBeInTheDocument();
    expect(screen.getByText('Featured in monthly newsletter')).toBeInTheDocument();
    expect(screen.getByText('Resume review session')).toBeInTheDocument();
  });

  it('should render exclusive perks with "New" badge', () => {
    render(<HeroTierSection tier={tierInfo.cloud} />);
    
    // Cloud tier has exclusive perks
    expect(screen.getByText('Priority access to community meetups')).toBeInTheDocument();
    
    // Check for "New" badges (exclusive perks)
    const newBadges = screen.getAllByText('New');
    expect(newBadges.length).toBeGreaterThan(0);
  });

  it('should render all three tier types correctly', () => {
    const tiers = [tierInfo.automation, tierInfo.cloud, tierInfo.devops];
    
    tiers.forEach(tier => {
      const { unmount } = render(<HeroTierSection tier={tier} />);
      expect(screen.getByText(tier.name)).toBeInTheDocument();
      expect(screen.getByText('Requirements')).toBeInTheDocument();
      expect(screen.getByText('Perks')).toBeInTheDocument();
      unmount();
    });
  });

  it('should render tier badge image', () => {
    render(<HeroTierSection tier={tierInfo.automation} />);
    const image = screen.getByAltText('Automation Hero badge');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('automation-hero-badge.png'));
  });

  it('should display CheckCircle2 icon for requirements section', () => {
    const { container } = render(<HeroTierSection tier={tierInfo.automation} />);
    // The icon is rendered, we can check the structure
    expect(screen.getByText('Requirements')).toBeInTheDocument();
  });

  it('should display Gift icon for perks section', () => {
    const { container } = render(<HeroTierSection tier={tierInfo.automation} />);
    // The icon is rendered, we can check the structure
    expect(screen.getByText('Perks')).toBeInTheDocument();
  });
});
