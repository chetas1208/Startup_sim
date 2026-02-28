'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import IdeaInputCard from '@/components/IdeaInputCard';
import StepperCard from '@/components/StepperCard';
import ResultsPanel from '@/components/ResultsPanel';
import { INITIAL_STEPS } from '@/lib/mock-data';
import type { PipelineStep, StepStatus } from '@/lib/mock-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Map backend AgentStep to frontend step keys
const STEP_KEY_MAP: Record<string, string> = {
  clarifier: 'clarify',
  market_search: 'market',
  deep_extract: 'extract',
  normalize: 'normalize',
  market_synthesis: 'synthesize',
  competitive_analysis: 'compete',
  vc_interview: 'interview',
  funding_strategy: 'funding',
};

export default function HomePage() {
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_STEPS.map(s => ({ ...s })));
  const [isRunning, setIsRunning] = useState(false);
  const [dossier, setDossier] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cleanup SSE on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const updateStepsFromDossier = useCallback((data: any) => {
    const currentStepKey = data.current_step ? STEP_KEY_MAP[data.current_step] : null;
    const isDone = data.status === 'done';
    const isError = data.status === 'error';

    setSteps(prev => {
      let passedCurrent = false;
      return prev.map(step => {
        if (isDone) return { ...step, status: 'done' as StepStatus };
        if (isError && step.key === currentStepKey) return { ...step, status: 'error' as StepStatus };

        if (step.key === currentStepKey) {
          passedCurrent = true;
          return { ...step, status: 'running' as StepStatus };
        }
        if (!passedCurrent) return { ...step, status: 'done' as StepStatus };
        return { ...step, status: 'queued' as StepStatus };
      });
    });
  }, []);

  const runPipeline = useCallback(async (idea: string) => {
    setIsRunning(true);
    setDossier(null);
    setError(null);
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'queued' as StepStatus })));

    try {
      // 1. Create run
      const resp = await fetch(`${API_URL}/api/runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_text: idea }),
      });

      if (!resp.ok) throw new Error(`API error: ${resp.status}`);
      const { run_id } = await resp.json();

      // 2. Stream SSE events
      const es = new EventSource(`${API_URL}/api/runs/${run_id}/events`);
      eventSourceRef.current = es;

      es.addEventListener('update', (e) => {
        const data = JSON.parse(e.data);
        updateStepsFromDossier(data);
        setDossier(data);
      });

      es.addEventListener('complete', (e) => {
        const data = JSON.parse(e.data);
        updateStepsFromDossier(data);
        setDossier(data);
        setIsRunning(false);
        es.close();
      });

      es.addEventListener('error', (e) => {
        console.error('SSE error', e);
        // Check if it's a MessageEvent with data
        if (e instanceof MessageEvent && e.data) {
          try {
            const errData = JSON.parse(e.data);
            setError(errData.message || 'Pipeline failed');
          } catch {
            setError('Connection lost');
          }
        }
        setIsRunning(false);
        es.close();
      });

      es.onerror = () => {
        // EventSource reconnect logic — if it closes completely, stop
        if (es.readyState === EventSource.CLOSED) {
          setIsRunning(false);
        }
      };

    } catch (e: any) {
      setError(e.message || 'Failed to start analysis');
      setIsRunning(false);
    }
  }, [updateStepsFromDossier]);

  const showResults = dossier?.status === 'done';

  return (
    <AppShell>
      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column — Input + Progress */}
        <div className="lg:col-span-4 space-y-4">
          <IdeaInputCard onRun={runPipeline} isRunning={isRunning} />
          <StepperCard steps={steps} />
        </div>

        {/* Right Column — Results */}
        <div className="lg:col-span-8">
          <ResultsPanel show={showResults} dossier={dossier} />
        </div>
      </div>
    </AppShell>
  );
}
