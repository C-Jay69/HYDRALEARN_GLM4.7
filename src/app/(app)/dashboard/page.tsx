import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Users,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { PageHeader } from '@/components/page-header';
import { ClassPerformanceChart } from './class-performance-chart';

const studentsNeedingHelp = [
  {
    name: 'Johnny Appleseed',
    subject: 'Fractions',
    issue: 'Struggling with division',
    avatar: 'https://picsum.photos/seed/johnny/40/40',
    initials: 'JA',
  },
  {
    name: 'Maria Rodriguez',
    nameHint: 'person',
    subject: 'Writing',
    issue: 'Essay structure weak',
    avatar: 'https://picsum.photos/seed/maria/40/40',
    initials: 'MR',
  },
  {
    name: 'Ahmed Khan',
    nameHint: 'person',
    subject: 'Geometry',
    issue: 'Difficulty with proofs',
    avatar: 'https://picsum.photos/seed/ahmed/40/40',
    initials: 'AK',
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Welcome, Teacher!"
        description="Here's a snapshot of your classroom's progress."
      />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Students on Track
            </CardTitle>
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 / 22</div>
            <p className="text-xs text-muted-foreground">
              +1 since yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Needs Attention
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              2 new micro-plans suggested
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Planned</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">for this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+92%</div>
            <p className="text-xs text-muted-foreground">
              Above average this month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>
              Average scores across key subjects this semester.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClassPerformanceChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Students Needing Help</CardTitle>
              <CardDescription>
                AI-suggested micro-plans are available for these students.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1" variant="outline">
              <Link href="/schedule">
                View Schedule
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-8">
            {studentsNeedingHelp.map((student) => (
              <div className="flex items-center gap-4" key={student.name}>
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src={student.avatar} alt={student.name} data-ai-hint={student.nameHint || 'person portrait'}/>
                  <AvatarFallback>{student.initials}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {student.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {student.subject}: {student.issue}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  View Plan
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
