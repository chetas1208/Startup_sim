import { mockData } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const USE_MOCK = true;

export async function submitQuery(query) {
  if (USE_MOCK) {
    return { run_id: 'mock-run-001', status: 'processing' };
  }
  const res = await fetch(`${API_URL}/api/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

export async function getResults(runId) {
  if (USE_MOCK) {
    return mockData;
  }
  const res = await fetch(`${API_URL}/api/research/${runId}`);
  return res.json();
}

export async function getResearchStatus(runId) {
  if (USE_MOCK) {
    return { status: 'complete' };
  }
  const res = await fetch(`${API_URL}/api/research/${runId}/status`);
  return res.json();
}

export const PROGRESS_STEPS = [
  { id: 1, icon: '🔍', text: 'Deploying research agents across the web...', source: 'Yutori' },
  { id: 2, icon: '📡', text: 'Searching for market data and trends...', source: 'Tavily' },
  { id: 3, icon: '🏢', text: 'Found 14 companies in this space...', source: null },
  { id: 4, icon: '🧠', text: 'Extracting structured intelligence...', source: 'Fastino GLiNER2' },
  { id: 5, icon: '🔗', text: 'Building competitive knowledge graph...', source: 'Neo4j' },
  { id: 6, icon: '📊', text: 'Analyzing market size and funding patterns...', source: null },
  { id: 7, icon: '🎤', text: 'Preparing voice briefing...', source: 'Modulate' },
  { id: 8, icon: '✅', text: 'Your market landscape is ready.', source: null },
];
