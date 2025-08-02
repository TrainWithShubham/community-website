export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  experience: 'Internship' | 'Fresher' | '0-2 years' | '0-5 years' | '3-5 years' | '5-10 years';
  type: 'Full-time' | 'Part-time' | 'Contract';
  postedDate: string;
  applyLink: string;
};

// This static data is kept as a fallback, but the primary source is now Google Sheets.
// Generate dates for the last 7 days
const today = new Date();
const dates = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(today.getDate() - i);
  return date.toISOString().split('T')[0];
});

export const jobs: Job[] = [
  {
    id: 1,
    title: 'Senior DevOps Engineer',
    company: 'CloudScale Inc.',
    location: 'Remote',
    experience: '5-10 years',
    type: 'Full-time',
    postedDate: dates[0],
    applyLink: '#',
  },
  {
    id: 2,
    title: 'Cloud Security Analyst',
    company: 'SecureNet',
    location: 'New York, NY',
    experience: '3-5 years',
    type: 'Full-time',
    postedDate: dates[1],
    applyLink: '#',
  },
  {
    id: 3,
    title: 'Junior Site Reliability Engineer',
    company: 'Innovatech',
    location: 'San Francisco, CA',
    experience: '0-2 years',
    type: 'Full-time',
    postedDate: dates[2],
    applyLink: '#',
  },
  {
    id: 4,
    title: 'DevOps Internship',
    company: 'StartUp Fast',
    location: 'Remote',
    experience: 'Internship',
    type: 'Part-time',
    postedDate: dates[3],
    applyLink: '#',
  },
   {
    id: 5,
    title: 'Cloud Engineer (Fresher)',
    company: 'DataVortex',
    location: 'Austin, TX',
    experience: 'Fresher',
    type: 'Full-time',
    postedDate: dates[4],
    applyLink: '#',
  },
  {
    id: 6,
    title: 'Mid-Level Kubernetes Administrator',
    company: 'Container Solutions',
    location: 'Remote',
    experience: '0-5 years',
    type: 'Contract',
    postedDate: dates[5],
    applyLink: '#',
  },
  {
    id: 7,
    title: 'Senior DevSecOps Engineer',
    company: 'GovSecure',
    location: 'Washington D.C.',
    experience: '5-10 years',
    type: 'Full-time',
    postedDate: dates[6],
    applyLink: '#',
  },
  {
    id: 8,
    title: 'Platform Engineer',
    company: 'TechMatrix',
    location: 'Seattle, WA',
    experience: '3-5 years',
    type: 'Full-time',
    postedDate: dates[0],
    applyLink: '#',
  },
];
