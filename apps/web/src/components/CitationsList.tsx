'use client';

import { Copy, ExternalLink, Link2 } from 'lucide-react';
import type { Citation } from '@/lib/mock-data';

interface Props { citations: Citation[]; }

export default function CitationsList({ citations }: Props) {
    const copy = (url: string) => {
        navigator.clipboard.writeText(url);
    };

    return (
        <div className="space-y-2">
            {citations.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                        <Link2 className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{c.title}</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono truncate">{c.domain}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button onClick={() => copy(c.url)} className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" aria-label="Copy link">
                                    <Copy className="w-3 h-3" />
                                </button>
                                <a href={c.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" aria-label="Open link">
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed line-clamp-2">{c.snippet}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
