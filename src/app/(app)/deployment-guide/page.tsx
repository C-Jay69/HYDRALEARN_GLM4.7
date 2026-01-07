import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DeploymentGuidePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Deployment Guide"
        description="A technical guide for deploying, hosting, and scaling the HydraLearn application."
      />
      <Card>
        <CardHeader>
          <CardTitle>1. Environment Setup</CardTitle>
          <CardDescription>
            Before deploying, ensure your local and server environments are correctly configured.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Prerequisites:</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Node.js (v18 or higher recommended)</li>
              <li>A Google Cloud Platform (GCP) account with a Firebase project.</li>
              <li>Firebase CLI installed and authenticated (`npm install -g firebase-tools`).</li>
              <li>A registered domain name (optional, but recommended for production).</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Environment Variables:</h3>
            <p className="text-muted-foreground mb-2">Create a `.env.local` file in the root of your project. This file is for sensitive keys and should not be committed to source control. You will need to get your `GEMINI_API_KEY` from Google AI Studio.</p>
            <pre className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap font-mono">
{`GEMINI_API_KEY="your-google-ai-api-key-here"
`}
            </pre>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>2. Deployment with Firebase App Hosting</CardTitle>
          <CardDescription>
            The recommended way to deploy HydraLearn is using Firebase App Hosting for a seamless, serverless experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal pl-5 space-y-4">
            <li>
                <h3 className="font-semibold">Initialize Firebase</h3>
                <p className="text-muted-foreground">If you haven't already, link your project directory to your Firebase project by running `firebase init hosting` in your terminal and selecting your project.</p>
            </li>
            <li>
                <h3 className="font-semibold">Build the Application</h3>
                <p className="text-muted-foreground">Generate a production-ready build of your Next.js application by running:</p>
                <pre className="p-4 mt-2 bg-muted rounded-md text-sm whitespace-pre-wrap font-mono">npm run build</pre>
            </li>
            <li>
                <h3 className="font-semibold">Deploy to Firebase</h3>
                <p className="text-muted-foreground">Deploy the built application to Firebase App Hosting with a single command:</p>
                <pre className="p-4 mt-2 bg-muted rounded-md text-sm whitespace-pre-wrap font-mono">firebase deploy --only hosting</pre>
                <p className="text-muted-foreground mt-2">After deployment, the CLI will provide you with a URL to your live application.</p>
            </li>
            <li>
                <h3 className="font-semibold">Connect a Custom Domain (Optional)</h3>
                <p className="text-muted-foreground">In the Firebase Console, navigate to the "Hosting" section. Click "Add custom domain" and follow the instructions to point your domain's DNS records to Firebase.</p>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Scaling and Performance</CardTitle>
          <CardDescription>
            Firebase App Hosting handles scaling automatically, but here are some best practices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <h3 className="font-semibold text-lg mb-2">Automatic Scaling:</h3>
            <p className="text-muted-foreground">Firebase App Hosting automatically provisions and scales resources based on traffic. You can configure the maximum number of instances in the `apphosting.yaml` file to control costs. The default is set to a low number to prevent unexpected bills.</p>
            <pre className="p-4 mt-2 bg-muted rounded-md text-sm whitespace-pre-wrap font-mono">
{`# apphosting.yaml
runConfig:
  maxInstances: 10 # Example: Allow up to 10 instances
`}
            </pre>
          </div>
           <div>
            <h3 className="font-semibold text-lg mb-2">Caching:</h3>
            <p className="text-muted-foreground">Firebase Hosting automatically caches static assets (JS, CSS, images) on a global CDN, ensuring fast delivery to users worldwide. API responses from Genkit flows are not cached by default, ensuring real-time data.</p>
          </div>
           <div>
            <h3 className="font-semibold text-lg mb-2">Monitoring:</h3>
            <p className="text-muted-foreground">Monitor your application's performance and errors through the Firebase Console. Check the Hosting dashboard for usage metrics and the Functions logs for any Genkit flow errors.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
