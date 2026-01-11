/**
 * @fileOverview A flow for batch grading multiple essays at once.
 *
 * - batchGradeEssays - A function that grades multiple essays and returns CSV data.
 * - BatchGradeEssaysInput - The input type for the batchGradeEssays function.
 * - BatchGradeEssaysOutput - The return type for the batchGradeEssays function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EssayInputSchema = z.object({
  fileName: z.string().describe('The filename of the essay.'),
  content: z.string().describe('The text content of the essay.'),
});

const BatchGradeEssaysInputSchema = z.object({
  essays: z
    .array(EssayInputSchema)
    .describe('Array of essays to grade, each with filename and content.'),
  gradeLevel: z.string().describe('The grade level of the students.'),
  rubric: z.string().describe('The grading rubric to be used for all essays.'),
  teacherNotes: z.string().optional().describe('Optional notes from the teacher to guide the grading.'),
  styleGuide: z.string().optional().describe("A collection of writing samples to inform the AI's tone and style."),
});

export type BatchGradeEssaysInput = z.infer<typeof BatchGradeEssaysInputSchema>;

const EssayGradingResultSchema = z.object({
  fileName: z.string().describe('The filename of the essay.'),
  grade: z.string().describe('The grade assigned to the essay.'),
  feedback: z.string().describe('Feedback on the essay.'),
  reasoning: z.string().describe('The AI reasoning for the grade and feedback.'),
});

const BatchGradeEssaysOutputSchema = z.object({
  results: z
    .array(EssayGradingResultSchema)
    .describe('Array of grading results for each essay.'),
  csvContent: z.string().describe('CSV formatted string with all grading results.'),
});

export type BatchGradeEssaysOutput = z.infer<typeof BatchGradeEssaysOutputSchema>;

export async function batchGradeEssays(
  input: BatchGradeEssaysInput
): Promise<BatchGradeEssaysOutput> {
  return batchGradeEssaysFlow(input);
}

const prompt = ai.definePrompt({
  name: 'batchGradeEssaysPrompt',
  input: { schema: BatchGradeEssaysInputSchema },
  output: { schema: BatchGradeEssaysOutputSchema },
  prompt: `You are an AI assistant that grades student essays in batch. Your grading should be adapted to the students' grade level.

You must follow the teacher's notes as the ultimate source of truth.

You should also adapt your feedback to match the teacher's writing style, as demonstrated in the Style Guide provided.

Grade Level: {{{gradeLevel}}}

Teacher's Style Guide:
{{{styleGuide}}}

Rubric (applies to all essays):
{{{rubric}}}

Teacher's Notes:
{{{teacherNotes}}}

Essays to Grade:
{{#each essays}}
Filename: {{{fileName}}}
Essay: {{{content}}}

{{/each}}

Grade each essay based on the rubric. For each essay, provide a grade, feedback, and reasoning.

Then, create a CSV with the following headers: fileName,grade,feedback,reasoning
Each row should contain the grading results for one essay.
Format the CSV properly with commas separating fields and newlines separating rows.
Escape any commas in the feedback or reasoning by wrapping the field in double quotes.

Ensure that the grade, feedback, and reasoning are all helpful and appropriate for students in the specified grade level.`,
});

const batchGradeEssaysFlow = ai.defineFlow(
  {
    name: 'batchGradeEssaysFlow',
    inputSchema: BatchGradeEssaysInputSchema,
    outputSchema: BatchGradeEssaysOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
      ...input,
      teacherNotes: input.teacherNotes ?? 'No specific teacher notes provided.',
      styleGuide: input.styleGuide ?? 'No style guide provided. Use a generally encouraging and constructive tone.',
    });
    return output!;
  }
);
