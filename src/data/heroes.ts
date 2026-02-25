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

export const tierColorMap: Record<HeroTier, {
  border: string;
  text: string;
  bg: string;
  borderAccent: string;
}> = {
  automation: {
    border: 'border-orange-500/30',
    text: 'text-orange-500',
    bg: 'bg-orange-500/10',
    borderAccent: 'border-l-orange-500',
  },
  cloud: {
    border: 'border-blue-500/30',
    text: 'text-blue-500',
    bg: 'bg-blue-500/10',
    borderAccent: 'border-l-blue-500',
  },
  devops: {
    border: 'border-purple-500/30',
    text: 'text-purple-500',
    bg: 'bg-purple-500/10',
    borderAccent: 'border-l-purple-500',
  },
};

export const heroes: Hero[] = [
  // Example hero
  {
    id: 'amitabh-soni',
    name: 'Amitabh Soni',
    title: 'DevOps Engineer',
    photo: '/heroes/amitabh-soni.jpeg',
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
    photo: '/heroes/md-anas.jpeg',
    location: 'Karachi, Pakistan',
    heroSince: '2026-01-15',
    about: 'DevOps Engineer @ Zynex Solutions | Focus on AI-Driven Automation & Cloud Scalability | Continuous Delivery, Containerization & Cloud Native Ops',
    tier: 'automation',
    socialLinks: {
      github: 'https://github.com/yo-its-anas',
      linkedin: 'https://www.linkedin.com/in/muhammad-anas-a35b1a334/'
    }
  },
  {
    id: 'kislay-srivastava',
    name: 'Kisalay Srivastava',
    title: 'Full Stack + DevOps Engineer',
    photo: '/heroes/kisalay-srivastava.jpeg',
    location: 'Pune, Maharashtra',
    heroSince: '2026-01-15',
    about: 'Full Stack + DevOps Engineer | Ex-Data Scientist | Java, Spring Boot, React, Node.js | AWS/GCP/Azure | Docker | Kubernetes | CI/CD | Terraform | Oracle Cloud Certified | NLP, ML, System Design',
    tier: 'devops',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/kisalay-srivastava-46b243196/',
      blog: 'https://medium.com/@kisalaykisu'
    }
  },
  {
    id: 'abdullah-abrar',
    name: 'Muhammad Abdullah Abrar',
    title: 'DevOps Engineer',
    photo: '/heroes/abdullah-abrar.jpeg',
    location: 'Islamabad, Pakistan',
    heroSince: '2026-01-15',
    about: 'DevOps Engineer | Cloud Engineer | Deploying Scalable Production-ready Applications | CI/CD | Kubernetes | Python | Linux',
    tier: 'devops',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/muhammadabdullahabrar/',
    }
  },
  {
    id: 'madhup-pandey',
    name: 'Madhup Pandey',
    title: 'DevOps Engineer',
    photo: '/heroes/madhup-pandey.jpeg',
    location: 'Pune, Maharashtra',
    heroSince: '2026-01-15',
    about: 'DevOps Engineer| GitLab PSE Certified | AWS | Kubernetes | CI/CD | Terraform | Jenkins | GitLab | Site Reliability | Helping Companies Ship Faster with Scalable & Secure Cloud Infrastructure',
    tier: 'devops',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/madhup-pandey/',
    }
  },
  {
    id: 'sanket-dangat',
    name: 'Sanket Dangat',
    title: 'Cloud & DevOps Engineer',
    photo: '/heroes/sanket-dangat.jpeg',
    location: 'Navi Mumbai, India',
    heroSince: '2026-02-25',
    about: 'Cloud & DevOps Engineer with a journey from Desktop Support to DevOps, focused on building scalable, automated, and reliable cloud solutions.',
    tier: 'automation',
    socialLinks: {
      github: 'https://github.com/srdangat',
      linkedin: 'https://www.linkedin.com/in/sanket-dangat-6462b8271/',
    }
  },
  {
    id: 'nandan-aghera',
    name: 'Nandan P Aghera',
    title: 'Software Engineer at Kambala Solutions Pvt Ltd',
    photo: '/heroes/nandan-aghera.jpeg',
    location: 'Mangaluru, Karnataka',
    heroSince: '2026-02-25',
    about: 'Software Engineer @ Kambala Solutions | DevOps Enthusiast | Community Contributor | AWS, Linux, Git, CI/CD, Docker.',
    tier: 'automation',
    socialLinks: {
      github: 'https://github.com/Nandan29300',
      linkedin: 'https://www.linkedin.com/in/nandan-p-aghera/',
    }
  },
  {
    id: 'prakhar-srivastava',
    name: 'Prakhar Srivastava',
    title: 'DevOps Engineer',
    photo: '/heroes/prakhar-srivastava.jpeg',
    location: 'Patna, Bihar, India',
    heroSince: '2026-02-25',
    about: 'DevOps Engineer | CI/CD | AWS | Infrastructure Automation | Container Orchestration.',
    tier: 'automation',
    socialLinks: {
      github: 'https://github.com/Heyyprakhar1',
      linkedin: 'https://www.linkedin.com/in/heyyprakhar1/',
    }
  }
  // More heroes can be added here
];
