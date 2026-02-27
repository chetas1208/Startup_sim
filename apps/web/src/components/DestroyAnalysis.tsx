'use client';

import React from 'react';

interface DestroyAnalysisProps {
  analysis: {
    regulatory_risks: string[];
    moat_weaknesses: string[];
    churn_risks: string[];
    distribution_challenges: string[];
    survived: boolean;
    reasoning: string;
  };
}

export function DestroyAnalysis({ analysis }: DestroyAnalysisProps) {
  return (
    <div className="space-y-4">
      <div
        className={`border-2 rounded-lg p-4 ${
          analysis.survived
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-2xl ${analysis.survived ? '✓' : '✗'}`}>
            {analysis.survived ? '✓' : '✗'}
          </span>
          <h4 className={`text-lg font-bold ${analysis.survived ? 'text-green-900' : 'text-red-900'}`}>
            {analysis.survived ? 'Idea Survived' : 'Idea Did Not Survive'}
          </h4>
        </div>
        <p className={`text-sm ${analysis.survived ? 'text-green-800' : 'text-red-800'}`}>
          {analysis.reasoning}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <h5 className="text-sm font-semibold text-red-900 mb-3">Regulatory Risks</h5>
          <ul className="space-y-2">
            {analysis.regulatory_risks.map((risk, idx) => (
              <li key={idx} className="text-sm text-red-800 flex gap-2">
                <span className="text-red-400">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
          <h5 className="text-sm font-semibold text-orange-900 mb-3">Moat Weaknesses</h5>
          <ul className="space-y-2">
            {analysis.moat_weaknesses.map((weakness, idx) => (
              <li key={idx} className="text-sm text-orange-800 flex gap-2">
                <span className="text-orange-400">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
          <h5 className="text-sm font-semibold text-yellow-900 mb-3">Churn Risks</h5>
          <ul className="space-y-2">
            {analysis.churn_risks.map((risk, idx) => (
              <li key={idx} className="text-sm text-yellow-800 flex gap-2">
                <span className="text-yellow-400">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
          <h5 className="text-sm font-semibold text-purple-900 mb-3">Distribution Challenges</h5>
          <ul className="space-y-2">
            {analysis.distribution_challenges.map((challenge, idx) => (
              <li key={idx} className="text-sm text-purple-800 flex gap-2">
                <span className="text-purple-400">•</span>
                <span>{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
