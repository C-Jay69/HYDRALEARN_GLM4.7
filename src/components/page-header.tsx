import { cn } from '@/lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function PageHeader({
  title,
  description,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8', className)}>
      <div className="grid gap-1">
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
