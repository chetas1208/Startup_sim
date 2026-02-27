'use client';

import React from 'react';

interface CompetitiveMatrixProps {
  matrix: {
    headers: string[];
    rows: Array<Record<string, string>>;
    analysis: string;
  };
}

const statusColors: Record<string, string> = {
  strong: 'bg-green-100 text-green-800 border-green-300',
  parity: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  gap: 'bg-red-100 text-red-800 border-red-300',
};

export function CompetitiveMatrix({ matrix }: CompetitiveMatrixProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
              {matrix.headers.map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 border border-gray-200 bg-gray-50">
                  {row.feature}
                </td>
                {matrix.headers.slice(1).map((header, colIdx) => {
                  const value = row[header.toLowerCase()] || 'gap';
                  const colorClass = statusColors[value] || statusColors.gap;
                  return (
                    <td
                      key={colIdx}
                      className={`px-4 py-3 text-sm font-medium text-center border border-gray-200 ${colorClass}`}
                    >
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">{matrix.analysis}</p>
      </div>

      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-gray-600">Strong</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span className="text-gray-600">Parity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-gray-600">Gap</span>
        </div>
      </div>
    </div>
  );
}
