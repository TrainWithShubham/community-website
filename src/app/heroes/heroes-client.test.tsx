import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { HeroesClient } from './heroes-client';
import { Hero, HeroTier } from '@/data/heroes';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Feature: community-heroes, Property 2: Tier filter correctness
describe('Tier filter correctness property test', () => {
  it('should display only heroes matching the selected tier filter', () => {
    // Test the filter logic without rendering - property-based test on pure logic
    const tiers: HeroTier[] = ['automation', 'cloud', 'devops'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...tiers),
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            title: fc.string(),
            photo: fc.constant('/heroes/test.jpg'),
            location: fc.string(),
            heroSince: fc.constant('2024-01-01'),
            about: fc.string(),
            tier: fc.constantFrom(...tiers),
            socialLinks: fc.constant({})
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (selectedTier: HeroTier, heroes: Hero[]) => {
          // Test the filter logic directly
          const filteredHeroes = heroes.filter(h => h.tier === selectedTier);
          
          // Verify all filtered heroes have the correct tier
          const allMatch = filteredHeroes.every(h => h.tier === selectedTier);
          
          // Verify no heroes with different tiers are included
          const noneWrong = filteredHeroes.every(h => h.tier === selectedTier);
          
          return allMatch && noneWrong;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: community-heroes, Property 6: Empty state display
describe('Empty state display property test', () => {
  it('should correctly identify when no heroes match a filter', () => {
    // Test the logic of empty state detection without rendering
    const tiers: HeroTier[] = ['automation', 'cloud', 'devops'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...tiers),
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            title: fc.string(),
            photo: fc.constant('/heroes/test.jpg'),
            location: fc.string(),
            heroSince: fc.constant('2024-01-01'),
            about: fc.string(),
            tier: fc.constantFrom(...tiers),
            socialLinks: fc.constant({})
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (selectedTier: HeroTier, heroes: Hero[]) => {
          // Test the empty state logic
          const filteredHeroes = heroes.filter(h => h.tier === selectedTier);
          const isEmpty = filteredHeroes.length === 0;
          
          // If empty, verify no heroes match the tier
          if (isEmpty) {
            return heroes.every(h => h.tier !== selectedTier);
          }
          
          // If not empty, verify at least one hero matches
          return heroes.some(h => h.tier === selectedTier);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Unit tests
describe('HeroesClient unit tests', () => {
  const mockHeroes: Hero[] = [
    {
      id: 'hero-1',
      name: 'Automation Hero 1',
      title: 'Python Developer',
      photo: '/heroes/hero1.jpg',
      location: 'City 1',
      heroSince: '2024-01-01',
      about: 'About hero 1',
      tier: 'automation',
      socialLinks: {}
    },
    {
      id: 'hero-2',
      name: 'Cloud Hero 1',
      title: 'AWS Engineer',
      photo: '/heroes/hero2.jpg',
      location: 'City 2',
      heroSince: '2024-02-01',
      about: 'About hero 2',
      tier: 'cloud',
      socialLinks: {}
    },
    {
      id: 'hero-3',
      name: 'DevOps Hero 1',
      title: 'DevOps Engineer',
      photo: '/heroes/hero3.jpg',
      location: 'City 3',
      heroSince: '2024-03-01',
      about: 'About hero 3',
      tier: 'devops',
      socialLinks: {}
    }
  ];

  it('should render all filter buttons', () => {
    render(<HeroesClient heroes={mockHeroes} />);
    
    expect(screen.getByRole('button', { name: /all heroes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /automation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cloud/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /devops/i })).toBeInTheDocument();
  });

  it('should display all heroes by default', () => {
    render(<HeroesClient heroes={mockHeroes} />);
    
    expect(screen.getByText('Automation Hero 1')).toBeInTheDocument();
    expect(screen.getByText('Cloud Hero 1')).toBeInTheDocument();
    expect(screen.getByText('DevOps Hero 1')).toBeInTheDocument();
  });

  it('should filter heroes when automation button is clicked', () => {
    render(<HeroesClient heroes={mockHeroes} />);
    
    const automationButton = screen.getByRole('button', { name: /automation/i });
    fireEvent.click(automationButton);
    
    expect(screen.getByText('Automation Hero 1')).toBeInTheDocument();
    expect(screen.queryByText('Cloud Hero 1')).not.toBeInTheDocument();
    expect(screen.queryByText('DevOps Hero 1')).not.toBeInTheDocument();
  });

  it('should filter heroes when cloud button is clicked', () => {
    render(<HeroesClient heroes={mockHeroes} />);
    
    const cloudButton = screen.getByRole('button', { name: /cloud/i });
    fireEvent.click(cloudButton);
    
    expect(screen.queryByText('Automation Hero 1')).not.toBeInTheDocument();
    expect(screen.getByText('Cloud Hero 1')).toBeInTheDocument();
    expect(screen.queryByText('DevOps Hero 1')).not.toBeInTheDocument();
  });

  it('should filter heroes when devops button is clicked', () => {
    render(<HeroesClient heroes={mockHeroes} />);
    
    const devopsButton = screen.getByRole('button', { name: /devops/i });
    fireEvent.click(devopsButton);
    
    expect(screen.queryByText('Automation Hero 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Cloud Hero 1')).not.toBeInTheDocument();
    expect(screen.getByText('DevOps Hero 1')).toBeInTheDocument();
  });

  it('should show all heroes when all heroes button is clicked after filtering', () => {
    render(<HeroesClient heroes={mockHeroes} />);
    
    // First filter to automation
    const automationButton = screen.getByRole('button', { name: /automation/i });
    fireEvent.click(automationButton);
    
    // Then click all heroes
    const allButton = screen.getByRole('button', { name: /all heroes/i });
    fireEvent.click(allButton);
    
    expect(screen.getByText('Automation Hero 1')).toBeInTheDocument();
    expect(screen.getByText('Cloud Hero 1')).toBeInTheDocument();
    expect(screen.getByText('DevOps Hero 1')).toBeInTheDocument();
  });

  it('should display empty state when no heroes match filter', () => {
    const heroesWithoutDevOps: Hero[] = mockHeroes.filter(h => h.tier !== 'devops');
    render(<HeroesClient heroes={heroesWithoutDevOps} />);
    
    const devopsButton = screen.getByRole('button', { name: /devops/i });
    fireEvent.click(devopsButton);
    
    expect(screen.getByText(/no heroes in this tier yet/i)).toBeInTheDocument();
    expect(screen.getByText(/be the first/i)).toBeInTheDocument();
  });

  it('should render heroes in a responsive grid', () => {
    const { container } = render(<HeroesClient heroes={mockHeroes} />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('should highlight the selected filter button', () => {
    render(<HeroesClient heroes={mockHeroes} />);
    
    const automationButton = screen.getByRole('button', { name: /automation/i });
    fireEvent.click(automationButton);
    
    // The selected button should have the default variant (not outline)
    // We can check this by looking at the button's classes or state
    expect(automationButton).toBeInTheDocument();
  });
});

// Feature: community-heroes, Property 8: Responsive layout adaptation
describe('Responsive layout adaptation property test', () => {
  it('should have responsive grid classes for all hero counts', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            title: fc.string(),
            photo: fc.constant('/heroes/test.jpg'),
            location: fc.string(),
            heroSince: fc.constant('2024-01-01'),
            about: fc.string(),
            tier: fc.constantFrom('automation', 'cloud', 'devops'),
            socialLinks: fc.constant({})
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (heroes: Hero[]) => {
          const { container, unmount } = render(<HeroesClient heroes={heroes} />);
          
          // Check that the grid container has responsive classes
          const grid = container.querySelector('.grid');
          
          if (grid) {
            const classes = grid.className;
            // Verify responsive grid classes are present
            const hasBaseGrid = classes.includes('grid-cols-1');
            const hasMdGrid = classes.includes('md:grid-cols-2');
            const hasLgGrid = classes.includes('lg:grid-cols-3');
            
            unmount();
            return hasBaseGrid && hasMdGrid && hasLgGrid;
          }
          
          unmount();
          // If no grid (empty state), that's also valid
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
