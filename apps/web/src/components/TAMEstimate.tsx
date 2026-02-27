'use client';

import React from 'react';

interface TAMEstimateProps {
  estimate: {
    tam: string;
    sam: string;
    som: string;
    reasoning: string;
    assumptions: string[];
  };
}

export function TAMEstimate({ estimate }: TAMEstimateProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-blue-900 uppercase mb-2">TAM</h4>
          <p className="text-lg font-bold text-blue-900">{estimate.tam}</p>
          <p className="text-xs text-blue-700 mt-1">Total Addressable Market</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-indigo-900 uppercase mb-2">SAM</h4>
          <p className="text-lg font-bold text-indigo-900">{estimate.sam}</p>
          <p className="text-xs text-indigo-700 mt-1">Serviceable Addressable Market</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-purple-900 uppercase mb-2">SOM</h4>
          <p className="text-lg font-bold text-purple-900">{estimate.som}</p>
          <p className="text-xs text-purple-700 mt-1">Serviceable Obtainable Market</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Reasoning</h4>
        <p className="text-sm text-gray-700">{estimate.reasoning}</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Assumptions</h4>
        <ul className="space-y-2">
          {estimate.assumptions.map((assumption, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex gap-2">
              <span className="text-gray-400">•</span>
              <span>{assumption}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
