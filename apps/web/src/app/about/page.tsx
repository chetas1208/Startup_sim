import AppShell from '@/components/AppShell';

const TECH_STACK = [
  { name: 'Next.js', role: 'Frontend' },
  { name: 'FastAPI', role: 'Backend' },
  { name: 'NVIDIA Kimi K2.5', role: 'LLM Reasoning' },
  { name: 'Tavily', role: 'Web Search' },
  { name: 'Yutori', role: 'Page Extraction' },
  { name: 'Fastino GLiNER2', role: 'Entity Extraction' },
  { name: 'Neo4j', role: 'Graph Database' },
  { name: 'PostgreSQL', role: 'Structured Storage' },
  { name: 'CrewAI', role: 'Agent Orchestration' },
  { name: 'Render', role: 'Deployment' },
];

const STEPS = [
  { step: '1', title: 'You describe a startup idea', desc: 'We parse it into a structured format: target customer, problem, solution, keywords.' },
  { step: '2', title: 'We search the market', desc: 'Tavily queries discover competitors, market reports, and pricing data with live web search.' },
  { step: '3', title: 'We extract deep intelligence', desc: 'Yutori visits competitor websites to extract features, positioning, and pricing.' },
  { step: '4', title: 'We normalize everything', desc: 'Fastino cleans and structures the data: standardized names, pricing, segments.' },
  { step: '5', title: 'We synthesize market analysis', desc: 'NVIDIA Kimi generates competitive landscape, market gaps, and differentiation opportunities.' },
  { step: '6', title: 'We simulate a VC interview', desc: 'Five questions that a real investor would ask, with scored answers and feedback.' },
  { step: '7', title: 'We recommend funding strategy', desc: 'Bootstrap, angel, seed, or grants — with use-of-funds breakdown and milestones.' },
];

export default function AboutPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-8 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">How VentureForge Works</h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
            AI-powered startup research, competitive intelligence, and strategic positioning — in under 60 seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-sm font-bold">
                {s.step}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((t, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{t.name}</span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
