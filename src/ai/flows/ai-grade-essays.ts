'use server';

/**
 * @fileOverview An AI agent for grading student essays with teacher override.
 *
 * - aiGradeEssays - A function that handles the essay grading process.
 * - AiGradeEssaysInput - The input type for the aiGradeEssays function.
 * - AiGradeEssaysOutput - The return type for the aiGradeEssays function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiGradeEssaysInputSchema = z.object({
  essay: z.string().describe('The text of the essay to be graded.'),
  rubric: z.string().describe('The grading rubric to be used.'),
  gradeLevel: z.string().describe('The grade level of the student.'),
  teacherNotes: z.string().optional().describe('Optional notes from the teacher to guide the grading.'),
  styleGuide: z.string().optional().describe("A collection of writing samples to inform the AI's tone and style."),
});
export type AiGradeEssaysInput = z.infer<typeof AiGradeEssaysInputSchema>;

const AiGradeEssaysOutputSchema = z.object({
  grade: z.string().describe('The grade assigned to the essay.'),
  feedback: z.string().describe('Feedback on the essay.'),
  reasoning: z.string().describe('The AI reasoning for the grade and feedback.'),
});
export type AiGradeEssaysOutput = z.infer<typeof AiGradeEssaysOutputSchema>;

export async function aiGradeEssays(input: AiGradeEssaysInput): Promise<AiGradeEssaysOutput> {
  return aiGradeEssaysFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGradeEssaysPrompt',
  input: {
    schema: AiGradeEssaysInputSchema,
  },
  output: {
    schema: AiGradeEssaysOutputSchema,
  },
  prompt: `You are an AI assistant that grades student essays. Your grading should be adapted to the student's grade level.

You must follow the teacher's notes as the ultimate source of truth.

You should also adapt your feedback to match the teacher's writing style, as demonstrated in the Style Guide provided.

Grade Level: {{{gradeLevel}}}

Teacher's Style Guide:
{{{styleGuide}}}

Rubric:
{{{rubric}}}

Teacher's Notes:
{{{teacherNotes}}}

Essay:
{{{essay}}}

Provide a grade, feedback, and reasoning for the grade. Focus on areas for improvement and strengths.

Ensure that the grade, feedback, and reasoning are all helpful and appropriate for a student in the specified grade level.`,
});

const aiGradeEssaysFlow = ai.defineFlow(
  {
    name: 'aiGradeEssaysFlow',
    inputSchema: AiGradeEssaysInputSchema,
    outputSchema: AiGradeEssaysOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      teacherNotes: input.teacherNotes ?? 'No specific teacher notes provided.',
      styleGuide: input.styleGuide ?? 'No style guide provided. Use a generally encouraging and constructive tone.',
    });
    return output!;
  }
);
