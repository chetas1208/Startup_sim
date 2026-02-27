'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getRun, streamEvents, downloadMarkdown, downloadPDF, StartupDossier } from '@/lib/api'
import ProgressTracker from '@/components/ProgressTracker'
import DossierView from '@/components/DossierView'
import { Download, FileText, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/Toast'

export default function RunPage() {
  const params = useParams()
  const runId = (params?.runId as string) || ''
  const { addToast } = useToast()
  const [dossier, setDossier] = useState<StartupDossier | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let eventSource: EventSource | null = null

    const loadRun = async () => {
      try {
        const data = await getRun(runId)
        setDossier(data)
        setLoading(false)

        // If still running, stream updates
        if (data.status === 'running' || data.status === 'pending') {
          eventSource = streamEvents(
            runId,
            (_event, data) => {
              setDossier(data)
            },
            (error) => {
              console.error('Stream error:', error)
            }
          )
        }
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    if (runId) {
      loadRun()
    }

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [runId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">Loading simulation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="btn btn-ghost mb-6 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <div className="card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-lg flex-shrink-0">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">Error Loading Simulation</p>
              <p className="text-red-700 dark:text-red-200 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dossier) return null

  const isComplete = dossier.status === 'completed'
  const isFailed = dossier.status === 'failed'

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Link href="/" className="btn btn-ghost mb-6 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            {dossier.raw_idea}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Run ID: {runId}</p>
          {dossier.selected_functions && dossier.selected_functions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {dossier.selected_functions.map((func) => (
                <span key={func} className="badge badge-info">
                  {func.replace('_', ' ')}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="mb-8 animate-slideInRight">
          <ProgressTracker dossier={dossier} />
        </div>

        {/* Error State */}
        {isFailed && (
          <div className="mb-8 card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-lg flex-shrink-0">
                <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">Simulation Failed</p>
                <p className="text-red-700 dark:text-red-200 text-sm mt-1">{dossier.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Download Buttons */}
        {isComplete && (
          <div className="mb-8 flex gap-4 flex-wrap">
            <a
              href={downloadMarkdown(runId)}
              download
              className="btn btn-primary inline-flex items-center gap-2 group"
            >
              <FileText className="w-5 h-5" />
              <span>Download Markdown</span>
              <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
            <a
              href={downloadPDF(runId)}
              download
              className="btn btn-secondary inline-flex items-center gap-2 group"
            >
              <FileText className="w-5 h-5" />
              <span>Download PDF</span>
              <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        )}

        {/* Dossier Content */}
        <div className="space-y-6">
          <DossierView dossier={dossier} />
        </div>
      </div>
    </div>
  )
}
