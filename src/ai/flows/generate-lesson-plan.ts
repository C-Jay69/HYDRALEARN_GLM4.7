'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized lesson plans for students.
 *
 * The flow takes student-specific needs and learning gaps as input, leverages an LLM to generate
 * a tailored lesson plan, and outputs the plan for teacher use.
 *
 * @exports {
 *   generateLessonPlan,
 *   GenerateLessonPlanInput,
 *   GenerateLessonPlanOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the generateLessonPlan flow.  Includes student needs, current curriculum,
 * and any specific objectives to achieve.
 */
const GenerateLessonPlanInputSchema = z.object({
  studentNeeds: z
    .string()
    .describe('A detailed description of the student’s learning needs and gaps.'),
  curriculum: z
    .string()
    .describe('The official curriculum to be used as a reference (e.g., Common Core, IB).'),
  objectives: z
    .string()
    .describe('Specific lesson objectives to be achieved.'),
  gradeLevel: z.string().describe('The grade level of the student.'),
  subject: z.string().describe('The subject of the lesson plan.'),
});

export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

/**
 * Output schema for the generateLessonPlan flow.  Returns a detailed lesson plan tailored to the student.
 */
const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z
    .string()
    .describe('A detailed, personalized lesson plan for the student.'),
});

export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

/**
 * Wrapper function to generate a personalized lesson plan.
 *
 * @param {GenerateLessonPlanInput} input - The input parameters for generating the lesson plan.
 * @returns {Promise<GenerateLessonPlanOutput>} - A promise that resolves to the generated lesson plan.
 */
export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

/**
 * Prompt definition for generating the personalized lesson plan.
 */
const generateLessonPlanPrompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an expert teacher, skilled in creating personalized lesson plans.

  Based on the student's needs, the curriculum, objectives, grade level and subject, generate a detailed lesson plan.

  Student Needs: {{{studentNeeds}}}
  Curriculum: {{{curriculum}}}
  Objectives: {{{objectives}}}
  Grade Level: {{{gradeLevel}}}
  Subject: {{{subject}}}

  Consider various teaching methodologies and suggest differentiated activities.
  Provide a lesson plan that is adaptive and caters to the student's unique learning style.
  Format the lesson plan so it is easily readable by a teacher.
  Focus on creating a single lesson plan, not a series of plans.`,
});

/**
 * Genkit flow definition for generating personalized lesson plans.
 */
const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await generateLessonPlanPrompt(input);
    return output!;
  }
);
