import * as React from 'react';
import { cn } from './Card';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: React.ReactNode;
    description?: React.ReactNode;
}

export function SectionHeader({ title, description, className, ...props }: SectionHeaderProps) {
    return (
        <div className={cn('flex flex-col space-y-1.5 mb-6', className)} {...props}>
            <h2 className="text-xl font-semibold leading-none tracking-tight text-text-primary">
                {title}
            </h2>
            {description && (
                <p className="text-sm text-text-secondary">
                    {description}
                </p>
            )}
        </div>
    );
}
