import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BatchEssayGraderForm } from './batch-essay-grader-form';

export default function BatchEssayGraderPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Batch Essay Grader"
        description="Upload multiple essays to grade them all at once."
      />
      <Card>
        <CardHeader>
            <CardTitle>Grade a Batch of Essays</CardTitle>
            <CardDescription>Upload essay files (.txt, .md), provide a rubric, and the AI will generate a downloadable CSV report.</CardDescription>
        </CardHeader>
        <CardContent>
            <BatchEssayGraderForm />
        </CardContent>
      </Card>
    </div>
  );
}
