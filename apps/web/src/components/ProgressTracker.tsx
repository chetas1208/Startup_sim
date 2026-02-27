import { StartupDossier } from '@/lib/api'
import { Check, Loader2, Zap } from 'lucide-react'

const STEPS = [
  { key: 'clarifier', label: 'Idea' },
  { key: 'market_research', label: 'Market' },
  { key: 'positioning', label: 'Strategy' },
  { key: 'mvp_planner', label: 'MVP' },
  { key: 'landing_copy', label: 'Landing' },
  { key: 'bull_investor', label: 'Bull' },
  { key: 'skeptic_investor', label: 'Skeptic' },
  { key: 'moderator', label: 'Debate' },
  { key: 'finance', label: 'Finance' },
  { key: 'finalizer', label: 'Final' },
]

interface ProgressTrackerProps {
  dossier: StartupDossier
}

export default function ProgressTracker({ dossier }: ProgressTrackerProps) {
  const currentStep = dossier.current_step
  const status = dossier.status

  const getStepStatus = (stepKey: string) => {
    if (!currentStep) return 'pending'

    const currentIndex = STEPS.findIndex((s) => s.key === currentStep)
    const stepIndex = STEPS.findIndex((s) => s.key === stepKey)

    if (status === 'completed') return 'completed'
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
      case 'active':
        return 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg animate-pulse-glow'
      default:
        return 'bg-gray-200 text-gray-600'
    }
  }

  const completedCount = STEPS.filter(step => getStepStatus(step.key) === 'completed').length
  const progressPercent = (completedCount / STEPS.length) * 100

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Simulation Progress</h3>
        </div>
        <span className="text-sm font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
          {completedCount}/{STEPS.length} steps
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{Math.round(progressPercent)}% complete</p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between overflow-x-auto pb-4 gap-2">
        {STEPS.map((step, index) => {
          const stepStatus = getStepStatus(step.key)

          return (
            <div key={step.key} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${getStepColor(
                    stepStatus
                  )}`}
                >
                  {stepStatus === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : stepStatus === 'active' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs text-gray-600 mt-2 text-center whitespace-nowrap font-medium">
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`h-1 w-6 mx-1 transition-all duration-500 rounded-full ${
                    stepStatus === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Status:</span>
          <span className={`badge font-semibold capitalize ${
            status === 'completed' ? 'badge-success' :
            status === 'running' ? 'badge-info' :
            status === 'failed' ? 'badge-error' : 'badge-warning'
          }`}>
            {status || 'pending'}
          </span>
        </div>
      </div>
    </div>
  )
}
