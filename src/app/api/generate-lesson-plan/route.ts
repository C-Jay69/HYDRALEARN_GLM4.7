import { NextRequest, NextResponse } from 'next/server';
import { generateLessonPlan } from '@/ai/flows/generate-lesson-plan';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentNeeds, curriculum, objectives, gradeLevel, subject } = body;

    if (!studentNeeds || !curriculum || !objectives || !gradeLevel || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await generateLessonPlan({
      studentNeeds,
      curriculum,
      objectives,
      gradeLevel,
      subject,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating lesson plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson plan', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
