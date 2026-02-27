'use client'

import { useEffect, useState } from 'react'
import { listRuns, StartupDossier } from '@/lib/api'
import Link from 'next/link'
import { Clock, ArrowRight, Loader2 } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'

export default function HistoryPage() {
  const [runs, setRuns] = useState<StartupDossier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRuns = async () => {
      try {
        const data = await listRuns(50)
        setRuns(data)
      } catch (error) {
        console.error('Error loading runs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRuns()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Simulation History
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          View all your past startup simulations
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
      ) : runs.length === 0 ? (
        <EmptyState
          type="empty"
          title="No Simulations Yet"
          description="Start your first simulation to see it appear here"
          action={{
            label: 'Create Simulation',
            onClick: () => (window.location.href = '/'),
          }}
        />
      ) : (
        <div className="space-y-3">
          {runs.map((run) => (
            <Link
              key={run.run_id}
              href={`/run/${run.run_id}`}
              className="card hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {run.raw_idea}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(run.created_at).toLocaleDateString()}</span>
                  </div>
                  {run.selected_functions && run.selected_functions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {run.selected_functions.map((func) => (
                        <span
                          key={func}
                          className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        >
                          {func.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge
                    status={
                      run.status === 'completed'
                        ? 'completed'
                        : run.status === 'failed'
                        ? 'error'
                        : run.status === 'running'
                        ? 'running'
                        : 'pending'
                    }
                  />
                  <ArrowRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
