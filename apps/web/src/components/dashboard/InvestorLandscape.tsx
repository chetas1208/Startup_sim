'use client';

import { TrendingUp, ArrowRight } from 'lucide-react';
import type { Investor, Competitor } from '@/lib/types';

interface Props { investors: Investor[] | undefined; competitors: Competitor[] | undefined; }

export default function InvestorLandscape({ investors, competitors }: Props) {
    if (!investors) return null;

    const fundingTimeline = competitors
        ?.flatMap((c) => (c.funding_rounds || []).map((r) => ({ company: c.name, ...r })))
        .sort((a, b) => parseInt(b.date) - parseInt(a.date))
        .slice(0, 10);

    const investorOverlap = investors.filter((inv) => inv.companies_in_space.length > 1);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="section-title">Investor Landscape</h2>
                <p className="section-subtitle">Active investors, recent rounds, and funding patterns</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {investors.map((inv) => (
                    <div key={inv.id} className="glass-panel-hover p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="text-sm font-semibold text-sg-text">{inv.name}</h3>
                                <p className="text-xs text-sg-textDim">{inv.aum ? `AUM: ${inv.aum}` : ''}</p>
                            </div>
                            <span className="text-xs text-sg-purple font-mono">
                                {inv.companies_in_space.length} portfolio co{inv.companies_in_space.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <p className="text-xs text-sg-textMuted mb-3">{inv.thesis_fit}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {inv.companies_in_space.map((c, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 rounded bg-sg-purple/10 text-sg-purple border border-sg-purple/20">{c}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {investorOverlap.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-sg-textDim uppercase tracking-wider mb-3">Cross-Portfolio Investors</h3>
                    <div className="glass-panel p-4 space-y-3">
                        {investorOverlap.map((inv) => (
                            <div key={inv.id} className="flex items-center gap-3 text-sm">
                                <span className="text-sg-purple font-medium min-w-[140px]">{inv.name}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-sg-textDim flex-shrink-0" />
                                <div className="flex flex-wrap gap-1.5">
                                    {inv.companies_in_space.map((c, i) => (
                                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-sg-surfaceLight text-sg-textMuted">{c}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {fundingTimeline && fundingTimeline.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-sg-textDim uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Recent Funding Rounds
                    </h3>
                    <div className="glass-panel overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sg-border">
                                    <th className="text-left py-2.5 px-4 text-sg-textDim font-medium">Company</th>
                                    <th className="text-left py-2.5 px-4 text-sg-textDim font-medium">Round</th>
                                    <th className="text-left py-2.5 px-4 text-sg-textDim font-medium">Amount</th>
                                    <th className="text-left py-2.5 px-4 text-sg-textDim font-medium">Year</th>
                                    <th className="text-left py-2.5 px-4 text-sg-textDim font-medium">Investors</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fundingTimeline.map((r, i) => (
                                    <tr key={i} className="border-b border-sg-border/50 last:border-0">
                                        <td className="py-2.5 px-4 text-sg-text font-medium">{r.company}</td>
                                        <td className="py-2.5 px-4 text-sg-textMuted">{r.round}</td>
                                        <td className="py-2.5 px-4 text-sg-green font-medium">{r.amount}</td>
                                        <td className="py-2.5 px-4 text-sg-textDim">{r.date}</td>
                                        <td className="py-2.5 px-4 text-sg-purple text-xs">{r.investors?.join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
