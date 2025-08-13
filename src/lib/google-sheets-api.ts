import { google } from 'googleapis';

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function appendToGoogleSheets(data: any) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');
    }

    console.log('📊 Writing to Google Sheets:', spreadsheetId);
    console.log('📝 Question Type:', data.questionType);

    let sheetName: string;
    let values: any[][];

    // Route to the correct sheet based on question type
    switch (data.questionType) {
      case 'scenario':
        sheetName = 'Scenerio-Based';
        values = [
          [
            new Date().toISOString(), // Timestamp
            data.author || '', // Author Name
            data.questionType || '', // Question Type
            data.question || '', // Question
            data.summary || '', // Summary
            data.diagnosisSteps || '', // Diagnosis Steps
            data.rootCause || '', // Root Cause
            data.fix || '', // Fix
            data.lessonLearned || '', // Lesson Learned
            data.howToAvoid || '' // How to Avoid
          ]
        ];
        break;

      case 'interview':
        sheetName = 'Interview Questions';
        values = [
          [
            new Date().toISOString(), // Timestamp
            data.author || '', // Author Name
            data.questionType || '', // Question Type
            data.question || '', // Question
            data.answer || '' // Answer
          ]
        ];
        break;

      case 'mcq':
        sheetName = 'MCQ Questions';
        // Prepare MCQ options (up to 10 options)
        const mcqOptions = data.mcqOptions || [];
        const options = Array(10).fill('').map((_, index) => 
          mcqOptions[index]?.value || ''
        );
        
        values = [
          [
            new Date().toISOString(), // Timestamp
            data.author || '', // Author Name
            data.questionType || '', // Question Type
            data.question || '', // Question
            ...options, // Option 1-10
            data.correctMcqAnswer || '' // Correct Answer
          ]
        ];
        break;

      default:
        throw new Error(`Unsupported question type: ${data.questionType}`);
    }

    console.log('📋 Sheet Name:', sheetName);
    console.log('📝 Row data to append:', values[0]);

    // Append the row to the correct sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`, // Use a wide range to accommodate all columns
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    console.log('✅ Successfully appended to Google Sheets');
    console.log('📊 Updated range:', response.data.updates?.updatedRange);
    
    return true;
  } catch (error) {
    console.error('❌ Error writing to Google Sheets:', error);
    throw error;
  }
}

// Function to get sheet data for a specific sheet (for debugging)
export async function getSheetData(sheetName: string = 'Interview Questions') {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');
    }

    console.log(`📖 Reading data from sheet: ${sheetName}`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });

    console.log(`✅ Successfully read ${response.data.values?.length || 0} rows from ${sheetName}`);
    return response.data.values;
  } catch (error) {
    console.error(`❌ Error reading from sheet ${sheetName}:`, error);
    throw error;
  }
}

// Function to get all sheet names
export async function getSheetNames() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');
    }

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetNames = response.data.sheets?.map(sheet => sheet.properties?.title) || [];
    console.log('📋 Available sheets:', sheetNames);
    return sheetNames;
  } catch (error) {
    console.error('❌ Error getting sheet names:', error);
    throw error;
  }
}

// Function to get community questions from Google Sheets API
export async function getCommunityQuestionsFromAPI(): Promise<Array<{
  timestamp: string;
  author: string;
  questionType: string;
  question: string;
  answer?: string;
  summary?: string;
  diagnosisSteps?: string;
  rootCause?: string;
  fix?: string;
  lessonLearned?: string;
  howToAvoid?: string;
  options?: string[];
  correctAnswer?: string;
  source: string;
}>> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');
    }

    console.log('📖 Reading community questions from Google Sheets API...');

    // Read from all three sheets to get community questions
    const [interviewData, scenarioData, mcqData] = await Promise.allSettled([
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Interview Questions!A:E',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Scenerio-Based!A:J',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'MCQ Questions!A:O',
      })
    ]);

    const allQuestions: Array<{
      timestamp: string;
      author: string;
      questionType: string;
      question: string;
      answer?: string;
      summary?: string;
      diagnosisSteps?: string;
      rootCause?: string;
      fix?: string;
      lessonLearned?: string;
      howToAvoid?: string;
      options?: string[];
      correctAnswer?: string;
      source: string;
    }> = [];

    // Process interview questions
    if (interviewData.status === 'fulfilled' && interviewData.value.data.values) {
      const rows = interviewData.value.data.values.slice(1); // Skip header
      rows.forEach(row => {
        if (row.length >= 5) {
          allQuestions.push({
            timestamp: row[0],
            author: row[1],
            questionType: row[2],
            question: row[3],
            answer: row[4],
            source: 'Interview Questions'
          });
        }
      });
    }

    // Process scenario questions
    if (scenarioData.status === 'fulfilled' && scenarioData.value.data.values) {
      const rows = scenarioData.value.data.values.slice(1); // Skip header
      rows.forEach(row => {
        if (row.length >= 10) {
          allQuestions.push({
            timestamp: row[0],
            author: row[1],
            questionType: row[2],
            question: row[3],
            summary: row[4],
            diagnosisSteps: row[5],
            rootCause: row[6],
            fix: row[7],
            lessonLearned: row[8],
            howToAvoid: row[9],
            source: 'Scenerio-Based'
          });
        }
      });
    }

    // Process MCQ questions
    if (mcqData.status === 'fulfilled' && mcqData.value.data.values) {
      const rows = mcqData.value.data.values.slice(1); // Skip header
      rows.forEach(row => {
        if (row.length >= 15) {
          const options = row.slice(4, 14).filter(opt => opt && opt.trim() !== '');
          allQuestions.push({
            timestamp: row[0],
            author: row[1],
            questionType: row[2],
            question: row[3],
            options: options,
            correctAnswer: row[14],
            source: 'MCQ Questions'
          });
        }
      });
    }

    console.log(`✅ Successfully read ${allQuestions.length} community questions from Google Sheets API`);
    return allQuestions;
    
  } catch (error) {
    console.error('❌ Error reading community questions from Google Sheets API:', error);
    return [];
  }
}

// Function to check for duplicate questions
export async function checkForDuplicateQuestion(questionText: string, questionType: string): Promise<boolean> {
  try {
    const questions = await getCommunityQuestionsFromAPI();
    
    // Normalize question text for comparison
    const normalizedNewQuestion = questionText.toLowerCase().trim();
    
    // Check for exact matches
    const exactMatch = questions.some(q => 
      q.question.toLowerCase().trim() === normalizedNewQuestion &&
      q.questionType === questionType
    );
    
    if (exactMatch) {
      console.log('🚫 Duplicate question found (exact match)');
      return true;
    }
    
    // Check for similar questions (optional - more sophisticated duplicate detection)
    const similarQuestions = questions.filter(q => {
      const normalizedExisting = q.question.toLowerCase().trim();
      const similarity = calculateSimilarity(normalizedNewQuestion, normalizedExisting);
      return similarity > 0.8; // 80% similarity threshold
    });
    
    if (similarQuestions.length > 0) {
      console.log('🚫 Similar questions found:', similarQuestions.map(q => q.question));
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error('❌ Error checking for duplicates:', error);
    return false; // Allow submission if duplicate check fails
  }
}

// Simple similarity calculation (Levenshtein distance based)
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
