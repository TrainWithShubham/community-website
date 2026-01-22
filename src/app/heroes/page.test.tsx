import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { heroes, tierInfo } from '@/data/heroes';

// Feature: community-heroes, Property 4: Image path validity
describe('Image path validity property test', () => {
  it('should have valid image paths for all heroes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...heroes),
        (hero) => {
          // Verify photo path starts with /heroes/
          const hasValidPhotoPath = hero.photo.startsWith('/heroes/');
          
          // Verify photo path has a file extension
          const hasExtension = /\.(jpg|jpeg|png|svg|webp|avif)$/i.test(hero.photo);
          
          return hasValidPhotoPath && hasExtension;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have valid badge image paths for all tiers', () => {
    const tiers = Object.values(tierInfo);
    
    fc.assert(
      fc.property(
        fc.constantFrom(...tiers),
        (tier) => {
          // Verify badge image path starts with /
          const hasValidPath = tier.badgeImage.startsWith('/');
          
          // Verify badge image path has a file extension
          const hasExtension = /\.(jpg|jpeg|png|svg|webp|avif)$/i.test(tier.badgeImage);
          
          // Verify badge image path contains expected naming pattern
          const hasValidName = tier.badgeImage.includes('badge');
          
          return hasValidPath && hasExtension && hasValidName;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Unit tests for heroes page
describe('HeroesPage unit tests', () => {
  it('should have correct page structure with all required data', () => {
    // Verify we have all the data needed for the page
    expect(tierInfo).toBeDefined();
    expect(heroes).toBeDefined();
    
    // Verify all three tiers exist
    expect(tierInfo.automation).toBeDefined();
    expect(tierInfo.cloud).toBeDefined();
    expect(tierInfo.devops).toBeDefined();
  });

  it('should export tierInfo with all three tiers', () => {
    expect(tierInfo).toBeDefined();
    expect(tierInfo.automation).toBeDefined();
    expect(tierInfo.cloud).toBeDefined();
    expect(tierInfo.devops).toBeDefined();
  });

  it('should have heroes array defined', () => {
    expect(heroes).toBeDefined();
    expect(Array.isArray(heroes)).toBe(true);
  });

  it('should have at least one example hero', () => {
    expect(heroes.length).toBeGreaterThan(0);
  });

  it('should have all tier info with required properties', () => {
    Object.values(tierInfo).forEach(tier => {
      expect(tier.id).toBeDefined();
      expect(tier.name).toBeDefined();
      expect(tier.badgeImage).toBeDefined();
      expect(tier.requirements).toBeDefined();
      expect(tier.perks).toBeDefined();
      expect(tier.color).toBeDefined();
      expect(Array.isArray(tier.requirements)).toBe(true);
      expect(Array.isArray(tier.perks)).toBe(true);
    });
  });

  it('should have tier requirements as non-empty arrays', () => {
    Object.values(tierInfo).forEach(tier => {
      expect(tier.requirements.length).toBeGreaterThan(0);
    });
  });

  it('should have tier perks as non-empty arrays', () => {
    Object.values(tierInfo).forEach(tier => {
      expect(tier.perks.length).toBeGreaterThan(0);
    });
  });
});
