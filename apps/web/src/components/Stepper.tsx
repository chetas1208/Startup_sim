'use client'

import React from 'react'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

export type StepStatus = 'pending' | 'running' | 'completed' | 'error'

interface Step {
  id: string
  label: string
  status: StepStatus
}

interface StepperProps {
  steps: Step[]
  currentStep?: string
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = step.status === 'completed'
        const isError = step.status === 'error'
        const isRunning = step.status === 'running'

        return (
          <div key={step.id} className="flex items-start gap-4">
            {/* Step Indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : isError
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : isRunning
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-300 dark:ring-blue-700'
                    : isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-2 ring-blue-300 dark:ring-blue-700'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : isError ? (
                  <AlertCircle className="w-6 h-6" />
                ) : isRunning ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-1 h-8 mt-2 transition-colors duration-300 ${
                    isCompleted
                      ? 'bg-green-200 dark:bg-green-800'
                      : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 pt-1">
              <div
                className={`font-medium transition-colors ${
                  isActive || isRunning
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {step.label}
              </div>
              {isRunning && (
                <div className="mt-2 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
