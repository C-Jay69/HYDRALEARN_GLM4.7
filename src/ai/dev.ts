import { config } from 'dotenv';
config();

import '@/ai/flows/generate-lesson-plan.ts';
import '@/ai/flows/generate-differentiated-activities.ts';
import '@/ai/flows/ai-grade-essays.ts';
import '@/ai/flows/batch-grade-essays.ts';
import '@/ai/flows/create-automatic-assessment.ts';
import '@/ai/flows/generate-learning-material.ts';
