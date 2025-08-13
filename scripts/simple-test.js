require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

console.log('Testing Google Sheets API...');
console.log('CLIENT_EMAIL:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
console.log('PROJECT_ID:', process.env.GOOGLE_SHEETS_PROJECT_ID);
console.log('PRIVATE_KEY exists:', !!process.env.GOOGLE_SHEETS_PRIVATE_KEY);

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

async function testConnection() {
  try {
    console.log('Testing connection...');
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    });
    
    console.log('✅ Success! Connected to spreadsheet:', response.data.properties?.title);
    console.log('📋 Available sheets:', response.data.sheets?.map(s => s.properties?.title));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();
