'use client';

import React, { useState } from 'react';

interface ValidationExperiment {
  name: string;
  description: string;
  landing_page_copy: string;
  cold_outreach_email: string;
  survey_questions: string[];
  pricing_questions: string[];
  timeline: string;
}

interface ValidationExperimentsProps {
  experiments: ValidationExperiment[];
}

export function ValidationExperiments({ experiments }: ValidationExperimentsProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {experiments.map((exp, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <button
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors flex items-center justify-between"
          >
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">{exp.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
            </div>
            <span className="text-gray-400 ml-2">{expandedIdx === idx ? '−' : '+'}</span>
          </button>

          {expandedIdx === idx && (
            <div className="p-4 space-y-4 bg-white">
              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase mb-2">Timeline</h5>
                <p className="text-sm text-gray-600">{exp.timeline}</p>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase mb-2">Landing Page Copy</h5>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-700 font-mono text-xs">
                  {exp.landing_page_copy}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase mb-2">Cold Outreach Email</h5>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-700 font-mono text-xs whitespace-pre-wrap">
                  {exp.cold_outreach_email}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase mb-2">Survey Questions</h5>
                <ul className="space-y-2">
                  {exp.survey_questions.map((q, qIdx) => (
                    <li key={qIdx} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-gray-400">{qIdx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-gray-700 uppercase mb-2">Pricing Questions</h5>
                <ul className="space-y-2">
                  {exp.pricing_questions.map((q, qIdx) => (
                    <li key={qIdx} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-gray-400">{qIdx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
