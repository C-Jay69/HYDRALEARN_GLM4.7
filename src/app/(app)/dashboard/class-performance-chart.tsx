'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { subject: 'Algebra', performance: 82 },
  { subject: 'Fractions', performance: 45 },
  { subject: 'Geometry', performance: 76 },
  { subject: 'Spelling', performance: 91 },
  { subject: 'Reading', performance: 88 },
  { subject: 'Writing', performance: 72 },
];

export function ClassPerformanceChart() {
  return (
    <ChartContainer
      config={{
        performance: {
          label: 'Performance',
          color: 'hsl(var(--primary))',
        },
      }}
      className="min-h-[250px] w-full"
    >
      <BarChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="subject"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          domain={[0, 100]}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar
          dataKey="performance"
          fill="var(--color-performance)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}
