import { useState } from 'react';
import { Search } from 'lucide-react';
import { exampleQueries } from '../data/mockData';

export default function LandingPage({ onSubmit }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSubmit(query.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Logo + Tagline */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-sg-accent/20" />
              <div className="absolute inset-1 rounded-full bg-sg-accent/30" />
              <div className="absolute inset-2 rounded-full bg-sg-accent flex items-center justify-center">
                <svg viewBox="0 0 20 20" className="w-4 h-4 text-sg-bg" fill="currentColor">
                  <circle cx="6" cy="7" r="2.5" />
                  <circle cx="14" cy="6" r="2" />
                  <circle cx="11" cy="14" r="1.8" />
                  <line x1="6" y1="7" x2="14" y2="6" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="14" y1="6" x2="11" y2="14" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="6" y1="7" x2="11" y2="14" stroke="currentColor" strokeWidth="0.8" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-sg-text">
              Scout<span className="text-sg-accent">Graph</span>
            </h1>
          </div>
          <p className="text-sg-textMuted text-lg">
            Describe what you're building. We'll map your market.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., An AI-powered voice tutor for kids aged 6 to 12"
              rows={4}
              className="w-full px-5 py-4 bg-sg-surface border border-sg-border rounded-xl
                         text-sg-text placeholder-sg-textDim text-lg leading-relaxed
                         resize-none outline-none
                         focus:border-sg-accent/50 focus:ring-1 focus:ring-sg-accent/25
                         transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="absolute bottom-3 right-3 text-xs text-sg-textDim">
              Enter ↵ to submit
            </div>
          </div>

          <button
            type="submit"
            disabled={!query.trim()}
            className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5" />
            Scout the Market
          </button>
        </form>

        {/* Example Prompts */}
        <div className="mt-8">
          <p className="text-xs text-sg-textDim text-center mb-3 uppercase tracking-wider font-medium">
            Try an example
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {exampleQueries.map((eq, i) => (
              <button
                key={i}
                onClick={() => setQuery(eq)}
                className="text-sm text-sg-textMuted px-3 py-1.5 rounded-lg
                           border border-sg-border hover:border-sg-borderLight
                           hover:text-sg-text hover:bg-sg-surface/60
                           transition-all duration-200"
              >
                {eq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center">
        <p className="text-xs text-sg-textDim">
          Powered by <span className="text-sg-textMuted">Yutori</span> · <span className="text-sg-textMuted">Tavily</span> · <span className="text-sg-textMuted">Fastino</span> · <span className="text-sg-textMuted">Neo4j</span> · <span className="text-sg-textMuted">Modulate</span>
          <span className="mx-2">|</span>
          Deployed on <span className="text-sg-textMuted">Render</span>
        </p>
      </footer>
    </div>
  );
}
