'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import CitationsList from '@/components/CitationsList';
import ArtifactsBar from '@/components/ArtifactsBar';
import { SectionCard } from '@/components/ui-primitives';

const TABS = [
  { key: 'summary', label: 'Summary' },
  { key: 'market', label: 'Market' },
  { key: 'compete', label: 'Competition' },
  { key: 'interview', label: 'VC Interview' },
  { key: 'funding', label: 'Funding' },
  { key: 'scorecard', label: 'Scorecard' },
] as const;

type TabKey = typeof TABS[number]['key'];

interface Props {
  show: boolean;
  dossier?: any;
}

export default function ResultsPanel({ show, dossier }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollTo = useCallback((key: string) => {
    setActiveTab(key as TabKey);
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!show || !dossier) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-12 flex flex-col items-center justify-center text-center">
        <svg className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">No results yet</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Enter a startup idea and run the analysis</p>
      </div>
    );
  }

  const cl = dossier.clarification;
  const mr = dossier.market_research;
  const ca = dossier.competitive_analysis;
  const st = dossier.strategy;
  const vi = dossier.vc_interview;
  const fs = dossier.funding_strategy;
  const sc = dossier.scorecard;

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="sticky top-14 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md -mx-1 px-1 py-2 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => scrollTo(t.key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                activeTab === t.key
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ArtifactsBar />

      {/* SUMMARY */}
      {cl && (
        <section ref={el => { sectionRefs.current.summary = el; }} className="animate-fadeIn">
          <SectionCard>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Summary</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Idea</span>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">{cl.idea_title || 'Untitled'}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Target</span>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{cl.target_customer}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Problem</span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">{cl.core_problem}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Solution</span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">{cl.proposed_solution}</p>
              </div>
              {cl.key_assumptions?.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Key Assumptions</span>
                  <ul className="mt-2 space-y-1">
                    {cl.key_assumptions.map((a: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-2">
                        <span className="text-zinc-400">&bull;</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionCard>
        </section>
      )}

      {/* MARKET */}
      {mr && (
        <section ref={el => { sectionRefs.current.market = el; }} className="animate-fadeIn space-y-4">
          <SectionCard>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Market Analysis</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">{mr.summary}</p>

            {mr.segments?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mr.segments.map((s: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">{s}</span>
                ))}
              </div>
            )}

            {mr.competitors?.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-zinc-500">Company</th>
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-zinc-500">Segment</th>
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-zinc-500">Pricing</th>
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-zinc-500">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mr.competitors.map((c: any, i: number) => (
                      <tr key={i} className={cn('border-b border-zinc-100 dark:border-zinc-800 last:border-0', i % 2 === 1 && 'bg-zinc-50/50 dark:bg-zinc-800/20')}>
                        <td className="py-2.5 px-3 font-medium text-zinc-900 dark:text-zinc-100">{c.name}</td>
                        <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">{c.segment || '-'}</td>
                        <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400 font-mono text-xs">{c.pricing || 'unknown'}</td>
                        <td className="py-2.5 px-3 text-zinc-500 dark:text-zinc-400 max-w-[200px] truncate">{c.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {mr.market_gaps?.length > 0 && (
              <div className="mt-4">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Market Gaps</span>
                <ul className="mt-2 space-y-1.5">
                  {mr.market_gaps.map((g: string, i: number) => (
                    <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300 flex gap-2 items-start">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">&#9670;</span> {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </SectionCard>

          {mr.citations?.length > 0 && (
            <SectionCard>
              <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">Sources</h4>
              <CitationsList citations={mr.citations} />
            </SectionCard>
          )}
        </section>
      )}

      {/* COMPETITIVE ANALYSIS */}
      {ca && (
        <section ref={el => { sectionRefs.current.compete = el; }} className="animate-fadeIn">
          <SectionCard>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Competitive Intelligence</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">{ca.competitive_summary}</p>

            {ca.overlap_assessment && (
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 mb-4">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Overlap Analysis</span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">{ca.overlap_assessment}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ca.differentiation_opportunities?.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-emerald-500 uppercase tracking-wider">Differentiation</span>
                  <ul className="mt-2 space-y-1.5">
                    {ca.differentiation_opportunities.map((d: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-2"><span className="text-emerald-500">+</span> {d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {ca.top_threats?.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-red-500 uppercase tracking-wider">Threats</span>
                  <ul className="mt-2 space-y-1.5">
                    {ca.top_threats.map((t: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-2"><span className="text-red-500">!</span> {t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionCard>
        </section>
      )}

      {/* STRATEGY */}
      {st && (
        <section className="animate-fadeIn">
          <SectionCard>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Strategy & Positioning</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">ICP</span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{st.icp}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Positioning</span>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">{st.positioning_statement}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Differentiation Angle</span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{st.differentiation_angle}</p>
              </div>
              {st.risks?.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-red-500 uppercase tracking-wider">Key Risks</span>
                  <ul className="mt-2 space-y-1">
                    {st.risks.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-2"><span className="text-red-500">!</span> {r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionCard>
        </section>
      )}

      {/* VC INTERVIEW */}
      {vi && (
        <section ref={el => { sectionRefs.current.interview = el; }} className="animate-fadeIn">
          <SectionCard>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">VC Interview Simulation</h3>
            <p className="text-xs text-zinc-400 mb-4">Simulated investor Q&A</p>
            <div className="space-y-4">
              {vi.questions?.map((q: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{q.question}</p>
                    <span className={cn(
                      'flex-shrink-0 text-xs font-mono px-2 py-0.5 rounded-full',
                      q.strength_score >= 8 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : q.strength_score >= 6 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
                    )}>{q.strength_score}/10</span>
                  </div>
                  {q.why_it_matters && <p className="text-xs text-zinc-400 italic">{q.why_it_matters}</p>}
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{q.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            {vi.vc_feedback && (
              <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">VC Feedback</span>
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    vi.investment_risk_level === 'Low' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                      : vi.investment_risk_level === 'Medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
                  )}>
                    {vi.investment_risk_level} Risk
                  </span>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{vi.vc_feedback}</p>
              </div>
            )}
          </SectionCard>
        </section>
      )}

      {/* FUNDING STRATEGY */}
      {fs && (
        <section ref={el => { sectionRefs.current.funding = el; }} className="animate-fadeIn">
          <SectionCard>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Funding Strategy</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Recommended</span>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fs.recommended_funding_type}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Capital Needed</span>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fs.estimated_capital_needed}</p>
              </div>
            </div>
            {fs.why && (
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 mb-4">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Rationale</span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">{fs.why}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fs.use_of_funds?.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Use of Funds</span>
                  <ul className="mt-2 space-y-1.5">
                    {fs.use_of_funds.map((u: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400">{u}</li>
                    ))}
                  </ul>
                </div>
              )}
              {fs.milestones_for_next_round?.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Milestones for Next Round</span>
                  <ul className="mt-2 space-y-1.5">
                    {fs.milestones_for_next_round.map((m: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-2">
                        <span className="text-zinc-400 tabular-nums font-mono text-xs mt-0.5">{i + 1}.</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionCard>
        </section>
      )}

      {/* SCORECARD */}
      {sc && (
        <section ref={el => { sectionRefs.current.scorecard = el; }} className="animate-fadeIn">
          <SectionCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Scorecard</h3>
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{sc.overall_score}<span className="text-sm text-zinc-400 font-normal">/10</span></span>
            </div>
            {sc.dimensions?.length > 0 && (
              <div className="space-y-3 mb-4">
                {sc.dimensions.map((d: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 w-28 flex-shrink-0">{d.label}</span>
                    <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          d.score >= 8 ? 'bg-emerald-500' : d.score >= 6 ? 'bg-amber-500' : 'bg-red-500',
                        )}
                        style={{ width: `${(d.score / (d.max || 10)) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-zinc-500 tabular-nums w-8 text-right">{d.score}/{d.max || 10}</span>
                  </div>
                ))}
              </div>
            )}
            {sc.recommendation && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900">
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Recommendation</span>
                <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed font-medium">{sc.recommendation}</p>
              </div>
            )}
          </SectionCard>
        </section>
      )}
    </div>
  );
}
