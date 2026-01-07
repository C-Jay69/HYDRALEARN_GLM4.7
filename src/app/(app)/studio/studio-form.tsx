'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateLearningMaterial,
  GenerateLearningMaterialOutput,
} from '@/ai/flows/generate-learning-material';

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
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Brush } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

const formSchema = z.object({
  materialType: z.string().min(3, 'Please describe the material type.'),
  topic: z.string().min(3, 'A topic is required.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
  instructions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function StudioForm() {
  const [result, setResult] = useState<GenerateLearningMaterialOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialType: searchParams.get('materialType') || 'Flashcards',
      topic: searchParams.get('topic') || 'The Water Cycle',
      gradeLevel: searchParams.get('gradeLevel') || '4th Grade',
      instructions: searchParams.get('instructions') || 'Create 10 flashcards. One side should have the term, the other side a simple definition.',
    },
  });

  useEffect(() => {
    form.reset({
        materialType: searchParams.get('materialType') || 'Flashcards',
        topic: searchParams.get('topic') || '',
        gradeLevel: searchParams.get('gradeLevel') || '',
        instructions: searchParams.get('instructions') || '',
    })
  }, [searchParams, form]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateLearningMaterial(data);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate material. Please try again.',
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
            name="materialType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Material</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Flashcards, Worksheet, Chart" {...field} />
                </FormControl>
                 <FormDescription>
                  What kind of material do you need?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Instructions (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any specific details for the AI? e.g., 'Create 5 multiple-choice questions' or 'Make the chart colorful'."
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
                <Brush className="mr-2 h-4 w-4" />
                Generate Material
                </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="space-y-4">
        <h3 className="font-headline text-2xl font-bold">Generated Material</h3>
        <div className="min-h-[400px]">
            {isLoading && (
                <Card className="h-full flex items-center justify-center border-dashed">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p>AI is creating your material...</p>
                    </div>
                </Card>
            )}
            {!isLoading && !result && (
                <Card className="h-full flex items-center justify-center border-dashed">
                    <div className="text-center text-muted-foreground">
                        <p>Your generated material will appear here.</p>
                    </div>
                </Card>
            )}
            {result && (
                <Card>
                    <CardContent className="p-6">
                        <pre className="whitespace-pre-wrap font-body text-sm">{result.content}</pre>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
