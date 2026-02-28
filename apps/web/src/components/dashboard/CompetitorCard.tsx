'use client';

import { Building2, Users, Calendar, DollarSign } from 'lucide-react';
import { CLASSIFICATION_CONFIG } from '@/lib/helpers';
import type { Competitor } from '@/lib/types';

interface Props {
    competitor: Competitor;
    onClick: (c: Competitor) => void;
}

export default function CompetitorCard({ competitor, onClick }: Props) {
    const classification = CLASSIFICATION_CONFIG[competitor.classification] || CLASSIFICATION_CONFIG.indirect_competitor;

    return (
        <button
            onClick={() => onClick(competitor)}
            className="glass-panel-hover p-5 text-left w-full group"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sg-accent/10 border border-sg-accent/20
                          flex items-center justify-center text-sg-accent font-bold text-sm">
                        {competitor.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-sg-text group-hover:text-sg-accent transition-colors">
                            {competitor.name}
                        </h3>
                        <p className="text-xs text-sg-textDim">{competitor.website}</p>
                    </div>
                </div>
                <span className={classification.className}>{classification.label}</span>
            </div>

            <p className="text-sm text-sg-textMuted mb-4 line-clamp-2 leading-relaxed">
                {competitor.description}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-sg-textDim">
                    <DollarSign className="w-3.5 h-3.5 text-sg-green" />
                    <span className="text-sg-text font-medium">{competitor.funding_total}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sg-textDim">
                    <Users className="w-3.5 h-3.5 text-sg-purple" />
                    <span className="text-sg-text font-medium">{competitor.employees}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sg-textDim">
                    <Calendar className="w-3.5 h-3.5 text-sg-orange" />
                    <span className="text-sg-text font-medium">{competitor.founded}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sg-textDim">
                    <Building2 className="w-3.5 h-3.5 text-sg-teal" />
                    <span className="text-sg-text font-medium">{competitor.hq?.split(',')[0]}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {competitor.features?.slice(0, 3).map((feature, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-sg-surfaceLight text-sg-textMuted border border-sg-border">
                        {feature}
                    </span>
                ))}
                {competitor.features?.length > 3 && (
                    <span className="text-xs px-2 py-0.5 text-sg-textDim">+{competitor.features.length - 3}</span>
                )}
            </div>
        </button>
    );
}
