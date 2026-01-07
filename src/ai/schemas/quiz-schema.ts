import { z } from 'zod';

export const QuizQuestionSchema = z.object({
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).describe('An array of 4 possible answers.'),
  answer: z.string().describe('The correct answer. Must be one of the provided options.'),
});
