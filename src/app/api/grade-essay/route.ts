import { NextRequest, NextResponse } from 'next/server';
import { aiGradeEssays } from '@/ai/flows/ai-grade-essays';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { essay, gradeLevel, rubric, teacherNotes, styleGuide } = body;

        if (!essay || !gradeLevel || !rubric) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const result = await aiGradeEssays({
            essay,
            gradeLevel,
            rubric,
            teacherNotes,
            styleGuide,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error grading essay:', error);
        return NextResponse.json(
            { error: 'Failed to grade essay', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}
