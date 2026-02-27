'use client'

import { useState, useEffect } from 'react'
import { listRuns } from '@/lib/api'
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Activity,
  Zap
} from 'lucide-react'

export default function DashboardPage() {
  const [runs, setRuns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRuns = async () => {
      try {
        const data = await listRuns(50)
        setRuns(data.runs || [])
      } catch (error) {
        console.error('Error loading runs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRuns()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const completedRuns = runs.filter(r => r.status === 'completed')
  const goCount = completedRuns.filter(r => r.final_report?.recommendation === 'GO').length
  const noGoCount = completedRuns.filter(r => r.final_report?.recommendation === 'NO_GO').length
  const pivotCount = completedRuns.filter(r => r.final_report?.recommendation === 'PIVOT').length

  const avgScore = completedRuns.length > 0
    ? completedRuns.reduce((sum, r) => sum + (r.final_report?.scorecard?.overall_score || 0), 0) / completedRuns.length
    : 0

  const functionUsage = runs.reduce((acc: any, run) => {
    if (run.selected_functions) {
      run.selected_functions.forEach((func: string) => {
        acc[func] = (acc[func] || 0) + 1
      })
    }
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center space-x-3 mb-12 animate-fadeInUp">
          <div className="p-3 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="section-title">Analytics Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Track your simulation performance</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Simulations"
            value={runs.length}
            icon={Activity}
            color="from-blue-500 to-cyan-500"
            lightColor="from-blue-100 to-cyan-100"
          />
          <StatCard
            label="Completed"
            value={completedRuns.length}
            icon={CheckCircle2}
            color="from-green-500 to-emerald-500"
            lightColor="from-green-100 to-emerald-100"
          />
          <StatCard
            label="Average Score"
            value={avgScore.toFixed(1)}
            icon={TrendingUp}
            color="from-purple-500 to-pink-500"
            lightColor="from-purple-100 to-pink-100"
          />
          <StatCard
            label="Success Rate"
            value={completedRuns.length > 0 ? `${Math.round((goCount / completedRuns.length) * 100)}%` : '0%'}
            icon={Zap}
            color="from-orange-500 to-red-500"
            lightColor="from-orange-100 to-red-100"
          />
        </div>

        {/* Recommendations Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">GO</h3>
              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{goCount}</p>
            <p className="text-sm text-gray-500">
              {completedRuns.length > 0 ? Math.round((goCount / completedRuns.length) * 100) : 0}% of completed
            </p>
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                style={{ width: `${completedRuns.length > 0 ? (goCount / completedRuns.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">PIVOT</h3>
              <div className="p-2 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-yellow-600 mb-2">{pivotCount}</p>
            <p className="text-sm text-gray-500">
              {completedRuns.length > 0 ? Math.round((pivotCount / completedRuns.length) * 100) : 0}% of completed
            </p>
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-amber-600"
                style={{ width: `${completedRuns.length > 0 ? (pivotCount / completedRuns.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">NO GO</h3>
              <div className="p-2 bg-gradient-to-br from-red-100 to-rose-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-red-600 mb-2">{noGoCount}</p>
            <p className="text-sm text-gray-500">
              {completedRuns.length > 0 ? Math.round((noGoCount / completedRuns.length) * 100) : 0}% of completed
            </p>
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-rose-600"
                style={{ width: `${completedRuns.length > 0 ? (noGoCount / completedRuns.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Function Usage */}
        <div className="card mb-8 hover-lift">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary-600" />
            <span>Business Function Usage</span>
          </h3>
          <div className="space-y-4">
            {Object.entries(functionUsage).map(([func, count]: [string, any]) => (
              <div key={func}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-900 capitalize">{func.replace('_', ' ')}</span>
                  <span className="text-gray-600 font-medium">{count} runs</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(count / runs.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card hover-lift">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary-600" />
            <span>Recent Activity</span>
          </h3>
          <div className="space-y-3">
            {runs.slice(0, 5).map((run, i) => (
              <div key={run.run_id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-2 rounded transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-md">
                    {run.raw_idea}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(run.created_at).toLocaleString()}
                  </p>
                </div>
                <span className={`badge ml-4 flex-shrink-0 ${
                  run.status === 'completed' ? 'badge-success' :
                  run.status === 'running' ? 'badge-info' :
                  run.status === 'failed' ? 'badge-error' : 'badge-warning'
                }`}>
                  {run.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color,
  lightColor
}: { 
  label: string
  value: string | number
  icon: any
  color: string
  lightColor: string
}) {
  return (
    <div className="card hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-600">{label}</h3>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lightColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 bg-gradient-to-br ${color} bg-clip-text text-transparent`} />
        </div>
      </div>
      <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: '60%' }} />
      </div>
    </div>
  )
}
