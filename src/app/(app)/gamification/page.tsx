import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Book,
  Calculator,
  Flame,
  Globe,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { NewChallengeDialog } from './new-challenge-dialog';

const leaderboardData = [
  { rank: 1, name: 'Ava', points: 1250, avatar: PlaceHolderImages.find(p => p.id === 'avatar1')?.imageUrl, fallback: 'A' },
  { rank: 2, name: 'Liam', points: 1180, avatar: PlaceHolderImages.find(p => p.id === 'avatar2')?.imageUrl, fallback: 'L' },
  { rank: 3, name: 'Noah', points: 1150, avatar: PlaceHolderImages.find(p => p.id === 'avatar3')?.imageUrl, fallback: 'N' },
  { rank: 4, name: 'Olivia', points: 1090, avatar: PlaceHolderImages.find(p => p.id === 'avatar4')?.imageUrl, fallback: 'O' },
  { rank: 5, name: 'Emma', points: 1020, avatar: PlaceHolderImages.find(p => p.id === 'avatar5')?.imageUrl, fallback: 'E' },
];

const badges = [
  { name: 'Algebra Ace', icon: Calculator, color: 'bg-blue-500/10 text-blue-500' },
  { name: 'History Buff', icon: Globe, color: 'bg-green-500/10 text-green-500' },
  { name: 'Grammar Guru', icon: Book, color: 'bg-yellow-500/10 text-yellow-500' },
  { name: 'Perfect Streak', icon: Flame, color: 'bg-red-500/10 text-red-500' },
  { name: 'Top Competitor', icon: Trophy, color: 'bg-purple-500/10 text-purple-500' },
  { name: 'Creative Mind', icon: Sparkles, color: 'bg-pink-500/10 text-pink-500' },
];

const challenges = [
    { title: 'Classroom vs. Classroom: The Great Math-Off', description: 'Compete against Mrs. Davis\' class in a real-time algebra challenge.', progress: 75, mode: 'Class vs. Class'},
    { title: 'Student vs. AI: The Spelling Bee Showdown', description: 'Can you out-spell our smartest AI? 5 rounds to prove your skills.', progress: 40, mode: 'Student vs. AI'},
];

export default function GamificationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Gamified Learning Ecosystem"
        description="Foster engagement and friendly competition in your classroom."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Current Challenges</CardTitle>
              <CardDescription>
                Ongoing competitions for your students.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {challenges.map(challenge => (
                    <div key={challenge.title} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{challenge.title}</h4>
                            <Badge variant="outline">{challenge.mode}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
                        <Progress value={challenge.progress} className="h-2" />
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-muted-foreground">Progress</p>
                            <p className="text-xs font-semibold">{challenge.progress}%</p>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <NewChallengeDialog />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Available Badges</CardTitle>
              <CardDescription>
                Recognize student achievements with these unlockable badges.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <div key={badge.name} className="flex flex-col items-center gap-2 p-4 border rounded-lg text-center">
                  <div className={`flex items-center justify-center h-12 w-12 rounded-full ${badge.color}`}>
                    <badge.icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">{badge.name}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Class Leaderboard</CardTitle>
            <CardDescription>Top 5 students this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((student) => (
                  <TableRow key={student.rank}>
                    <TableCell className="font-medium">{student.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{student.fallback}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{student.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
