'use client';

import { useState } from 'react';
import { Send, RotateCcw, Lightbulb } from 'lucide-react';
import { EXAMPLE_IDEAS } from '@/lib/mock-data';

interface Props {
    onRun: (idea: string) => void;
    isRunning: boolean;
}

export default function IdeaInputCard({ onRun, isRunning }: Props) {
    const [idea, setIdea] = useState('');
    const maxLen = 500;

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Describe your startup idea</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">We&apos;ll research the market, analyze competitors, and simulate a VC interview.</p>
            </div>

            {/* Textarea */}
            <div className="relative">
                <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value.slice(0, maxLen))}
                    placeholder="e.g., An AI-powered voice tutor for kids aged 6 to 12…"
                    rows={4}
                    disabled={isRunning}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50
                     text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500
                     resize-none outline-none leading-relaxed
                     focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
                <span className="absolute bottom-2.5 right-3 text-[11px] text-zinc-400 tabular-nums">{idea.length}/{maxLen}</span>
            </div>

            {/* Example Chips */}
            <div>
                <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Try an example</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {EXAMPLE_IDEAS.map((ex, i) => (
                        <button
                            key={i}
                            onClick={() => setIdea(ex)}
                            disabled={isRunning}
                            className="text-xs px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700
                         text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800
                         hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {ex}
                        </button>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => onRun(idea)}
                    disabled={!idea.trim() || isRunning}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                     bg-zinc-900 dark:bg-white text-white dark:text-zinc-900
                     text-sm font-medium
                     hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Send className="w-4 h-4" />
                    {isRunning ? 'Running…' : 'Run Analysis'}
                </button>
                <button
                    onClick={() => setIdea('')}
                    disabled={isRunning || !idea}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700
                     text-sm text-zinc-600 dark:text-zinc-400 font-medium
                     hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Reset input"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
