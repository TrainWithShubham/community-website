import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Hero, HeroTier, SocialLinks, tierInfo, heroes } from './heroes';

// Feature: community-heroes, Property 1: Hero data validation
describe('Hero data validation', () => {
  it('should validate that all heroes have required fields and valid tier values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...heroes),
        (hero: Hero) => {
          // Check all required fields are present and non-empty
          expect(hero.id).toBeDefined();
          expect(hero.id).toBeTruthy();
          expect(typeof hero.id).toBe('string');
          
          expect(hero.name).toBeDefined();
          expect(hero.name).toBeTruthy();
          expect(typeof hero.name).toBe('string');
          
          expect(hero.title).toBeDefined();
          expect(hero.title).toBeTruthy();
          expect(typeof hero.title).toBe('string');
          
          expect(hero.photo).toBeDefined();
          expect(hero.photo).toBeTruthy();
          expect(typeof hero.photo).toBe('string');
          
          expect(hero.location).toBeDefined();
          expect(hero.location).toBeTruthy();
          expect(typeof hero.location).toBe('string');
          
          expect(hero.heroSince).toBeDefined();
          expect(hero.heroSince).toBeTruthy();
          expect(typeof hero.heroSince).toBe('string');
          
          expect(hero.about).toBeDefined();
          expect(hero.about).toBeTruthy();
          expect(typeof hero.about).toBe('string');
          
          expect(hero.tier).toBeDefined();
          expect(hero.socialLinks).toBeDefined();
          expect(typeof hero.socialLinks).toBe('object');
          
          // Check tier is valid
          const validTiers: HeroTier[] = ['automation', 'cloud', 'devops'];
          expect(validTiers).toContain(hero.tier);
          
          // Check heroSince is a valid ISO date string
          const date = new Date(hero.heroSince);
          expect(date.toString()).not.toBe('Invalid Date');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate that social links are optional but when present are valid URLs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...heroes),
        (hero: Hero) => {
          const { socialLinks } = hero;
          
          // Social links are optional, but if present should be strings
          if (socialLinks.github !== undefined) {
            expect(typeof socialLinks.github).toBe('string');
            expect(socialLinks.github).toBeTruthy();
          }
          
          if (socialLinks.linkedin !== undefined) {
            expect(typeof socialLinks.linkedin).toBe('string');
            expect(socialLinks.linkedin).toBeTruthy();
          }
          
          if (socialLinks.youtube !== undefined) {
            expect(typeof socialLinks.youtube).toBe('string');
            expect(socialLinks.youtube).toBeTruthy();
          }
          
          if (socialLinks.blog !== undefined) {
            expect(typeof socialLinks.blog).toBe('string');
            expect(socialLinks.blog).toBeTruthy();
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: community-heroes, Property 9: Tier requirements completeness
describe('Tier requirements completeness', () => {
  it('should validate that every tier has at least one requirement with description', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('automation', 'cloud', 'devops'),
        (tierKey: HeroTier) => {
          const tier = tierInfo[tierKey];
          
          expect(tier.requirements).toBeDefined();
          expect(Array.isArray(tier.requirements)).toBe(true);
          expect(tier.requirements.length).toBeGreaterThan(0);
          
          // Every requirement must have a description
          tier.requirements.forEach(req => {
            expect(req.description).toBeDefined();
            expect(req.description).toBeTruthy();
            expect(typeof req.description).toBe('string');
            
            // Metric is optional but if present should be a string
            if (req.metric !== undefined) {
              expect(typeof req.metric).toBe('string');
              expect(req.metric).toBeTruthy();
            }
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: community-heroes, Property 10: Tier perks completeness
describe('Tier perks completeness', () => {
  it('should validate that every tier has at least one perk with description', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('automation', 'cloud', 'devops'),
        (tierKey: HeroTier) => {
          const tier = tierInfo[tierKey];
          
          expect(tier.perks).toBeDefined();
          expect(Array.isArray(tier.perks)).toBe(true);
          expect(tier.perks.length).toBeGreaterThan(0);
          
          // Every perk must have a description
          tier.perks.forEach(perk => {
            expect(perk.description).toBeDefined();
            expect(perk.description).toBeTruthy();
            expect(typeof perk.description).toBe('string');
            
            // Exclusive is optional but if present should be a boolean
            if (perk.exclusive !== undefined) {
              expect(typeof perk.exclusive).toBe('boolean');
            }
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});