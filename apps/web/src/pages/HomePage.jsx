import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRun } from '../api'

export default function HomePage() {
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!idea.trim()) return

    setLoading(true)
    try {
      const response = await createRun(idea)
      navigate(`/run/${response.run_id}`)
    } catch (error) {
      console.error('Error creating run:', error)
      alert('Failed to start simulation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    'AI-powered meal planning for busy parents',
    'B2B SaaS for construction project management',
    'Marketplace for freelance data scientists',
    'Mobile app for mental health check-ins',
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Turn an idea into a stress-tested startup plan
        </h2>
        <p className="text-xl text-gray-600">
          Autonomous agents analyze your idea, research the market, and deliver
          a comprehensive GO/NO-GO recommendation
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your startup idea
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., AI-powered meal planning for busy parents"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !idea.trim()}
            className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Starting Simulation...' : 'Run Simulation'}
          </button>
        </form>

        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-3">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => setIdea(example)}
                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl mb-2">🤖</div>
          <h3 className="font-semibold text-gray-900 mb-1">10 AI Agents</h3>
          <p className="text-sm text-gray-600">
            Specialized agents for research, strategy, and analysis
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="font-semibold text-gray-900 mb-1">Live Market Scan</h3>
          <p className="text-sm text-gray-600">
            Real-time competitor research with citations
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold text-gray-900 mb-1">GO/NO-GO Score</h3>
          <p className="text-sm text-gray-600">
            Data-driven recommendation with next steps
          </p>
        </div>
      </div>
    </div>
  )
}
