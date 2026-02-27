import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const createRun = async (idea) => {
  const response = await api.post('/api/runs', { idea })
  return response.data
}

export const getRun = async (runId) => {
  const response = await api.get(`/api/runs/${runId}`)
  return response.data
}

export const listRuns = async (limit = 20) => {
  const response = await api.get('/api/runs', { params: { limit } })
  return response.data
}

export const downloadMarkdown = (runId) => {
  return `${API_URL}/api/runs/${runId}/artifact/report.md`
}

export const downloadPDF = (runId) => {
  return `${API_URL}/api/runs/${runId}/artifact/report.pdf`
}

export const streamEvents = (runId, onEvent, onError) => {
  const eventSource = new EventSource(`${API_URL}/api/runs/${runId}/events`)
  
  eventSource.addEventListener('update', (e) => {
    const data = JSON.parse(e.data)
    onEvent('update', data)
  })
  
  eventSource.addEventListener('complete', (e) => {
    const data = JSON.parse(e.data)
    onEvent('complete', data)
    eventSource.close()
  })
  
  eventSource.addEventListener('error', (e) => {
    onError(e)
    eventSource.close()
  })
  
  return eventSource
}
