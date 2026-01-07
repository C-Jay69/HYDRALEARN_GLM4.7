'use server';

/**
 * @fileOverview A flow for generating custom learning materials.
 *
 * - generateLearningMaterial - A function that creates materials like flashcards, worksheets, etc.
 * - GenerateLearningMaterialInput - The input type for the function.
 * - GenerateLearningMaterialOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLearningMaterialInputSchema = z.object({
  materialType: z.string().describe('The type of material to generate (e.g., Flashcards, Worksheet, Chart).'),
  topic: z.string().describe('The topic for the material.'),
  gradeLevel: z.string().describe('The target grade level for the material.'),
  instructions: z.string().optional().describe('Specific instructions for the AI on how to create the material.'),
});
export type GenerateLearningMaterialInput = z.infer<
  typeof GenerateLearningMaterialInputSchema
>;

const GenerateLearningMaterialOutputSchema = z.object({
  content: z
    .string()
    .describe(
      'The generated learning material content, formatted in Markdown.'
    ),
});
export type GenerateLearningMaterialOutput = z.infer<
  typeof GenerateLearningMaterialOutputSchema
>;

export async function generateLearningMaterial(
  input: GenerateLearningMaterialInput
): Promise<GenerateLearningMaterialOutput> {
  return generateLearningMaterialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningMaterialPrompt',
  input: {schema: GenerateLearningMaterialInputSchema},
  output: {schema: GenerateLearningMaterialOutputSchema},
  prompt: `You are an expert curriculum designer and teacher's assistant. Your task is to create high-quality learning materials.

Material Type: {{{materialType}}}
Topic: {{{topic}}}
Grade Level: {{{gradeLevel}}}
Specific Instructions: {{{instructions}}}

**Instructions for output:**
1.  **Format**: The output MUST be formatted using Markdown. This is crucial for display. For example, use '#' for headers, '*' for bullet points, and tables for structured data like flashcards.
2.  **Content**: Generate the content for the requested material based on the inputs.
3.  **Clarity**: Ensure the content is clear, accurate, and appropriate for the specified grade level.
4.  **Completeness**: Fulfill the request as completely as possible based on the instructions. If no instructions are given, use a standard, effective format for the requested material type.

Generate the material now.`,
});

const generateLearningMaterialFlow = ai.defineFlow(
  {
    name: 'generateLearningMaterialFlow',
    inputSchema: GenerateLearningMaterialInputSchema,
    outputSchema: GenerateLearningMaterialOutputSchema,
  },
  async (input) => {
    const {output} = await prompt({
        ...input,
        instructions: input.instructions ?? 'Use a standard format for this material type.'
    });
    return output!;
  }
);
