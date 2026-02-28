'use client';

import { CheckCircle, XCircle, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';
import type { StrategicSummaryData } from '@/lib/types';

interface Props { summary: StrategicSummaryData | undefined; }

export default function StrategicSummary({ summary }: Props) {
    if (!summary) return null;

    const attractiveConfig: Record<string, { icon: any; label: string; color: string; bg: string }> = {
        true: { icon: CheckCircle, label: 'Yes — Attractive Market', color: 'text-sg-green', bg: 'bg-sg-green/10 border-sg-green/20' },
        false: { icon: XCircle, label: 'No — Unattractive Market', color: 'text-sg-red', bg: 'bg-sg-red/10 border-sg-red/20' },
        maybe: { icon: HelpCircle, label: 'Maybe — Proceed with Caution', color: 'text-sg-yellow', bg: 'bg-sg-yellow/10 border-sg-yellow/20' },
    };

    const verdict = attractiveConfig[String(summary.attractive)] || attractiveConfig.maybe;
    const VerdictIcon = verdict.icon;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="section-title">Strategic Summary</h2>
                <p className="section-subtitle">Key takeaways and recommended actions</p>
            </div>

            <div className={`glass-panel p-6 border ${verdict.bg}`}>
                <div className="flex items-center gap-3 mb-3">
                    <VerdictIcon className={`w-6 h-6 ${verdict.color}`} />
                    <h3 className={`text-lg font-semibold ${verdict.color}`}>Is this market attractive?</h3>
                </div>
                <p className={`text-xl font-bold ${verdict.color} mb-2`}>{verdict.label}</p>
                <p className="text-sm text-sg-textMuted leading-relaxed">{summary.reasoning}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-5">
                    <h3 className="text-sm font-medium text-sg-textDim uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-sg-accent" /> What Must Be True to Win
                    </h3>
                    <ul className="space-y-2.5">
                        {summary.must_be_true?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-sg-textMuted">
                                <span className="text-sg-accent font-mono text-xs mt-0.5">{i + 1}.</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glass-panel p-5">
                    <h3 className="text-sm font-medium text-sg-textDim uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-sg-red" /> Biggest Risks
                    </h3>
                    <ul className="space-y-2.5">
                        {summary.risks?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-sg-textMuted">
                                <span className="text-sg-red mt-1.5 flex-shrink-0">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="glass-panel p-5 border-sg-accent/20 bg-sg-accent/5">
                <h3 className="text-sm font-medium text-sg-textDim uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-sg-accent" /> Recommended Next Steps
                </h3>
                <ul className="space-y-3">
                    {summary.next_steps?.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sg-accent/20 text-sg-accent flex items-center justify-center text-xs font-bold">{i + 1}</span>
                            <span className="text-sg-text mt-0.5">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
