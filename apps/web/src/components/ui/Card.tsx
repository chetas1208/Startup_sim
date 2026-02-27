import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl p-6 bg-card border border-border shadow-sm dark:shadow-none',
                className
            )}
            {...props}
        />
    );
}
