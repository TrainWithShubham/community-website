import { getCommunityQuestionsFromAPI } from '@/lib/google-sheets-api';
import { Question } from '@/data/questions';

// Format answer section for display
function formatAnswerSection(text: string): string {
  if (!text) return '';
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const isNumberedList = lines.every(line => /^\d+\.\s/.test(line.trim()));

  if (isNumberedList) {
    return `<ol>${lines.map(line => `<li>${line.trim().substring(line.indexOf('.') + 1).trim()}</li>`).join('')}</ol>`;
  }
  
  return lines.map(line => `<p>${line}</p>`).join('');
}

// Convert API data to Question format
function convertToQuestionFormat(apiData: any): Question {
  const { question, answer, summary, diagnosisSteps, rootCause, fix, lessonLearned, howToAvoid, author, questionType, options, correctAnswer } = apiData;

  let formattedAnswer;
  const parts = [];

  if (questionType === 'scenario') {
    if (summary) parts.push(`<h4>Summary:</h4>${formatAnswerSection(summary)}`);
    if (diagnosisSteps) parts.push(`<h4>Diagnosis Steps:</h4>${formatAnswerSection(diagnosisSteps)}`);
    if (rootCause) parts.push(`<h4>Root Cause:</h4>${formatAnswerSection(rootCause)}`);
    if (fix) parts.push(`<h4>Fix:</h4>${formatAnswerSection(fix)}`);
    if (lessonLearned) parts.push(`<h4>Lesson Learned:</h4>${formatAnswerSection(lessonLearned)}`);
    if (howToAvoid) parts.push(`<h4>How to Avoid in Future:</h4>${formatAnswerSection(howToAvoid)}`);
    formattedAnswer = parts.join('');
  } else if (questionType === 'mcq' && options && options.length > 0) {
    // Handle MCQ questions with options
    const optionsHtml = options.map((option: string, index: number) => 
      `<div class="mcq-option ${option === correctAnswer ? 'correct' : ''}">${String.fromCharCode(65 + index)}. ${option}</div>`
    ).join('');
    formattedAnswer = `
      <div class="mcq-container">
        <h4>Options:</h4>
        ${optionsHtml}
        <h4>Correct Answer:</h4>
        <p><strong>${correctAnswer}</strong></p>
      </div>
    `;
  } else {
    formattedAnswer = answer ? formatAnswerSection(answer) : 'Answer not available.';
  }
  
  return {
    question: question || '',
    answer: formattedAnswer,
    author: author || undefined,
  };
}

// New function to get community questions from Google Sheets API
export async function getCommunityQuestionsFromSheetsAPI(): Promise<Question[]> {
  try {
    console.log('📖 Fetching community questions from Google Sheets API...');
    
    const apiData = await getCommunityQuestionsFromAPI();
    
    // Convert API data to Question format
    const questions = apiData
      .filter(item => item.question && item.question.trim() !== '')
      .map(convertToQuestionFormat);
    
    console.log(`✅ Successfully fetched ${questions.length} community questions from Google Sheets API`);
    return questions;
    
  } catch (error) {
    console.error('❌ Error fetching community questions from Google Sheets API:', error);
    return [];
  }
}
