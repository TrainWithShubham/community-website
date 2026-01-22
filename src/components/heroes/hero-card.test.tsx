import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { HeroCard } from './hero-card';
import { Hero, SocialLinks } from '@/data/heroes';

// Feature: community-heroes, Property 3: Social links rendering
describe('Social links rendering property test', () => {
  it('should only render social link buttons for defined links', () => {
    // Generate arbitrary social links with random combinations
    const socialLinksArb = fc.record({
      github: fc.option(fc.webUrl(), { nil: undefined }),
      linkedin: fc.option(fc.webUrl(), { nil: undefined }),
      youtube: fc.option(fc.webUrl(), { nil: undefined }),
      blog: fc.option(fc.webUrl(), { nil: undefined }),
    });

    const heroArb = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
      name: fc.string({ minLength: 2, maxLength: 30 }).filter(s => s.trim().length > 1),
      title: fc.string({ minLength: 2, maxLength: 30 }).filter(s => s.trim().length > 1),
      photo: fc.constant('/heroes/test.jpg'),
      location: fc.string({ minLength: 2, maxLength: 30 }).filter(s => s.trim().length > 1),
      heroSince: fc.date({ min: new Date(2020, 0, 1), max: new Date(2025, 11, 31) }).map(d => d.toISOString()),
      about: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 4),
      tier: fc.constantFrom('automation', 'cloud', 'devops'),
      socialLinks: socialLinksArb,
    });

    fc.assert(
      fc.property(heroArb, (hero: Hero) => {
        const { unmount } = render(<HeroCard hero={hero} />);
        
        // Check GitHub link
        if (hero.socialLinks.github) {
          const githubLink = screen.getByRole('link', { name: /github profile/i });
          expect(githubLink).toBeInTheDocument();
          expect(githubLink).toHaveAttribute('href', hero.socialLinks.github);
        } else {
          const githubLinks = screen.queryAllByRole('link', { name: /github profile/i });
          expect(githubLinks.length).toBe(0);
        }
        
        // Check LinkedIn link
        if (hero.socialLinks.linkedin) {
          const linkedinLink = screen.getByRole('link', { name: /linkedin profile/i });
          expect(linkedinLink).toBeInTheDocument();
          expect(linkedinLink).toHaveAttribute('href', hero.socialLinks.linkedin);
        } else {
          const linkedinLinks = screen.queryAllByRole('link', { name: /linkedin profile/i });
          expect(linkedinLinks.length).toBe(0);
        }
        
        // Check YouTube link
        if (hero.socialLinks.youtube) {
          const youtubeLink = screen.getByRole('link', { name: /youtube channel/i });
          expect(youtubeLink).toBeInTheDocument();
          expect(youtubeLink).toHaveAttribute('href', hero.socialLinks.youtube);
        } else {
          const youtubeLinks = screen.queryAllByRole('link', { name: /youtube channel/i });
          expect(youtubeLinks.length).toBe(0);
        }
        
        // Check Blog link
        if (hero.socialLinks.blog) {
          const blogLink = screen.getByRole('link', { name: /blog website/i });
          expect(blogLink).toBeInTheDocument();
          expect(blogLink).toHaveAttribute('href', hero.socialLinks.blog);
        } else {
          const blogLinks = screen.queryAllByRole('link', { name: /blog website/i });
          expect(blogLinks.length).toBe(0);
        }
        
        unmount();
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: community-heroes, Property 5: Hero since date formatting
describe('Hero since date formatting property test', () => {
  it('should format any valid ISO date string to "Month YYYY" format', () => {
    const heroArb = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
      name: fc.string({ minLength: 2, maxLength: 30 }).filter(s => s.trim().length > 1),
      title: fc.string({ minLength: 2, maxLength: 30 }).filter(s => s.trim().length > 1),
      photo: fc.constant('/heroes/test.jpg'),
      location: fc.string({ minLength: 2, maxLength: 30 }).filter(s => s.trim().length > 1),
      heroSince: fc.date({ min: new Date(2020, 0, 1), max: new Date(2025, 11, 31) }).map(d => d.toISOString()),
      about: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 4),
      tier: fc.constantFrom('automation', 'cloud', 'devops'),
      socialLinks: fc.record({
        github: fc.option(fc.webUrl(), { nil: undefined }),
        linkedin: fc.option(fc.webUrl(), { nil: undefined }),
        youtube: fc.option(fc.webUrl(), { nil: undefined }),
        blog: fc.option(fc.webUrl(), { nil: undefined }),
      }),
    });

    fc.assert(
      fc.property(heroArb, (hero: Hero) => {
        const { unmount } = render(<HeroCard hero={hero} />);
        
        // Parse the expected format
        const date = new Date(hero.heroSince);
        const expectedMonth = date.toLocaleDateString('en-US', { month: 'long' });
        const expectedYear = date.toLocaleDateString('en-US', { year: 'numeric' });
        const expectedFormat = `${expectedMonth} ${expectedYear}`;
        
        // Check that the formatted date appears in the document
        const sinceText = screen.getByText(new RegExp(`Since ${expectedFormat}`));
        expect(sinceText).toBeInTheDocument();
        
        unmount();
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// Unit tests
describe('HeroCard unit tests', () => {
  const mockHero: Hero = {
    id: 'test-hero',
    name: 'Test Hero',
    title: 'Test Engineer',
    photo: '/heroes/test.jpg',
    location: 'Test City, Test Country',
    heroSince: '2024-01-15',
    about: 'This is a test hero with a test description.',
    tier: 'devops',
    socialLinks: {
      github: 'https://github.com/testhero',
      linkedin: 'https://linkedin.com/in/testhero',
      youtube: 'https://youtube.com/@testhero',
      blog: 'https://testhero.dev'
    }
  };

  it('should render hero with complete data', () => {
    render(<HeroCard hero={mockHero} />);
    
    expect(screen.getByText('Test Hero')).toBeInTheDocument();
    expect(screen.getByText('Test Engineer')).toBeInTheDocument();
    expect(screen.getByText('Test City, Test Country')).toBeInTheDocument();
    expect(screen.getByText(/This is a test hero/)).toBeInTheDocument();
  });

  it('should render hero with missing optional social links', () => {
    const heroWithoutSocial: Hero = {
      ...mockHero,
      socialLinks: {}
    };
    
    render(<HeroCard hero={heroWithoutSocial} />);
    
    expect(screen.getByText('Test Hero')).toBeInTheDocument();
    expect(screen.queryAllByRole('link').length).toBe(0);
  });

  it('should render hero with partial social links', () => {
    const heroWithPartialSocial: Hero = {
      ...mockHero,
      socialLinks: {
        github: 'https://github.com/testhero',
        linkedin: 'https://linkedin.com/in/testhero'
      }
    };
    
    render(<HeroCard hero={heroWithPartialSocial} />);
    
    expect(screen.getByRole('link', { name: /github profile/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin profile/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /youtube channel/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /blog website/i })).not.toBeInTheDocument();
  });

  it('should render hero photo with correct alt text', () => {
    render(<HeroCard hero={mockHero} />);
    
    const image = screen.getByAltText('Test Hero profile photo');
    expect(image).toBeInTheDocument();
  });

  it('should render tier badge', () => {
    render(<HeroCard hero={mockHero} />);
    
    expect(screen.getByText('DevOps Hero')).toBeInTheDocument();
  });

  it('should format hero since date correctly', () => {
    render(<HeroCard hero={mockHero} />);
    
    expect(screen.getByText('Since January 2024')).toBeInTheDocument();
  });

  it('should render all social links with correct hrefs', () => {
    render(<HeroCard hero={mockHero} />);
    
    const githubLink = screen.getByRole('link', { name: /github profile/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/testhero');
    
    const linkedinLink = screen.getByRole('link', { name: /linkedin profile/i });
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/testhero');
    
    const youtubeLink = screen.getByRole('link', { name: /youtube channel/i });
    expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com/@testhero');
    
    const blogLink = screen.getByRole('link', { name: /blog website/i });
    expect(blogLink).toHaveAttribute('href', 'https://testhero.dev');
  });

  it('should open social links in new tab', () => {
    render(<HeroCard hero={mockHero} />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
