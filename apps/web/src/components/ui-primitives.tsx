'use client';

import { cn } from '@/lib/utils';
import type { StepStatus } from '@/lib/mock-data';

const STATUS_MAP: Record<StepStatus, { label: string; classes: string }> = {
    queued: { label: 'Queued', classes: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400' },
    running: { label: 'Running', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 animate-pulse' },
    done: { label: 'Done', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' },
    error: { label: 'Error', classes: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400' },
};

export function StatusBadge({ status }: { status: StepStatus }) {
    const { label, classes } = STATUS_MAP[status];
    return (
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium', classes)}>
            {label}
        </span>
    );
}

export function MonoBlock({ children, title }: { children: React.ReactNode; title?: string }) {
    return (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {title && (
                <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{title}</span>
                </div>
            )}
            <pre className="p-4 text-sm font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto leading-relaxed bg-zinc-50/50 dark:bg-zinc-900/50">
                {children}
            </pre>
        </div>
    );
}

export function Skeleton({ className }: { className?: string }) {
    return <div className={cn('skeleton rounded-lg h-4', className)} />;
}

export function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5', className)}>
            {children}
        </div>
    );
}
