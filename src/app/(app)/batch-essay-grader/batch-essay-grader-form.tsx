'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  BatchGradeEssaysOutput,
} from '@/ai/flows/batch-grade-essays';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Download, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['text/plain', 'text/markdown'];

const formSchema = z.object({
  essays: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, 'At least one essay file is required.')
    .refine((files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE), `Each file size must be less than 5MB.`)
    .refine((files) => Array.from(files).every((file) => ACCEPTED_FILE_TYPES.includes(file.type)), 'Only .txt and .md files are accepted.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
  rubric: z.string().min(20, 'A detailed rubric is required.'),
  teacherNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function BatchEssayGraderForm() {
  const [result, setResult] = useState<BatchGradeEssaysOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      essays: undefined,
      gradeLevel: '8th Grade',
      rubric: 'A: Excellent - Clear thesis, strong evidence, well-structured. B: Good - Clear thesis, some evidence, minor structure issues. C: Fair - Unclear thesis, weak evidence. D: Poor - Lacks thesis and evidence.',
      teacherNotes: 'Focus on the use of specific historical evidence for all essays.',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      // This is a bit of a hack to make react-hook-form happy with FileList
      const dataTransfer = new DataTransfer();
      [...selectedFiles, ...newFiles].forEach(file => dataTransfer.items.add(file));
      form.setValue('essays', dataTransfer.files, { shouldValidate: true });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    form.setValue('essays', dataTransfer.files, { shouldValidate: true });
  }

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      // Fetch the style guide from localStorage
      const styleGuide = typeof window !== 'undefined' ? localStorage.getItem('teacherStyleGuide') : null;

      const response = await fetch('/api/batch-grade-essays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essays: await Promise.all(Array.from(data.essays).map(async (file) => ({
            fileName: file.name,
            content: await file.text(),
          }))),
          gradeLevel: data.gradeLevel,
          rubric: data.rubric,
          teacherNotes: data.teacherNotes,
          styleGuide: styleGuide ?? undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details
          ? `${errorData.error}: ${errorData.details}`
          : (errorData.error || 'Failed to grade essays');
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setResult(responseData);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to grade essays. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const downloadCsv = () => {
    if (result) {
      const blob = new Blob([result.csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'essay-grades.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="essays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Essay Files</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept=".txt,.md"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </FormControl>
                <FormDescription>
                  Upload one or more .txt or .md files.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Files:</h4>
              <div className="space-y-2 rounded-md border p-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                  This will be applied to all essays in the batch.
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
                    placeholder="Provide the grading rubric. This will be applied to all essays."
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
                    placeholder="Add any specific instructions or points to focus on for all essays."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading || selectedFiles.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Grading Batch...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Grade All Essays
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="space-y-4">
        <h3 className="font-headline text-2xl font-bold">Grading Report</h3>
        <div className="min-h-[400px]">
          {isLoading && (
            <Card className="h-full flex items-center justify-center border-dashed">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>AI is grading all essays...</p>
              </div>
            </Card>
          )}
          {!isLoading && !result && (
            <Card className="h-full flex items-center justify-center border-dashed">
              <div className="text-center text-muted-foreground">
                <p>Your downloadable CSV report will be ready here.</p>
              </div>
            </Card>
          )}
          {result && (
            <Card className="h-full flex flex-col items-center justify-center text-center">
              <CardHeader>
                <CardTitle>Report Ready!</CardTitle>
                <CardDescription>Your CSV report with all grades is ready for download.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={downloadCsv}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Grades.csv
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
