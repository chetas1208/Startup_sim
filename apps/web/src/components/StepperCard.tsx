'use client';

import { Check, Loader2, AlertCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge, Skeleton } from '@/components/ui-primitives';
import type { PipelineStep } from '@/lib/mock-data';

interface Props {
    steps: PipelineStep[];
}

const STATUS_ICON = {
    queued: <Circle className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />,
    running: <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />,
    done: <Check className="w-4 h-4 text-emerald-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
};

export default function StepperCard({ steps }: Props) {
    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Pipeline Progress</h2>
            <div className="space-y-1">
                {steps.map((step, i) => {
                    const isActive = step.status === 'running';
                    return (
                        <div key={step.id}>
                            <div className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-xl transition-colors',
                                isActive && 'bg-amber-50/50 dark:bg-amber-950/20',
                                step.status === 'done' && 'opacity-70',
                            )}>
                                <div className="flex-shrink-0">{STATUS_ICON[step.status]}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={cn(
                                            'text-sm font-medium',
                                            isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400',
                                        )}>
                                            {step.label}
                                        </span>
                                        <StatusBadge status={step.status} />
                                    </div>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">{step.description}</p>
                                </div>
                            </div>
                            {/* Shimmer for running step */}
                            {isActive && (
                                <div className="ml-10 mt-1.5 mb-2 space-y-1.5">
                                    <Skeleton className="h-3 w-4/5" />
                                    <Skeleton className="h-3 w-3/5" />
                                </div>
                            )}
                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="ml-[22px] h-3 border-l border-zinc-200 dark:border-zinc-800" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
