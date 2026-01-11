import { NextRequest, NextResponse } from 'next/server';
import { generateDifferentiatedActivities } from '@/ai/flows/generate-differentiated-activities';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { topic, gradeLevel, studentProfiles, learningObjectives } = body;

        if (!topic || !gradeLevel || !studentProfiles || !learningObjectives) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const result = await generateDifferentiatedActivities({
            topic,
            gradeLevel,
            studentProfiles,
            learningObjectives,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error generating differentiated activities:', error);
        return NextResponse.json(
            { error: 'Failed to generate differentiated activities', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}
