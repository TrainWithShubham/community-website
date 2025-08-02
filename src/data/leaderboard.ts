
export type Contributor = {
  rank: number;
  name: string;
  contributions: number;
};

// This static data is now a fallback and will be replaced by data from Google Sheets on the homepage.
export const leaderboardData: Contributor[] = [
  { rank: 1, name: 'alex_devops', contributions: 124 },
  { rank: 2, name: 'cloud_guru_jane', contributions: 112 },
  { rank: 3, name: 'secops_sam', contributions: 98 },
  { rank: 4, name: 'kubemaster_kim', contributions: 85 },
  { rank: 5, name: 'git_wizard_greg', contributions: 76 },
];
