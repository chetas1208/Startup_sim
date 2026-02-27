import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRun, streamEvents, downloadMarkdown, downloadPDF } from '../api'
import ProgressTracker from '../components/ProgressTracker'
import DossierView from '../components/DossierView'

export default function RunPage() {
  const { runId } = useParams()
  const [dossier, setDossier] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let eventSource = null

    const loadRun = async () => {
      try {
        const data = await getRun(runId)
        setDossier(data)
        setLoading(false)

        // If still running, stream updates
        if (data.status === 'running' || data.status === 'pending') {
          eventSource = streamEvents(
            runId,
            (event, data) => {
              setDossier(data)
            },
            (error) => {
              console.error('Stream error:', error)
            }
          )
        }
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    loadRun()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [runId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading simulation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    )
  }

  const isComplete = dossier?.status === 'completed'
  const isFailed = dossier?.status === 'failed'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Simulation: {dossier?.raw_idea}
        </h2>
        <p className="text-sm text-gray-500">Run ID: {runId}</p>
      </div>

      <ProgressTracker dossier={dossier} />

      {isFailed && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">Simulation Failed</p>
          <p className="text-red-700 text-sm mt-1">{dossier.error}</p>
        </div>
      )}

      {isComplete && (
        <div className="mt-6 flex gap-4">
          <a
            href={downloadMarkdown(runId)}
            download
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download Markdown
          </a>
          <a
            href={downloadPDF(runId)}
            download
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Download PDF
          </a>
        </div>
      )}

      <div className="mt-8">
        <DossierView dossier={dossier} />
      </div>
    </div>
  )
}
