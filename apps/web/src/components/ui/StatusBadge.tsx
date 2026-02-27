import * as React from 'react';
import { cn } from './Card';

export type StatusType = 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: StatusType;
    label: React.ReactNode;
}

const statusStyles: Record<StatusType, string> = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    neutral: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    accent: 'bg-accent-soft text-accent dark:text-indigo-300',
};

export function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold',
                statusStyles[status],
                className
            )}
            {...props}
        >
            {label}
        </span>
    );
}
