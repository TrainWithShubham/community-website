import { config } from 'dotenv';
import { appendToGoogleSheets, getSheetData, getSheetNames } from '../src/lib/google-sheets-api';

// Load environment variables
config({ path: '.env.local' });

async function testGoogleSheetsAPI() {
  console.log('🧪 Testing Google Sheets API Connection...\n');

  try {
    // Test getting sheet names
    console.log('📋 Getting available sheets...');
    const sheetNames = await getSheetNames();
    console.log('✅ Available sheets:', sheetNames);

    // Test reading data from each sheet
    for (const sheetName of sheetNames) {
      if (sheetName) {
        console.log(`\n📖 Reading data from ${sheetName}...`);
        try {
          const sheetData = await getSheetData(sheetName);
          console.log(`✅ Successfully read ${sheetData?.length || 0} rows from ${sheetName}`);
          if (sheetData && sheetData.length > 0) {
            console.log(`📋 Sample row from ${sheetName}:`, sheetData[0]);
          }
        } catch (error) {
          console.log(`⚠️ Could not read from ${sheetName}:`, (error as Error).message);
        }
      }
    }

    // Test writing to each sheet type
    const testCases = [
      {
        name: 'Interview Question',
        data: {
          author: 'Test User',
          questionType: 'interview',
          question: 'What is Docker?',
          answer: 'Docker is a containerization platform.',
          userId: 'test-user-123',
          userEmail: 'test@example.com'
        }
      },
      {
        name: 'Scenario Question',
        data: {
          author: 'Test User',
          questionType: 'scenario',
          question: 'How to handle production deployment issues?',
          summary: 'Production deployment failed',
          diagnosisSteps: 'Check logs, verify configuration',
          rootCause: 'Missing environment variables',
          fix: 'Add required env vars',
          lessonLearned: 'Always validate config',
          howToAvoid: 'Use config validation',
          userId: 'test-user-123',
          userEmail: 'test@example.com'
        }
      },
      {
        name: 'MCQ Question',
        data: {
          author: 'Test User',
          questionType: 'mcq',
          question: 'What is the primary purpose of Docker?',
          mcqOptions: [
            { value: 'Containerization' },
            { value: 'Virtualization' },
            { value: 'Compilation' },
            { value: 'Encryption' }
          ],
          correctMcqAnswer: 'Containerization',
          userId: 'test-user-123',
          userEmail: 'test@example.com'
        }
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n📝 Testing ${testCase.name}...`);
      try {
        await appendToGoogleSheets(testCase.data);
        console.log(`✅ Successfully wrote ${testCase.name} to Google Sheets`);
      } catch (error) {
        console.log(`❌ Failed to write ${testCase.name}:`, (error as Error).message);
      }
    }

    console.log('\n🎉 Google Sheets API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Google Sheets API test failed:', error);
    process.exit(1);
  }
}

// Run the test
testGoogleSheetsAPI();
