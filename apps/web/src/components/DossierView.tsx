'use client'

import { useState } from 'react'
import { VentureDossier, getPdfUrl, GraphData } from '@/lib/api'
import VentureGraph from './VentureGraph'
import {
  FileText,
  Search,
  Target,
  BarChart4,
  Download,
  ExternalLink,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Zap
} from 'lucide-react'

interface DossierViewProps {
  dossier: VentureDossier
  graphData?: GraphData
}

type TabType = 'overview' | 'market' | 'competition' | 'strategy'

export default function DossierView({ dossier, graphData }: DossierViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  if (!dossier) return null

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Lightbulb },
    { id: 'market', label: 'Market Research', icon: Search },
    { id: 'competition', label: 'Competition', icon: Target },
    { id: 'strategy', label: 'Strategy', icon: BarChart4 },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tabs Navigation */}
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl max-w-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === tab.id
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Section title="Venture Concept & Clarification" icon={Lightbulb}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InfoBlock label="Core Problem" value={dossier.clarification?.core_problem} />
                <InfoBlock label="Proposed Solution" value={dossier.clarification?.proposed_solution} />
                <InfoBlock label="Target Customer" value={dossier.clarification?.target_customer} />
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Strategic Assumptions</h4>
                <ul className="space-y-3">
                  {dossier.clarification?.key_assumptions.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {graphData && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-zinc-100">Market Relationship Visualization</h3>
              <VentureGraph data={graphData} />
            </div>
          )}
        </div>
      )}

      {/* Market Research Tab */}
      {activeTab === 'market' && dossier.market_research && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Market Intelligence</h2>
            <DownloadButton runId={dossier.run_id} type="market" />
          </div>

          <Section title="Synthesis" icon={Search}>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg italic">
              "{dossier.market_research.summary}"
            </p>
          </Section>

          <Section title="Market Gaps Identified" icon={Target}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dossier.market_research.market_gaps.map((gap, i) => (
                <div key={i} className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl text-indigo-900 dark:text-indigo-300 text-sm font-medium">
                  {gap}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Data Sources & Citations" icon={FileText}>
            <div className="space-y-3">
              {dossier.market_research.citations.map((cit, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <a href={cit.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 transition-colors">
                      {cit.title || 'Source'}
                    </a>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{cit.url}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Competitive Analysis Tab */}
      {activeTab === 'competition' && dossier.competitive_analysis && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Competitive Positioning</h2>
            <DownloadButton runId={dossier.run_id} type="competition" />
          </div>

          <Section title="Overlap Assessment" icon={Target}>
            <p className="text-zinc-600 dark:text-zinc-400">{dossier.competitive_analysis.overlap_assessment}</p>
          </Section>

          <Section title="Competitor Comparison" icon={BarChart4}>
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Competitor</th>
                    <th className="px-6 py-4">Strategic Focus</th>
                    <th className="px-6 py-4">Key Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {dossier.competitive_analysis.competitor_comparison.map((comp: any, i: number) => (
                    <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100">{comp.competitor || comp.name}</td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{comp.focus || 'N/A'}</td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{comp.advantage || 'Multi-feature'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* Strategy Tab */}
      {activeTab === 'strategy' && dossier.strategy && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Winning Strategy</h2>
            <DownloadButton runId={dossier.run_id} type="strategy" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Section title="Ideal Customer Profile (ICP)" icon={Target}>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{dossier.strategy.icp}</p>
              </Section>
              <Section title="Differentiation Angle" icon={Zap}>
                <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/20">
                  <p className="text-xl font-bold italic leading-relaxed">
                    "{dossier.strategy.differentiation_angle}"
                  </p>
                </div>
              </Section>
            </div>

            <div className="space-y-6">
              <Section title="Positioning Statement" icon={BarChart4}>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">"{dossier.strategy.positioning_statement}"</p>
              </Section>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Strategic Focus</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{dossier.strategy.strategic_focus}</p>
                <ArrowRight className="w-5 h-5 mt-4 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">{label}</h4>
      <p className="text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">{value || 'Pending...'}</p>
    </div>
  )
}

function DownloadButton({ runId, type }: { runId: string; type: any }) {
  return (
    <a
      href={getPdfUrl(runId, type)}
      download
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
    >
      <Download className="w-4 h-4" />
      PDF Report
    </a>
  )
}
