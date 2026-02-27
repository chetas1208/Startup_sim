import * as React from 'react';
import { cn } from './Card';
import { ExternalLink } from 'lucide-react';

export interface CitationCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    source: string;
    url?: string;
    snippet?: string;
}

export function CitationCard({ title, source, url, snippet, className, ...props }: CitationCardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl p-4 bg-card border border-border border-l-4 border-l-accent shadow-sm dark:shadow-none transition-all',
                className
            )}
            {...props}
        >
            <h4 className="text-sm font-semibold text-text-primary mb-1 line-clamp-1">{title}</h4>
            <p className="text-xs text-text-secondary mb-2">{source}</p>

            {snippet && (
                <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                    "{snippet}"
                </p>
            )}

            {url && (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                >
                    View Source
                    <ExternalLink className="w-3 h-3 ml-1" />
                </a>
            )}
        </div>
    );
}
