'use client'

import { Sparkles, Zap, Brain, BarChart3, Github } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            About Startup Simulator
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            AI-powered business planning for founders
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">How It Works</h2>
          <div className="space-y-6">
            {[
              {
                icon: Sparkles,
                title: 'Submit Your Idea',
                description: 'Describe your startup concept and select which business functions you want analyzed.',
              },
              {
                icon: Brain,
                title: '10 AI Agents Analyze',
                description: 'Specialized agents work together to stress-test your idea across market, positioning, MVP, finance, and more.',
              },
              {
                icon: BarChart3,
                title: 'Get Comprehensive Report',
                description: 'Receive a detailed analysis with GO/NO-GO recommendations, competitive insights, and next experiments to run.',
              },
              {
                icon: Zap,
                title: 'Download & Share',
                description: 'Export your analysis as Markdown or PDF to share with investors, co-founders, or advisors.',
              },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Frontend', items: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'] },
              { name: 'Backend', items: ['FastAPI', 'CrewAI', 'OpenAI GPT-4', 'Neo4j'] },
              { name: 'Integrations', items: ['Tavily Search', 'Modulate API', 'Numeric', 'Yutori'] },
              { name: 'Infrastructure', items: ['Docker', 'AWS CDK', 'Render', 'DynamoDB'] },
            ].map((category, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                  {category.name}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item, j) => (
                    <li key={j} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Multi-function business analysis',
              'Competitive matrix generation',
              'Assumption tracking & validation',
              'Market size estimation (TAM/SAM/SOM)',
              'Aggressive skeptic analysis',
              'Distribution strategy planning',
              'Financial modeling',
              'Real-time streaming updates',
              'Dark mode support',
              'Export to Markdown & PDF',
              'Confidence scoring',
              'Citation tracking',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-sm text-zinc-900 dark:text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 text-center">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            Ready to analyze your startup?
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Start a simulation now and get comprehensive insights in minutes.
          </p>
          <a
            href="/"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Simulation
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Built with ❤️ for founders and investors
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
