'use client';

import { TrendingUp, DollarSign } from 'lucide-react';
import type { MarketSizingData } from '@/lib/types';

interface Props { data: MarketSizingData | undefined; }

export default function MarketSizing({ data }: Props) {
    if (!data) return null;

    const details = [
        { label: 'TAM', value: data.tam, desc: data.tam_description },
        { label: 'SAM', value: data.sam, desc: data.sam_description },
        { label: 'SOM', value: data.som, desc: data.som_description },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="section-title">Market Sizing</h2>
                <p className="section-subtitle">Total addressable, serviceable, and obtainable market</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex items-center justify-center py-8">
                    <div className="relative" style={{ width: 288, height: 288 }}>
                        <div className="absolute inset-0 rounded-full border-2 border-sg-accent/30 bg-sg-accent/5" />
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                            <span className="text-[10px] font-mono text-sg-textDim uppercase tracking-wider">TAM</span>
                            <span className="block text-base font-bold text-sg-text">{data.tam}</span>
                        </div>
                        <div className="absolute rounded-full border-2 border-sg-accent/50 bg-sg-accent/10" style={{ inset: 52 }} />
                        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none" style={{ top: 64 }}>
                            <span className="text-[10px] font-mono text-sg-textDim uppercase tracking-wider">SAM</span>
                            <span className="block text-sm font-bold text-sg-text">{data.sam}</span>
                        </div>
                        <div className="absolute rounded-full border-2 border-sg-accent bg-sg-accent/20 flex flex-col items-center justify-center" style={{ inset: 100 }}>
                            <span className="text-[10px] font-mono text-sg-textDim uppercase tracking-wider">SOM</span>
                            <span className="block text-sm font-bold text-sg-text">{data.som}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {details.map(({ label, value, desc }) => (
                        <div key={label} className="glass-panel p-4">
                            <div className="flex items-baseline justify-between mb-1">
                                <span className="text-xs font-mono text-sg-textDim uppercase tracking-wider">{label}</span>
                                <span className="text-lg font-bold text-sg-text">{value}</span>
                            </div>
                            <p className="text-sm text-sg-textMuted">{desc}</p>
                        </div>
                    ))}
                    <div className="glass-panel p-4 border-sg-green/20 bg-sg-green/5">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-sg-green" />
                            <span className="text-sm font-medium text-sg-green">Growth Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-sg-text">{data.growth_rate}</p>
                        <p className="text-xs text-sg-textDim mt-1">{data.growth_period}</p>
                    </div>
                </div>
            </div>

            {data.key_stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {data.key_stats.map((stat, i) => (
                        <div key={i} className="glass-panel p-4 text-center">
                            <p className="text-lg font-bold text-sg-text">{stat.value}</p>
                            <p className="text-xs text-sg-textDim mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div>
                <h3 className="text-sm font-medium text-sg-textDim uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Pricing Benchmarks
                </h3>
                <div className="glass-panel overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-sg-border">
                                <th className="text-left py-2.5 px-4 text-sg-textDim font-medium">Competitor</th>
                                <th className="text-left py-2.5 px-4 text-sg-textDim font-medium">Price</th>
                                <th className="text-left py-2.5 px-4 text-sg-textDim font-medium">Model</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.pricing_benchmarks?.map((item, i) => (
                                <tr key={i} className="border-b border-sg-border/50 last:border-0">
                                    <td className="py-2.5 px-4 text-sg-text">{item.competitor}</td>
                                    <td className="py-2.5 px-4 text-sg-green font-medium">{item.price}</td>
                                    <td className="py-2.5 px-4 text-sg-textMuted">{item.model}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
