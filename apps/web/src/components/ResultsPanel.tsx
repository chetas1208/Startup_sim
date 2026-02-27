'use client'

import React, { useState } from 'react'
import { ChevronDown, Copy, Download, FileText } from 'lucide-react'
import { CitationCard } from './CitationCard'
import { SkeletonCard } from './Skeleton'

interface Section {
  id: string
  title: string
  icon?: React.ReactNode
  content: React.ReactNode
  citations?: any[]
  loading?: boolean
}

interface ResultsPanelProps {
  sections: Section[]
  onDownloadMarkdown?: () => void
  onDownloadPDF?: () => void
  onCopySummary?: () => void
}

export function ResultsPanel({
  sections,
  onDownloadMarkdown,
  onDownloadPDF,
  onCopySummary,
}: ResultsPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.slice(0, 2).map((s) => s.id))
  )

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <div className="space-y-6">
      {/* Artifacts Bar */}
      <div className="flex flex-wrap gap-2 sticky top-20 z-40 bg-white dark:bg-zinc-950 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onDownloadMarkdown}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
        >
          <FileText className="w-4 h-4" />
          Markdown
        </button>
        <button
          onClick={onDownloadPDF}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
        <button
          onClick={onCopySummary}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id)

          return (
            <div
              key={section.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {section.icon && <div className="text-blue-600 dark:text-blue-400">{section.icon}</div>}
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-left">
                    {section.title}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-500 dark:text-zinc-400 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Content */}
              {isExpanded && (
                <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 space-y-4">
                  {section.loading ? (
                    <SkeletonCard />
                  ) : (
                    <>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {section.content}
                      </div>

                      {/* Citations */}
                      {section.citations && section.citations.length > 0 && (
                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
                            Sources
                          </h4>
                          <div className="space-y-2">
                            {section.citations.map((citation, i) => (
                              <CitationCard key={i} citation={citation} compact />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
