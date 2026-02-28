'use client';

import { MessageSquare, ExternalLink } from 'lucide-react';
import type { DemandSignal } from '@/lib/types';

const SOURCE_COLORS: Record<string, string> = {
    Reddit: 'text-sg-orange border-sg-orange/20 bg-sg-orange/10',
    'Twitter/X': 'text-sg-accent border-sg-accent/20 bg-sg-accent/10',
    'Hacker News': 'text-sg-yellow border-sg-yellow/20 bg-sg-yellow/10',
    'Product Hunt': 'text-sg-red border-sg-red/20 bg-sg-red/10',
};

const SENTIMENT_CONFIG: Record<string, { label: string; color: string }> = {
    positive: { label: 'Positive', color: 'text-sg-green' },
    negative: { label: 'Negative', color: 'text-sg-red' },
    neutral: { label: 'Neutral', color: 'text-sg-textDim' },
};

interface Props { signals: DemandSignal[] | undefined; }

export default function DemandSignals({ signals }: Props) {
    if (!signals?.length) return null;

    const themes = [...new Set(signals.map((s) => s.theme))];
    const sentimentCounts = signals.reduce<Record<string, number>>((acc, s) => {
        acc[s.sentiment] = (acc[s.sentiment] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div>
                <h2 className="section-title">Demand Signals</h2>
                <p className="section-subtitle">Real conversations from potential users across the web</p>
            </div>

            <div className="flex gap-4">
                {Object.entries(sentimentCounts).map(([sentiment, count]) => {
                    const config = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral;
                    return (
                        <div key={sentiment} className="glass-panel px-4 py-2 flex items-center gap-2">
                            <span className={`text-lg font-bold ${config.color}`}>{count}</span>
                            <span className="text-xs text-sg-textDim">{config.label}</span>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap gap-2">
                {themes.map((theme) => (
                    <span key={theme} className="text-xs px-2.5 py-1 rounded-full bg-sg-surfaceLight border border-sg-border text-sg-textMuted">{theme}</span>
                ))}
            </div>

            <div className="space-y-3">
                {signals.map((signal) => {
                    const sourceColor = SOURCE_COLORS[signal.source] || SOURCE_COLORS.Reddit;
                    return (
                        <div key={signal.id} className="glass-panel p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded border ${sourceColor}`}>{signal.source}</span>
                                    {signal.subreddit && <span className="text-xs text-sg-textDim font-mono">{signal.subreddit}</span>}
                                    <span className="text-xs text-sg-textDim">{signal.date}</span>
                                </div>
                                <a href={signal.url} target="_blank" rel="noopener noreferrer"
                                    className="text-sg-textDim hover:text-sg-accent transition-colors flex-shrink-0">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                            <div className="flex gap-3">
                                <MessageSquare className="w-4 h-4 text-sg-textDim flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-sg-textMuted leading-relaxed italic">&ldquo;{signal.text}&rdquo;</p>
                            </div>
                            <div className="mt-2 ml-7">
                                <span className="text-xs px-2 py-0.5 rounded bg-sg-surfaceLight text-sg-textDim border border-sg-border">{signal.theme}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
