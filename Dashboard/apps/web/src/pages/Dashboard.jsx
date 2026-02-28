import { useState, useRef } from 'react';
import { Search, Volume2, ArrowUp, ChevronDown } from 'lucide-react';
import KnowledgeGraph from '../components/KnowledgeGraph';
import CompetitorCard from '../components/CompetitorCard';
import CompetitorDetail from '../components/CompetitorDetail';
import MarketSizing from '../components/MarketSizing';
import InvestorLandscape from '../components/InvestorLandscape';
import DemandSignals from '../components/DemandSignals';
import WhiteSpace from '../components/WhiteSpace';
import StrategicSummary from '../components/StrategicSummary';
import VoiceBriefing from '../components/VoiceBriefing';
import { sortCompetitors } from '../utils/helpers';

const SECTIONS = [
  { id: 'landscape', label: 'Landscape' },
  { id: 'market', label: 'Market Size' },
  { id: 'investors', label: 'Investors' },
  { id: 'demand', label: 'Demand' },
  { id: 'whitespace', label: 'White Space' },
  { id: 'summary', label: 'Summary' },
];

export default function Dashboard({ data, onNewSearch }) {
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [showBriefing, setShowBriefing] = useState(false);
  const [sortBy, setSortBy] = useState('funding');
  const [activeSection, setActiveSection] = useState('landscape');
  const sectionRefs = useRef({});

  const scrollToSection = (id) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleGraphNodeClick = (node) => {
    if (node.type === 'company') {
      const comp = data.competitors.find((c) => c.id === node.id);
      if (comp) setSelectedCompetitor(comp);
    }
  };

  const sorted = sortCompetitors(data.competitors || [], sortBy);

  return (
    <div className="min-h-screen bg-sg-bg">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-40 bg-sg-bg/95 backdrop-blur border-b border-sg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-sm font-bold text-sg-accent whitespace-nowrap">
                Scout<span className="text-sg-text">Graph</span>
              </h1>
              <span className="text-sg-border">|</span>
              <p className="text-sm text-sg-textMuted truncate">{data.query}</p>
            </div>
            <button
              onClick={onNewSearch}
              className="btn-ghost text-xs flex items-center gap-1.5 flex-shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              New Search
            </button>
          </div>

          {/* Section Nav */}
          <div className="flex gap-1 -mb-px overflow-x-auto pb-px">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap
                  ${activeSection === s.id
                    ? 'border-sg-accent text-sg-accent'
                    : 'border-transparent text-sg-textDim hover:text-sg-textMuted'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16">
        {/* Section A: Competitive Landscape */}
        <section ref={(el) => (sectionRefs.current.landscape = el)} id="landscape">
          <div className="mb-6">
            <h2 className="section-title">Competitive Landscape</h2>
            <p className="section-subtitle">Interactive knowledge graph of the market ecosystem</p>
          </div>

          <KnowledgeGraph graphData={data.graph} onNodeClick={handleGraphNodeClick} />

          {/* Competitor Cards */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-sg-text">
                {data.competitors?.length} Competitors Found
              </h3>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-sg-surface border border-sg-border rounded-lg
                             px-3 py-1.5 pr-8 text-xs text-sg-textMuted
                             focus:outline-none focus:border-sg-borderLight cursor-pointer"
                >
                  <option value="funding">Sort by Funding</option>
                  <option value="employees">Sort by Employees</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sg-textDim pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map((comp) => (
                <CompetitorCard
                  key={comp.id || comp.name}
                  competitor={comp}
                  onClick={setSelectedCompetitor}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section B: Market Sizing */}
        <section ref={(el) => (sectionRefs.current.market = el)} id="market">
          <MarketSizing data={data.market_sizing} />
        </section>

        {/* Section C: Investor Landscape */}
        <section ref={(el) => (sectionRefs.current.investors = el)} id="investors">
          <InvestorLandscape investors={data.investors} competitors={data.competitors} />
        </section>

        {/* Section D: Demand Signals */}
        <section ref={(el) => (sectionRefs.current.demand = el)} id="demand">
          <DemandSignals signals={data.demand_signals} />
        </section>

        {/* Section E: White Space */}
        <section ref={(el) => (sectionRefs.current.whitespace = el)} id="whitespace">
          <WhiteSpace gaps={data.white_space} />
        </section>

        {/* Section F: Strategic Summary */}
        <section ref={(el) => (sectionRefs.current.summary = el)} id="summary">
          <StrategicSummary summary={data.strategic_summary} />
        </section>

        {/* Footer */}
        <footer className="border-t border-sg-border pt-6 pb-12 text-center">
          <p className="text-xs text-sg-textDim">
            Powered by <span className="text-sg-textMuted">Yutori</span> · <span className="text-sg-textMuted">Tavily</span> · <span className="text-sg-textMuted">Fastino</span> · <span className="text-sg-textMuted">Neo4j</span> · <span className="text-sg-textMuted">Modulate</span>
            <span className="mx-2">|</span>
            Deployed on <span className="text-sg-textMuted">Render</span>
          </p>
        </footer>
      </main>

      {/* Floating Action Button — Brief Me */}
      <button
        onClick={() => setShowBriefing(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-5 py-3
                   bg-sg-accent text-sg-bg font-semibold rounded-full
                   shadow-lg shadow-sg-accent/25
                   hover:bg-sg-accentDim transition-all duration-200
                   hover:shadow-xl hover:shadow-sg-accent/30"
      >
        <Volume2 className="w-4 h-4" />
        Brief Me
      </button>

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 z-30 w-10 h-10 rounded-full
                   bg-sg-surface border border-sg-border text-sg-textMuted
                   hover:text-sg-text hover:border-sg-borderLight
                   flex items-center justify-center transition-colors"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Voice Briefing Modal */}
      {showBriefing && (
        <VoiceBriefing
          text={data.voice_briefing_text}
          onClose={() => setShowBriefing(false)}
        />
      )}

      {/* Competitor Detail Panel */}
      {selectedCompetitor && (
        <CompetitorDetail
          competitor={selectedCompetitor}
          onClose={() => setSelectedCompetitor(null)}
        />
      )}
    </div>
  );
}
