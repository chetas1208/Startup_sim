import { useState, useEffect } from 'react';
import { PROGRESS_STEPS } from '../services/api';

export default function ResearchProgress({ query, onComplete }) {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentStep >= PROGRESS_STEPS.length) {
      setTimeout(() => setDone(true), 600);
      return;
    }

    const delay = currentStep === 0 ? 400 : 700 + Math.random() * 500;
    const timer = setTimeout(() => {
      setVisibleSteps((prev) => [...prev, PROGRESS_STEPS[currentStep]]);
      setCurrentStep((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* Query Display */}
        <div className="mb-10 text-center animate-fade-in">
          <p className="text-sm text-sg-textDim uppercase tracking-wider font-medium mb-2">
            Researching
          </p>
          <p className="text-lg text-sg-text font-medium leading-relaxed">
            "{query}"
          </p>
        </div>

        {/* Pulsing Indicator */}
        <div className="flex justify-center mb-10">
          <div className="relative w-16 h-16">
            {!done && (
              <>
                <div className="absolute inset-0 rounded-full bg-sg-accent/20 ripple-ring" />
                <div className="absolute inset-0 rounded-full bg-sg-accent/15 ripple-ring-delayed" />
                <div className="absolute inset-0 rounded-full bg-sg-accent/10 ripple-ring-delayed-2" />
              </>
            )}
            <div
              className={`absolute inset-3 rounded-full flex items-center justify-center transition-all duration-500 ${
                done ? 'bg-sg-green scale-110' : 'bg-sg-accent'
              }`}
            >
              {done ? (
                <svg className="w-5 h-5 text-sg-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="w-2 h-2 bg-sg-bg rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-3">
          {visibleSteps.map((step, index) => {
            const isLast = index === visibleSteps.length - 1;
            const isComplete = step.id === PROGRESS_STEPS.length;
            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 px-4 py-3 rounded-lg animate-slide-up
                  ${isLast && !done ? 'bg-sg-surface border border-sg-border' : 'bg-transparent'}
                  ${isComplete ? 'bg-sg-green/10 border border-sg-green/20' : ''}`}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{step.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${isComplete ? 'text-sg-green font-semibold' : 'text-sg-text'}`}>
                    {step.text}
                  </p>
                  {step.source && (
                    <p className="text-xs text-sg-textDim mt-0.5 font-mono">
                      via {step.source}
                    </p>
                  )}
                </div>
                {!isComplete && index < visibleSteps.length - 1 && (
                  <svg className="w-4 h-4 text-sg-green flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* View Results Button */}
        {done && (
          <div className="mt-8 animate-slide-up flex justify-center">
            <button
              onClick={onComplete}
              className="btn-primary text-base px-8 py-3"
            >
              View Results →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
