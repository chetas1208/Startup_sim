'use client';

import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { CitationCard } from '@/components/ui/CitationCard';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Zap, Play, Settings } from 'lucide-react';

export default function ExampleDashboardPage() {
    const steps = ['Idea Input', 'Market Analysis', 'Financial Model', 'Final Report'];

    return (
        <div className="min-h-screen p-8 bg-bg text-text-primary transition-colors">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold mb-2 tracking-tight">Startup Simulator</h1>
                        <p className="text-text-secondary">AI-powered business planning and validation</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <SecondaryButton size="icon">
                            <Settings className="w-4 h-4" />
                        </SecondaryButton>
                    </div>
                </div>

                {/* Step Progress Panel */}
                <Card className="p-8">
                    <SectionHeader
                        title="Simulation Progress"
                        description="Track the AI agents as they analyze your business model"
                    />
                    <div className="py-4">
                        <StepIndicator steps={steps} currentStep={2} />
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Main Column */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Idea Input Card */}
                        <Card>
                            <SectionHeader
                                title="Your Idea"
                                description="Describe the core concept of your startup"
                            />
                            <div className="space-y-4">
                                <textarea
                                    className="w-full h-32 p-4 rounded-xl bg-muted border border-border text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-none transition-all"
                                    placeholder="e.g. A marketplace for local home cooks to sell meals to busy professionals..."
                                    defaultValue="B2B SaaS platform for construction project management, integrating AI-driven supply chain forecasting."
                                />
                                <div className="flex justify-end gap-3">
                                    <SecondaryButton>Save Draft</SecondaryButton>
                                    <PrimaryButton className="gap-2">
                                        <Play className="w-4 h-4 fill-current" /> Run Simulation
                                    </PrimaryButton>
                                </div>
                            </div>
                        </Card>

                        {/* Results Card */}
                        <Card>
                            <div className="flex items-center justify-between mb-6">
                                <SectionHeader
                                    title="Analysis Results"
                                    description="Key findings from the market research agents"
                                    className="mb-0"
                                />
                                <StatusBadge status="warning" label="In Progress" />
                            </div>

                            <div className="space-y-6">
                                <div className="prose prose-sm dark:prose-invert">
                                    <p>
                                        Initial analysis shows strong demand in the mid-market construction sector. Current solutions are often fragmented and rely heavily on manual data entry.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <CitationCard
                                        title="Market Size Report 2024"
                                        source="Construction Tech Trends"
                                        snippet="SaaS adoption in construction grew by 24% year-over-year..."
                                        url="#"
                                    />
                                    <CitationCard
                                        title="Competitor Analysis"
                                        source="Internal AI Agent"
                                        snippet="Procore dominates enterprise, but mid-market is underserved."
                                    />
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold mb-3">API Integration Plan</h4>
                                    <CodeBlock
                                        language="typescript"
                                        code={`async function fetchSupplyChainData(projectId: string) {
  const response = await api.get(\`/projects/\${projectId}/supply-chain\`);
  return validatePredictionModel(response.data);
}`}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Table Example */}
                        <Card>
                            <SectionHeader title="Financial Projections" />
                            <div className="overflow-x-auto border border-border rounded-xl">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-text-secondary font-semibold uppercase tracking-wider text-xs">
                                        <tr>
                                            <th className="px-6 py-3 border-b border-border">Quarter</th>
                                            <th className="px-6 py-3 border-b border-border">Revenue</th>
                                            <th className="px-6 py-3 border-b border-border">Costs</th>
                                            <th className="px-6 py-3 border-b border-border">Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <tr className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-text-primary">Q1 2025</td>
                                            <td className="px-6 py-4 text-text-secondary">$125,000</td>
                                            <td className="px-6 py-4 text-text-secondary">$85,000</td>
                                            <td className="px-6 py-4 text-success">32%</td>
                                        </tr>
                                        <tr className="even:bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-text-primary">Q2 2025</td>
                                            <td className="px-6 py-4 text-text-secondary">$180,000</td>
                                            <td className="px-6 py-4 text-text-secondary">$95,000</td>
                                            <td className="px-6 py-4 text-success">47%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8">

                        {/* Scorecard Section */}
                        <Card className="bg-muted border-none">
                            <SectionHeader
                                title="Health Score"
                                description="Overall viability rating"
                            />

                            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl border border-border shadow-sm dark:shadow-none mb-6">
                                <div className="text-5xl font-bold text-accent mb-2">78</div>
                                <div className="text-sm text-text-secondary mb-4">Out of 100 points</div>
                                <StatusBadge status="warning" label="PIVOT RECOMMENDED" className="text-sm px-4 py-2" />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-text-primary font-medium">Market Fit</span>
                                        <span className="text-text-secondary">85 / 100</span>
                                    </div>
                                    <div className="h-2 w-full bg-card rounded-full overflow-hidden border border-border">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-text-primary font-medium">Competition</span>
                                        <span className="text-text-secondary">42 / 100</span>
                                    </div>
                                    <div className="h-2 w-full bg-card rounded-full overflow-hidden border border-border">
                                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '42%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-text-primary font-medium">Financials</span>
                                        <span className="text-text-secondary">70 / 100</span>
                                    </div>
                                    <div className="h-2 w-full bg-card rounded-full overflow-hidden border border-border">
                                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <SecondaryButton className="w-full justify-start text-left font-normal bg-transparent shadow-none hover:bg-muted">
                                    <Zap className="w-4 h-4 mr-2 text-accent" /> Iterate on Idea
                                </SecondaryButton>
                                <SecondaryButton className="w-full justify-start text-left font-normal bg-transparent shadow-none hover:bg-muted">
                                    View Full Report
                                </SecondaryButton>
                            </div>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
