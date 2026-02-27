'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, Zap, Target, Search, BarChart4 } from 'lucide-react'
import { createRun } from '@/lib/api'
import { useToast } from '@/components/Toast'

const EXAMPLE_IDEAS = [
  'AI-powered meal planning for busy parents',
  'B2B SaaS for solar panel installers',
  'Sustainable fashion logistics engine',
  'Remote healthcare scheduling for seniors',
]

export default function HomePage() {
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim()) return

    setLoading(true)
    try {
      const response = await createRun(idea)
      addToast('Analysis engine engaged!', 'success')
      router.push(`/run/${response.run_id}`)
    } catch (error) {
      console.error('Error creating run:', error)
      addToast('Failed to start analysis. check backend connection.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Startup Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 tracking-tight">
            Venture<span className="text-indigo-600">Forge</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 leading-relaxed">
            AI-powered startup research, competitive intelligence, and strategic positioning engine.
          </p>
        </div>

        {/* Input Card */}
        <div className="max-w-2xl mx-auto mb-20 animate-fadeInUp">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-4 text-zinc-900 dark:text-zinc-200">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  Your Startup Concept
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your idea in a few sentences..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-5 py-4 min-h-[140px] text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !idea.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 transition-all group shadow-lg shadow-indigo-600/20"
              >
                {loading ? 'Initializing Agents...' : 'Forge Strategy'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">
                Inspire your vision:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_IDEAS.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setIdea(example)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-transparent"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: Zap, title: 'Clarify', desc: 'Structure the concept' },
            { icon: Search, title: 'Research', desc: 'Live market data' },
            { icon: Target, title: 'Analyze', desc: 'Competitive gaps' },
            { icon: BarChart4, title: 'Position', desc: 'Win with strategy' },
          ].map((step, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
              <step.icon className="w-6 h-6 mx-auto mb-3 text-indigo-600" />
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{step.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
