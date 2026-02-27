'use client'

export default function TestThemePage() {
  return (
    <div className="container-max py-12 space-y-8">
      <div className="card">
        <h1 className="mb-4">Theme Test Page</h1>
        <p className="text-secondary mb-6">
          Testing the design system with proper CSS variables and Tailwind integration.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2">Buttons</h3>
            <div className="flex gap-3">
              <button className="btn-primary-md">Primary Button</button>
              <button className="btn-secondary-md">Secondary Button</button>
              <button className="btn-ghost-md">Ghost Button</button>
            </div>
          </div>

          <div>
            <h3 className="mb-2">Badges</h3>
            <div className="flex gap-2">
              <span className="badge-success">Success</span>
              <span className="badge-warning">Warning</span>
              <span className="badge-danger">Danger</span>
              <span className="badge-neutral">Neutral</span>
              <span className="badge-accent">Accent</span>
            </div>
          </div>

          <div>
            <h3 className="mb-2">Status Badges</h3>
            <div className="flex gap-2">
              <span className="status-go">GO</span>
              <span className="status-no-go">NO-GO</span>
              <span className="status-pivot">PIVOT</span>
            </div>
          </div>

          <div>
            <h3 className="mb-2">Input</h3>
            <input
              type="text"
              className="input"
              placeholder="Enter some text..."
            />
          </div>

          <div>
            <h3 className="mb-2">Colors</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgb(var(--bg))' }}>
                Background
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgb(var(--bg-card))' }}>
                Card
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgb(var(--bg-muted))' }}>
                Muted
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgb(var(--accent))', color: 'white' }}>
                Accent
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgb(var(--success))', color: 'white' }}>
                Success
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgb(var(--danger))', color: 'white' }}>
                Danger
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-hover">
        <h2 className="mb-2">Hover Card</h2>
        <p className="text-secondary">This card has hover effects</p>
      </div>

      <div className="scorecard">
        <div className="scorecard-item">
          <span className="scorecard-label">Market Score</span>
          <span className="scorecard-value">8.5</span>
        </div>
        <div className="scorecard-item">
          <span className="scorecard-label">Team Score</span>
          <span className="scorecard-value">7.2</span>
        </div>
      </div>
    </div>
  )
}
