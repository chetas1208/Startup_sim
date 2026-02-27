'use client'

import React, { useState } from 'react'
import { Copy, ExternalLink, CheckCircle2 } from 'lucide-react'

interface Citation {
  url: string
  title?: string
  snippet?: string
  published_date?: string
}

interface CitationCardProps {
  citation: Citation
  compact?: boolean
}

export function CitationCard({ citation, compact = false }: CitationCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(citation.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const domain = new URL(citation.url).hostname.replace('www.', '')

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">
            {citation.title || domain}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{domain}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
            title="Copy link"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            )}
          </button>
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
            title="Open link"
          >
            <ExternalLink className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          {citation.title && (
            <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-1 line-clamp-2">
              {citation.title}
            </h4>
          )}
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{domain}</p>
          {citation.published_date && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              {new Date(citation.published_date).toLocaleDateString()}
            </p>
          )}
        </div>
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
          title="Open link"
        >
          <ExternalLink className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        </a>
      </div>

      {citation.snippet && (
        <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 mb-3">
          {citation.snippet}
        </p>
      )}

      <button
        onClick={handleCopy}
        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
      >
        {copied ? (
          <>
            <CheckCircle2 className="w-3 h-3" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            Copy link
          </>
        )}
      </button>
    </div>
  )
}
