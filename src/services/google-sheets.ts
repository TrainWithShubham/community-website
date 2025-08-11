
import { Question } from "@/data/questions";
import { Contributor } from "@/data/leaderboard";
import { Job } from "@/data/jobs";
import Papa from "papaparse";

const SCENARIO_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUrAU7tRsTjLa2B9nYV5yz4x3gcYLf38ofVM0haSMKZ3XFq-FHwDQiIGntWYH1oEeWJXMQPeHnm3WN/pub?output=csv';
const INTERVIEW_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKXulHlDEFD1f3mVxbNgtk5_qfewFBIIN0s-XOYXXhOa2W-T9mmkvmbZi_SMqk0EpUhZbpFKhOMZDh/pub?output=csv';
const LIVE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTX8qvtRs3zOsCtecGKHtcrqAAq8akht-drKxmkxCFBxxYEwWiG1_gqR8TY1fT757wqDIrzviEdbUpj/pub?output=csv';
const COMMUNITY_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTS9P-csRa0DxN4W3DYQ-Jd1216fI0EhUmKEeBVhDNOgZmVTJPxTUFbY52SjpuORhaHYRkkc66IYLsD/pub?output=csv';
const LEADERBOARD_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQl3-ej0Y-Y6apt3lJOpnj1y9B6wXcxqOi3OLCQJ-sDeEoWVUc3Kz12F8p3cYixrwjpzYLjds790La4/pub?output=csv';
const JOBS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXG1tfJqAN5IqlJqpvPWnOMVlCEKCYIgSfddrb30wZndYyn4rl2KSznKhx8D1GvdJmG040p1KA983u/pub?output=csv';
const COMMUNITY_STATS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRX5qvUPTswosvphvap35loiZh754Enf45-A-IH3qNbxlVJY7oOqtD1YehFU9mXb8dStOq4vjA8CESX/pub?output=csv';

export type CommunityStats = {
  activeMembers: string;
  activeVolunteers: string;
  successStories: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}


async function fetchCSV(url: string): Promise<string> {
  // Use Next.js's default caching for fetched data.
  const response = await fetch(url); 
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV from ${url}: ${response.statusText}`);
  }
  return response.text();
}

function formatAnswerSection(text: string): string {
    if (!text) return '';
    // Split by newline, filter empty lines, wrap in <p>, and join.
    const lines = text.split('\n').filter(line => line.trim() !== '');

    // Check if the text looks like a numbered list
    const isNumberedList = lines.every(line => /^\d+\.\s/.test(line.trim()));

    if (isNumberedList) {
        return `<ol>${lines.map(line => `<li>${line.trim().substring(line.indexOf('.') + 1).trim()}</li>`).join('')}</ol>`;
    }
    
    return lines.map(line => `<p>${line}</p>`).join('');
}


export async function getInterviewQuestions(): Promise<Question[]> {
  try {
    const csvText = await fetchCSV(INTERVIEW_SHEET_URL);
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
        console.error("Errors parsing interview CSV:", parsed.errors);
    }

    return parsed.data.map((row: any) => {
      const { question, answer, author } = row;
      return {
        question: question || '',
        answer: answer ? formatAnswerSection(answer) : 'Answer not available.',
        author: author || undefined,
      };
    }).filter(q => q.question);

  } catch (error) {
    console.error('Error fetching or parsing interview questions:', error);
    return []; // Return empty array on error
  }
}


export async function getScenarioQuestions(): Promise<Question[]> {
  try {
    const csvText = await fetchCSV(SCENARIO_SHEET_URL);
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
        console.error("Errors parsing CSV:", parsed.errors);
    }

    return parsed.data.map((row: any) => {
      const { 
        question, 
        summary, 
        diagnosisSteps, 
        rootCause, 
        fix, 
        lessonLearned, 
        howToAvoid,
        author,
        answer: legacyAnswer
      } = row;

      let formattedAnswer;

      const parts = [];
      if (summary) parts.push(`<h4>Summary:</h4>${formatAnswerSection(summary)}`);
      if (diagnosisSteps) parts.push(`<h4>Diagnosis Steps:</h4>${formatAnswerSection(diagnosisSteps)}`);
      if (rootCause) parts.push(`<h4>Root Cause:</h4>${formatAnswerSection(rootCause)}`);
      if (fix) parts.push(`<h4>Fix:</h4>${formatAnswerSection(fix)}`);
      if (lessonLearned) parts.push(`<h4>Lesson Learned:</h4>${formatAnswerSection(lessonLearned)}`);
      if (howToAvoid) parts.push(`<h4>How to Avoid in Future:</h4>${formatAnswerSection(howToAvoid)}`);
      
      if (parts.length > 0) {
        formattedAnswer = parts.join('');
      } else {
        formattedAnswer = legacyAnswer ? formatAnswerSection(legacyAnswer) : 'Answer not available.';
      }
      
      return {
        question: question || '',
        answer: formattedAnswer,
        author: author || undefined,
      };
    }).filter(q => q.question);

  } catch (error) {
    console.error('Error fetching or parsing scenario questions:', error);
    return []; // Return empty array on error
  }
}

export async function getLiveQuestions(): Promise<Question[]> {
  try {
    const csvText = await fetchCSV(LIVE_SHEET_URL);
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
        console.error("Errors parsing live questions CSV:", parsed.errors);
    }

    return parsed.data.map((row: any) => {
      const { 
        question, 
        summary, 
        diagnosisSteps, 
        rootCause, 
        fix,
        author,
        answer
      } = row;

      let formattedAnswer;

      const parts = [];
      if (summary) parts.push(`<h4>Summary:</h4>${formatAnswerSection(summary)}`);
      if (diagnosisSteps) parts.push(`<h4>Diagnosis Steps:</h4>${formatAnswerSection(diagnosisSteps)}`);
      if (rootCause) parts.push(`<h4>Root Cause:</h4>${formatAnswerSection(rootCause)}`);
      if (fix) parts.push(`<h4>Fix:</h4>${formatAnswerSection(fix)}`);
      
      if (parts.length > 0) {
        formattedAnswer = parts.join('');
      } else {
        formattedAnswer = answer ? formatAnswerSection(answer) : 'Answer not available.';
      }
      
      return {
        question: question || '',
        answer: formattedAnswer,
        author: author || undefined,
      };
    }).filter(q => q.question);

  } catch (error) {
    console.error('Error fetching or parsing live questions:', error);
    return [];
  }
}

export async function getCommunityQuestions(): Promise<Question[]> {
  try {
    const csvText = await fetchCSV(COMMUNITY_SHEET_URL);
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
        console.error("Errors parsing community questions CSV:", parsed.errors);
    }

    return parsed.data.map((row: any) => {
       const { 
        question, 
        summary, 
        diagnosisSteps, 
        rootCause, 
        fix, 
        lessonLearned, 
        howToAvoid,
        author,
        answer, // For interview and MCQ questions
        type // To distinguish between question types
      } = row;

      let formattedAnswer;
      const parts = [];

      if (type === 'scenario') {
        if (summary) parts.push(`<h4>Summary:</h4>${formatAnswerSection(summary)}`);
        if (diagnosisSteps) parts.push(`<h4>Diagnosis Steps:</h4>${formatAnswerSection(diagnosisSteps)}`);
        if (rootCause) parts.push(`<h4>Root Cause:</h4>${formatAnswerSection(rootCause)}`);
        if (fix) parts.push(`<h4>Fix:</h4>${formatAnswerSection(fix)}`);
        if (lessonLearned) parts.push(`<h4>Lesson Learned:</h4>${formatAnswerSection(lessonLearned)}`);
        if (howToAvoid) parts.push(`<h4>How to Avoid in Future:</h4>${formatAnswerSection(howToAvoid)}`);
        formattedAnswer = parts.join('');
      } else {
        // For interview, mcq, or other types
         formattedAnswer = answer ? formatAnswerSection(answer) : 'Answer not available.';
      }
      
      return {
        question: question || '',
        answer: formattedAnswer,
        author: author || undefined,
      };
    }).filter(q => q.question);

  } catch (error) {
    console.error('Error fetching or parsing community questions:', error);
    return [];
  }
}

export async function getLeaderboardData(): Promise<Contributor[]> {
  try {
    const csvText = await fetchCSV(LEADERBOARD_SHEET_URL);
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (parsed.errors.length > 0) {
        console.error("Errors parsing leaderboard CSV:", parsed.errors);
    }
    
    // Filter out rows that are empty or don't have a name.
    const validData = parsed.data.filter((row: any) => row.name && row.rank && row.contributions);

    return validData.map((row: any) => ({
      rank: row.rank || 0,
      name: row.name || 'Anonymous',
      contributions: row.contributions || 0,
    }));

  } catch (error) {
    console.error('Error fetching or parsing leaderboard data:', error);
    return [];
  }
}

export async function getJobs(): Promise<Job[]> {
  try {
    const csvText = await fetchCSV(JOBS_SHEET_URL);
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (parsed.errors.length > 0) {
        console.error("Errors parsing jobs CSV:", parsed.errors);
    }

    const validData = parsed.data.filter((row: any) => row.id && row.title && row.company);

    return validData.map((row: any) => ({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      experience: row.experience,
      type: row.type,
      postedDate: row.postedDate,
      applyLink: row.applyLink,
    }));
  } catch (error) {
    console.error('Error fetching or parsing jobs data:', error);
    return [];
  }
}

export async function getCommunityStats(): Promise<CommunityStats> {
    const defaultStats: CommunityStats = {
        activeMembers: "10k+",
        activeVolunteers: "50+",
        successStories: "200+",
        githubUrl: "#",
        linkedinUrl: "#",
        twitterUrl: "#",
        instagramUrl: "#"
    };

    try {
        const csvText = await fetchCSV(COMMUNITY_STATS_URL);
        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        if (parsed.errors.length > 0) {
            console.error("Errors parsing community stats CSV:", parsed.errors);
            return defaultStats;
        }

        const stats = parsed.data.reduce((acc: any, row: any) => {
            if (row.key) {
                acc[row.key] = row.value;
            }
            return acc;
        }, {});

        return Object.assign({}, defaultStats, stats);

    } catch (error) {
        console.error('Error fetching or parsing community stats:', error);
        return defaultStats;
    }
}
