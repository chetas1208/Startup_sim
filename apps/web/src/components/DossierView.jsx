export default function DossierView({ dossier }) {
  if (!dossier) return null

  return (
    <div className="space-y-6">
      {dossier.clarified_idea && (
        <Section title="1. Clarified Idea">
          <InfoRow label="Problem" value={dossier.clarified_idea.problem} />
          <InfoRow label="Solution" value={dossier.clarified_idea.solution} />
          <InfoRow label="Target Customer" value={dossier.clarified_idea.target_customer} />
          <InfoRow label="Value Proposition" value={dossier.clarified_idea.value_proposition} />
          <List label="Key Assumptions" items={dossier.clarified_idea.assumptions} />
        </Section>
      )}

      {dossier.market_research && (
        <Section title="2. Market Research">
          <h4 className="font-semibold text-gray-900 mb-3">Competitors</h4>
          {dossier.market_research.competitors.map((comp, i) => (
            <div key={i} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold text-gray-900">{comp.name}</h5>
              {comp.url && (
                <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {comp.url}
                </a>
              )}
              <p className="text-sm text-gray-700 mt-2">{comp.description}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Strengths:</span> {comp.strengths.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Weaknesses:</span> {comp.weaknesses.join(', ')}
                </div>
              </div>
              {comp.pricing && (
                <p className="text-sm text-gray-600 mt-1">Pricing: {comp.pricing}</p>
              )}
            </div>
          ))}
          
          <h4 className="font-semibold text-gray-900 mt-6 mb-3">Market Segments</h4>
          {dossier.market_research.segments.map((seg, i) => (
            <div key={i} className="mb-2">
              <span className="font-medium">{seg.name}</span> ({seg.size_estimate})
            </div>
          ))}
          
          <List label="Key Trends" items={dossier.market_research.trends} />
        </Section>
      )}

      {dossier.positioning && (
        <Section title="3. Positioning & Differentiation">
          <InfoRow label="Ideal Customer Profile" value={dossier.positioning.icp} />
          <InfoRow label="Positioning Statement" value={dossier.positioning.positioning_statement} />
          <List label="Differentiators" items={dossier.positioning.differentiators} />
          <InfoRow label="Unique Value" value={dossier.positioning.unique_value} />
        </Section>
      )}

      {dossier.mvp_plan && (
        <Section title="4. MVP Plan">
          <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Feature</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Priority</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Effort</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dossier.mvp_plan.features.map((feat, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-sm">{feat.name}</td>
                    <td className="px-4 py-2 text-sm">{feat.priority}</td>
                    <td className="px-4 py-2 text-sm">{feat.effort}</td>
                    <td className="px-4 py-2 text-sm">{feat.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <h4 className="font-semibold text-gray-900 mt-6 mb-3">4-Week Roadmap</h4>
          {dossier.mvp_plan.roadmap.map((milestone, i) => (
            <div key={i} className="mb-3">
              <div className="font-medium">Week {milestone.week}: {milestone.goal}</div>
              <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                {milestone.deliverables.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {dossier.landing_page && (
        <Section title="5. Landing Page Copy">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {dossier.landing_page.headline}
            </h3>
            <p className="text-lg text-gray-700">{dossier.landing_page.subheadline}</p>
          </div>
          <List label="Value Propositions" items={dossier.landing_page.value_props} />
          <InfoRow label="Call-to-Action" value={dossier.landing_page.cta} />
          
          <h4 className="font-semibold text-gray-900 mt-4 mb-3">Pricing Tiers</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dossier.landing_page.pricing_tiers.map((tier, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h5 className="font-semibold">{tier.name}</h5>
                <p className="text-2xl font-bold text-blue-600">${tier.price}/mo</p>
                <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {dossier.debate && (
        <Section title="6. Investor Debate">
          <List label="Bull Case" items={dossier.debate.bull_points} color="green" />
          <List label="Bear Case" items={dossier.debate.skeptic_points} color="red" />
          <InfoRow label="Synthesis" value={dossier.debate.synthesis} />
          <List label="Risk Mitigations" items={dossier.debate.mitigations} />
        </Section>
      )}

      {dossier.finance && (
        <Section title="7. Financial Model">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Inputs</h4>
              <InfoRow label="CAC" value={`$${dossier.finance.inputs.cac}`} />
              <InfoRow label="LTV" value={`$${dossier.finance.inputs.ltv}`} />
              <InfoRow label="Monthly Churn" value={`${(dossier.finance.inputs.monthly_churn * 100).toFixed(1)}%`} />
              <InfoRow label="Pricing" value={`$${dossier.finance.inputs.pricing}/mo`} />
              <InfoRow label="Unit Cost" value={`$${dossier.finance.inputs.unit_cost}/mo`} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Outputs</h4>
              <InfoRow label="LTV/CAC Ratio" value={`${dossier.finance.outputs.ltv_cac_ratio.toFixed(2)}x`} />
              <InfoRow label="Payback Period" value={`${dossier.finance.outputs.payback_months.toFixed(1)} months`} />
              <InfoRow label="Gross Margin" value={`${(dossier.finance.outputs.gross_margin * 100).toFixed(1)}%`} />
              <InfoRow label="Break-even" value={`${dossier.finance.outputs.break_even_customers} customers`} />
            </div>
          </div>
          <List label="Assumptions" items={dossier.finance.assumptions} />
        </Section>
      )}

      {dossier.final_report && (
        <Section title="8. Final Recommendation">
          <div className={`p-6 rounded-lg mb-4 ${
            dossier.final_report.recommendation === 'GO' ? 'bg-green-50 border-2 border-green-500' :
            dossier.final_report.recommendation === 'NO_GO' ? 'bg-red-50 border-2 border-red-500' :
            'bg-yellow-50 border-2 border-yellow-500'
          }`}>
            <h3 className="text-3xl font-bold mb-2">
              {dossier.final_report.recommendation}
            </h3>
            <p className="text-lg">Overall Score: {dossier.final_report.scorecard.overall_score.toFixed(1)}/10</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InfoRow label="Market Opportunity" value={`${dossier.final_report.scorecard.market_opportunity}/10`} />
            <InfoRow label="Competitive Advantage" value={`${dossier.final_report.scorecard.competitive_advantage}/10`} />
            <InfoRow label="Execution Feasibility" value={`${dossier.final_report.scorecard.execution_feasibility}/10`} />
            <InfoRow label="Financial Viability" value={`${dossier.final_report.scorecard.financial_viability}/10`} />
          </div>
          
          <InfoRow label="Reasoning" value={dossier.final_report.scorecard.reasoning} />
          <List label="Key Insights" items={dossier.final_report.key_insights} />
          
          <h4 className="font-semibold text-gray-900 mt-6 mb-3">Next Experiments</h4>
          {dossier.final_report.next_experiments.map((exp, i) => (
            <div key={i} className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-semibold">{exp.hypothesis}</h5>
              <p className="text-sm mt-1"><span className="font-medium">Test:</span> {exp.test}</p>
              <p className="text-sm"><span className="font-medium">Success:</span> {exp.success_criteria}</p>
              <p className="text-sm"><span className="font-medium">Timeline:</span> {exp.timeline}</p>
            </div>
          ))}
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
