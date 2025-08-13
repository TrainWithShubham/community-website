require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

console.log('Testing Google Sheets Write Functionality...');

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

async function testWrite() {
  try {
    console.log('Testing write to Interview Questions sheet...');
    
    const testData = [
      [
        new Date().toISOString(), // Timestamp
        'Test User', // Author Name
        'interview', // Question Type
        'Test question from API', // Question
        'Test answer from API' // Answer
      ]
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Interview Questions!A:Z',
      valueInputOption: 'RAW',
      requestBody: { values: testData },
    });

    console.log('✅ Successfully wrote to Google Sheets!');
    console.log('📊 Updated range:', response.data.updates?.updatedRange);
    console.log('📝 Rows updated:', response.data.updates?.updatedRows);
    
  } catch (error) {
    console.error('❌ Error writing to Google Sheets:', error.message);
  }
}

testWrite();
