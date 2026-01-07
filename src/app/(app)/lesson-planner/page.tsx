import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonPlannerForm } from './lesson-planner-form';

export default function LessonPlannerPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Personalized Lesson Planner"
        description="Generate adaptive lesson plans for each student based on their unique needs."
      />
      <Card>
        <CardHeader>
            <CardTitle>Generate a Lesson Plan</CardTitle>
            <CardDescription>Fill in the details below to get a customized lesson plan from the AI assistant.</CardDescription>
        </CardHeader>
        <CardContent>
            <LessonPlannerForm />
        </CardContent>
      </Card>
    </div>
  );
}
