export type HeroTier = 'automation' | 'cloud' | 'devops';

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
};

export type Hero = {
  id: string;
  name: string;
  title: string;
  photo: string;
  location: string;
  heroSince: string; // ISO date string
  about: string;
  tier: HeroTier;
  socialLinks: SocialLinks;
};

export type TierRequirement = {
  description: string;
  metric?: string;
};

export type TierPerk = {
  description: string;
  exclusive?: boolean; // true if only for this tier and above
};

export type TierInfo = {
  id: HeroTier;
  name: string;
  badgeImage: string;
  requirements: TierRequirement[];
  perks: TierPerk[];
  color: string; // Tailwind color class
};

export const tierInfo: Record<HeroTier, TierInfo> = {
  automation: {
    id: 'automation',
    name: 'Automation Hero',
    badgeImage: '/automation-hero-badge.png',
    requirements: [
      { description: 'Complete Python For DevOps course' },
      { description: 'Solve community doubts', metric: '10+ per month' },
      { description: 'LinkedIn posts with #TrainWithShubham', metric: '2+ per week' }
    ],
    perks: [
      { description: 'Special Discord role and channel access' },
      { description: 'Featured in monthly newsletter' },
      { description: 'Resume review session' }
    ],
    color: 'orange'
  },
  cloud: {
    id: 'cloud',
    name: 'Cloud Hero',
    badgeImage: '/cloud-hero-badge.png',
    requirements: [
      { description: 'Achieve Automation Hero status first' },
      { description: 'Complete AWS Zero To Hero (CCP & SAA) courses' },
      { description: 'Solve community doubts', metric: '15+ per month' },
      { description: 'LinkedIn posts with #TrainWithShubham', metric: '3+ per week' }
    ],
    perks: [
      { description: 'All Automation Hero perks' },
      { description: 'Priority access to community meetups', exclusive: true },
      { description: 'Job referral opportunities', exclusive: true },
      { description: '1-on-1 mentorship session', exclusive: true }
    ],
    color: 'blue'
  },
  devops: {
    id: 'devops',
    name: 'DevOps Hero',
    badgeImage: '/devops-hero-badge.png',
    requirements: [
      { description: 'Complete DevOps - Zero To Hero course' },
      { description: 'Solve community doubts', metric: '20+ per month' },
      { description: 'LinkedIn posts with #TrainWithShubham', metric: '4+ per week' }
    ],
    perks: [
      { description: 'All Cloud Hero perks' },
      { description: 'Exclusive meetup invitations', exclusive: true },
      { description: 'Featured on community website heroes page', exclusive: true },
      { description: 'Direct job referrals to partner companies', exclusive: true },
      { description: 'Guest speaker opportunities in community events', exclusive: true }
    ],
    color: 'purple'
  }
};

export const heroes: Hero[] = [
  // Example hero
  {
    id: 'amitabh-soni',
    name: 'Amitabh Soni',
    title: 'DevOps Engineer',
    photo: '/heroes/amitabh-soni.png',
    location: 'Mumbai, India',
    heroSince: '2025-01-15',
    about: 'Passionate DevOps engineer with expertise in Kubernetes, AWS, and CI/CD pipelines. Active community contributor helping members solve complex infrastructure challenges.',
    tier: 'devops',
    socialLinks: {
      github: 'https://github.com/Amitabh-DevOps',
      linkedin: 'https://www.linkedin.com/in/amitabh-devops/',
      youtube: 'https://www.youtube.com/@SoniAmitabh',
      blog: 'https://www.amitabh.cloud/'
    }
  },
  {
    id: 'md-anas',
    name: 'Muhammad Anas',
    title: 'DevOps Engineer',
    photo: '/heroes/md-anas.png',
    location: 'Karachi, Pakistan',
    heroSince: '2026-01-15',
    about: 'DevOps Engineer @ Zynex Solutions | Focus on AI-Driven Automation & Cloud Scalability | Continuous Delivery, Containerization & Cloud Native Ops',
    tier: 'automation',
    socialLinks: {
      github: 'https://github.com/anas',
      linkedin: 'https://www.linkedin.com/in/muhammad-anas-a35b1a334/'
    }
  }
  // More heroes can be added here
];
