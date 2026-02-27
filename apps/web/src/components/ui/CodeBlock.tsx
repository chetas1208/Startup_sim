import * as React from 'react';
import { cn } from './Card';

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
    code: string;
    language?: string;
}

export function CodeBlock({ code, language, className, ...props }: CodeBlockProps) {
    return (
        <div className="relative group rounded-lg overflow-hidden border border-[#3f3f46]">
            {language && (
                <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium text-[#a1a1aa] bg-[#27272a] rounded-bl-lg">
                    {language}
                </div>
            )}
            <pre
                className={cn(
                    'p-4 overflow-x-auto text-sm font-mono bg-[#18181b] text-[#fafafa]',
                    className
                )}
                {...props}
            >
                <code>{code}</code>
            </pre>
        </div>
    );
}
