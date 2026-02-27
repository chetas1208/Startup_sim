'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  TrendingUp,
  Package,
  DollarSign,
  Truck,
  ArrowRight,
  Zap,
  CheckCircle2,
  BarChart3,
} from 'lucide-react'
import { createRun } from '@/lib/api'
import { useToast } from '@/components/Toast'

const BUSINESS_FUNCTIONS = [
  { id: 'marketing', label: 'Marketing Strategy', icon: TrendingUp },
  { id: 'finance', label: 'Finance & Funding', icon: DollarSign },
  { id: 'supply_chain', label: 'Supply Chain', icon: Truck },
  { id: 'inventory', label: 'Inventory Management', icon: Package },
]

const EXAMPLE_IDEAS = [
  'AI-powered meal planning for busy parents',
  'B2B SaaS for construction project management',
  'Sustainable fashion marketplace',
  'Healthcare appointment scheduling platform',
]

export default function HomePage() {
  const [idea, setIdea] = useState('')
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([
    'marketing',
    'finance',
  ])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  const toggleFunction = (functionId: string) => {
    setSelectedFunctions((prev) =>
      prev.includes(functionId)
        ? prev.filter((id) => id !== functionId)
        : [...prev, functionId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim() || selectedFunctions.length === 0) return

    setLoading(true)
    try {
      const response = await createRun(idea, selectedFunctions)
      addToast('Simulation started!', 'success')
      router.push(`/run/${response.run_id}`)
    } catch (error) {
      console.error('Error creating run:', error)
      addToast('Failed to start simulation. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ backgroundColor: 'rgb(var(--bg))' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{
              backgroundColor: 'rgb(var(--accent-soft))',
              color: 'rgb(var(--accent))',
            }}
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Business Analysis
          </div>
          <h1
            className="text-4xl md:text-5xl font-semibold mb-4 leading-tight tracking-tight"
            style={{ color: 'rgb(var(--text-primary))' }}
          >
            Turn Your Idea Into a{' '}
            <span style={{ color: 'rgb(var(--accent))' }}>Business Plan</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgb(var(--text-secondary))' }}
          >
            Autonomous AI agents analyze your startup across multiple business
            functions, delivering comprehensive insights in minutes.
          </p>
        </div>

        {/* Main Form Card */}
        <div
          className="rounded-2xl p-8 shadow-sm max-w-3xl mx-auto mb-16"
          style={{
            backgroundColor: 'rgb(var(--card))',
            border: '1px solid rgb(var(--border))',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Idea Input */}
            <div>
              <label
                className="flex items-center gap-2 text-sm font-semibold mb-3"
                style={{ color: 'rgb(var(--text-primary))' }}
              >
                <Zap className="w-4 h-4" style={{ color: 'rgb(var(--accent))' }} />
                Describe your startup idea
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., AI-powered meal planning for busy parents"
                className="w-full rounded-xl resize-none text-base leading-relaxed transition-all px-5 py-4"
                style={{
                  backgroundColor: 'rgb(var(--muted))',
                  border: '1px solid rgb(var(--border))',
                  color: 'rgb(var(--text-primary))',
                }}
                rows={4}
                disabled={loading}
              />
              <p
                className="text-xs mt-2"
                style={{ color: 'rgb(var(--text-secondary))' }}
              >
                {idea.length} characters
              </p>
            </div>

            {/* Business Functions Selection */}
            <div>
              <label
                className="block text-sm font-semibold mb-4"
                style={{ color: 'rgb(var(--text-primary))' }}
              >
                Select business functions to analyze
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUSINESS_FUNCTIONS.map((func) => {
                  const Icon = func.icon
                  const isSelected = selectedFunctions.includes(func.id)
                  return (
                    <button
                      key={func.id}
                      type="button"
                      onClick={() => toggleFunction(func.id)}
                      className="flex items-center gap-3 p-4 rounded-xl transition-all text-left"
                      style={{
                        border: isSelected
                          ? '2px solid rgb(var(--accent))'
                          : '2px solid rgb(var(--border))',
                        backgroundColor: isSelected
                          ? 'rgb(var(--accent-soft))'
                          : 'rgb(var(--card))',
                        color: 'rgb(var(--text-primary))',
                      }}
                    >
                      <Icon
                        className="w-5 h-5 flex-shrink-0"
                        style={{
                          color: isSelected
                            ? 'rgb(var(--accent))'
                            : 'rgb(var(--text-secondary))',
                        }}
                      />
                      <span className="font-medium text-sm">{func.label}</span>
                      {isSelected && (
                        <CheckCircle2
                          className="w-5 h-5 ml-auto flex-shrink-0"
                          style={{ color: 'rgb(var(--accent))' }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
              <p
                className="text-xs mt-3"
                style={{ color: 'rgb(var(--text-secondary))' }}
              >
                Select at least one function. More functions = deeper analysis.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !idea.trim() || selectedFunctions.length === 0}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              style={{ backgroundColor: 'rgb(var(--accent))' }}
            >
              <span>
                {loading ? 'Starting Simulation…' : 'Run Simulation'}
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Example Ideas */}
          <div
            className="mt-8 pt-8"
            style={{ borderTop: '1px solid rgb(var(--border))' }}
          >
            <p
              className="text-sm font-semibold mb-4"
              style={{ color: 'rgb(var(--text-secondary))' }}
            >
              Try an example:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_IDEAS.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setIdea(example)}
                  className="text-sm px-4 py-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: 'rgb(var(--muted))',
                    border: '1px solid rgb(var(--border))',
                    color: 'rgb(var(--text-secondary))',
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: BarChart3,
              title: 'Multi-Function Analysis',
              description:
                'Analyze marketing, finance, supply chain, and inventory in one comprehensive report.',
            },
            {
              icon: Sparkles,
              title: '10 AI Agents',
              description:
                'Specialized agents work together to stress-test your business model.',
            },
            {
              icon: TrendingUp,
              title: 'Actionable Insights',
              description:
                'Get clear GO / NO-GO recommendations with next experiments to run.',
            },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="rounded-2xl p-6 transition-colors"
                style={{
                  backgroundColor: 'rgb(var(--card))',
                  border: '1px solid rgb(var(--border))',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgb(var(--accent-soft))' }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: 'rgb(var(--accent))' }}
                  />
                </div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: 'rgb(var(--text-primary))' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgb(var(--text-secondary))' }}
                >
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
