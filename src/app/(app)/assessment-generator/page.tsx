import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentGeneratorForm } from './assessment-generator-form';

export default function AssessmentGeneratorPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Automatic Assessment Engine"
        description="Create quizzes, games, projects, and essays in just a few clicks."
      />
      <Card>
        <CardHeader>
            <CardTitle>Generate an Assessment</CardTitle>
            <CardDescription>Use the AI to build a competency-tracking assessment for your students.</CardDescription>
        </CardHeader>
        <CardContent>
            <AssessmentGeneratorForm />
        </CardContent>
      </Card>
    </div>
  );
}
