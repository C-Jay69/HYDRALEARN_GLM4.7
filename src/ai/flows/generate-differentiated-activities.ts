'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating differentiated activities for students.
 *
 * The flow takes student needs and learning styles as input and returns a list of suggested activities tailored to each student.
 *
 * @exports generateDifferentiatedActivities - An async function that calls the generateDifferentiatedActivitiesFlow.
 * @exports GenerateDifferentiatedActivitiesInput - The input type for the generateDifferentiatedActivities function.
 * @exports GenerateDifferentiatedActivitiesOutput - The output type for the generateDifferentiatedActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentProfileSchema = z.object({
  studentId: z.string().describe('Unique identifier for the student.'),
  learningStyle: z
    .string()
    .describe(
      'The students preferred learning style (e.g., visual, auditory, kinesthetic).'
    ),
  needs: z.string().describe('Specific learning needs or challenges of the student.'),
  currentLevel: z
    .string()
    .describe('The current skill level of the student in the subject.'),
});

const GenerateDifferentiatedActivitiesInputSchema = z.object({
  topic: z.string().describe('The topic for which activities are needed.'),
  students: z.array(StudentProfileSchema).describe('Array of student profiles.'),
  gradeLevel: z.string().describe('The grade level of the students.'),
});

export type GenerateDifferentiatedActivitiesInput = z.infer<
  typeof GenerateDifferentiatedActivitiesInputSchema
>;

const SuggestedActivitySchema = z.object({
  studentId: z.string().describe('The student ID for whom the activity is intended.'),
  activityDescription: z
    .string()
    .describe('A description of the suggested activity.'),
  justification: z.string().describe('Why this activity is suitable for the student.'),
});

const GenerateDifferentiatedActivitiesOutputSchema = z.object({
  activities: z.array(SuggestedActivitySchema).describe('List of suggested activities for each student.'),
});

export type GenerateDifferentiatedActivitiesOutput = z.infer<
  typeof GenerateDifferentiatedActivitiesOutputSchema
>;

export async function generateDifferentiatedActivities(
  input: GenerateDifferentiatedActivitiesInput
): Promise<GenerateDifferentiatedActivitiesOutput> {
  return generateDifferentiatedActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDifferentiatedActivitiesPrompt',
  input: {schema: GenerateDifferentiatedActivitiesInputSchema},
  output: {schema: GenerateDifferentiatedActivitiesOutputSchema},
  prompt: `You are an experienced teacher skilled at creating differentiated learning activities.

        For each student, suggest an activity that caters to their learning style, needs, and current level, given the topic and grade level.
        Explain why each activity is appropriate for the student.

        Topic: {{{topic}}}
        Grade Level: {{{gradeLevel}}}

        {{#each students}}
        Student ID: {{{studentId}}}
        Learning Style: {{{learningStyle}}}
        Needs: {{{needs}}}
        Current Level: {{{currentLevel}}}
        {{/each}}

        Provide activities that are appropriate and engaging to the student.
        `,
});

const generateDifferentiatedActivitiesFlow = ai.defineFlow(
  {
    name: 'generateDifferentiatedActivitiesFlow',
    inputSchema: GenerateDifferentiatedActivitiesInputSchema,
    outputSchema: GenerateDifferentiatedActivitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
