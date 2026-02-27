'use client'

import React from 'react'
import { CheckCircle2, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react'

/**
 * ThemeShowcase Component
 * Demonstrates all styled components and the color system
 */

export function ThemeShowcase() {
  return (
    <div className="container-max py-12 space-y-section">
      {/* Header */}
      <div className="space-y-2">
        <h1>Design System Showcase</h1>
        <p className="text-text-secondary">
          Complete color system and component library for Startup Simulator
        </p>
      </div>

      {/* Color Palette */}
      <section className="space-y-4">
        <div className="section-header">
          <h2>Color Palette</h2>
          <p>Neutral base with deep indigo accent</p>
        </div>

        <div className="grid grid-cols-2-auto">
          {/* Light Mode Colors */}
          <div className="card">
            <h3 className="font-semibold mb-4">Light Mode</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-bg border border-border" />
                <div>
                  <p className="text-sm font-medium">Background</p>
                  <p className="text-xs text-text-secondary">#f4f4f5</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-bg-card border border-border" />
                <div>
                  <p className="text-sm font-medium">Card</p>
                  <p className="text-xs text-text-secondary">#ffffff</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent" />
                <div>
                  <p className="text-sm font-medium text-white">Accent</p>
                  <p className="text-xs text-text-secondary">#4f46e5</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-success" />
                <div>
                  <p className="text-sm font-medium text-white">Success</p>
                  <p className="text-xs text-text-secondary">#059669</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dark Mode Colors */}
          <div className="card dark">
            <h3 className="font-semibold mb-4">Dark Mode</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-bg border border-border" />
                <div>
                  <p className="text-sm font-medium">Background</p>
                  <p className="text-xs text-text-secondary">#09090b</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-bg-card border border-border" />
                <div>
                  <p className="text-sm font-medium">Card</p>
                  <p className="text-xs text-text-secondary">#18181b</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent" />
                <div>
                  <p className="text-sm font-medium text-white">Accent</p>
                  <p className="text-xs text-text-secondary">#6366f1</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-success" />
                <div>
                  <p className="text-sm font-medium text-white">Success</p>
                  <p className="text-xs text-text-secondary">#10b981</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <div className="section-header">
          <h2>Buttons</h2>
          <p>Primary, secondary, and ghost variants</p>
        </div>

        <div className="card space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-text-secondary">Primary Buttons</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary-lg">Large Button</button>
              <button className="btn-primary-md">Medium Button</button>
              <button className="btn-primary-sm">Small Button</button>
              <button className="btn-primary-md" disabled>
                Disabled
              </button>
            </div>
          </div>

          <div className="divider" />

          <div className="space-y-3">
            <p className="text-sm font-medium text-text-secondary">Secondary Buttons</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary-lg">Large Button</button>
              <button className="btn-secondary-md">Medium Button</button>
              <button className="btn-secondary-sm">Small Button</button>
            </div>
          </div>

          <div className="divider" />

          <div className="space-y-3">
            <p className="text-sm font-medium text-text-secondary">Ghost Buttons</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-ghost-md">Ghost Button</button>
              <button className="btn-ghost-sm">Small Ghost</button>
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <div className="section-header">
          <h2>Badges & Status</h2>
          <p>Semantic status indicators</p>
        </div>

        <div className="card space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-text-secondary">Status Badges</p>
            <div className="flex flex-wrap gap-3">
              <span className="status-go">GO</span>
              <span className="status-no-go">NO-GO</span>
              <span className="status-pivot">PIVOT</span>
            </div>
          </div>

          <div className="divider" />

          <div className="space-y-3">
            <p className="text-sm font-medium text-text-secondary">Semantic Badges</p>
            <div className="flex flex-wrap gap-3">
              <span className="badge-success">Success</span>
              <span className="badge-warning">Warning</span>
              <span className="badge-danger">Danger</span>
              <span className="badge-neutral">Neutral</span>
              <span className="badge-accent">Accent</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <div className="section-header">
          <h2>Cards</h2>
          <p>Card variants and layouts</p>
        </div>

        <div className="grid-cols-2-auto">
          <div className="card">
            <h3 className="font-semibold mb-2">Standard Card</h3>
            <p className="text-text-secondary text-sm">
              This is a standard card with border and subtle shadow in light mode.
            </p>
          </div>

          <div className="card-hover">
            <h3 className="font-semibold mb-2">Hover Card</h3>
            <p className="text-text-secondary text-sm">
              This card has hover effects and is interactive.
            </p>
          </div>

          <div className="card-interactive">
            <h3 className="font-semibold mb-2">Interactive Card</h3>
            <p className="text-text-secondary text-sm">
              This card responds to hover with background change.
            </p>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Success Card</h3>
                <p className="text-text-secondary text-sm">
                  Card with success icon and styling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <div className="section-header">
          <h2>Form Inputs</h2>
          <p>Text inputs and textareas</p>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Text Input</label>
            <input className="input" placeholder="Enter text..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Large Input</label>
            <input className="input input-lg" placeholder="Large input..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Textarea</label>
            <textarea className="textarea" placeholder="Enter multiple lines..." rows={4} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Disabled Input</label>
            <input className="input" placeholder="Disabled..." disabled />
          </div>
        </div>
      </section>

      {/* Tables */}
      <section className="space-y-4">
        <div className="section-header">
          <h2>Tables</h2>
          <p>Zebra striping and hover effects</p>
        </div>

        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th>Feature</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row">
                <td className="table-cell">Market Research</td>
                <td className="table-cell">
                  <span className="badge-success">Complete</span>
                </td>
                <td className="table-cell">8.5/10</td>
              </tr>
              <tr className="table-row">
                <td className="table-cell">Competitive Analysis</td>
                <td className="table-cell">
                  <span className="badge-warning">In Progress</span>
                </td>
                <td className="table-cell">7.2/10</td>
              </tr>
              <tr className="table-row">
                <td className="table-cell">Financial Model</td>
                <td className="table-cell">
                  <span className="badge-neutral">Pending</span>
                </td>
                <td className="table-cell">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Scorecard */}
      <section className="space-y-4">
        <div className="section-header">
          <h2>Scorecard</h2>
          <p>Recommendation and scoring display</p>
        </div>

        <div className="grid-cols-2-auto">
          <div className="scorecard">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Recommendation</h3>
              <span className="status-go">GO</span>
            </div>

            <div className="scorecard-item">
              <span className="scorecard-label">Market Opportunity</span>
              <span className="scorecard-value">8.5</span>
            </div>

            <div className="scorecard-item">
              <span className="scorecard-label">Competitive Advantage</span>
              <span className="scorecard-value">7.8</span>
            </div>

            <div className="scorecard-item">
              <span className="scorecard-label">Execution Feasibility</span>
              <span className="scorecard-value">8.2</span>
            </div>

            <div className="scorecard-item">
              <span className="scorecard-label">Financial Viability</span>
              <span className="scorecard-value">7.5</span>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">Overall Score</span>
                <span className="text-3xl font-bold text-accent">8.0</span>
              </div>
            </div>
          </div>

          <div className="scorecard">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Progress</h3>
              <span className="badge-accent">75%</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Clarification</span>
                  <span className="text-xs text-text-secondary">100%</span>
                </div>
                <div className="scorecard-bar">
                  <div className="scorecard-bar-fill" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Market Research</span>
                  <span className="text-xs text-text-secondary">100%</span>
                </div>
                <div className="scorecard-bar">
                  <div className="scorecard-bar-fill" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Analysis</span>
                  <span className="text-xs text-text-secondary">50%</span>
                </div>
                <div className="scorecard-bar">
                  <div className="scorecard-bar-fill" style={{ width: '50%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Recommendations</span>
                  <span className="text-xs text-text-secondary">0%</span>
                </div>
                <div className="scorecard-bar">
                  <div className="scorecard-bar-fill" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <div className="section-header">
          <h2>Typography</h2>
          <p>Heading and text hierarchy</p>
        </div>

        <div className="card space-y-6">
          <div>
            <h1>Heading 1 - 3xl semibold</h1>
            <p className="text-text-secondary text-sm">Used for page titles</p>
          </div>

          <div className="divider" />

          <div>
            <h2>Heading 2 - xl semibold</h2>
            <p className="text-text-secondary text-sm">Used for section titles</p>
          </div>

          <div className="divider" />

          <div>
            <h3>Heading 3 - lg semibold</h3>
            <p className="text-text-secondary text-sm">Used for subsections</p>
          </div>

          <div className="divider" />

          <div>
            <p>Body text - base leading-relaxed</p>
            <p className="text-text-secondary text-sm">Secondary text - sm text-secondary</p>
          </div>
        </div>
      </section>

      {/* Icons with Colors */}
      <section className="space-y-4">
        <div className="section-header">
          <h2>Icons & Indicators</h2>
          <p>Semantic icon usage</p>
        </div>

        <div className="grid-cols-auto">
          <div className="card flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
            <div>
              <p className="font-medium">Success</p>
              <p className="text-xs text-text-secondary">Positive outcome</p>
            </div>
          </div>

          <div className="card flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-warning flex-shrink-0" />
            <div>
              <p className="font-medium">Warning</p>
              <p className="text-xs text-text-secondary">Needs attention</p>
            </div>
          </div>

          <div className="card flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-danger flex-shrink-0" />
            <div>
              <p className="font-medium">Danger</p>
              <p className="text-xs text-text-secondary">Critical issue</p>
            </div>
          </div>

          <div className="card flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-accent flex-shrink-0" />
            <div>
              <p className="font-medium">Accent</p>
              <p className="text-xs text-text-secondary">Primary action</p>
            </div>
          </div>

          <div className="card flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-text-secondary flex-shrink-0" />
            <div>
              <p className="font-medium">Secondary</p>
              <p className="text-xs text-text-secondary">Neutral element</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
