'use client';

import React, { useState } from 'react';

interface DistributionStrategyProps {
  strategy: {
    top_channels: Array<{ channel: string; rationale: string }>;
    first_100_customers: string;
    cold_outreach_script: string;
    community_strategy: string;
  };
}

export function DistributionStrategy({ strategy }: DistributionStrategyProps) {
  const [expandedScript, setExpandedScript] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900">Top Acquisition Channels</h4>
        {strategy.top_channels.map((channel, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h5 className="font-semibold text-gray-900 text-sm">{idx + 1}. {channel.channel}</h5>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Channel
              </span>
            </div>
            <p className="text-sm text-gray-700">{channel.rationale}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-green-900 mb-2">First 100 Customers Strategy</h4>
        <p className="text-sm text-green-800">{strategy.first_100_customers}</p>
      </div>

      <div>
        <button
          onClick={() => setExpandedScript(!expandedScript)}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors rounded-lg border border-purple-200 flex items-center justify-between"
        >
          <h4 className="text-sm font-semibold text-gray-900">Cold Outreach Script</h4>
          <span className="text-gray-400">{expandedScript ? '−' : '+'}</span>
        </button>
        {expandedScript && (
          <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 font-mono text-xs whitespace-pre-wrap">
              {strategy.cold_outreach_script}
            </p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-indigo-900 mb-2">Community & Organic Strategy</h4>
        <p className="text-sm text-indigo-800">{strategy.community_strategy}</p>
      </div>
    </div>
  );
}
