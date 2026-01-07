'use server';

/**
 * @fileOverview A flow for creating automatic assessments.
 *
 * - createAutomaticAssessment - A function that creates automatic assessments.
 * - CreateAutomaticAssessmentInput - The input type for the createAutomaticAssessment function.
 * - CreateAutomaticAssessmentOutput - The return type for the createAutomaticassessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { QuizQuestionSchema } from '@/ai/schemas/quiz-schema';

const CreateAutomaticAssessmentInputSchema = z.object({
  topic: z.string().describe('The topic of the assessment.'),
  gradeLevel: z.string().describe('The grade level of the assessment.'),
  assessmentType: z
    .enum(['quiz', 'game', 'project', 'essay'])
    .describe('The type of assessment.'),
  learningObjectives: z
    .string()
    .describe('The learning objectives of the assessment.'),
  curriculum: z
    .string()
    .describe(
      'The curriculum to align the assessment with (e.g., Common Core, IB).'
    ),
});
export type CreateAutomaticAssessmentInput = z.infer<
  typeof CreateAutomaticAssessmentInputSchema
>;

const CreateAutomaticAssessmentOutputSchema = z.object({
  assessmentContent: z
    .string()
    .describe(
      'The content of the assessment, including questions, instructions, evaluation criteria, and a separate answer key.'
    ),
  feedback: z.string().describe('AI-generated feedback for the assessment.'),
  quiz: z.array(QuizQuestionSchema).optional().describe('An array of quiz questions if the assessment type is game or quiz.'),
});
export type CreateAutomaticAssessmentOutput = z.infer<
  typeof CreateAutomaticAssessmentOutputSchema
>;

export async function createAutomaticAssessment(
  input: CreateAutomaticAssessmentInput
): Promise<CreateAutomaticAssessmentOutput> {
  return createAutomaticAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createAutomaticAssessmentPrompt',
  input: {schema: CreateAutomaticAssessmentInputSchema},
  output: {schema: CreateAutomaticAssessmentOutputSchema},
  prompt: `You are an expert teacher creating an automatic assessment for the topic of {{{topic}}} for grade level {{{gradeLevel}}}.

The assessment type is {{{assessmentType}}}. The learning objectives are: {{{learningObjectives}}}.

The assessment should align with the {{{curriculum}}} curriculum.

**Instructions for output:**
1.  **Format**: The output for 'assessmentContent' MUST be plain text or Markdown. Do NOT use HTML or any other markup language.
2.  **Content**: Provide the assessment content, including clear questions, instructions, and evaluation criteria.
3.  **Answer Key**: At the end of the 'assessmentContent', you MUST include a clearly labeled "Answer Key" section with the correct answers for all questions.
4.  **Difficulty**: Ensure the assessment has a difficulty appropriate to the grade level.
5.  **Engagement**: Be creative and engaging when creating the assessment.
6.  **Game/Quiz**: If the assessmentType is 'game' or 'quiz', you MUST ALSO populate the 'quiz' field with an array of 5 multiple-choice questions. Each question must have exactly 4 options.

Provide the assessment content and AI-generated feedback based on these instructions.`,
});

const createAutomaticAssessmentFlow = ai.defineFlow(
  {
    name: 'createAutomaticAssessmentFlow',
    inputSchema: CreateAutomaticAssessmentInputSchema,
    outputSchema: CreateAutomaticAssessmentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
