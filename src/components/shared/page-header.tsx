import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
