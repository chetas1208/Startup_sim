import * as React from 'react';
import { cn } from './Card';
import { Check } from 'lucide-react';

export interface StepIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
    steps: string[];
    currentStep: number;
}

export function StepIndicator({ steps, currentStep, className, ...props }: StepIndicatorProps) {
    return (
        <div className={cn('flex items-center w-full', className)} {...props}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;

                return (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center relative">
                            <div
                                className={cn(
                                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold z-10',
                                    {
                                        'bg-success text-white': isCompleted,
                                        'bg-accent text-white': isActive,
                                        'bg-muted text-text-secondary': !isCompleted && !isActive,
                                    }
                                )}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                            </div>
                            <span
                                className={cn(
                                    "absolute top-10 text-xs font-medium whitespace-nowrap",
                                    isActive ? "text-text-primary" : "text-text-secondary"
                                )}
                            >
                                {step}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    'flex-1 h-1 mx-2 rounded-full',
                                    isCompleted ? 'bg-success' : 'bg-muted'
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
