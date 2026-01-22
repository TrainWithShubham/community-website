import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { Navbar } from './navbar';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Feature: community-heroes, Property 7: Navigation link presence
describe('Navigation link presence property test', () => {
  it('should always include Heroes link in navigation', () => {
    // Test that Heroes link is consistently present across multiple renders
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { unmount } = render(<Navbar />);
          
          // Check that Heroes link exists in the navigation
          const heroesLink = screen.getByRole('link', { name: /heroes/i });
          expect(heroesLink).toBeInTheDocument();
          expect(heroesLink).toHaveAttribute('href', '/heroes');
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Unit tests for navbar
describe('Navbar unit tests', () => {
  it('should render Heroes link in navigation', () => {
    render(<Navbar />);
    
    const heroesLink = screen.getByRole('link', { name: /heroes/i });
    expect(heroesLink).toBeInTheDocument();
  });

  it('should have Heroes link navigate to /heroes', () => {
    render(<Navbar />);
    
    const heroesLink = screen.getByRole('link', { name: /heroes/i });
    expect(heroesLink).toHaveAttribute('href', '/heroes');
  });

  it('should render all navigation links', () => {
    render(<Navbar />);
    
    // Get all links and check that our navigation links are present
    const allLinks = screen.getAllByRole('link');
    const linkTexts = allLinks.map(link => link.textContent?.toLowerCase() || '');
    
    expect(linkTexts.some(text => text.includes('home'))).toBe(true);
    expect(linkTexts.some(text => text.includes('events'))).toBe(true);
    expect(linkTexts.some(text => text.includes('projects'))).toBe(true);
    expect(linkTexts.some(text => text.includes('interview questions'))).toBe(true);
    expect(linkTexts.some(text => text.includes('jobs'))).toBe(true);
    expect(linkTexts.some(text => text.includes('heroes'))).toBe(true);
  });

  it('should render Heroes link with Trophy icon', () => {
    const { container } = render(<Navbar />);
    
    // Find the Heroes button/link
    const heroesLink = screen.getByRole('link', { name: /heroes/i });
    expect(heroesLink).toBeInTheDocument();
    
    // Verify it contains an svg (icon)
    const icon = heroesLink.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should have Heroes link in correct position (after Jobs)', () => {
    render(<Navbar />);
    
    const allLinks = screen.getAllByRole('link');
    const linkTexts = allLinks.map(link => link.textContent?.toLowerCase() || '');
    
    const jobsIndex = linkTexts.findIndex(text => text.includes('jobs'));
    const heroesIndex = linkTexts.findIndex(text => text.includes('heroes'));
    
    // Heroes should come after Jobs in the navigation
    expect(heroesIndex).toBeGreaterThan(jobsIndex);
  });
});
