import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudioForm } from './studio-form';

export default function StudioPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Creative Studio"
        description="Your AI assistant for creating any kind of learning material."
      />
      <Card>
        <CardHeader>
            <CardTitle>Generate Learning Materials</CardTitle>
            <CardDescription>Describe what you need, from flashcards to worksheets, and the AI will create it for you.</CardDescription>
        </CardHeader>
        <CardContent>
            <StudioForm />
        </CardContent>
      </Card>
    </div>
  );
}
