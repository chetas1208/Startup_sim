'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getRun, streamEvents } from '@/lib/api'
import { Stepper, type StepStatus } from '@/components/Stepper'
import { ResultsPanel } from '@/components/ResultsPanel'
import { EmptyState } from '@/components/EmptyState'
import { useToast } from '@/components/Toast'
import { SkeletonCard } from '@/components/Skeleton'
import { Download, Copy, RefreshCw } from 'lucide-react'
import DossierView from '@/components/DossierView'

interface Step {
  id: string
  label: string
  status: StepStatus
}

const STEPS: Step[] = [
  { id: 'clarifier', label: 'Clarify Idea', status: 'pending' },
  { id: 'market_research', label: 'Market Research', status: 'pending' },
  { id: 'positioning', label: 'Positioning', status: 'pending' },
  { id: 'mvp_planner', label: 'MVP Plan', status: 'pending' },
  { id: 'landing_copy', label: 'Landing Copy', status: 'pending' },
  { id: 'bull_investor', label: 'Bull Case', status: 'pending' },
  { id: 'skeptic_investor', label: 'Skeptic Case', status: 'pending' },
  { id: 'moderator', label: 'Synthesis', status: 'pending' },
  { id: 'finance', label: 'Finance', status: 'pending' },
  { id: 'finalizer', label: 'Final Report', status: 'pending' },
]

export default function RunPage() {
  const params = useParams()
  const runId = params.runId as string
  const { addToast } = useToast()

  const [dossier, setDossier] = useState<any>(null)
  const [steps, setSteps] = useState<Step[]>(STEPS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial load
    const loadRun = async () => {
      try {
        const data = await getRun(runId)
        setDossier(data)
        setLoading(false)

        // If still running, set up event stream
        if (data.status === 'running') {
          setupEventStream()
        }
      } catch (err) {
        console.error('Error loading run:', err)
        setError('Failed to load simulation')
        setLoading(false)
      }
    }

    loadRun()
  }, [runId])

  const setupEventStream = () => {
    const eventSource = streamEvents(
      runId,
      (event, data) => {
        if (event === 'update') {
          // Update step status
          const stepId = data.current_step
          setSteps((prev) =>
            prev.map((step) =>
              step.id === stepId
                ? { ...step, status: 'running' as StepStatus }
                : step.status === 'running'
                ? { ...step, status: 'completed' as StepStatus }
                : step
            )
          )
        } else if (event === 'complete') {
          setDossier(data)
          setSteps((prev) =>
            prev.map((step) =>
              step.status === 'running'
                ? { ...step, status: 'completed' as StepStatus }
                : step
            )
          )
          addToast('Simulation completed!', 'success')
        }
      },
      (error) => {
        console.error('Event stream error:', error)
        setError('Connection lost')
      }
    )

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }

  const handleDownloadMarkdown = () => {
    // Mock implementation
    addToast('Markdown downloaded!', 'success')
  }

  const handleDownloadPDF = () => {
    // Mock implementation
    addToast('PDF downloaded!', 'success')
  }

  const handleCopySummary = () => {
    // Mock implementation
    navigator.clipboard.writeText('Simulation summary copied!')
    addToast('Summary copied to clipboard!', 'success')
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          type="error"
          title="Error Loading Simulation"
          description={error}
          action={{
            label: 'Try Again',
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
          {dossier?.raw_idea || 'Loading...'}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Run ID: <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs">{runId}</code>
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Progress */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 card">
            <h2 className="font-bold text-zinc-900 dark:text-white mb-6">Progress</h2>
            <Stepper steps={steps} currentStep={dossier?.current_step} />
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : dossier ? (
            <DossierView dossier={dossier} />
          ) : (
            <EmptyState
              type="empty"
              title="No Data"
              description="The simulation hasn't started yet"
            />
          )}
        </div>
      </div>
    </div>
  )
}
