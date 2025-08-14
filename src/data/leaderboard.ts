
export type Contributor = {
  rank: number;
  name: string;
  contributions: number;
};

// This static data is now a fallback and will be replaced by data from Google Sheets on the homepage.
export const leaderboardData: Contributor[] = [
  { rank: 1, name: 'Pooja', contributions: 45 },
  { rank: 2, name: 'Fauzeya', contributions: 40 },
  { rank: 3, name: 'Shubham', contributions: 30 },
  { rank: 4, name: 'Altamash', contributions: 25 },
  { rank: 5, name: 'Yashir', contributions: 15 },
];
