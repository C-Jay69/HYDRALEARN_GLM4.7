import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalizationForm } from './personalization-form';

export default function PersonalizationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Personalization"
        description="Train the AI to match your unique teaching and feedback style."
      />
      <Card>
        <CardHeader>
            <CardTitle>Upload Your Writing Samples</CardTitle>
            <CardDescription>
                Provide examples of your past feedback, comments, or emails. The AI will learn your tone, phrasing, and style to provide more personalized assistance. Upload .txt or .md files.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <PersonalizationForm />
        </CardContent>
      </Card>
    </div>
  );
}
