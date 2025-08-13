import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { appendToGoogleSheets, checkForDuplicateQuestion } from '@/lib/google-sheets-api';

// Validation schema for community questions
const CommunityQuestionSchema = z.object({
  author: z.string().min(2, "Author name is required."),
  questionType: z.enum(["interview", "mcq", "scenario"]),
  question: z.string().min(5, "Question must be at least 5 characters."),
  answer: z.string().optional(),
  mcqOptions: z.array(z.object({ value: z.string().min(1) })).optional(),
  correctMcqAnswer: z.string().optional(),
  summary: z.string().optional(),
  diagnosisSteps: z.string().optional(),
  rootCause: z.string().optional(),
  fix: z.string().optional(),
  lessonLearned: z.string().optional(),
  howToAvoid: z.string().optional(),
  userId: z.string().optional(),
  userEmail: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    console.log('📝 Community question submission received');
    
    const body = await request.json();
    console.log('📝 Request body:', body);
    
    // Validate the request body
    const validatedData = CommunityQuestionSchema.parse(body);
    console.log('✅ Data validation passed');
    
    // Check for duplicate questions
    console.log('🔍 Checking for duplicate questions...');
    const isDuplicate = await checkForDuplicateQuestion(validatedData.question, validatedData.questionType);
    
    if (isDuplicate) {
      console.log('🚫 Duplicate question detected, rejecting submission');
      return NextResponse.json({
        success: false,
        message: 'This question appears to be a duplicate. Please check if a similar question already exists.',
        error: 'DUPLICATE_QUESTION'
      }, { 
        status: 409,
        headers 
      });
    }
    
    console.log('✅ No duplicates found, proceeding with submission');
    
    // Prepare submission data
    const submissionData = {
      ...validatedData,
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      id: `cq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    console.log('📝 Community Question Submitted:', submissionData);
    
    // Actually write to Google Sheets
    try {
      await appendToGoogleSheets(submissionData);
      console.log('✅ Successfully written to Google Sheets');
    } catch (sheetsError) {
      console.error('❌ Failed to write to Google Sheets:', sheetsError);
      // Continue with success response but log the error
      // In production, you might want to handle this differently
    }
    
    return NextResponse.json({
      success: true,
      message: 'Question submitted successfully! It will be reviewed before being published.',
      data: {
        id: submissionData.id,
        status: 'pending_review',
        submittedAt: submissionData.submittedAt
      }
    }, { 
      status: 201,
      headers 
    });
    
  } catch (error) {
    console.error('❌ Error submitting community question:', error);
    
    if (error instanceof z.ZodError) {
      console.error('❌ Validation errors:', error.errors);
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { 
        status: 400,
        headers 
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, { 
      status: 500,
      headers 
    });
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'Method not allowed'
  }, { status: 405 });
}