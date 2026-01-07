'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  createAutomaticAssessment,
  CreateAutomaticAssessmentOutput,
} from '@/ai/flows/create-automatic-assessment';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Swords, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InteractiveQuiz } from './interactive-quiz';

const formSchema = z.object({
  topic: z.string().min(2, 'Topic is required.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
  learningObjectives: z.string().min(10, 'Please provide detailed learning objectives.'),
  curriculum: z.string().min(2, 'Curriculum is required.'),
});

type FormData = z.infer<typeof formSchema>;

export function NewChallengeDialog() {
  const [result, setResult] = useState<CreateAutomaticAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'Fractions',
      gradeLevel: '4th Grade',
      learningObjectives: 'Students will be able to add and subtract fractions with common denominators.',
      curriculum: 'Common Core',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await createAutomaticAssessment({ ...data, assessmentType: 'game' });
      if (!response.quiz || response.quiz.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Failed to generate quiz',
          description: 'The AI did not return any questions. Please try again.',
        });
        return;
      }
      setResult(response);
      setIsFormOpen(false); // Close form dialog
      setIsResultOpen(true); // Open result dialog
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate game. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button>
            <Swords className="mr-2 h-4 w-4" />
            Launch New Challenge
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Launch a New Challenge</DialogTitle>
            <DialogDescription>
              Create a new educational game for your students. The AI will generate the content.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="curriculum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curriculum</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="learningObjectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Objectives</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Game...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Game
                  </>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {result?.quiz && (
        <InteractiveQuiz 
            isOpen={isResultOpen} 
            onOpenChange={setIsResultOpen} 
            topic={form.getValues('topic')} 
            questions={result.quiz} 
        />
      )}
    </>
  );
}
