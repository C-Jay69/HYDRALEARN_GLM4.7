import { NextRequest, NextResponse } from 'next/server';
import { generateLessonPlan } from '@/ai/flows/generate-lesson-plan';

export async function POST(req: NextRequest) {
  try {
    console.log('Received lesson plan generation request');
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    const { studentNeeds, curriculum, objectives, gradeLevel, subject } = body;

    console.log('Validating individual fields...');
    console.log(`- studentNeeds: ${!!studentNeeds} (${studentNeeds?.length || 0} chars)`);
    console.log(`- curriculum: ${!!curriculum}`);
    console.log(`- objectives: ${!!objectives}`);
    console.log(`- gradeLevel: ${!!gradeLevel}`);
    console.log(`- subject: ${!!subject}`);

    if (!studentNeeds || !curriculum || !objectives || !gradeLevel || !subject) {
      console.error('Missing required fields in request body');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Diagnostic check for API key (do not log the key itself!)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: GEMINI_API_KEY or GOOGLE_GENAI_API_KEY is missing from environment');
      return NextResponse.json(
        { error: 'AI service configuration error: API key missing' },
        { status: 500 }
      );
    }
    console.log('API key found in environment');

    console.log('Calling generateLessonPlan flow...');
    const result = await generateLessonPlan({
      studentNeeds,
      curriculum,
      objectives,
      gradeLevel,
      subject,
    });
    console.log('Lesson plan generated successfully');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating lesson plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson plan', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
