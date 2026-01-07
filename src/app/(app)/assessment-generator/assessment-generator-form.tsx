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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  topic: z.string().min(2, 'Topic is required.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
  assessmentType: z.enum(['quiz', 'game', 'project', 'essay']),
  learningObjectives: z.string().min(10, 'Please provide detailed learning objectives.'),
  curriculum: z.string().min(2, 'Curriculum is required.'),
});

type FormData = z.infer<typeof formSchema>;

export function AssessmentGeneratorForm() {
  const [result, setResult] = useState<CreateAutomaticAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'The American Revolution',
      gradeLevel: '8th Grade',
      assessmentType: 'quiz',
      learningObjectives: 'Students will be able to identify key figures, events, and their significance.',
      curriculum: 'Common Core',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await createAutomaticAssessment(data);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate assessment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Photosynthesis" {...field} />
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
                  <Input placeholder="e.g., 6th Grade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="assessmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assessment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an assessment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="game">Game</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input placeholder="e.g., IB, UK National Curriculum" {...field} />
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
                  <Textarea
                    placeholder="What skills or knowledge should this assessment measure?"
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
                Creating...
              </>
            ) : (
                <>
                <Wand2 className="mr-2 h-4 w-4" />
                Create Assessment
                </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="space-y-4">
        <h3 className="font-headline text-2xl font-bold">Generated Assessment</h3>
        <div className="min-h-[400px]">
            {isLoading && (
                <Card className="h-full flex items-center justify-center border-dashed">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p>AI is building your assessment...</p>
                    </div>
                </Card>
            )}
            {!isLoading && !result && (
                <Card className="h-full flex items-center justify-center border-dashed">
                    <div className="text-center text-muted-foreground">
                        <p>Your assessment will appear here.</p>
                    </div>
                </Card>
            )}
            {result && (
              <Tabs defaultValue="content" className="w-full">
                <TabsList>
                  <TabsTrigger value="content">Assessment Content</TabsTrigger>
                  <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                    <Card>
                        <CardContent className="p-6">
                            <pre className="whitespace-pre-wrap font-body text-sm">{result.assessmentContent}</pre>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="feedback">
                    <Card>
                         <CardContent className="p-6">
                            <pre className="whitespace-pre-wrap font-body text-sm">{result.feedback}</pre>
                        </CardContent>
                    </Card>
                </TabsContent>
              </Tabs>
            )}
        </div>
      </div>
    </div>
  );
}
