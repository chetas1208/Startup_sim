'use client'

import React from 'react'
import { CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react'

type Status = 'pending' | 'running' | 'completed' | 'error'

interface StatusBadgeProps {
  status: Status
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const statusConfig = {
    pending: {
      bg: 'bg-zinc-100 dark:bg-zinc-800',
      text: 'text-zinc-700 dark:text-zinc-300',
      icon: Clock,
      label: 'Pending',
    },
    running: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      icon: Loader2,
      label: 'Running',
    },
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      icon: CheckCircle2,
      label: 'Completed',
    },
    error: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      icon: AlertCircle,
      label: 'Error',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full font-medium ${sizeClasses[size]} ${config.bg} ${config.text}`}
    >
      <Icon className={`w-${size === 'sm' ? 3 : size === 'md' ? 4 : 5} h-${size === 'sm' ? 3 : size === 'md' ? 4 : 5} ${status === 'running' ? 'animate-spin' : ''}`} />
      <span>{label || config.label}</span>
    </div>
  )
}
