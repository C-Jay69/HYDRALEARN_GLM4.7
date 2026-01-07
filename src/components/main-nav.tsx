'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BookOpen,
  CalendarDays,
  Dna,
  Gamepad2,
  GraduationCap,
  Home,
  LifeBuoy,
  Rocket,
  Sparkles,
  Users,
  Wand2,
  Brush,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/lesson-planner', label: 'Lesson Planner', icon: BookOpen },
  { href: '/assessment-generator', label: 'Assessment Gen', icon: Sparkles },
  { href: '/studio', label: 'Studio', icon: Brush },
  { href: '/differentiated-activities', label: 'Differentiated Activities', icon: Dna },
  { href: '/essay-grader', label: 'Essay Grader', icon: GraduationCap },
  { href: '/batch-essay-grader', label: 'Batch Essay Grader', icon: Users },
  { href: '/personalization', label: 'AI Personalization', icon: Wand2 },
  { href: '/gamification', label: 'Gamification', icon: Gamepad2 },
  { href: '/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/user-guide', label: 'User Guide', icon: LifeBuoy },
  { href: '/deployment-guide', label: 'Deployment Guide', icon: Rocket },
];

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <SidebarMenu className={cn(className)}>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <Link href={link.href}>
            <SidebarMenuButton
              isActive={pathname === link.href}
              tooltip={link.label}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
