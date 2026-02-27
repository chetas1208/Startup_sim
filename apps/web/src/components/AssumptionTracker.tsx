'use client';

import React from 'react';

interface Assumption {
  statement: string;
  risk_type: string;
  confidence: number;
  validation_experiment: string;
}

interface AssumptionTrackerProps {
  tracker: {
    assumptions: Assumption[];
    highest_risk: string;
    summary: string;
  };
}

const riskColors: Record<string, string> = {
  market: 'bg-red-100 text-red-800 border-red-300',
  tech: 'bg-orange-100 text-orange-800 border-orange-300',
  gtm: 'bg-purple-100 text-purple-800 border-purple-300',
};

export function AssumptionTracker({ tracker }: AssumptionTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-red-900 mb-1">Highest Risk Assumption</h4>
        <p className="text-sm text-red-800">{tracker.highest_risk}</p>
      </div>

      <div className="space-y-3">
        {tracker.assumptions.map((assumption, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-sm font-medium text-gray-900 flex-1">{assumption.statement}</p>
              <span className={`px-2 py-1 text-xs font-semibold rounded border ${riskColors[assumption.risk_type] || riskColors.market}`}>
                {assumption.risk_type.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                  style={{ width: `${assumption.confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                {Math.round(assumption.confidence * 100)}%
              </span>
            </div>

            <div className="bg-gray-50 rounded p-2 border border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Test:</span> {assumption.validation_experiment}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">{tracker.summary}</p>
      </div>
    </div>
  );
}
