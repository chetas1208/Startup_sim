import { StartupDossier } from '@/lib/api'
import { CompetitiveMatrix } from './CompetitiveMatrix'
import { AssumptionTracker } from './AssumptionTracker'
import { ValidationExperiments } from './ValidationExperiments'
import { TAMEstimate } from './TAMEstimate'
import { DestroyAnalysis } from './DestroyAnalysis'
import { DistributionStrategy } from './DistributionStrategy'
import { ConfidenceScore } from './ConfidenceScore'
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Truck, 
  Target, 
  Users, 
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Shield,
  Crosshair,
  TrendingDown
} from 'lucide-react'

interface DossierViewProps {
  dossier: StartupDossier
}

export default function DossierView({ dossier }: DossierViewProps) {
  if (!dossier) return null

  return (
    <div className="space-y-6">
      {/* Clarified Idea */}
      {dossier.clarified_idea && (
        <Section title="1. Clarified Idea" icon={Lightbulb}>
          <InfoRow label="Problem" value={dossier.clarified_idea.problem} />
          <InfoRow label="Solution" value={dossier.clarified_idea.solution} />
          <InfoRow label="Target Customer" value={dossier.clarified_idea.target_customer} />
          <InfoRow label="Value Proposition" value={dossier.clarified_idea.value_proposition} />
          <List label="Key Assumptions" items={dossier.clarified_idea.assumptions} />
        </Section>
      )}

      {/* Market Research */}
      {dossier.market_research && (
        <Section title="2. Market Research" icon={Target}>
          <h4 className="font-semibold text-gray-900 mb-3">Competitors</h4>
          {dossier.market_research.competitors.map((comp: any, i: number) => (
            <div key={i} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold text-gray-900">{comp.name}</h5>
              {comp.url && (
                <a
                  href={comp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:underline"
                >
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
          {dossier.market_research.segments.map((seg: any, i: number) => (
            <div key={i} className="mb-2">
              <span className="font-medium">{seg.name}</span> ({seg.size_estimate})
            </div>
          ))}

          <List label="Key Trends" items={dossier.market_research.trends} />
        </Section>
      )}

      {/* Positioning */}
      {dossier.positioning && (
        <Section title="3. Positioning & Differentiation" icon={Target}>
          <InfoRow label="Ideal Customer Profile" value={dossier.positioning.icp} />
          <InfoRow label="Positioning Statement" value={dossier.positioning.positioning_statement} />
          <List label="Differentiators" items={dossier.positioning.differentiators} />
          <InfoRow label="Unique Value" value={dossier.positioning.unique_value} />
        </Section>
      )}

      {/* MVP Plan */}
      {dossier.mvp_plan && (
        <Section title="4. MVP Plan" icon={Package}>
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
                {dossier.mvp_plan.features.map((feat: any, i: number) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-sm">{feat.name}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`badge ${
                        feat.priority === 'P0' ? 'badge-error' :
                        feat.priority === 'P1' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {feat.priority}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{feat.effort}</td>
                    <td className="px-4 py-2 text-sm">{feat.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold text-gray-900 mt-6 mb-3">4-Week Roadmap</h4>
          {dossier.mvp_plan.roadmap.map((milestone: any, i: number) => (
            <div key={i} className="mb-3">
              <div className="font-medium">Week {milestone.week}: {milestone.goal}</div>
              <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                {milestone.deliverables.map((d: string, j: number) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Landing Page */}
      {dossier.landing_page && (
        <Section title="5. Landing Page Copy" icon={TrendingUp}>
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
            {dossier.landing_page.pricing_tiers.map((tier: any, i: number) => (
              <div key={i} className="border rounded-lg p-4">
                <h5 className="font-semibold">{tier.name}</h5>
                <p className="text-2xl font-bold text-primary-600">${tier.price}/mo</p>
                <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Marketing Plan (if selected) */}
      {dossier.marketing_plan && (
        <Section title="Marketing Strategy" icon={TrendingUp}>
          <InfoRow label="Target Audience" value={dossier.marketing_plan.target_audience} />
          <List label="Marketing Channels" items={dossier.marketing_plan.channels} />
          <List label="Content Strategy" items={dossier.marketing_plan.content_strategy} />
          <InfoRow label="Budget Allocation" value={dossier.marketing_plan.budget_allocation} />
          <List label="KPIs" items={dossier.marketing_plan.kpis} />
        </Section>
      )}

      {/* Supply Chain Plan (if selected) */}
      {dossier.supply_chain_plan && (
        <Section title="Supply Chain Management" icon={Truck}>
          <List label="Suppliers" items={dossier.supply_chain_plan.suppliers} />
          <InfoRow label="Lead Time" value={dossier.supply_chain_plan.lead_time} />
          <List label="Logistics Strategy" items={dossier.supply_chain_plan.logistics} />
          <List label="Risk Mitigation" items={dossier.supply_chain_plan.risk_mitigation} />
        </Section>
      )}

      {/* Inventory Plan (if selected) */}
      {dossier.inventory_plan && (
        <Section title="Inventory Management" icon={Package}>
          <InfoRow label="Inventory Model" value={dossier.inventory_plan.model} />
          <InfoRow label="Reorder Point" value={dossier.inventory_plan.reorder_point} />
          <InfoRow label="Safety Stock" value={dossier.inventory_plan.safety_stock} />
          <List label="Tracking Methods" items={dossier.inventory_plan.tracking_methods} />
        </Section>
      )}

      {/* Investor Debate */}
      {dossier.debate && (
        <Section title="6. Investor Debate" icon={Users}>
          <List label="Bull Case" items={dossier.debate.bull_points} color="green" />
          <List label="Bear Case" items={dossier.debate.skeptic_points} color="red" />
          <InfoRow label="Synthesis" value={dossier.debate.synthesis} />
          <List label="Risk Mitigations" items={dossier.debate.mitigations} />
        </Section>
      )}

      {/* Finance */}
      {dossier.finance && (
        <Section title="7. Financial Model" icon={DollarSign}>
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

      {/* High-Impact Features */}

      {/* Competitive Matrix */}
      {dossier.competitive_matrix && (
        <Section title="Competitive Matrix" icon={Crosshair}>
          <CompetitiveMatrix matrix={dossier.competitive_matrix} />
        </Section>
      )}

      {/* Assumption Tracker */}
      {dossier.assumption_tracker && (
        <Section title="Assumption Tracker" icon={AlertTriangle}>
          <AssumptionTracker tracker={dossier.assumption_tracker} />
        </Section>
      )}

      {/* Validation Experiments */}
      {dossier.validation_experiments && dossier.validation_experiments.length > 0 && (
        <Section title="Validation Experiments" icon={Zap}>
          <ValidationExperiments experiments={dossier.validation_experiments} />
        </Section>
      )}

      {/* TAM Estimate */}
      {dossier.tam_estimate && (
        <Section title="Market Size Estimation" icon={TrendingUp}>
          <TAMEstimate estimate={dossier.tam_estimate} />
        </Section>
      )}

      {/* Destroy Analysis */}
      {dossier.destroy_analysis && (
        <Section title="Destroy This Idea" icon={Shield}>
          <DestroyAnalysis analysis={dossier.destroy_analysis} />
        </Section>
      )}

      {/* Distribution Strategy */}
      {dossier.distribution_strategy && (
        <Section title="Distribution Strategy" icon={TrendingDown}>
          <DistributionStrategy strategy={dossier.distribution_strategy} />
        </Section>
      )}

      {/* Confidence Score */}
      {dossier.confidence_score && (
        <Section title="Analysis Confidence" icon={CheckCircle2}>
          <ConfidenceScore score={dossier.confidence_score} />
        </Section>
      )}

      {/* Final Report */}
      {dossier.final_report && (
        <Section title="8. Final Recommendation" icon={CheckCircle2}>
          <div
            className={`p-6 rounded-lg mb-4 ${
              dossier.final_report.recommendation === 'GO'
                ? 'bg-green-50 border-2 border-green-500'
                : dossier.final_report.recommendation === 'NO_GO'
                ? 'bg-red-50 border-2 border-red-500'
                : 'bg-yellow-50 border-2 border-yellow-500'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              {dossier.final_report.recommendation === 'GO' ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : dossier.final_report.recommendation === 'NO_GO' ? (
                <XCircle className="w-8 h-8 text-red-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              )}
              <h3 className="text-3xl font-bold">{dossier.final_report.recommendation}</h3>
            </div>
            <p className="text-lg">
              Overall Score: {dossier.final_report.scorecard.overall_score.toFixed(1)}/10
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <InfoRow
              label="Market Opportunity"
              value={`${dossier.final_report.scorecard.market_opportunity}/10`}
            />
            <InfoRow
              label="Competitive Advantage"
              value={`${dossier.final_report.scorecard.competitive_advantage}/10`}
            />
            <InfoRow
              label="Execution Feasibility"
              value={`${dossier.final_report.scorecard.execution_feasibility}/10`}
            />
            <InfoRow
              label="Financial Viability"
              value={`${dossier.final_report.scorecard.financial_viability}/10`}
            />
          </div>

          <InfoRow label="Reasoning" value={dossier.final_report.scorecard.reasoning} />
          <List label="Key Insights" items={dossier.final_report.key_insights} />

          <h4 className="font-semibold text-gray-900 mt-6 mb-3">Next Experiments</h4>
          {dossier.final_report.next_experiments.map((exp: any, i: number) => (
            <div key={i} className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-semibold">{exp.hypothesis}</h5>
              <p className="text-sm mt-1">
                <span className="font-medium">Test:</span> {exp.test}
              </p>
              <p className="text-sm">
                <span className="font-medium">Success:</span> {exp.success_criteria}
              </p>
              <p className="text-sm">
                <span className="font-medium">Timeline:</span> {exp.timeline}
              </p>
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: any
  children: React.ReactNode
}) {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="w-6 h-6 text-primary-600" />
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <span className="font-medium text-gray-700">{label}:</span>{' '}
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

function List({
  label,
  items,
  color = 'blue',
}: {
  label: string
  items: string[]
  color?: 'blue' | 'green' | 'red'
}) {
  const colorClass =
    color === 'green'
      ? 'text-green-700'
      : color === 'red'
      ? 'text-red-700'
      : 'text-gray-700'

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
