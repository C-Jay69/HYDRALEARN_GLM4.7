import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DifferentiatedActivitiesForm } from './differentiated-activities-form';

export default function DifferentiatedActivitiesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Differentiated Activities Suggester"
        description="Generate tailored activities for students with diverse learning styles and needs."
      />
      <Card>
        <CardHeader>
            <CardTitle>Get Activity Suggestions</CardTitle>
            <CardDescription>Add student profiles and a topic to receive AI-powered activity ideas.</CardDescription>
        </CardHeader>
        <CardContent>
            <DifferentiatedActivitiesForm />
        </CardContent>
      </Card>
    </div>
  );
}
