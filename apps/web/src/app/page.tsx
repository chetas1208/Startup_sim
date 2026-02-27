'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, TrendingUp, Package, DollarSign, BarChart3, Truck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
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
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>(['marketing', 'finance'])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  const toggleFunction = (functionId: string) => {
    setSelectedFunctions(prev =>
      prev.includes(functionId)
        ? prev.filter(id => id !== functionId)
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
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight">
            Turn Your Idea Into a Business Plan
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Autonomous AI agents analyze your startup across multiple business functions,
            delivering comprehensive insights in minutes.
          </p>
        </div>

        {/* Main Form */}
        <div className="card max-w-4xl mx-auto mb-16">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Idea Input */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Describe your startup idea
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., AI-powered meal planning for busy parents"
                className="input input-lg resize-none"
                rows={4}
                disabled={loading}
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                {idea.length} characters
              </p>
            </div>

            {/* Business Functions Selection */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-4">
                Select business functions to analyze
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BUSINESS_FUNCTIONS.map((func) => {
                  const Icon = func.icon
                  const isSelected = selectedFunctions.includes(func.id)
                  
                  return (
                    <button
                      key={func.id}
                      type="button"
                      onClick={() => toggleFunction(func.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-zinc-600 dark:text-zinc-400'}`} />
                      <span className={`font-medium ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-zinc-900 dark:text-white'}`}>
                        {func.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />
                      )}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3">
                Select at least one function. More functions = deeper analysis.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !idea.trim() || selectedFunctions.length === 0}
              className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Starting Simulation...' : 'Run Simulation'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Example Ideas */}
          <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_IDEAS.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setIdea(example)}
                  className="text-sm px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: BarChart3,
              title: 'Multi-Function Analysis',
              description: 'Analyze marketing, finance, supply chain, and inventory in one comprehensive report',
            },
            {
              icon: Sparkles,
              title: '10 AI Agents',
              description: 'Specialized agents work together to stress-test your business model',
            },
            {
              icon: TrendingUp,
              title: 'Actionable Insights',
              description: 'Get clear GO/NO-GO recommendations with next experiments to run',
            },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="card hover:shadow-lg transition-shadow">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 w-fit mb-4">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
