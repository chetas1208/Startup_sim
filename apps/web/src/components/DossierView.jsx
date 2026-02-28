export default function DossierView({ dossier }) {
  if (!dossier) return null

  return (
    <div className="space-y-6">
      {dossier.clarification && (
        <Section title="1. Clarified Idea">
          <InfoRow label="Problem" value={dossier.clarification.core_problem} />
          <InfoRow label="Solution" value={dossier.clarification.proposed_solution} />
          <InfoRow label="Target Customer" value={dossier.clarification.target_customer} />
          <List label="Key Assumptions" items={dossier.clarification.key_assumptions} />
          <InfoRow label="Measurable Outcome" value={dossier.clarification.measurable_outcome} />
        </Section>
      )}

      {dossier.market_research && (
        <Section title="2. Market Research">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
            <p className="text-gray-700">{dossier.market_research.summary}</p>
          </div>

          <h4 className="font-semibold text-gray-900 mb-3">Market Segments</h4>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            {dossier.market_research.segments.map((seg, i) => (
              <li key={i}>{seg}</li>
            ))}
          </ul>

          <h4 className="font-semibold text-gray-900 mb-3">Top Competitors</h4>
          {dossier.market_research.competitors.slice(0, 3).map((comp, i) => (
            <div key={i} className="mb-4 p-4 border rounded-lg">
              <h5 className="font-semibold text-gray-900">{comp.name}</h5>
              {comp.url && (
                <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {comp.url}
                </a>
              )}
              <p className="text-sm text-gray-700 mt-2">{comp.description}</p>
              {comp.pricing && <p className="text-sm text-gray-600 mt-1">Pricing: {comp.pricing}</p>}
              {comp.features && comp.features.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Features:</span> {comp.features.join(', ')}
                </div>
              )}
            </div>
          ))}

          <List label="Market Gaps" items={dossier.market_research.market_gaps} />
        </Section>
      )}

      {dossier.competitive_analysis && (
        <Section title="3. Competitive Analysis">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{dossier.competitive_analysis.competitive_summary}</p>
          </div>
          <InfoRow label="Overlap Assessment" value={dossier.competitive_analysis.overlap_assessment} />

          <List label="Differentiation Opportunities" items={dossier.competitive_analysis.differentiation_opportunities} color="green" />
          <List label="Top Threats" items={dossier.competitive_analysis.top_threats} color="red" />

          <h4 className="font-semibold text-gray-900 mt-6 mb-3">Competitor Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossier.competitive_analysis.competitor_comparison.map((comp, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h5 className="font-semibold">{comp.competitor}</h5>
                <p className="text-sm mt-1"><span className="font-medium">Focus:</span> {comp.focus}</p>
                <p className="text-sm mt-1"><span className="font-medium">Advantage:</span> {comp.advantage}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {dossier.strategy && (
        <Section title="4. Strategy & Positioning">
          <InfoRow label="Ideal Customer Profile" value={dossier.strategy.icp} />
          <InfoRow label="Positioning Statement" value={dossier.strategy.positioning_statement} />
          <InfoRow label="Differentiation Angle" value={dossier.strategy.differentiation_angle} />
          <InfoRow label="Strategic Focus" value={dossier.strategy.strategic_focus} />
          <List label="Risks" items={dossier.strategy.risks} color="red" />
          <List label="Recommended Next Steps" items={dossier.strategy.recommended_next_steps} />
        </Section>
      )}

      {dossier.vc_interview && (
        <Section title="5. VC Interview Simulation">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">VC Feedback</h4>
            <p className="text-gray-700 mb-4">{dossier.vc_interview.vc_feedback}</p>
            <InfoRow label="Investment Risk Level" value={dossier.vc_interview.investment_risk_level} />
          </div>

          <h4 className="font-semibold text-gray-900 mb-3">Q&A Simulation</h4>
          <div className="space-y-4">
            {dossier.vc_interview.questions.map((q, i) => (
              <div key={i} className="border rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-1">Q: {q.question}</p>
                <p className="text-sm text-gray-500 mb-3 italic">Why it matters: {q.why_it_matters}</p>
                <div className="bg-blue-50 p-3 rounded text-gray-800 text-sm mb-2">
                  <span className="font-semibold">Founder Answer:</span> {q.answer}
                </div>
                <p className="text-sm font-medium">Strength Score: <span className={q.strength_score >= 7 ? 'text-green-600' : 'text-yellow-600'}>{q.strength_score}/10</span></p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {dossier.funding_strategy && (
        <Section title="6. Funding Strategy">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Recommended: {dossier.funding_strategy.recommended_funding_type}
            </h3>
            <p className="text-gray-700">{dossier.funding_strategy.why}</p>
          </div>
          <InfoRow label="Estimated Capital Needed" value={dossier.funding_strategy.estimated_capital_needed} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <List label="Use of Funds" items={dossier.funding_strategy.use_of_funds} />
            <List label="Milestones for Next Round" items={dossier.funding_strategy.milestones_for_next_round} />
          </div>
        </Section>
      )}

      {dossier.scorecard && (
        <Section title="7. Final Recommendation">
          <div className={`p-6 rounded-lg mb-6 ${dossier.scorecard.recommendation.toLowerCase().includes('go') && !dossier.scorecard.recommendation.toLowerCase().includes('no')
              ? 'bg-green-50 border-2 border-green-500'
              : dossier.scorecard.recommendation.toLowerCase().includes('no')
                ? 'bg-red-50 border-2 border-red-500'
                : 'bg-yellow-50 border-2 border-yellow-500'
            }`}>
            <h3 className="text-3xl font-bold mb-2">Recommendation / Scorecard</h3>
            <p className="text-xl font-semibold mb-4">Overall Score: {dossier.scorecard.overall_score.toFixed(1)}/10</p>
            <p className="text-lg text-gray-800">{dossier.scorecard.recommendation}</p>
          </div>

          <h4 className="font-semibold text-gray-900 mb-4">Dimensions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossier.scorecard.dimensions.map((dim, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-700">{dim.label}</span>
                <span className="font-semibold">{dim.score}/{dim.max}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="mb-3">
      <span className="font-medium text-gray-700">{label}:</span>{' '}
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

function List({ label, items, color = 'blue' }) {
  const colorClass = color === 'green' ? 'text-green-700' : color === 'red' ? 'text-red-700' : 'text-gray-700'

  return (
    <div className="mb-4">
      <h4 className="font-semibold text-gray-900 mb-2">{label}</h4>
      <ul className={`list-disc list-inside space-y-1 ${colorClass}`}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
