'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AiGradeEssaysOutput } from '@/ai/flows/ai-grade-essays';

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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  essay: z.string().min(50, 'Essay content is too short.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
  rubric: z.string().min(20, 'Rubric must be provided.'),
  teacherNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function EssayGraderForm() {
  const [result, setResult] = useState<AiGradeEssaysOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      essay: 'The primary cause of the Civil War was the issue of slavery. Southern states depended on enslaved labor for their economy, while Northern states were increasingly abolitionist. This fundamental disagreement created deep political and social divides that ultimately led to conflict.',
      gradeLevel: '8th Grade',
      rubric: 'A: Excellent - Clear thesis, strong evidence, well-structured. B: Good - Clear thesis, some evidence, minor structure issues. C: Fair - Unclear thesis, weak evidence. D: Poor - Lacks thesis and evidence.',
      teacherNotes: 'Focus on the use of specific historical evidence.',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      // Fetch the style guide from localStorage
      const styleGuide = localStorage.getItem('teacherStyleGuide');

      const response = await fetch('/api/grade-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essayContent: data.essay,
          rubric: data.rubric,
          studentStyleGuide: styleGuide ?? undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details
          ? `${errorData.error}: ${errorData.details}`
          : (errorData.error || 'Failed to grade essay');
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setResult(responseData);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: error.message || 'Failed to grade essay. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="essay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Essay</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the full text of the student's essay here."
                    className="min-h-[200px] font-mono text-xs"
                    {...field}
                  />
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
                  <Input placeholder="e.g., 8th Grade" {...field} />
                </FormControl>
                <FormDescription>
                  This helps the AI adapt the grading to the student's level.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rubric"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grading Rubric</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide the grading rubric. Be as detailed as possible."
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
            name="teacherNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teacher Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any specific instructions or points to focus on."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This will guide the AI and override its default grading where necessary.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Grading...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Grade Essay
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="space-y-4">
        <h3 className="font-headline text-2xl font-bold">AI Grading Results</h3>
        <div className="min-h-[400px]">
          {isLoading && (
            <Card className="h-full flex items-center justify-center border-dashed">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>AI is reading and grading...</p>
              </div>
            </Card>
          )}
          {!isLoading && !result && (
            <Card className="h-full flex items-center justify-center border-dashed">
              <div className="text-center text-muted-foreground">
                <p>Grading results will appear here.</p>
              </div>
            </Card>
          )}
          {result && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>Results</CardTitle>
                  <Badge variant="secondary" className="text-lg">Grade: {result.grade}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-base mb-2">Feedback for Student</h4>
                  <p className="text-sm text-muted-foreground">{result.feedback}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-base mb-2">AI Reasoning (for teacher)</h4>
                  <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
