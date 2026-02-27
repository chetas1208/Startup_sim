const steps = [
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

export default function ProgressTracker({ dossier }) {
  const currentStep = dossier?.current_step
  const status = dossier?.status

  const getStepStatus = (stepKey) => {
    if (!currentStep) return 'pending'
    
    const currentIndex = steps.findIndex((s) => s.key === currentStep)
    const stepIndex = steps.findIndex((s) => s.key === stepKey)
    
    if (status === 'completed') return 'completed'
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white'
      case 'active':
        return 'bg-blue-500 text-white animate-pulse'
      default:
        return 'bg-gray-200 text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
      
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.key)
          
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getStepColor(
                    stepStatus
                  )}`}
                >
                  {stepStatus === 'completed' ? '✓' : index + 1}
                </div>
                <span className="text-xs text-gray-600 mt-2 text-center">
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-8 mx-2 ${
                    stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">
          Status:{' '}
          <span className="font-semibold capitalize">{status || 'pending'}</span>
        </span>
      </div>
    </div>
  )
}
