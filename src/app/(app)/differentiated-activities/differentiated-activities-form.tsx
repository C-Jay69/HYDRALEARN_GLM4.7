'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GenerateDifferentiatedActivitiesOutput } from '@/ai/flows/generate-differentiated-activities';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, PlusCircle, Sparkles, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const studentProfileSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required.'),
  learningStyle: z.string().min(2, 'Learning style is required.'),
  needs: z.string().min(2, 'Needs are required.'),
  currentLevel: z.string().min(2, 'Current level is required.'),
});

const formSchema = z.object({
  topic: z.string().min(2, 'Topic is required.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
  students: z.array(studentProfileSchema).min(1, 'At least one student is required.'),
});

type FormData = z.infer<typeof formSchema>;

export function DifferentiatedActivitiesForm() {
  const [result, setResult] = useState<GenerateDifferentiatedActivitiesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'Ecosystems',
      gradeLevel: '4th Grade',
      students: [
        { studentId: 'María', learningStyle: 'Visual', needs: 'Needs visual aids to understand complex systems', currentLevel: 'On track' },
        { studentId: 'Ahmed', learningStyle: 'Kinesthetic', needs: 'Benefits from hands-on activities', currentLevel: 'Advanced' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'students',
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/generate-differentiated-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: data.topic,
          gradeLevel: data.gradeLevel,
          studentProfiles: data.students,
          learningObjectives: 'Standard alignment based on grade level and topic.',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate activities');
      }

      const responseData = await response.json();
      setResult(responseData);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: error.message || 'Failed to generate activities. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Water Cycle" {...field} />
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
                    <Input placeholder="e.g., 2nd Grade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Student Profiles</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ studentId: `Student ${fields.length + 1}`, learningStyle: '', needs: '', currentLevel: '' })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-base">Student {index + 1}</CardTitle>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-0">
                    <FormField
                      control={form.control}
                      name={`students.${index}.studentId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Name/ID</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`students.${index}.learningStyle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Learning Style</FormLabel>
                          <FormControl>
                            <Input placeholder="Visual, Auditory, Kinesthetic" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`students.${index}.needs`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specific Needs</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`students.${index}.currentLevel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Level</FormLabel>
                          <FormControl>
                            <Input placeholder="Beginner, On track, Advanced" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            {form.formState.errors.students && (
              <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.students.message}</p>
            )}
          </div>


          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suggesting Activities...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Suggestions
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="space-y-4">
        <h3 className="font-headline text-2xl font-bold">Suggested Activities</h3>
        <div className="min-h-[400px]">
          {isLoading && (
            <Card className="h-full flex items-center justify-center border-dashed">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Finding the best activities...</p>
              </div>
            </Card>
          )}
          {!isLoading && !result && (
            <Card className="h-full flex items-center justify-center border-dashed">
              <div className="text-center text-muted-foreground">
                <p>Activity suggestions will appear here.</p>
              </div>
            </Card>
          )}
          {result && (
            <Accordion type="multiple" className="w-full space-y-4">
              {result.activities.map((activity, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="bg-card border rounded-lg">
                  <AccordionTrigger className="px-6 text-base hover:no-underline">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Activity for {activity.studentId}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{activity.activityDescription}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Justification</h4>
                        <p className="text-sm text-muted-foreground">{activity.justification}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
