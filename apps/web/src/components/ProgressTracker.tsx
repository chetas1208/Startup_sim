import { VentureDossier } from '@/lib/api'
import { Check, Loader2, Zap, Search, Target, BarChart4 } from 'lucide-react'

const STEPS = [
  { key: 'CLARIFY', label: 'Clarification', icon: Zap },
  { key: 'MARKET_RESEARCH', label: 'Market Research', icon: Search },
  { key: 'COMPETITIVE_ANALYSIS', label: 'Competitive Analysis', icon: Target },
  { key: 'STRATEGY', label: 'Strategy & Positioning', icon: BarChart4 },
]

interface ProgressTrackerProps {
  dossier: VentureDossier
}

export default function ProgressTracker({ dossier }: ProgressTrackerProps) {
  const currentStep = dossier.current_step
  const status = dossier.status

  const getStepStatus = (stepKey: string) => {
    if (status === 'DONE') return 'completed'
    if (status === 'ERROR') return 'failed'

    if (!currentStep) return 'pending'

    const currentIndex = STEPS.findIndex((s) => s.key === currentStep)
    const stepIndex = STEPS.findIndex((s) => s.key === stepKey)

    if (stepIndex < currentIndex && currentIndex !== -1) return 'completed'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 text-white border-emerald-500'
      case 'active':
        return 'bg-white text-indigo-600 border-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-900/20'
      case 'failed':
        return 'bg-rose-500 text-white border-rose-500'
      default:
        return 'bg-white text-zinc-400 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'
    }
  }

  const completedCount = STEPS.filter(step => getStepStatus(step.key) === 'completed').length
  const progressPercent = (completedCount / STEPS.length) * 100

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Forge Progress</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-450 mt-1">Autonomous agents are forging your venture strategy...</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{Math.round(progressPercent)}%</div>
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{status}</div>
        </div>
      </div>

      {/* Steps Visualizer */}
      <div className="relative flex justify-between">
        {/* Connector Line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 -z-10" />
        <div
          className="absolute top-6 left-0 h-0.5 bg-indigo-500 transition-all duration-1000 -z-10"
          style={{ width: `${Math.max(0, (completedCount / (STEPS.length - 1)) * 100)}%` }}
        />

        {STEPS.map((step, index) => {
          const stepStatus = getStepStatus(step.key)
          const Icon = step.icon

          return (
            <div key={step.key} className="flex flex-col items-center group">
              <div
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${getStepStyles(stepStatus)}`}
              >
                {stepStatus === 'completed' ? (
                  <Check className="w-6 h-6" />
                ) : stepStatus === 'active' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="mt-4 text-center">
                <div className={`text-xs font-bold uppercase tracking-tight transition-colors ${stepStatus === 'active' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500'}`}>
                  {step.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
