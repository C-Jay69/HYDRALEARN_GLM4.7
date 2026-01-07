'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateLessonPlan,
  GenerateLessonPlanOutput,
} from '@/ai/flows/generate-lesson-plan';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Brush } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  studentNeeds: z.string().min(10, 'Please provide more detail on student needs.'),
  curriculum: z.string().min(2, 'Curriculum is required.'),
  objectives: z.string().min(10, 'Please provide more detail on lesson objectives.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
  subject: z.string().min(2, 'Subject is required.'),
});

type FormData = z.infer<typeof formSchema>;

export function LessonPlannerForm() {
  const [result, setResult] = useState<GenerateLessonPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentNeeds: '',
      curriculum: 'Common Core',
      objectives: '',
      gradeLevel: '5th Grade',
      subject: 'Mathematics',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateLessonPlan(data);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to generate lesson plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const createStudioLink = () => {
    if (!result) return '';
    const { subject, gradeLevel } = form.getValues();
    const params = new URLSearchParams({
      topic: subject,
      gradeLevel,
      instructions: `Based on the following lesson plan, generate the necessary materials (e.g., flashcards, worksheets):\n\n${result.lessonPlan}`,
    });
    return `/studio?${params.toString()}`;
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., American History" {...field} />
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
                  <Input placeholder="e.g., 10th Grade" {...field} />
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
                  <Input placeholder="e.g., Common Core, IB" {...field} />
                </FormControl>
                <FormDescription>
                  The official curriculum to use as a reference.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studentNeeds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Needs & Gaps</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the student's learning needs, strengths, and areas for improvement."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="objectives"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Objectives</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What should the student be able to do after this lesson?"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
                <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Plan
                </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="space-y-4">
        <h3 className="font-headline text-2xl font-bold">Generated Plan</h3>
        <Card className="min-h-[400px]">
            {isLoading && (
                <div className="flex items-center justify-center h-full border-dashed rounded-lg">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p>AI is thinking...</p>
                    </div>
                </div>
            )}
            {!isLoading && !result && (
                <div className="flex items-center justify-center h-full border-dashed rounded-lg">
                    <div className="text-center text-muted-foreground">
                        <p>Your lesson plan will appear here.</p>
                    </div>
                </div>
            )}
            {result && (
                <>
                    <CardContent className="p-6 max-h-[60vh] overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-body text-sm">{result.lessonPlan}</pre>
                    </CardContent>
                    <CardFooter>
                        <Button asChild>
                            <Link href={createStudioLink()}>
                                <Brush className="mr-2 h-4 w-4" />
                                Generate Materials
                            </Link>
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
      </div>
    </div>
  );
}
