'use client'

import React from 'react'
import { AlertCircle, Inbox, RotateCcw } from 'lucide-react'

type EmptyStateType = 'empty' | 'error' | 'no-results'

interface EmptyStateProps {
  type?: EmptyStateType
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  type = 'empty',
  title,
  description,
  action,
}: EmptyStateProps) {
  const iconConfig = {
    empty: {
      icon: Inbox,
      color: 'text-zinc-400 dark:text-zinc-600',
      bg: 'bg-zinc-100 dark:bg-zinc-800',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-400 dark:text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/20',
    },
    'no-results': {
      icon: RotateCcw,
      color: 'text-amber-400 dark:text-amber-600',
      bg: 'bg-amber-100 dark:bg-amber-900/20',
    },
  }

  const config = iconConfig[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className={`p-4 rounded-full ${config.bg} mb-4`}>
        <Icon className={`w-8 h-8 ${config.color}`} />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
