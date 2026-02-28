import { Lightbulb } from 'lucide-react';

const SIZE_CONFIG = {
  high: { label: 'High', color: 'text-sg-green bg-sg-green/10 border-sg-green/20' },
  medium: { label: 'Medium', color: 'text-sg-yellow bg-sg-yellow/10 border-sg-yellow/20' },
  low: { label: 'Low', color: 'text-sg-textDim bg-sg-surfaceLight border-sg-border' },
};

export default function WhiteSpace({ gaps }) {
  if (!gaps?.length) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">White Space & Opportunities</h2>
        <p className="section-subtitle">Identified gaps and underserved segments in the market</p>
      </div>

      <div className="space-y-4">
        {gaps.map((gap, i) => {
          const sizeConfig = SIZE_CONFIG[gap.opportunity_size] || SIZE_CONFIG.medium;
          return (
            <div key={gap.id || i} className="glass-panel p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-sg-yellow/10 border border-sg-yellow/20
                                  flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-sg-yellow" />
                  </div>
                  <h3 className="text-sm font-semibold text-sg-text leading-snug">{gap.gap}</h3>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${sizeConfig.color}`}>
                  {sizeConfig.label} opportunity
                </span>
              </div>
              <p className="text-sm text-sg-textMuted leading-relaxed ml-11">{gap.evidence}</p>
              {gap.competitors_missing?.length > 0 && (
                <div className="mt-3 ml-11 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-sg-textDim">Missing from:</span>
                  {gap.competitors_missing.map((c, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded bg-sg-surfaceLight text-sg-textMuted border border-sg-border">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
