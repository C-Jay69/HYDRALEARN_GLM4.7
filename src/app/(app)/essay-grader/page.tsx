import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EssayGraderForm } from './essay-grader-form';

export default function EssayGraderPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI-Powered Essay Grader"
        description="Get instant, rubric-based feedback and grades for student essays."
      />
      <Card>
        <CardHeader>
            <CardTitle>Grade an Essay</CardTitle>
            <CardDescription>Paste the essay and rubric below. The AI will provide a grade, feedback, and its reasoning.</CardDescription>
        </CardHeader>
        <CardContent>
            <EssayGraderForm />
        </CardContent>
      </Card>
    </div>
  );
}
