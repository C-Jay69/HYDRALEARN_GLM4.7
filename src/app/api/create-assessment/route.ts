import { NextRequest, NextResponse } from 'next/server';
import { createAutomaticAssessment } from '@/ai/flows/create-automatic-assessment';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { topic, gradeLevel, assessmentType, learningObjectives, curriculum } = body;

        if (!topic || !gradeLevel || !assessmentType || !learningObjectives || !curriculum) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const result = await createAutomaticAssessment({
            topic,
            gradeLevel,
            assessmentType,
            learningObjectives,
            curriculum,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error creating assessment:', error);
        return NextResponse.json(
            { error: 'Failed to create assessment', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}
