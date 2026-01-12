import { NextRequest, NextResponse } from 'next/server';
import { generateDifferentiatedActivities } from '@/ai/flows/generate-differentiated-activities';

export async function POST(req: NextRequest) {
    try {
        console.log('Received differentiated activities request');
        const body = await req.json();
        console.log('Request body:', JSON.stringify(body, null, 2));

        const { topic, gradeLevel, students } = body;

        if (!topic || !gradeLevel || !students) {
            console.error('Missing required fields in differentiated activities request');
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        console.log(`Calling flow for topic: ${topic}, students count: ${students.length}`);
        const result = await generateDifferentiatedActivities({
            topic,
            gradeLevel,
            students,
        });
        console.log('Differentiated activities generated successfully');

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error generating differentiated activities:', error);
        return NextResponse.json(
            { error: 'Failed to generate differentiated activities', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}
