'use client';

import React from 'react';

interface ConfidenceScoreProps {
  score: {
    overall_confidence: number;
    data_availability: number;
    source_quality: number;
    assumption_density: number;
    reasoning: string;
  };
}

function ConfidenceBar({ label, value }: { label: string; value: number }) {
  const percentage = Math.round(value * 100);
  const color =
    percentage >= 75 ? 'from-green-400 to-green-500' :
    percentage >= 50 ? 'from-yellow-400 to-yellow-500' :
    'from-red-400 to-red-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export function ConfidenceScore({ score }: ConfidenceScoreProps) {
  const overallPercentage = Math.round(score.overall_confidence * 100);
  const overallColor =
    overallPercentage >= 75 ? 'from-green-500 to-green-600' :
    overallPercentage >= 50 ? 'from-yellow-500 to-yellow-600' :
    'from-red-500 to-red-600';

  return (
    <div className="space-y-4">
      <div className={`bg-gradient-to-r ${overallColor} rounded-lg p-6 text-white`}>
        <h4 className="text-sm font-semibold opacity-90 mb-2">Overall Confidence</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{overallPercentage}%</span>
          <span className="text-sm opacity-90">
            {overallPercentage >= 75 ? 'High' : overallPercentage >= 50 ? 'Medium' : 'Low'}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
        <ConfidenceBar label="Data Availability" value={score.data_availability} />
        <ConfidenceBar label="Source Quality" value={score.source_quality} />
        <ConfidenceBar label="Assumption Density" value={score.assumption_density} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Analysis Quality</h4>
        <p className="text-sm text-gray-700">{score.reasoning}</p>
      </div>
    </div>
  );
}
