import { NextRequest, NextResponse } from 'next/server';
import { batchGradeEssays } from '@/ai/flows/batch-grade-essays';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { essays, gradeLevel, rubric, teacherNotes, styleGuide } = body;

        if (!essays || !gradeLevel || !rubric) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const result = await batchGradeEssays({
            essays,
            gradeLevel,
            rubric,
            teacherNotes,
            styleGuide,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error in batch grading:', error);
        return NextResponse.json(
            { error: 'Failed to grade essays in batch', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}
