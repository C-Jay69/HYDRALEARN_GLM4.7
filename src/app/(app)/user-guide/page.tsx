import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function UserGuidePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to HydraLearn!"
        description="Many heads. One goal: smarter, safer learning."
      />
      
      <Accordion type="multiple" className="w-full space-y-4">
        {/* For Teachers Section */}
        <AccordionItem value="for-teachers" className="bg-card border rounded-lg">
          <AccordionTrigger className="px-6 text-lg hover:no-underline font-semibold">
            For Teachers: Your AI Assistant
          </AccordionTrigger>
          <AccordionContent className="px-6 space-y-4">
            <p className="text-muted-foreground">HydraLearn is like having a helpful assistant for your classroom. It helps you save time on planning and grading so you can focus more on teaching.</p>
            
            <div>
              <h4 className="font-semibold mb-1">Lesson Planner</h4>
              <p className="text-sm text-muted-foreground">Need a lesson plan for a specific student? Go to the "Lesson Planner," tell the AI about the student's needs and your goals, and it will create a personalized plan just for them.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Assessment Generator</h4>
              <p className="text-sm text-muted-foreground">Quickly create quizzes, essays, or even fun projects. Just give the AI a topic, grade level, and what you want students to learn. It will write the whole assessment for you, including an answer key!</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Essay Grader</h4>
              <p className="text-sm text-muted-foreground">Grade essays one by one or upload a whole batch! The AI reads the essays, compares them to your rubric, and gives a grade and helpful feedback. It can even learn to write feedback in your style if you use the "AI Personalization" page.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Gamification</h4>
              <p className="text-sm text-muted-foreground">Make learning fun with classroom challenges and badges. You can use the AI to launch new educational games for your students to compete in.</p>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* For Students Section */}
        <AccordionItem value="for-students" className="bg-card border rounded-lg">
          <AccordionTrigger className="px-6 text-lg hover:no-underline font-semibold">
            For Students: Your Learning Buddy
          </AccordionTrigger>
          <AccordionContent className="px-6 space-y-4">
            <p className="text-muted-foreground">HydraLearn makes learning more like a game. You can earn points, get badges, and see how you stack up against your classmates on the leaderboard.</p>
            
            <div>
              <h4 className="font-semibold mb-1">Challenges</h4>
              <p className="text-sm text-muted-foreground">Your teacher will launch fun challenges and games for you to play. You might compete against the whole class or even against an AI. Do your best to earn points!</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Leaderboard</h4>
              <p className="text-sm text-muted-foreground">Check the "Gamification" page to see the class leaderboard. The more you participate and learn, the more points you'll get. Can you make it to the #1 spot?</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Badges</h4>
              <p className="text-sm text-muted-foreground">When you do really well in a subject or win a challenge, you can earn special badges to show off your skills. Try to collect them all!</p>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
