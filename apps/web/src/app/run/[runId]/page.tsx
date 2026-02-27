'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getRun, streamEvents, getGraph, VentureDossier, GraphData } from '@/lib/api'
import ProgressTracker from '@/components/ProgressTracker'
import DossierView from '@/components/DossierView'
import { Loader2, ArrowLeft, RotateCcw, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/Toast'

export default function RunPage() {
  const params = useParams()
  const runId = (params?.runId as string) || ''
  const { addToast } = useToast()
  const [dossier, setDossier] = useState<VentureDossier | null>(null)
  const [graphData, setGraphData] = useState<GraphData | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let eventSource: EventSource | null = null

    const loadRunData = async () => {
      try {
        const data = await getRun(runId)
        setDossier(data)

        if (data.status === 'DONE') {
          const gData = await getGraph(runId)
          setGraphData(gData)
        }

        setLoading(false)

        // Stream updates if not finished
        if (data.status !== 'DONE' && data.status !== 'ERROR') {
          eventSource = streamEvents(
            runId,
            (_event, updatedDossier) => {
              setDossier(updatedDossier)
              if (updatedDossier.status === 'DONE') {
                loadRunData() // Refresh for final artifacts
              }
            },
            (err) => {
              console.error('SSE Error:', err)
              addToast('Disrupted connection to analysis engine.', 'error')
            }
          )
        }
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    if (runId) {
      loadRunData()
    }

    return () => {
      if (eventSource) eventSource.close()
    }
  }, [runId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Engaging Forge Agents...</p>
        </div>
      </div>
    )
  }

  if (error || !dossier) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800 p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold text-rose-600 mb-2">Analysis Interrupted</h2>
          <p className="text-zinc-600 dark:text-zinc-400">{error || 'Failed to locate venture run.'}</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Forge
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* Top Navigation */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-black tracking-tighter">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            VENTUREFORGE
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
              RUN: {runId.slice(0, 8)}
            </span>
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-zinc-400 hover:text-indigo-600 transition-colors"
              title="Restart View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10" />

          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 leading-tight max-w-4xl">
            {dossier.idea_text}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${dossier.status === 'DONE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                dossier.status === 'ERROR' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                  'bg-indigo-50 text-indigo-600 border border-indigo-100'
              }`}>
              {dossier.status}
            </div>
            <div className="text-zinc-400 text-xs font-bold">
              Forged at: {new Date(dossier.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            <DossierView dossier={dossier} graphData={graphData} />
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <ProgressTracker dossier={dossier} />

            {/* Strategic Insights Sidebar Meta */}
            <div className="bg-zinc-900 rounded-2xl p-8 text-white shadow-xl shadow-zinc-900/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4">Forge Core</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Autonomous agents were deployed to simulate market dynamics and stress-test your value proposition.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold">Encrypted Storage</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold">Ciliated Knowledge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
