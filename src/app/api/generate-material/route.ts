import { NextRequest, NextResponse } from 'next/server';
import { generateLearningMaterial } from '@/ai/flows/generate-learning-material';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { materialType, topic, gradeLevel, instructions } = body;

    if (!materialType || !topic || !gradeLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: materialType, topic, or gradeLevel' },
        { status: 400 }
      );
    }

    const result = await generateLearningMaterial({
      materialType,
      topic,
      gradeLevel,
      instructions,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating learning material:', error);
    return NextResponse.json(
      { error: 'Failed to generate learning material' },
      { status: 500 }
    );
  }
}
